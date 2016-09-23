---
layout: page-fullwidth
show_meta: false
title: "<span class='icon-download'></span> Old Releases Available for Download"
subheadline: "Getting Canvas Gauges"
permalink: "/old-releases/"
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

<div class="medium-8 medium-pull-4 columns" markdown="1" style="min-height:600px">

On this page you can find old canvas gauges releases, available for download. To download a proper release just right-click the item you need and choose "Save link as..." in a context-menu.

If you are looking for a latest release, please, go to [download]({{site.url}}/download/) page.

{% for release in site.data.releases %}
{% if release[1].name != site.data.releases.latest.name %}

### Version {{release[1].name}}

 * [All-in-one]({{site.url}}/download/{{release[1].name}}/all/gauge.min.js) ({{ release[1].all.kb }} Kb)
 * [Only radial gauge]({{site.url}}/download/{{release[1].name}}/radial/gauge.min.js) ({{ release[1].radial.kb }} Kb)
 * [Only linear gauge]({{site.url}}/download/{{release[1].name}}/linear/gauge.min.js) ({{ release[1].linear.kb }} Kb)

{% endif %}
{% endfor %}

{% if site.data.releases.length > 6 %}
If you are looking for a latest release, please, go to [download]({{site.url}}/download/) page.
{% endif %}

</div><!-- /.medium-8.columns -->
</div><!-- /.row -->
