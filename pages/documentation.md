---
layout: page
show_meta: false
title: "Canvas Gauge API Documentation"
permalink: "/documentation/"
---

<script>
function fitme(frame) {
    var doc =  frame.contentDocument || frame.contentWindow.document;
    var parent = frame.parentNode.parentNode.parentNode;

    if (!frame.initialized) {
        var header = parent.getElementsByTagName('header')[0];
        parent.parentNode.insertBefore(header, parent);
        parent.parentNode.insertBefore(frame, parent);
        frame.initialized = true;
        
    }

    frame.style.height = doc.body.offsetHeight + 40 + 'px';
    frame.style.visibility = 'visible';
    console.log(parent);
}
</script>
<iframe name="docs-window" style="visibility:hidden;width:100%;height:100%" src="{{ site.url }}/docs/2.0.0/identifiers.html" frameborder="0" onload="fitme(this)"></iframe>
