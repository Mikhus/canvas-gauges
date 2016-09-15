---
layout: page-fullwidth
show_meta: false
title: "Gauges Scripting API"
subheadline: "Canvas Gauges User Guide"
teaser: "How to use canvas gauges scripting API"
header: false
permalink: "/documentation/user-guide/scripting-api"
breadcrumb: true
---
<div class="row">
<div class="medium-4 medium-push-8 columns" markdown="1">
<div class="panel radius toc" markdown="1">
<h4>Table of Contents</h4>
{: #toc }
*  TOC
{:toc}

<h4>User Guide Chapters</h4>
<ul>
    <li><a href="{{site.url}}/documentation/user-guide/">Introduction</a></li>
    <li><a href="{{site.url}}/documentation/user-guide/configuration">Configuration</a></li>
    <li><a href="{{site.url}}/documentation/user-guide/custom-builds">Creating Custom Builds</a></li>
    <li><a href="{{site.url}}/documentation/user-guide/using-as-component">Using As Components</a></li>
    <li><a href="{{site.url}}/documentation/user-guide/advanced-usage">Advanced Usage</a></li>
    <li><a href="{{site.url}}/migration/">Migration Guide</a></li>
</ul>
</div>
</div><!-- /.medium-4.columns -->

<div class="medium-8 medium-pull-4 columns" markdown="1">

## User API

Canvas gauges provide three global elements which are available to the user:

 1. ```LinearGauge``` constructor
 2. ```RadialGauge``` constructor
 3. ```document.gauges``` collection

Both LinearGauge and RadialGauge classes has the same public interface, main difference only in the set of configuration [options]({{site.url}}/documentation/user-guide/configuration) they could understand.

### Instantiating And Drawing Gauges

~~~javascript
var linear = new LinearGauge('linear-gauge-id');
var radial = new RadialGauge(document.createElement('canvas'));
~~~

As you may see the only mandatory options required to properly instantiate zero-configured gauge is ```renderTo``` option which should be either identifier of canvas element on HTML page or the canvas element itself.

Canvas gauges support dynamic configuration change at runtime and/or at construction. So it is safe to bypass all required config options when instantiating the gauge:

~~~javascript
var radial = new RadialGauge({
    renderTo: 'gauge-id',
    width: 400,
    height: 400,
    units: 'Km/h',
    title: false,
    value: 0,
    minValue: 0,
    maxValue: 220,
    majorTicks: [
        '0','20','40','60','80','100','120','140','160','180','200','220'
    ],
    minorTicks: 2,
    strokeTicks: false,
    highlights: [
        { from: 0, to: 50, color: 'rgba(0,255,0,.15)' },
        { from: 50, to: 100, color: 'rgba(255,255,0,.15)' },
        { from: 100, to: 150, color: 'rgba(255,30,0,.25)' },
        { from: 150, to: 200, color: 'rgba(255,0,225,.25)' },
        { from: 200, to: 220, color: 'rgba(0,0,255,.25)' }
    ],
    colorPlate: '#222',
    colorMajorTicks: '#f5f5f5',
    colorMinorTicks: '#ddd',
    colorTitle: '#fff',
    colorUnits: '#ccc',
    colorNumbers: '#eee',
    colorNeedle: 'rgba(240, 128, 128, 1)',
    colorNeedleEnd: 'rgba(255, 160, 122, .9)',
    valueBox: true,
    animationRule: 'bounce',
    animationDuration: 500
});
~~~

After the gauge object is instantiated and mapped with canvas element, it is required to call ```draw()``` method to initialize gauge rendering.

~~~javascript
radial.draw();
~~~

> Please, take into account that ```draw()``` method will not  re-render entire gauge for performance reasons. Actually the most elements which are not taking their part in animation will be drawn initially only once. By the way, sometimes it may be required to redraw gauge completely (for example if upseting some new font face to static gauge elements). In this case preferable way to draw a gauge is to use ```update()``` method call.

### Updating Values

Of course, statically drawn gauge provides almost no benefits in comparison to statically drawn image. The power of gauges is that it is able to dynamically re-render itself when you changing the value. It is quite simple to do updating gauge ```value``` property.

~~~javascript
// initialize gauge with value on construction
var gauge = new LinearGauge({ renderTo: 'gauge-id', value: 50 });

// change the value at runtime
gauge.value = 33.2;
~~~

If animation is enabled on the gauge, when changing the value it will be executed. If animation is disabled - gauge will be simply re-drawn in one operation to display the new given value (visually it may look like "jumping").

> Gauges was designed and can be used to constantly display some changing values, for example which are regularly collected from some sensors or obtained from remote servers. It is up to you as developer to define is it require animation and animation params, like duration and animation rules. It may happen that values you get to display comes more often that animation duration. For gauge itself it is safe as newly started animation will not collapse with the previous one, but in such a case gauge may never show the exact value, but will actually display only it's trending changes. So it is up to developer to define this behavior properly and find correct timings. In some cases you may even need to reach those kind of effect.

### Re-Configuring And Re-Drawing Gauges At Runtime

There are two ways re-configuring gauges at runtime:

 - using API ```update()``` method
 - using HTML element attributes

Updating via API is quite simple. It expects a configuration object which contains options to change in the current gauge configuration:

~~~javascript
gauge.update({
   animation: false,
   colorNumbers: 'blue'
});
~~~

All the remaining options defined for this gauge configuration will remain untouched, so there is no need to upset all possible config options within the call.

The API call is useful when you dealing with gauge instance in your code. When the gauge instance is hard to obtain for some reason, but there is access to a gauge DOM element it is possible to re-configure the gauge via changing DOM element's attributes;

For example, this code does similar to the previous one from a visualizing perspective:

~~~javascript
gaugeElement.setAttribute('data-animation', false);
gaugeElement.setAttribute('data-color-numbers', 'blue');
~~~

By the way, the API call is more efficient way to update gauge config for several reasons:

 - it gives possibility to update multiple options at-once;
 - it does not modify DOM element, so it is more efficient in terms of performance.

From other hand if you refer to a data-binding strategy it can break it. In this case, changing config options via attributes is more preferable.

> Please, take into account that updating gauge value through ```update()``` API call or by changing HTML-attribute may cause performance issues as far as updating gauge config will result in complete redraw, instead of redrawing only animated elements.

### Gauge Interface Summary

The most important aspects of scripting API is written above. Here is the summary table of the gauge interface.

#### Properties


| type | refers to actual gauge constructor function | 
| options | gauge [configuration options]({{site.url}}/documentation/user-guide/configuration)  |
| canvas | [SmartCanvas]({{site.url}}/docs/2.0.0/class/lib/SmartCanvas.js~SmartCanvas.html) object |
| animation | [Animation]({{site.url}}/docs/2.0.0/class/lib/Animation.js~Animation.html) object |
| value | current value, numeric |

#### Methods

| *constructor(options)* | instantiates gauge object |
| *destroy()* | properly destruct gauge object, call it whenever the gauge instance is not required anymore |
| *draw()* | required for initial draw or gauge re-draw |
| *update(options)* | allows to update gauge configuration (look & feel, etc.) at runtime |

More details [BaseGauge]({{site.url}}/docs/2.0.0/class/lib/BaseGauge.js~BaseGauge.html), [LinearGauge]({{site.url}}/docs/2.0.0/class/lib/LinearGauge.js~LinearGauge.html), [RadialGauge]({{site.url}}/docs/2.0.0/class/lib/RadialGauge.js~RadialGauge.html)

### Gauges Collection

When canvas gauge object is instantiated it becomes a part of publicly defined ```document.gauges``` collection. When the gauge is destructed it is removed from the collection. So the gauge collection object always contain the actual gauge instances which can be easily accessed or referred from JavaScript code.

Simply the collection is an extended array, which has ```get()``` method to lookup the gauges by position or identifier of the related DOM element.

Usage example:

~~~javascript
document.gauges.forEach(function (gauge) {
    console.log(gauge.type);
});
~~~

Referring gauge from collection by a DOM element identifier:

~~~javascript
<canvas data-type="radial-gauge" id="radial-one"></canvas>
<script>
var gauge = document.gauges.get('radial-one');
console.log(gauge.value);
</script>
~~~

</div><!-- /.medium-8.columns -->
</div><!-- /.row -->
