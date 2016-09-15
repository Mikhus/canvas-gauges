---
layout: page-fullwidth
show_meta: false
title: "Gauges As HTML Components"
subheadline: "Canvas Gauges User Guide"
teaser: "How to use canvas gauges as HTML components"
header: false
permalink: "/documentation/user-guide/using-as-component"
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
    <li><a href="{{site.url}}/documentation/user-guide/scripting-api">Scripting API</a></li>
    <li><a href="{{site.url}}/documentation/user-guide/advanced-usage">Advanced Usage</a></li>
    <li>a href="{{site.url}}/migration/">Migration Guide</a></li>
</ul>
</div>
</div><!-- /.medium-4.columns -->

<div class="medium-8 medium-pull-4 columns" markdown="1">

Canvas gauges provides a declarative way of injection gauges into HTML-page. Each gauge is a simply HTML canvas element. When the custom element obtains attribute "data-type" with one of "linear-gauge" or "radial-gauge" values it automatically becomes treated as gauge component and is rendered correspondingly.

Gauges support in-runtime injection/modifying config options via adding/changing/removing configuration attributes. All configuration attributes should start with "data-" prefix to produce valid HTML output. All attribute names correspondingly mapped into gauge configuration options.

## Declaring Gauges

Zero-configuration gauge:

~~~html
<script src="gauge.min.js"></script>
<canvas data-type="linear-gauge"></canvas>
~~~

With some configuration options:

~~~html
<script src="gauge.min.js"></script>
<canvas data-type="linear-gauge"
        data-width="160"
        data-height="600"
        data-border-radius="0"
        data-borders="0"
        data-bar-begin-circle="25"
        data-minor-ticks="10"
        data-value="36.6"
        data-min-value="35"
        data-max-value="42"
        data-title="°C"
        data-major-ticks="35,36,37,38,39,40,41,42"
        data-ticks-width="18"
        data-ticks-width-minor="7.5"
        data-bar-width="5"
        data-highlights="false"
        data-color-value-box-shadow="false"
        data-value-box-stroke="0"
        data-color-value-box-background="false"
        data-value-int="2"
        data-value-dec="1"
></canvas>
~~~

## Mutating Gauges

Canvas gauges supports in-runtime mutations, so you can easily re-configure gauge by simply changing attributes values. Even gauge type can be changed in-runtime. 

There are some configuration options which are defined for a certain type of gauge only. By the way even if you will declare attributes which gauge does not support it won't break it - them will just won't be parsed and took into account during rendering. So switching gauge type in-runtime always safe.

For example:

~~~html
<script src="gauge.min.js"></script>
<canvas data-type="linear-gauge"
        data-width="200"
        data-height="600"
></canvas>

<script>
var gaugeElement = document.getElementsByTagName('canvas')[0];

gaugeElement.setAttribute('data-border-radius', 20);
gaugeElement.setAttribute('data-color-numbers', 'red');
gaugeElement.setAttribute('data-type', 'radial-gauge');
gaugeElement.setAttribute('data-type', 'linear-gauge');
</script>
~~~

## Configuration Attributes Mapping

When using HTML declarative configuration via attributes, mandatory "renderTo" configuration option is not required as far as gauge will be rendered to a proper canvas element directly.

<style>
table tbody tr td:nth-child(1),
table tbody tr td:nth-child(2) {
    white-space:nowrap;
    word-break:keep-all;
}
</style>

