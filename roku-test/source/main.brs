' OnNow Roku test: lists the channels installed on this Roku and opens one when selected.
' It talks to the Roku's own control interface on 127.0.0.1:8060 (External Control Protocol).
sub Main()
    screen = CreateObject("roSGScreen")
    port = CreateObject("roMessagePort")
    screen.setMessagePort(port)
    scene = screen.CreateScene("MainScene")
    screen.show()
    scene.observeField("launchId", port)
    scene.apps = queryApps()
    while true
        msg = wait(0, port)
        if type(msg) = "roSGScreenEvent"
            if msg.isScreenClosed() then return
        else if type(msg) = "roSGNodeEvent"
            if msg.getField() = "launchId" then scene.status = launchApp(msg.getData())
        end if
    end while
end sub

function queryApps() as object
    u = CreateObject("roUrlTransfer")
    u.SetUrl("http://127.0.0.1:8060/query/apps")
    s = u.GetToString()
    out = []
    x = CreateObject("roXMLElement")
    if s <> "" and x.Parse(s)
        for each a in x.GetNamedElements("app")
            if a@type = "appl" then out.Push({ id: a@id, name: a.GetText() })
        end for
    end if
    return out
end function

function launchApp(id as string) as string
    u = CreateObject("roUrlTransfer")
    u.SetUrl("http://127.0.0.1:8060/launch/" + id)
    code = u.PostFromString("")
    if code = 200 or code = 204 then return "Sent (code " + code.ToStr() + "). If the channel didn't open, tell Claude."
    return "Roku refused to open it (code " + code.ToStr() + "). Try the setting at the bottom of the screen."
end function
