---
layout: page-fullwidth
show_meta: false
title: "All Configuration Options"
subheadline: "Canvas Gauges User Guide"
teaser: "Complete list of available configuration options for gauges"
header: false
permalink: "/documentation/user-guide/configuration"
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
    <li><a href="{{site.url}}/documentation/user-guide/custom-builds">Creating Custom Builds</a></li>
    <li><a href="{{site.url}}/documentation/user-guide/using-as-component">Using As Components</a></li>
    <li><a href="{{site.url}}/documentation/user-guide/scripting-api">Scripting API</a></li>
    <li><a href="{{site.url}}/documentation/user-guide/advanced-usage">Advanced Usage</a></li>
    <li><a href="{{site.url}}/migration/">Migration Guide</a></li>
</ul>
</div>
</div><!-- /.medium-4.columns -->

<div class="medium-8 medium-pull-4 columns" markdown="1">

Canvas gauges can be configured in two ways:

 * using JavaScript API
 * using HTML-component API

JavaScript API provides two ways of bypassing configuration options: on the object instantiation via constructor; in runtime using update() method.

HTML-component API simply provides an ability to add/change/remove configuration attributes on HTML gauge element.

Semantically JavaScript and HTML use different naming conventions which are standard in the industry for today: HTML attribute name is prefixed with "data-" and the option name is dash-split; JavaScript options names are following camelCase rule.

JavaScript example:

~~~javascript
var options = {
   minValue: -100,
   maxValue: 100,
   animationRule: 'elastic',
   animationDuration: 500
};
~~~

Equivalent example in HTML-definition would be:

~~~html
<canvas data-type="linear-gauge"
        data-min-value="-100"
        data-max-value="100"
        data-animation-rule="elastic"
        data-animation-duration="500"
></canvas>
~~~

Sometimes, the values can be a complex-data structures, like arrays or objects. In this case in JavaScript them simply defined as standard notations, but in HTML-attributes definitions the following rules are applied:

 - for arrays of primitives it is allowed to define a comma-separated string of values;
 - it is allowed to define the value as valid JSON notation;

Examples:

Array of primitives:

~~~html
<canvas data-type="radial-gauge"
        data-major-ticks="0,20,40,60,80,100"
></canvas>

<canvas data-type="radial-gauge"
        data-major-ticks="N,NE,E,SE,S,SW,W,NW"
></canvas>
~~~

JSON notations:

~~~html
<canvas data-type="radial-gauge"
        data-major-ticks='["N","NE","E","SE","S","SW","W","NW"]'
></canvas>

<canvas data-type="radial-gauge"
        data-highlights='[
            { "from": 0, "to": 50, "color": "rgba(0,255,0,.15)" },
            { "from": 50, "to": 100, "color": "rgba(255,255,0,.15)" },
            { "from": 100, "to": 150, "color": "rgba(255,30,0,.25)" },
            { "from": 150, "to": 200, "color": "rgba(255,0,225,.25)" },
            { "from": 200, "to": 220, "color": "rgba(0,0,255,.25)" }
        ]'
></canvas>
~~~

All available options for configuring gauges are listed below.

## Common Configuration options

Common configuration options are spread across all type of the gauges means they are applicable to any gauge type. For been more informative and easy-to-find we split those options into groups below.

### Mandatory Options

 - **renderTo**: render target in DOM tree. It is expected to be a canvas element or it's identifier in a DOM tree. This option is not required when the gauge injected as a web-component on the page.

### Basic Options

 - **width**: number in pixels of the canvas element on which the gauge will be drawn.
 - **height**: number in pixels of the canvas element on which the gauge will be drawn.
 - **minValue**: numeric minimal value which will be shown on a gauge bar.
 - **maxValue**: numeric maximal value which will be shown on a gauge bar.
 - **value**: current gauge value which will be displayed.
 - **units**: should be a string explaining the units for the gauge value, or something falsy to hide this element on a gauge.
 - **title**: should be a string to display gauge title or falsy value to hide this element.

### Ticks Bar Options

