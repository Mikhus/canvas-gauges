# HTML Canvas Gauges v2.0

[![Build Status](https://travis-ci.org/Mikhus/canv-gauge.svg?branch=v2.0.0)](https://travis-ci.org/Mikhus/canv-gauge) ![Test Coverage](https://rawgit.com/Mikhus/canv-gauge/v2.0.0/test-coverage.svg) ![Documentation Coverage](https://rawgit.com/Mikhus/canv-gauge/v2.0.0/docs-coverage.svg) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Mikhus/canv-gauge/v2.0.0/LICENSE)

[![Canvas Gauges](https://raw.githubusercontent.com/Mikhus/blob/master/gauges.png)](https://rawgit.com/Mikhus/canv-gauge/v2.0.0/examples/component.html)

<!-- toc -->

- [Installation](#installation)
- [Using Gauges](#using-gauges)
  * [Configuration Options](#configuration-options)
    + [Common Configuration options](#common-configuration-options)
      - [Mandatory Options](#mandatory-options)
      - [Basic Options](#basic-options)
      - [Ticks Bar Options](#ticks-bar-options)
      - [Animation Options](#animation-options)
      - [Coloring Options](#coloring-options)
      - [Needle Configuration Options](#needle-configuration-options)
      - [Borders Options](#borders-options)
      - [Value Box Options](#value-box-options)
      - [Fonts Customization Options](#fonts-customization-options)
    + [Gauge-Specific Configuration Options](#gauge-specific-configuration-options)
      - [Linear Gauge Options](#linear-gauge-options)
        * [Borders Options](#borders-options-1)
        * [Bar Options](#bar-options)
        * [Coloring Options](#coloring-options-1)
        * [Element Positioning Options](#element-positioning-options)
        * [Ticks Options](#ticks-options)
        * [Fonts Options](#fonts-options)
      - [Radial Gauge Options](#radial-gauge-options)
        * [Bar Options](#bar-options-1)
        * [Coloring Options](#coloring-options-2)
        * [Needle Options](#needle-options)
  * [Using As Components](#using-as-components)
  * [Scripting API](#scripting-api)
- [Sponsored By](#sponsored-by)
- [License](#license)

<!-- tocstop -->

This is tiny implementation of highly configurable gauge using pure JavaScript and HTML5 canvas.
No dependencies. Suitable for IoT devices because of minimum code base.

## Installation

Canvas gauges can be simply installed using npm package manager. Depending on your needs there is possibility to install whole gauge library or only that part you really need for your project.
To install the whole library, run:

    $ npm install canv-gauge

If you only need the exact type of the gauge it can be installed using the appropriate npm tag. Currently the following gauges are supported: linear, radial.

To install only linear gauge, run:

    $ npm install canv-gauge@linear

To install only radial gauge, run:

    $ npm install canv-gauge@radial

This strategy useful only if you need to minimize your code base and plan to use ONLY a specific gauge type. If you need to use various gauge types in your project it is recommended to use whole gauge package.

## Using Gauges

There are two ways inject gauges into your web-page:
 
 - as a web-component;
 - using JavaScript.

Whatever injecting type selected to use, first of all it is required to learn available gauge configuration options. Canvas gauges are **highly customizable controls**. You would be able to configure their look & feel at an extreme level of customization options. By the way to get a working gauge on your page it is possible to start with the zero-level of configuration.

### Configuration Options

Configuration options for the gauge usually passed to a constructor function and are a plain JavaScript object.

#### Common Configuration options

Common configuration options are spread across all type of the gauges means they are applicable to any gauge type. For been more informative and easy-to-find we split those options into groups below.

##### Mandatory Options

 - **renderTo**: render target in DOM tree. It is expected to be a canvas element or it's identifier in a DOM tree. This option is not required when the gauge injected as a web-component on the page.

##### Basic Options

 - **width**: number in pixels of the canvas element on which the gauge will be drawn.
 - **height**: number in pixels of the canvas element on which the gauge will be drawn.
 - **minValue**: numeric minimal value which will be shown on a gauge bar.
 - **maxValue**: numeric maximal value which will be shown on a gauge bar.
 - **value**: current gauge value which will be displayed.
 - **units**: should be a string explaining the units for the gauge value, or something falsy to hide this element on a gauge.
 - **glow**: boolean flag specifies if gauge should be drawn using glow effect or not.
 - **title**: should be a string to display gauge title or falsy value to hide this element.

##### Ticks Bar Options

Tick bars on a gauge representing the measuring system which visualize the gauge measuring intervals and the currently upset value. It should be upset in mind that ticks configuration must be relied properly on a given *minValue* and *maxValue* or you could get confusing display result otherwise.

 - **majorTicks**: expected to be an array of numeric or string values which will be displayed on a gauge bar as major ticks.
 - **minorTicks**: is an integer number which defines how many minor ticks have to be drawn between two neighbour major ticks.
 - **strokeTicks**: boolean value defining if ticks bar of the gauge should be stroked or not. This relies only to a visual effect.
 - **majorTicksInt**: integer which defines how many numeric positions should be used to display integer part of the tick number.
 - **majorTicksDec**: integer which defines how many positions should be used to display decimal part of the tick number.
 - **highlights**: an array of highlights objects, which configures color-highlighted areas on a ticks bar. Each highlight object defines an area to colorize starting **from** value **to** value and using a given **color**, like this: ```{ from: number, to: number, color: string }```

##### Animation Options

Animations on the gauge can be turned on or off. Whenever the animation is turned on it will automatically run each time gauge changing it's value. During the animation gauge will animate its needle or progress bar from the old value to a new value it has been upset. If *animatedValue* option is turned on it will also constantly update the value displayed in a value box on each animation step.

 - **animation**: boolean flag signaling whenever the animation is possible on the gauge or not.
 - **animationDuration**: time in milliseconds of the animation duration.
 - **animationRule**: defines a type of animation behavior for the gauge. Canvas gauges already knows the most used types of animation rules or you can define your own animation rule providing the animation rule function within this option. Known rules could be bypassed as string names, which are: *"linear", "quad", "quint", "cycle", "bounce", "elastic"* and their opposites: *"dequad", "dequint", "decycle", "debounce", "delastic"*.
 - **animatedValue**: boolean flag specifies if a value displayed in a value box of the gauge should be constantly updated during animation run. By default it is falsy, so the upset gauge value will be shown immediately and animation will run visually only on the gauge needle or progress bar.

##### Coloring Options

Canvas gauge provides highly customizable coloring options for the majority of gauge elements. Each color configuration is usually a string value representing the color in one of HEX (#000000-#FFFFFF), RGB (rgb(0, 0, 0)-rgb(255,255,255)) or RGBA (rgba(0,0,0,0)-rgba(255,255,255,1)) formats. Some elements supports gradients. In this case the color of an element could be configured as color start and color end parts.

 - **colorPlate**: defines background color of the gauge plate.
 - **colorMajorTicks**: color of the major ticks lines (also applied to stroke if *strokeTicks* option is true). 
 - **colorMinorTicks**: color of the minor ticks lines.
 - **colorTitle**: color of the title text.
 - **colorUnits**: color of the units text.
 - **colorNumbers**: color of the text for the tick numbers.
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

##### Needle Configuration Options

Gauge needle is an element which visualize the current position of the gauge value on a measuring bar. Currently canvas gauge supports drawing of two different types of the needles for each gauge - "line" needle and "arrow" needle. By the way, whenever it may be required, needle may be not drawn at all.

 - **needle**: boolean, specifies if gauge should draw the needle or not.
 - **needleShadow**: boolean, specifies if needle should drop shadow or not.
 - **needleType**: string, one of "arrow" or "line" supported.
 - **needleStart**: tail part of the needle length, in relative units.
 - **needleEnd**: main needle length in relative units.
 - **needleWidth**: max width of the needle in the most wide needle place.

##### Borders Options

Canvas gauge plate provides a way to define the borders. There are 3 borders availabe to draw on the edge of the gauge plate. It is possible to combine the borders display options, their widths and colors to achieve exclusive visual look & feel of your gauges.

 - **borders**: boolean, defines if a borders should be drawn or not.
 - **borderOuterWidth**: specifies a width in pixels of the outer border. If set to zero - border won't be drawn at all.
 - **borderMiddleWidth**: specifies a width in pixels of the middle border. If set to zero - border won't be drawn at all.
 - **borderInnerWidth**: specifies a width in pixels of the inner border. If set to zero - border won't be drawn at all.
 - **borderShadowWidth**: specifies the width of the outer border drop shadow. If zero - shadow won't be drawn.

##### Value Box Options

Value box element on the gauge is intended to display the digital representation of the current value. it is the most accurate visualisation of the exact value shawn by the gauge on the measuring bar. Whenever it is not required it may be turned off and not drawn.

 - **valueBox**: boolean, defines if the value box should be drawn or not on the gauge.
 - **valueBoxStroke**: number in relative units which defines the width of stroke of the value box element.
 - **valueText**: text to display instead of showing the current value. It may be useful when it is required to display something different in value box.
 - **valueTextShadow**: specifies if value text shadow should be drawn or not.
 - **valueBoxBorderRadius**: number of radius to draw rounded corners of the value box.
 - **valueInt**: integer which defines how many numeric positions should be used to display integer part of the value number.
 - **valueDec**: integer which defines how many positions should be used to display decimal part of the value number.
 
##### Fonts Customization Options

Canvas gauges enables use of custom fonts when drawing text elements. As far as gauges are build on principals of minimalistic code base there is no hardcoded fonts integrated with the gauges. Canvas gauges only provides a way to upset a custom font-family to its different text elements, but the font loading and initialization on the page is a part of the work user has to do himself.

 - **fontNumbers**: specifies font family for the tick numbers.
 - **fontTitle**: specifies font family for title text.
 - **fontUnits**: specifies font family for units text.
 - **fontValue**: specifies font-family for value box text.

#### Gauge-Specific Configuration Options

Each type of the gauge in this library also has it's own specific configuration optoins available for customization.

##### Linear Gauge Options

Linear gauge has some specific options for customization and some drawing rules which is good to know.

First of all it can be drawn vertically or horizontally, depending on the upset width and height options for the canvas element. If width greater than height the gauge will be treated as horizontal, otherwise - as vertical.

Horizontal gauge drawing has a limitation of drawing value box. In this orientation value box rendering is disabled as far as it is not possible to find a good place for it within the current design. So it has to be kept im mind when the horizontal orientation is selected to draw the gauge.

###### Borders Options

 - **borderRadius**: radius for rounded corners of the gauge plate and its borders.

###### Bar Options

 - **barBeginCircle**: defines if a gauge bar should start with a circle element imitating flask view of the bar. If set to zero it won't be drawn at all. 
 - **barWidth**: bar width in percents in relation to overall width of the gauge. It is limited to 50% anyway.
 - **barLength**: defines bar length in percents in relation to overall gauge length.
 - **barStrokeWidth**: defines a width of a bar stroke. If set to zero - stroke won't be drawn.
 - **barProgress**: flag, defines if a progress bar should be drawn within this gauge.

###### Coloring Options
 
 - **colorBarStroke**: color of a bar stroke.
 - **colorBar**: defines a bar background color.
 - **colorBarEnd**: if given, bar background will be drawn as gradient. If falsy bar color will be solid.
 - **colorBarProgress**: defines a progress bar color;
 - **colorBarProgressEnd**: if given, progress bar color will be drawn as gradient. If falsy bar color will be solid.

###### Element Positioning Options

 - **tickSide**: defines a side on which ticks bar should be drawn. Available values are: *"left", "right", "both"*. Default value is "both" - on the both sides of a gauge bar. For horizontally aligned gauges "left" value means top position, "right" value means bottom position.
 - **needleSide**: defines a side on which needle at the bar should be drawn. Available values are: *"left", "right", "both"*. Default value is "both" - on the both sides of a gauge bar. For horizontally aligned gauges "left" value means top position, "right" value means bottom position.
 - **numberSide**: defines a side on which tick numbers should be drawn. Available values are: *"left", "right", "both"*. Default value is "both" - on the both sides of a gauge bar. For horizontally aligned gauges "left" value means top position, "right" value means bottom position.

###### Ticks Options

 - **ticksWidth**: defines a length of major ticks width (and width of ticks bar overall) in relative units.
 - **ticksWidthMinor**: defines a length of minor tick lines in relative units.
 - **ticksPadding**: defines a padding used for drawing ticks out of a bar, in relative units.
 
###### Fonts Options

 - **fontNumbersSize**: Size of the font for tick numbers in relative units.
 - **fontTitleSize**: Size of the font for title element text in relative units.
 - **fontUnitsSize**: Size of the font for units element text in relative units.

##### Radial Gauge Options

Radial gauge controls has their specific customization options, which are enables to drastically customize its view to make it look, for example, like manometer or compass or any other radial-kind of the tool possible too imagine.

###### Bar Options 
 
 - **ticksAngle**: defines a max angle for ticks bar. By default is 270 degrees. If 360 degrees specified ticks bar fills the whole circle.
 - **startAngle**: defines a start angle using which ticks bar starts. By default is 45 degrees.

###### Coloring Options

 - **colorNeedleCircleOuter**: defines a color which should be used to draw outer decorative circle element at the middle of the gauge.
 - **colorNeedleCircleOuterEnd**: if defined, outer decorative circle gauge element will be drawn as gradient. If falsy - outer circle will be drawn using solid color.
 - **colorNeedleCircleInner**: defines a color which should be used to draw inner decorative circle element at the middle of the gauge.
 - **colorNeedleCircleInnerEnd**: if defined, inner decorative circle gauge element will be drawn as gradient. If falsy - inner circle will be drawn using solid color.

###### Needle Options

 - **needleCircleSize**: defines the size in relative units of the decorative circles element of the gauge.
 - **needleCircleInner**: boolean flag, turns on/off inner decorative circle element drawing.
 - **needleCircleOuter**: boolean flag, turns on/off outer decorative circle element drawing.

### Using As Components

TBD

### Scripting API

TBD

## Sponsored By

[![Lohika](http://www.lohika.com/wp-content/themes/gridalicious/images/lohika_full.svg)](http://www.lohika.com/)

## License

This code is subject to [MIT](https://raw.githubusercontent.com/Mikhus/canv-gauge/v2.0.0/LICENSE) license.
