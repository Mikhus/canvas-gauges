---
layout: page-fullwidth
show_meta: false
title: "<span class='icon-api-docs'></span> Canvas Gauge API"
subheadline: "Developer's Guide Documentation"
permalink: "/documentation/api/"
breadcrumb: true
header:
  image_fullwidth: "architect.jpg"
---

<script>
function fitme(frame) {
    var doc =  frame.contentDocument || frame.contentWindow.document;
    frame.style.height = doc.body.offsetHeight + 40 + 'px';
    frame.style.visibility = 'visible';
    var links = doc.getElementsByTagName('a');
    for (var i = 0, s = links.length; i < s; i++) {
       if (links[i].href.match(/^https?:\/\//)) {
           links[i].setAttribute('target', '_top');
       }
    }
}
if (!window.addEventListener && window.attachEvent) {
    window.addEventListener = function(event, handler) {
        window.attachEvent('on' + event, handler);
    }; 
}
window.addEventListener('resize', function() {
    var frame = document.getElementById('docs-window');
    fitme(frame);
    setTimeout(function() {
        fitme(frame);
    }, 200);
});
</script>
<iframe id="docs-window" style="visibility:hidden;width:100%;height:100%" src="{{ site.url }}/docs/2.0.0/identifiers.html" frameborder="0" onload="fitme(this)"></iframe>
