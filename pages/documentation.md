---
layout: page-fullwidth
show_meta: false
title: "<span class='icon-docs'></span> About Docs"
subheadline: "Canvas Gauge Documentation Page"
permalink: "/documentation/"
teaser: "Here you may find different types of documentation depending on your needs:"
widget1:
  title: "Starter User Guide"
  url: "/getting-started/"
  icon: "startup"
  iconColor: "#a55"
  text: 'Information about using canvas gauges in a web applications.'
widget2:
  title: "Developer's API Docs"
  url: "/documentation/api/"
  icon: "api-docs"
  iconColor: "#5a5"
  text: 'Application Programming Interface documentation for developers.'
widget3:
  title: "Usage Examples"
  url: "/examples/"
  icon: "examples"
  iconColor: "#55a"
  text: 'Learn using gauges through existing configuration examples.'
---

{% if page.widget1.title %}
{% include _frontpage-widget.html widget=page.widget1 %}
{% endif %}

{% if page.widget2.title %}
{% include _frontpage-widget.html widget=page.widget2 %}
{% endif %}

{% if page.widget3.title %}
{% include _frontpage-widget.html widget=page.widget3 %}
{% endif %}
