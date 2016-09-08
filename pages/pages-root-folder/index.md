---
#
# Use the widgets beneath and the content will be
# inserted automagically in the webpage. To make
# this work, you have to use › layout: frontpage
#
layout: frontpage
header: NULL
#  image_fullwidth: "tools-1.jpg"
#
# Use the call for action to show a button on the frontpage
#
# To make internal links, just use a permalink like this
# url: /getting-started/
#
# To style the button in different colors, use no value
# to use the main color or success, alert or secondary.
# To change colors see sass/_01_settings_colors.scss
#
#callforaction:
#  url: https://tinyletter.com/feeling-responsive
#  text: Inform me about new updates and features ›
#  style: alert
permalink: /index.html
#
# This is a nasty hack to make the navigation highlight
# this page as active in the topbar navigation
#
homepage: true
userGuide:
  title: "User Guide"
  url: "/documentation/user-guide/"
  icon: "user-guide"
  iconColor: "5a5a5a"
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

