---
layout: frontpage
header: no
permalink: /index.html
homepage: true
userGuide:
  title: "User Guide"
  url: "/documentation/user-guide/"
  icon: "user-guide"
  iconColor: "#a55"
  text: 'Complete user guide about canvas gauges.'
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

{% if page.userGuide.title %}
{% include _frontpage-widget.html widget=page.userGuide %}
{% endif %}

{% if page.devGuide.title %}
{% include _frontpage-widget.html widget=page.devGuide %}
{% endif %}

{% if page.examples.title %}
{% include _frontpage-widget.html widget=page.examples %}
{% endif %}

