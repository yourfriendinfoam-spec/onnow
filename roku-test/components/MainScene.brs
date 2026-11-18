sub init()
    m.list = m.top.findNode("list")
    m.statusLabel = m.top.findNode("statusLabel")
    m.list.observeField("itemSelected", "onSelect")
end sub

sub onApps()
    c = CreateObject("roSGNode", "ContentNode")
    for each a in m.top.apps
        n = c.createChild("ContentNode")
        n.title = a.name + "   (id " + a.id + ")"
    end for
    m.list.content = c
    m.statusLabel.text = m.top.apps.count().toStr() + " channels found. Select one and press OK to open it."
    m.list.setFocus(true)
end sub

sub onSelect()
    a = m.top.apps[m.list.itemSelected]
    m.statusLabel.text = "Opening " + a.name + "..."
    m.top.launchId = a.id
end sub

sub onStatus()
    m.statusLabel.text = m.top.status
end sub
