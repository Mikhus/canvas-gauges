---
layout: page-fullwidth
show_meta: false
title: "<span class='icon-download'></span> Download"
subheadline: "Getting Canvas Gauges"
permalink: "/download/"
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
<h4>Get Canvas Gauges</h4>
{: #toc }
*  TOC
{:toc}
</div>
</div><!-- /.medium-4.columns -->

<div class="medium-8 medium-pull-4 columns" markdown="1">

There are plenty of options obtaining canvas gauges: downloading packages for local use on your website; installing packages from node package manager; using content delivery network or using a source code.

## Download Minified Packages

Use right-click and "Save link as..." to download minified packages to your local device. If you wish simply refer it from your code - it is possible, but much preferable to use [CDN](#loading-from-cdn) for this.

 * [All-in-one]({{site.url}}/download/latest/all/gauge.min.js) ({{ site.data.releases.latest.all.kb }} Kb)
 * [Only radial gauge]({{site.url}}/download/latest/radial/gauge.min.js) ({{ site.data.releases.latest.radial.kb }} Kb)
 * [Only linear gauge]({{site.url}}/download/latest/linear/gauge.min.js) ({{ site.data.releases.latest.linear.kb }} Kb)

## Installing From NPM

 * All-in-one  
   ```$ npm install canvas-gauges```
 
 * Only radial gauge  
   ```$ npm install canvas-gauges@radial```

 * Only linear gauge  
   ```$ npm install canvas-gauges@linear```

## Loading From CDN
 * All-in-one  

~~~html
<script src="//cdn.rawgit.com/Mikhus/canvas-gauges/gh-pages/download/latest/all/gauge.min.js"></script>
~~~
 
 * Only radial gauge  

~~~html
<script src="//cdn.rawgit.com/Mikhus/canvas-gauges/gh-pages/download/latest/radial/gauge.min.js"></script>
~~~

 * Only linear gauge  

~~~html
<script src="//cdn.rawgit.com/Mikhus/canvas-gauges/gh-pages/download/latest/linear/gauge.min.js"></script>
~~~


## Getting Canvas Gauges Sources

 * [Fork to your account on github](https://github.com/Mikhus/canvas-gauges)
 * Clone repository locally  
   ```$ git clone git@github.com:Mikhus/canvas-gauges.git```

</div><!-- /.medium-8.columns -->
</div><!-- /.row -->
