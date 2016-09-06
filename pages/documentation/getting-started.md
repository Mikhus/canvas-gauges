---
layout: page-fullwidth
show_meta: false
title: "<span class='icon-startup'></span> Getting Started"
subheadline: "A Step-by-Step Guide"
teaser: "This step-by-step guide helps you to start use Canvas Gauges."
header: false
permalink: "/documentation/getting-started/"
breadcrumb: true
---

Canvas gauges is a **highly customizable** web-components drown using HTML5 canvas and JavaScript. 
Start using gauges is very easy using zero-level configuration and adjusting  a proper configuration options to make a unique look & feel.
Here are 3 simple steps to start using gauges in your web-application:

## 1. Install

We recommend using node package manager (npm):

    $ npm install canv-gauge

Or you may clone entire gauge repository from [github](https://github.com/Mikhus/canv-gauge):

    $ git clone git@github.com:Mikhus/canv-gauge.git

## 2. Inject Into Your Page

In a simplest case it is enough to put a script tag in your HTML-page:

~~~html
<script src="/path/to/gauge.min.js"></script>
~~~

Otherwise if your are using more complicated builds in your project the possibilities for code injection may vary. For example if you build project using browserify or webpack, which supports CommonJS module loading it is simply enough to require() the installed module:

~~~javascript
require('canv-gauge');
~~~

For TypeScript or ES6 based modules it is enough to do a proper import:

~~~typescript
import * from 'canv-gauge';
~~~

## 3. Draw Your Gauge!

Just as an HTML-component:

~~~html
<canvas data-type="radial-gauge">
<canvas data-type="linear-gauge">
~~~

Or By using scripting API:

in page.html:

~~~html
<canvas id="my-radial-gauge">
<canvas id="my-linear-gauge">
~~~

in script.js or html script tag:

~~~javascript
require('canv-gauge');

var radial = new RadialGauge({ renderTo: 'my-radial-gauge' })
var linear = new LinearGauge({ renderTo: 'my-linear-gauge' });

radial.draw();
linear.draw();
~~~

### What's Next?

Follow one of the following guides to learn more:

 * [User Guide]({{site.url}}/documentation/user-guide/)
 * [Examples]({{site.url}}/documentation/examples)
 * [Advanced Usage]({{site.url}}/documentation/user-guide/advanced-usage)

<!--<a class="radius button small" href="{{ site.url }}/docs/2.0.0/">Check out the API documentation for more ›</a>-->
