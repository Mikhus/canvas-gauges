---
layout: page-fullwidth
show_meta: false
header:
  image_fullwidth: "architect.jpg"
title: "<span class='icon-docs'></span> About Docs"
subheadline: "Canvas Gauge Documentation Page"
permalink: "/documentation/"
teaser: "Here you may find different types of documentation depending on your needs:"
starter:
  title: "Getting Started"
  url: "/documentation/getting-started/"
  icon: "startup"
  iconColor: "#a55"
  text: 'Quick steps to start using canvas gauges in a web applications.'
userGuide:
  title: "User Guide"
  url: "/documentation/user-guide/"
  icon: "user-guide"
  iconColor: "5a5a5a"
  text: 'Complete user gude about canvas gauges.'
devGuide:
  title: "Developer's API Docs"
  url: "/documentation/api/"
  icon: "api-docs"
  iconColor: "#5a5"
  text: 'API documentation for developers.'
examples:
  title: "Usage Examples"
  url: "/documentation/examples/"
  icon: "examples"
  iconColor: "#55a"
  text: 'Learn using gauges through existing configuration examples.'
---

{% if page.starter.title %}
{% include _frontpage-widget.html widget=page.starter %}
{% endif %}

{% if page.userGuide.title %}
{% include _frontpage-widget.html widget=page.userGuide %}
{% endif %}

{% if page.devGuide.title %}
{% include _frontpage-widget.html widget=page.devGuide %}
{% endif %}

{% if page.examples.title %}
{% include _frontpage-widget.html widget=page.examples %}
{% endif %}
