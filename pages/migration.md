---
layout: page-fullwidth
show_meta: false
title: "Migration Guide"
subheadline: "How To Migrate From An Older Version"
permalink: "/migration/"
breadcrumb: true
header: false
---
<style>
code {
    white-space: normal !important;
    word-break: break-all !important;
}
</style>

<div class="row">
<div class="medium-4 medium-push-8 columns" markdown="1">
<div class="panel radius toc" markdown="1">
<h4>Table Of Contents</h4>
{: #toc }
*  TOC
{:toc}
</div>
</div><!-- /.medium-4.columns -->

<div class="medium-8 medium-pull-4 columns" markdown="1" style="min-height:600px">

Here we tried to collect and provide all information you may find useful if you need to migrate from an older version to a new one. This guide only relates to a breaking changes in the releases which may cause problems with end-user code when changing canvas gauges version to a new one.

## Migration From v1.x.x to v2.x.x

Version 2 of canvas gauges contains breaking changes both in scripting API and gauges configuration in comparison to version 1.

### Configuration Changes

The table below contains a list of configuration options which was changed in a new API and HTML attributes.

| Old property | New property | New HTML attribute | Comments |
|---|---|---|---|
| valueFormat.int | valueInt | data-value-int |  |
| valueFormat.dec | valueDec | data-value-dec |  |
| updateValueOnAnimation | animatedValue | data-animated-value |  |
| glow | - | - | Removed from spec |
| animation.duration | animationDuration | data-animation-duration |  |
| animation.fn | animationRule | data-animation-rule |  |
| colors.plate | colorPlate | data-color-plate |  |
| colors.majorTicks | colorMajorTicks | data-color-major-ticks |  |
| colors.minorTicks | colorMinorTicks | data-color-minor-ticks |  |
| colors.title | colorTitle | data-color-title |  |
| colors.units | colorUnits | data-color-units |  |
| colors.numbers | colorNumbers | data-color-numbers |  |
| colors.needle.start | colorNeedle | data-color-needle |  |
| colors.needle.end | colorNeedleEnd | data-color-needle-end |  |
| colors.needle.circle.outerStart | colorNeedleCircleOuter | data-color-needle-circle-outer | only radial gauge |
| colors.needle.circle.outerEnd | colorNeedleCircleOuterEnd | data-color-needle-circle-outer-end | only radial gauge |
| colors.needle.circle.innerStart | colorNeedleCircleInner | data-color-needle-circle-inner | only radial gauge |
| colors.needle.circle.innerEnd | colorNeedleCircleInnerEnd | data-color-needle-circle-inner-end | only radial gauge |
| colors.needle.shadowUp | colorNeedleShadowUp | data-color-needle-shadow-up |  |
| colors.needle.shadowDown | colorNeedleShadowDown | data-color-needle-shadow-down |  |
| colors.valueBox.rectStart | colorValueBoxRect | data-color-value-box-rect  |  |
| colors.valueBox.rectEnd | colorValueBoxRectEnd | data-color-value-box-rect-end |  |
| colors.valueBox.background | colorValueBoxBackground | data-color-value-box-background |  |
| colors.valueBox.shadow | colorValueBoxShadow | data-color-value-box-shadow |  |
| colors.valueText.foreground | colorValueText | data-color-value-text |  |
| colors.valueText.shadow | colorValueTextShadow | data-color-value-text-shadow |  |
| colors.circle.shadow | colorBorderShadow | data-color-border-shadow |  |
| colors.circle.outerStart | colorBorderOuter | data-color-border-outer |  |
| colors.circle.outerEnd | colorBorderOuterEnd | data-color-border-end |  |
| colors.circle.middleStart | colorBorderMiddle | data-color-border-middle |  |
| colors.circle.middleEnd | colorBorderMiddleEnd | data-color-border-middle-end |  |
| colors.circle.innerStart | colorBorderInner | data-color-border-inner |  |
| colors.circle.innerEnd | colorBorderInnerEnd | data-color-border-inner-end |  |
| circles | borders | data-borders | transformed to boolean  |
| circles.outerVisible | borderOuterWidth | data-border-outer-width | transformed to numeric |
| circles.middleVisible | borderMiddleWidth | data-border-middle-width | transformed to numeric |
| circles.innerVisible | borderInnerWidth | data-border-inner-width | transformed to numeric |
| valueBox.visible | valueBox | data-value-box | truthy or falsy |
| valueText.visible | valueText | data-value-text | falsy or text |
| majorTicksFormat.int | majorTicksInt | data-major-ticks-int |  |
| majorTicksFormat.dec | majorTicksDec | data-major-ticks-dec |  |

### JavaScript API Changes

Here is a list of breaking changes for scripting API. It is related mainly to new RadialGauge implementation, as far as old code does not have any other gauges implementations.

| Old property | New property | Comments |
|---|---|---|
| Gauge(options) | RadialGauge(options) |  |
| updateConfig(options) | update(options) |  |
| setValue(value) | value | value is a property now, simply setter |
| getValue() | value | value is a property now, simply getter |
| clear() | - | removed as not required anymore |
| onready | - | removed as not required anymore |

</div><!-- /.medium-8.columns -->
</div><!-- /.row -->
