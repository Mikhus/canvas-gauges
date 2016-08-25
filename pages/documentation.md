---
layout: page
show_meta: false
permalink: "/documentation/"
---

<script>
function fitme(frame) {
    var doc =  frame.contentDocument || frame.contentWindow.document;
    var parent = frame.parentNode.parentNode.parentNode;

    if (!frame.initialized) {
        parent.parentNode.insertBefore(frame, parent);
        frame.initialized = true;
    }

    frame.style.height = doc.body.offsetHeight + 100 + 'px';
    frame.style.visibility='visible';
}
</script>
<iframe name="docs-window" style="visibility:hidden;width:100%;height:100%" src="{{ site.url }}/docs/2.0.0/" frameborder="0" onload="fitme(this)"></iframe>
