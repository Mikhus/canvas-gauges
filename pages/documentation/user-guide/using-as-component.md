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
</ul>
</div>
</div><!-- /.medium-4.columns -->

<div class="medium-8 medium-pull-4 columns" markdown="1">

Canvas gauges provides a declarative way of injection gauges into HTML-page. Each gauge is a simply HTML canvas element. When the custom element obtains attribute "data-type" with one of "linear-gauge" or "radial-gauge" values it automatically becomes treated as gauge component and is rendered correspondingly.

Gauges support in-runtime injection/modifying config options via adding/changing/removing configuration attributes. All configuration attributes should start with "data-" prefix to produce valid HTML output. All attribute names correspondingly mapped into gauge configuration options.

## Configuration Attributes Mapping

When using HTML declarative configuration via attributes, mandatory "renderTo" configuration option is not required as far as gauge will be rendered to a proper canvas element directly.

| Options | Attribute | Gauge Type |
|---|---|---|
| renderTo | - |  any |
| width | data-width | any |
| height | data-height | any |
| minValue | data-min-value | any |
| maxValue | data-max-value | any |
| value | data-value | any |
| title | data-title | any |
| units | data-units | any |
| majorTicks | data-major-ticks | any |
| minorTicks | data-minor-ticks | any |
| strokeTicks | data-stroke-ticks | any |
| animatedValue | data-animated-value | any |
| glow | data-glow | any |
| borders | data-borders | any |
| valueInt | data-value-int | any |
| valueDec | data-value-dec | any |
| majorTicksInt | data-major-ticks-int | any |
| majorTicksDec | data-major-ticks-dec | any |
| animation | data-animation | any |
| animationDuration | data-animation-duration | any |
| animationRule | data-animation-rule | any |
| colorPlate | data-color-plate | any |
| colorMajorTicks | data-color-major-ticks | any |
| colorMinorTicks | data-color-minor-ticks | any |
| colorTitle | data-color-title | any |
| colorUnits | data-color-units | any |
| colorNumbers | data-color-numbers | any |
| colorNeedle | data-color-needle | any |
| colorNeedleEnd | data-color-needle-end | any |
| colorValueText | data-color-value-text | any |
| colorValueTextShadow | data-color-value-text-shadow | any |
| colorBorderShadow | data-color-border-shadow | any |
| colorBorderOuter | data-color-border-outer | any |
| colorBorderOuterEnd | data-color-border-outer-end | any |
| colorBorderMiddle | data-color-border-middle | any |
| colorBorderMiddleEnd | data-color-border-middle-end | any |
| colorBorderInner | data-color-border-inner | any |
| colorBorderInnerEnd | data-color-border-inner-end | any |
| colorValueBoxRect | data-color-value-box-rect | any |
| colorValueBoxRectEnd | data-color-value-box-rect-end | any |
| colorValueBoxBackground | data-color-value-box-background | any |
| colorValueBoxShadow | data-color-value-box-shadow | any |
| colorNeedleShadowUp | data-color-needle-shadow-up | any |
| colorNeedleShadowDown | data-color-needle-shadow-down | any |
| fontNumbers | data-font-numbers | any |
| fontTitle | data-font-title | any |
| fontUnits | data-font-units | any |
| fontValue | data-font-value | any |
| needle | data-needle | any |
| needleShadow | data-needle-shadow | any |
| needleType | data-needle-type | any |
| needleStart | data-needle-start | any |
| needleEnd | data-needle-end | any |
| needleWidth | data-needle-width | any |
| borderOuterWidth | data-border-outer-width | any |
| borderMiddleWidth | data-border-middle-width | any |
| borderInnerWidth | data-border-inner-width | any |
| borderShadowWidth | data-border-shadow-width | any |
| valueBox | data-value-box | any |
| valueBoxStroke | data-value-box-stroke | any |
| valueText | data-value-text | any |
| valueTextShadow | data-value-text-shadow | any |
| valueBoxBorderRadius | data-value-box-border-radius | any |
| highlights | data-highlights | any |
| borderRadius | data-border-radius | linear |
| barBeginCircle | data-bar-begin-circle | linear |
| barWidth | data-bar-width | linear |
| barStrokeWidth | data-bar-stroke-width | linear |
| barProgress | data-bar-progress | linear |
| colorBarStroke | data-color-bar-stroke | linear |
| colorBar | data-color-bar | linear |
| colorBarEnd | data-color-bar-end | linear |
| colorBarProgress | data-color-bar-progress | linear |
| colorBarProgressEnd | data-color-bar-progress-end | linear |
| tickSide | data-tick-side | linear |
| needleSide | data-needle-side | linear |
| numberSide | data-number-side | linear |
| ticksWidth | data-ticks-width | linear |
| ticksWidthMinor | data-ticks-width-minor | linear |
| ticksPadding | data-ticks-padding | linear |
| barLength | data-bar-length | linear |
| fontNumbersSize | data- font-numbers-size| linear |
| fontTitleSize | data-font-title-size | linear |
| fontUnitsSize | data-font-units-size | linear |


</div><!-- /.medium-8.columns -->
</div><!-- /.row -->
