---
layout: page-fullwidth
show_meta: false
title: "Custom Builds"
subheadline: "Canvas Gauges User Guide"
teaser: "How to create optimized custom builds"
header: false
permalink: "/documentation/user-guide/custom-builds"
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
    <li><a href="{{site.url}}/documentation/user-guide/using-as-component">Using As Components</a></li>
    <li><a href="{{site.url}}/documentation/user-guide/scripting-api">Scripting API</a></li>
    <li><a href="{{site.url}}/documentation/user-guide/advanced-usage">Advanced Usage</a></li>
    <li>a href="{{site.url}}/migration/">Migration Guide</a></li>
</ul>
</div>
</div><!-- /.medium-4.columns -->

<div class="medium-8 medium-pull-4 columns" markdown="1">

By default canvas gauges delivered with the good level of optimization. Up to your choice you can refer to a minified package which will include only that you need.

By the way there is possible some tricks to make the packages more efficient in terms of disk space usage or you may need to create your own extended build for some other reasons.

## Optimizing Disk Space Usage

This can be critical when the gauges used, for example, with IoT devices which has limited disk space. Here is a trick how to save up to 3-4 times of overall bytes of canvas gauges.

  1. Get the required minified code only.
  1. Gzip it
  1. Tune web-server do deliver compressed code always.

Possible problem here is that some old browsers may not understand compression. But at present day the impact of this problem is very-very low. Anyway, if you have to support very old browsers, keep it in-mind.

Another problem is that in this case gauges may be injected into page only via http request by referring from a script tag. This problem can be ommited if you bundling the entire JavaScript code with your own build process. In this case you may gzip entire bundle.

If you choose compressing gauge code outside your build process it can be easily done using canvas-gauges tools.

    $ git clone git@github.com:Mikhus/canvas-gauges.git
    $ npm install
    $ ./node_modules/.bin/gulp gzip

All minified and compressed packages can be found after that under ```dist/``` directory. Just grab what you need and remove everything else.

## Creating Custom Builds

As far as canvas gauges is an open source you may legally fork and modify it's code. Tools infrastructure around canvas gauges may help you develop, build test and create production packaging of your changes.

Build process is using [gulp](http://gulpjs.com/) as task runner. So there is several tasks which may be helpful when you need to create your custom build:

~~~
Usage: gulp [task] [options]
Tasks:
    build           Transpiles, combines and minifies JavaScript code.
     --type         build type:
                    'radial' - Gauge object only, 
                    'linear' - LinearGauge object only, 
                    'all' - everything (default)

    build:prod      Builds production packages

    clean           Clean-ups files from previous build.

    gzip            Runs gzipping for minified file.
                    Depends: ["build:prod"]

    watch           Watch for source code changes and automatically 
                    re-build when wny of them detected.
                    Depends: ["build"]
~~~

</div><!-- /.medium-8.columns -->
</div><!-- /.row -->