Tick bars on a gauge representing the measuring system which visualize the gauge measuring intervals and the currently upset value. It should be upset in mind that ticks configuration must be relied properly on a given *minValue* and *maxValue* or you could get confusing display result otherwise.

 - **exactTicks**: boolean flag which switch ticks drawing modes. By default is turned off (false), meaning the tick bar will be drown by the following rules:
   a) majorTicks array will define a number of **equal by length** sections;
   b) minorTicks will define a number of ticks to draw between 2 nearest majorTicks.
 If the value set to true the rules are following:
   a) majorTicks array will define exact values where major ticks should be drawn (it should be an array of exact values, not arbitrary labels);
   b) minorTicks defines a value step for drawing minor tick on a bar.
   See this [example](https://rawgit.com/Mikhus/canvas-gauges/master/examples/exact-ticks-bar.html) [[Source](https://github.com/Mikhus/canvas-gauges/blob/master/examples/exact-ticks-bar.html)] for exact ticks bar configuration and behavior.
 - **majorTicks**: expected to be an array of numeric or string values which will be displayed on a gauge bar as major ticks. This array defines a labels for the ticks. Array length defines a number of sections on a ticks bar. 
 - **minorTicks**: is an integer number which defines how many minor ticks have to be drawn between two neighbour major ticks.
 - **strokeTicks**: boolean value defining if ticks bar of the gauge should be stroked or not. This relies only to a visual effect.
 - **majorTicksInt**: integer which defines how many numeric positions should be used to display integer part of the tick number.
 - **majorTicksDec**: integer which defines how many positions should be used to display decimal part of the tick number.
 - **highlights**: an array of highlights objects, which configures color-highlighted areas on a ticks bar. Each highlight object defines an area to colorize starting **from** value **to** value and using a given **color**, like this: ```{ from: number, to: number, color: string }```
  - **highlightsWidth**: sets the width of highlights area in relative units.
  - **numbersMargin**: defines a margin for tick labels (numbers) in relative units. By default is 1.

#### Progress Bar Options

 - **barWidth**: bar width in percents in relation to overall width of the gauge. It is limited to 50% anyway.
 - **barStrokeWidth**: defines a width of a bar stroke. If set to zero - stroke won't be drawn.
 - **barProgress**: flag, defines if a progress bar should be drawn within this gauge.
 - **barShadow**: number, length of the inner bar shadow if required. By default is 0.

### Animation Options

Animations on the gauge can be turned on or off. Whenever the animation is turned on it will automatically run each time gauge changing it's value. During the animation gauge will animate its needle or progress bar from the old value to a new value it has been upset. If *animatedValue* option is turned on it will also constantly update the value displayed in a value box on each animation step.

 - **animation**: boolean flag signaling whenever the animation is possible on the gauge or not.
 - **animationDuration**: time in milliseconds of the animation duration.
 - **animationRule**: defines a type of animation behavior for the gauge. Canvas gauges already knows the most used types of animation rules or you can define your own animation rule providing the animation rule function within this option. Known rules could be bypassed as string names, which are: *"linear", "quad", "quint", "cycle", "bounce", "elastic"* and their opposites: *"dequad", "dequint", "decycle", "debounce", "delastic"*.
 - **animatedValue**: boolean flag specifies if a value displayed in a value box of the gauge should be constantly updated during animation run. By default it is falsy, so the upset gauge value will be shown immediately and animation will run visually only on the gauge needle or progress bar.
 - **animateOnInit**: boolean flag, which specifies if gauge should be animated on the first draw, by default is false.

### Coloring Options

Canvas gauge provides highly customizable coloring options for the majority of gauge elements. Each color configuration is usually a string value representing the color in one of HEX (#000000-#FFFFFF), RGB (rgb(0, 0, 0)-rgb(255,255,255)) or RGBA (rgba(0,0,0,0)-rgba(255,255,255,1)) formats. Some elements supports gradients. In this case the color of an element could be configured as color start and color end parts.

 - **colorPlate**: defines background color of the gauge plate.
 - **colorPlateEnd**: if specified wil use gradient fill for the plate.
 - **colorMajorTicks**: color of the major ticks lines (also applied to stroke if *strokeTicks* option is true). It can be an array of colors, for each major tick it is possible to specify specific color. In this case if *strokeTicks* enabled, the first color from this array will be used for stroking.
 - **colorMinorTicks**: color of the minor ticks lines.
 - **colorStrokeTicks**: defines a static color for all ticks lines. By default is not specified. If set to some color value will override major ticks stroke color for lines, but will not influence numbers colors. For minor ticks will be used if colorMinorTicks is not specified. 
 - **colorTitle**: color of the title text.
 - **colorUnits**: color of the units text.
 - **colorNumbers**: color of the text for the tick numbers. It can be an array of colors, containing specific color for each number.
 - **colorNeedle**: defines color of the gauge needle.
 - **colorNeedleEnd**: if defined it enables use of gradient for the gauge needle. If this is falsy, needle will be drown using solid color.
 - **colorValueText**: defines a color of the text in a value box.
 - **colorValueTextShadow**: defines a color of a text in a value box. If this value is falsy shadow won't be drawn.
 - **colorBorderShadow**: defines a shadow color of the gauge plate. If is falsy the shadow won't be drawn.
 - **colorBorderOuter**: defines a color of the outer border for the gauge plate.
 - **colorBorderOuterEnd**: if defined it enables use of gradient on the outer border.
 - **colorBorderMiddle**: defines a color of the middle border for the gauge plate.
 - **colorBorderMiddleEnd**: if defined it enables use of gradient on the middle border.
 - **colorBorderInner**: defines a color of the inner border for the gauge plate.
 - **colorBorderInnerEnd**:  if defined it enables use of gradient on the inner border.
 - **colorValueBoxRect**: defines a color of the value box rectangle stroke.
 - **colorValueBoxRectEnd**: if defined it enables use of gradient on value box rectangle stroke.
 - **colorValueBoxBackground**: defines background color for value box.
 - **colorValueBoxShadow**: defines a color of value box shadow. If falsy shadow won't be drawn.
 - **colorNeedleShadowUp**: defines upper half of the needle shadow color.
 - **colorNeedleShadowDown**: defines drop shadow needle color.
 - **colorBarStroke**: color of a bar stroke.
 - **colorBar**: defines a bar background color.
 - **colorBarProgress**: defines a progress bar color;

### Needle Configuration Options

Gauge needle is an element which visualize the current position of the gauge value on a measuring bar. Currently canvas gauge supports drawing of two different types of the needles for each gauge - "line" needle and "arrow" needle. By the way, whenever it may be required, needle may be not drawn at all.

 - **needle**: boolean, specifies if gauge should draw the needle or not.
 - **needleShadow**: boolean, specifies if needle should drop shadow or not.
 - **needleType**: string, one of "arrow" or "line" supported.
 - **needleStart**: tail part of the needle length, in relative units.
 - **needleEnd**: main needle length in relative units.
 - **needleWidth**: max width of the needle in the most wide needle place.

### Borders Options

Canvas gauge plate provides a way to define the borders. There are 3 borders availabe to draw on the edge of the gauge plate. It is possible to combine the borders display options, their widths and colors to achieve exclusive visual look & feel of your gauges.

 - **borders**: boolean, defines if a borders should be drawn or not.
 - **borderOuterWidth**: specifies a width in pixels of the outer border. If set to zero - border won't be drawn at all.
 - **borderMiddleWidth**: specifies a width in pixels of the middle border. If set to zero - border won't be drawn at all.
 - **borderInnerWidth**: specifies a width in pixels of the inner border. If set to zero - border won't be drawn at all.
 - **borderShadowWidth**: specifies the width of the outer border drop shadow. If zero - shadow won't be drawn.

### Value Box Options

Value box element on the gauge is intended to display the digital representation of the current value. it is the most accurate visualisation of the exact value shawn by the gauge on the measuring bar. Whenever it is not required it may be turned off and not drawn.

 - **valueBox**: boolean, defines if the value box should be drawn or not on the gauge.
 - **valueBoxStroke**: number in relative units which defines the width of stroke of the value box element.
 - **valueBoxWidth**: if set and is greater than value text real width - will be set as configured. This value is expected to be a percent in relation to gauge width.
 - **valueText**: text to display instead of showing the current value. It may be useful when it is required to display something different in value box.
 - **valueTextShadow**: specifies if value text shadow should be drawn or not.
 - **valueBoxBorderRadius**: number of radius to draw rounded corners of the value box.
 - **valueInt**: integer which defines how many numeric positions should be used to display integer part of the value number.
 - **valueDec**: integer which defines how many positions should be used to display decimal part of the value number.
 
### Fonts Customization Options

Canvas gauges enables use of custom fonts when drawing text elements. As far as gauges are build on principals of minimalist code base there is no hardcoded fonts integrated with the gauges. Canvas gauges only provides a way to upset a custom font-family to its different text elements, but the font loading and initialization on the page is a part of the work user has to do himself.

 - **fontNumbers**: specifies font family for the tick numbers.
 - **fontTitle**: specifies font family for title text.
 - **fontUnits**: specifies font family for units text.
 - **fontValue**: specifies font-family for value box text.

 - **fontNumbersSize**: Size of the font for tick numbers in relative units.
 - **fontTitleSize**: Size of the font for title element text in relative units.
 - **fontUnitsSize**: Size of the font for units element text in relative units.
 - **fontValueSize**: Size of the font using for drawing value in a value box.

Since version 2.0.6 there is added more advanced font styling features. Now it is possible to set font style and font weight on each text element of the gauge. Where font style can be one of 'normal' (default) 'italic' or 'oblique' values. Font weight can be one of 'normal' (default), 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800' or '900' values.

 - **fontNumbersStyle**: Font style of tick numbers.
 - **fontTitleStyle**: Font style of a gauge title.
 - **fontUnitsStyle**: Font style of the gauge units text.
 - **fontValueStyle**: Font style for the value text in a value box. 

 - **fontNumbersWeight**: Font weight of tick numbers.
 - **fontTitleWeight**: Font weight of a gauge title.
 - **fontUnitsWeight**: Font weight of the gauge units text.
 - **fontValueWeight**: Font weight for the value text in a value box. 

## Gauge-Specific Configuration Options

Each type of the gauge in this library also has it's own specific configuration optoins available for customization.

### Linear Gauge Options

Linear gauge has some specific options for customization and some drawing rules which is good to know.

First of all it can be drawn vertically or horizontally, depending on the upset width and height options for the canvas element. If width greater than height the gauge will be treated as horizontal, otherwise - as vertical.

Horizontal gauge drawing has a limitation of drawing value box. In this orientation value box rendering is disabled as far as it is not possible to find a good place for it within the current design. So it has to be kept im mind when the horizontal orientation is selected to draw the gauge.

#### Borders Options

 - **borderRadius**: radius for rounded corners of the gauge plate and its borders.

#### Progress Bar Options

 - **barBeginCircle**: defines if a gauge bar should start with a circle element imitating flask view of the bar. If set to zero it won't be drawn at all. 
 - **barLength**: defines bar length in percents in relation to overall gauge length.

#### Coloring Options
 
 - **colorBarEnd**: if given, bar background will be drawn as gradient. If falsy bar color will be solid.
 - **colorBarProgressEnd**: if given, progress bar color will be drawn as gradient. If falsy bar color will be solid.

#### Element Positioning Options

 - **tickSide**: defines a side on which ticks bar should be drawn. Available values are: *"left", "right", "both"*. Default value is "both" - on the both sides of a gauge bar. For horizontally aligned gauges "left" value means top position, "right" value means bottom position.
 - **needleSide**: defines a side on which needle at the bar should be drawn. Available values are: *"left", "right", "both"*. Default value is "both" - on the both sides of a gauge bar. For horizontally aligned gauges "left" value means top position, "right" value means bottom position.
 - **numberSide**: defines a side on which tick numbers should be drawn. Available values are: *"left", "right", "both"*. Default value is "both" - on the both sides of a gauge bar. For horizontally aligned gauges "left" value means top position, "right" value means bottom position.

#### Ticks Bar Options

 - **ticksWidth**: defines a length of major ticks width (and width of ticks bar overall) in relative units.
 - **ticksWidthMinor**: defines a length of minor tick lines in relative units.
 - **ticksPadding**: defines a padding used for drawing ticks out of a bar, in relative units.

### Radial Gauge Options

Radial gauge controls has their specific customization options, which are enables to drastically customize its view to make it look, for example, like manometer or compass or any other radial-kind of the tool possible too imagine.

#### Ticks Bar Options 
 
 - **ticksAngle**: defines a max angle for ticks bar. By default is 270 degrees. If 360 degrees specified ticks bar fills the whole circle.
 - **startAngle**: defines a start angle using which ticks bar starts. By default is 45 degrees.

#### Coloring Options

 - **colorNeedleCircleOuter**: defines a color which should be used to draw outer decorative circle element at the middle of the gauge.
 - **colorNeedleCircleOuterEnd**: if defined, outer decorative circle gauge element will be drawn as gradient. If falsy - outer circle will be drawn using solid color.
 - **colorNeedleCircleInner**: defines a color which should be used to draw inner decorative circle element at the middle of the gauge.
 - **colorNeedleCircleInnerEnd**: if defined, inner decorative circle gauge element will be drawn as gradient. If falsy - inner circle will be drawn using solid color.

#### Needle Options

 - **needleCircleSize**: defines the size in relative units of the decorative circles element of the gauge.
 - **needleCircleInner**: boolean flag, turns on/off inner decorative circle element drawing.
 - **needleCircleOuter**: boolean flag, turns on/off outer decorative circle element drawing.

#### Animation Options

 - **animationTarget**: defines which part of the gauge should be animated when changing the value. Could be one of 'needle' (default) or 'plate' values. When 'plate' is selected then gauge will animate ticks bar instead of animating the needle.
 - **useMinPath** - boolean. Applicable only to radial gauges which have full 360-degree ticks plate. If set to true for these kind of gauges will rotate needle/plate by a minimal rotation path.

</div><!-- /.medium-8.columns -->
</div><!-- /.row -->
