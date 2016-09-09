---
layout: page-fullwidth
show_meta: false
title: "<span class='icon-examples'></span> Examples"
subheadline: "Gauges Use Examples"
permalink: "/documentation/examples/"
breadcrumb: true
header: false
---
<script src="https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js"></script>
<script src="/assets/js/jquery-3.1.0.min.js"></script>
<script src="/assets/js/gauge.min.js"></script>
<style>
.example { min-height: 200px }
.example canvas { cursor: pointer; cursor:hand }
</style>
<script>
function showCode(canvas) {
    let code = canvas.parentNode.getElementsByTagName('pre')[0];
    code.style.top = (window.innerHeight - code.offsetHeight) / 2 + 'px';
    code.style.left = (window.innerWidth - code.offsetWidth) / 2 + 'px';
    code.style.visibility = 'visible';
}
</script>

Canvas Gauges are highly configurable library. So you may use your fantasy to draw different gauges of different look and feel, displaying different kind of information. Here we simply tried to show you what it can be, when simply changing default gauge options.

**All gauges on this page are interactive. Click the gauge to get it's code!**

## Zero Configuration Gauges

Minimum declaration!

{% include examples/zero-configuration.html %}

## Radial Gauges as Compass

Compass wanted?

{% include examples/compass.html %}


## Other Custom Views

<script src="/assets/js/code-sample.js"></script>