| Options | Attribute | Gauge Type | Value Type |
|---|---|---|---|
| renderTo | - |  any | string or HTMLCanvasElement |
| width | data-width | any | number |
| height | data-height | any | number |
| minValue | data-min-value | any | number |
| maxValue | data-max-value | any | number |
| value | data-value | any | number |
| title | data-title | any | string |
| units | data-units | any | string |
| majorTicks | data-major-ticks | any | array of string or number |
| minorTicks | data-minor-ticks | any | integer |
| strokeTicks | data-stroke-ticks | any | boolean |
| animatedValue | data-animated-value | any | boolean |
| borders | data-borders | any | boolean |
| valueInt | data-value-int | any | integer |
| valueDec | data-value-dec | any | integer |
| majorTicksInt | data-major-ticks-int | any | integer |
| majorTicksDec | data-major-ticks-dec | any | integer |
| animation | data-animation | any | boolean |
| animationDuration | data-animation-duration | any | number |
| animationRule | data-animation-rule | any | string or function |
| colorPlate | data-color-plate | any | string |
| colorMajorTicks | data-color-major-ticks | any | string |
| colorMinorTicks | data-color-minor-ticks | any | string |
| colorTitle | data-color-title | any | string |
| colorUnits | data-color-units | any | string |
| colorNumbers | data-color-numbers | any | string |
| colorNeedle | data-color-needle | any | string |
| colorNeedleEnd | data-color-needle-end | any | string |
| colorValueText | data-color-value-text | any | string |
| colorValueTextShadow | data-color-value-text-shadow | any | string |
| colorBorderShadow | data-color-border-shadow | any | string |
| colorBorderOuter | data-color-border-outer | any | string |
| colorBorderOuterEnd | data-color-border-outer-end | any | string |
| colorBorderMiddle | data-color-border-middle | any | string |
| colorBorderMiddleEnd | data-color-border-middle-end | any | string |
| colorBorderInner | data-color-border-inner | any | string |
| colorBorderInnerEnd | data-color-border-inner-end | any | string |
| colorValueBoxRect | data-color-value-box-rect | any | string |
| colorValueBoxRectEnd | data-color-value-box-rect-end | any | string |
| colorValueBoxBackground | data-color-value-box-background | any | string |
| colorValueBoxShadow | data-color-value-box-shadow | any | string |
| colorNeedleShadowUp | data-color-needle-shadow-up | any | string |
| colorNeedleShadowDown | data-color-needle-shadow-down | any | string |
| fontNumbers | data-font-numbers | any | string |
| fontTitle | data-font-title | any | string |
| fontUnits | data-font-units | any | string |
| fontValue | data-font-value | any | string |
| needle | data-needle | any | boolean |
| needleShadow | data-needle-shadow | any | boolean |
| needleType | data-needle-type | any | string |
| needleStart | data-needle-start | any | number |
| needleEnd | data-needle-end | any | number |
| needleWidth | data-needle-width | any | number |
| borderOuterWidth | data-border-outer-width | any | number |
| borderMiddleWidth | data-border-middle-width | any | number |
| borderInnerWidth | data-border-inner-width | any | number |
| borderShadowWidth | data-border-shadow-width | any | number |
| valueBox | data-value-box | any | boolean |
| valueBoxStroke | data-value-box-stroke | any | number |
| valueText | data-value-text | any | string |
| valueTextShadow | data-value-text-shadow | any | boolean |
| valueBoxBorderRadius | data-value-box-border-radius | any | number |
| highlights | data-highlights | any | array of { from: number, to: number, color: string } |
| borderRadius | data-border-radius | linear | number |
| barBeginCircle | data-bar-begin-circle | linear | number |
| barWidth | data-bar-width | linear | number |
| barStrokeWidth | data-bar-stroke-width | linear | number |
| barProgress | data-bar-progress | linear | boolean |
| colorBarStroke | data-color-bar-stroke | linear |
| colorBar | data-color-bar | linear | string |
| colorBarEnd | data-color-bar-end | linear | string |
| colorBarProgress | data-color-bar-progress | linear | string |
| colorBarProgressEnd | data-color-bar-progress-end | linear | string |
| tickSide | data-tick-side | linear | string |
| needleSide | data-needle-side | linear | string |
| numberSide | data-number-side | linear | string |
| ticksWidth | data-ticks-width | linear | number |
| ticksWidthMinor | data-ticks-width-minor | linear | number |
| ticksPadding | data-ticks-padding | linear | number |
| barLength | data-bar-length | linear | number |
| fontNumbersSize | data- font-numbers-size| linear | number |
| fontTitleSize | data-font-title-size | linear | number |
| fontUnitsSize | data-font-units-size | linear | number |
| ticksAngle | data-ticks-angle | radial | number |
| startAngle | data-start-angle | radial | number |
| colorNeedleCircleOuter | data-color-needle-circle-outer | radial | string |
| colorNeedleCircleOuterEnd | data-color-needle-circle-outer-end | radial | string |
| colorNeedleCircleInner | data-color-needle-circle-inner | radial | string |
| colorNeedleCircleInnerEnd | data-color-needle-circle-inner-end | radial | string |
| needleCircleSize | data-needle-circle-size | radial | number |
| needleCircleInner | data-needle-circle-inner | radial | boolean |
| needleCircleOuter | data-needle-circle-outer | radial | boolean |
| animationTarget | data-animation-target | radial | string |

Read more: [all configuration options]({{site.url}}/documentation/user-guide/configuration)


</div><!-- /.medium-8.columns -->
</div><!-- /.row -->
