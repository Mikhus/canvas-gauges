---
layout: page-fullwidth
show_meta: false
title: "<span class='icon-user-guide'></span> User Guide"
subheadline: "Canvas Gauges User Guide"
teaser: "Installing, configuring and using gauges."
header: false
#  image_fullwidth: "architect.jpg"
permalink: "/documentation/user-guide/"
breadcrumb: true
---

<div class="row">
<div class="medium-4 medium-push-8 columns" markdown="1">
<div class="panel radius" markdown="1">
Table of Contents
{: #toc }
*  TOC
{:toc}
</div>
</div><!-- /.medium-4.columns -->



<div class="medium-8 medium-pull-4 columns" markdown="1">

Canvas gauges are friendly to minimalistic code design, so whenever you need this gauges to use on a desktop, mobile or **IoT devices with limited resources**, you can be assured it will provide you the best options to get the minimum amount of code for your solution.

## Installing

Canvas gauges can be simply installed using npm package manager. Depending on your needs there is possibility to install whole gauge library or only that part you really need for your project.
To install the whole library, run:

    $ npm install canv-gauge

If you only need the exact type of the gauge it can be installed using the appropriate npm tag. Currently the following gauges are supported: linear, radial.

To install only linear gauge, run:

    $ npm install canv-gauge@linear

To install only radial gauge, run:

    $ npm install canv-gauge@radial

This strategy useful only if you need to minimize your code base and plan to use ONLY a specific gauge type. If you need to use various gauge types in your project it is recommended to use whole gauge package.

Another way is to force installation directly from canv-gauge git repository, specifying in your ```package.json``` file a proper dependency, like:

~~~json
{
  "dependencies": {
    "canv-gauge": "git@github.com:Mikhus/canv-gauge.git#2.0.0"
  }
}
~~~

Or you may simply clone git repository locally:

    $ git clone git@github.com:Mikhus/canv-gauge.git

If it is not enough for you, please, refer to our [creating custom bulds tutorial]({{site.url}}/documentation/user-guide/custom-builds)

## Configuring

[All Configuration Options]({{site.url}}/documentation/user-guide/configuration)

Canvas gauges are **highly configurable web-components**. There are plenty of options which could help you build a unique pretty gauges for your web-pages.

Configuration options for the gauge usually passed to a constructor or update functions and are a plain JavaScript object or specified as an attributes of an HTML-element.

Naming rules are simple and follows the best practices accepted in the industry. All attributes are started with "data-" prefix (to produce valid HTML) and name part is dash-splitted words. For JavaScript naming it is used camelCase naming conventions.

For example, using these options are similar in terms of configuration:

~~~javascript
var gauge = new LinearGauge({
  renderTo: 'gauge-id',
  colorNumbers: 'red',
  width: 100,
  height: 300
})
~~~

~~~html
<canvas data-type="linear-gauge"
        data-color-numbers="red"
        data-width="100"
        data-height="300"
></canvas>
~~~

Canvas gauges supports dynamic re-configuration at runtime calling a special ```update()``` method or by dynamically changing HTML element attributes:

~~~javascript
gauge.update({ colorNumbers: 'blue' });
~~~

is similar to:

~~~javascript
$('canvas[data-type="linear-gauge"]').attr('data-color-numbers', 'blue');
~~~

Get a clue about available [configuration options]({{site.url}}/documentation/user-guide/configuration)

## Using

There are 2 ways of using gauges on the page.

First one is declarative by simply defining a gauge components in HTML, like

~~~html
<!doctype html>
<html>
<head>
    <title>Gauges as Components</title>
    <script src="gauge.min.js"></script>
</head>
<body>
<!-- Injecting linear gauge -->
<canvas data-type="linear-gauge"
        data-width="160"
        data-height="600"
        data-border-radius="20"
        data-borders="0"
        data-bar-stroke-width="20"
        data-minor-ticks="10"
        data-major-ticks="0,10,20,30,40,50,60,70,80,90,100"
        data-value="22.3"
        data-units="°C"
        data-color-value-box-shadow="false"
></canvas>

<!-- Injecting radial gauge -->
<canvas data-type="radial-gauge"
        data-width="400"
        data-height="400"
        data-units="Km/h"
        data-title="false"
        data-value="0"
        data-min-value="0"
        data-max-value="220"
        data-major-ticks="0,20,40,60,80,100,120,140,160,180,200,220"
        data-minor-ticks="2"
        data-stroke-ticks="false"
        data-highlights='[
            { "from": 0, "to": 50, "color": "rgba(0,255,0,.15)" },
            { "from": 50, "to": 100, "color": "rgba(255,255,0,.15)" },
            { "from": 100, "to": 150, "color": "rgba(255,30,0,.25)" },
            { "from": 150, "to": 200, "color": "rgba(255,0,225,.25)" },
            { "from": 200, "to": 220, "color": "rgba(0,0,255,.25)" }
        ]'
        data-color-plate="#222"
        data-color-major-ticks="#f5f5f5"
        data-color-minor-ticks="#ddd"
        data-color-title="#fff"
        data-color-units="#ccc"
        data-color-numbers="#eee"
        data-color-needle-start="rgba(240, 128, 128, 1)"
        data-color-needle-end="rgba(255, 160, 122, .9)"
        data-value-box="true"
        data-animation-rule="bounce"
        data-animation-duration="500"
        data-font-value="Led"
        data-animated-value="true"
></canvas>
</body>
</html>
~~~

Read more: [Using gauges as components]({{site.url}}/documentation/user-guide/using-as-components)

Another way is to use scripting API to inject gauges to the page:

~~~javascript
var gauge = new LinearGauge({
    renderTo: document.createElement('canvas'),
    width: 160,
    height: 600,
    borderRadius: 20,
    borders: 0,
    barStrokeWidth: 20,
    minorTicks: 10,
    majorTicks: [0,10,20,30,40,50,60,70,80,90,100],
    value: 22.3,
    units: "°C",
    colorValueBoxShadow: false
});

document.body.appendChild(gauge.options.renderTo);
~~~

Read more: [Gauges Scripting API]({{site.url}}/documentation/user-guide/scripting-api)

</div><!-- /.medium-8.columns -->
</div><!-- /.row -->

