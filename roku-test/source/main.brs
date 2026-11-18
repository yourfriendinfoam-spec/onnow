' OnNow Roku test: lists the channels installed on this Roku and opens one when selected.
' Talks to the Roku's control interface (External Control Protocol, port 8060).
' Tries the Roku's own Wi-Fi address first, then 127.0.0.1, and reports what happened.
sub Main()
    screen = CreateObject("roSGScreen")
    port = CreateObject("roMessagePort")
    screen.setMessagePort(port)
    scene = screen.CreateScene("MainScene")
    screen.show()
    scene.observeField("launchId", port)

    bases = []
    ips = CreateObject("roDeviceInfo").GetIPAddrs()
    for each iface in ips
        bases.Push("http://" + ips[iface] + ":8060")
    end for
    bases.Push("http://127.0.0.1:8060")

    m.base = invalid
    report = ""
    apps = []
    for each b in bases
        r = httpRequest(b + "/query/apps", false)
        report = report + b + " -> " + r.code.ToStr() + "   "
        if r.code = 200
            apps = parseApps(r.body)
            m.base = b
            exit for
        end if
    end for

    scene.apps = apps
    if m.base = invalid
        scene.status = "Blocked. " + report
    else
        scene.status = apps.Count().ToStr() + " channels found via " + m.base + ". Select one and press OK."
    end if

    while true
        msg = wait(0, port)
        if type(msg) = "roSGScreenEvent"
            if msg.isScreenClosed() then return
        else if type(msg) = "roSGNodeEvent"
            if msg.getField() = "launchId" and m.base <> invalid
                r = httpRequest(m.base + "/launch/" + msg.getData(), true)
                scene.status = "Launch sent, code " + r.code.ToStr() + ". If nothing opened, tell Claude this code."
            end if
        end if
    end while
end sub

' Returns { code, body }. code is the HTTP status, or a negative number for a connection error.
function httpRequest(url as string, post as boolean) as object
    p = CreateObject("roMessagePort")
    u = CreateObject("roUrlTransfer")
    u.SetMessagePort(p)
    u.SetUrl(url)
    if post
        u.AsyncPostFromString("")
    else
        u.AsyncGetToString()
    end if
    msg = wait(5000, p)
    if type(msg) = "roUrlEvent"
        return { code: msg.GetResponseCode(), body: msg.GetString() }
    end if
    u.AsyncCancel()
    return { code: -999, body: "" }
end function

function parseApps(s as string) as object
    out = []
    x = CreateObject("roXMLElement")
    if s <> "" and x.Parse(s)
        for each a in x.GetNamedElements("app")
            if a@type = "appl" and a@id <> "dev" then out.Push({ id: a@id, name: a.GetText() })
        end for
    end if
    return out
end function
