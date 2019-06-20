---
layout: default
title: "Counties"
nav: "no"
---

<div class="container">
  <h2>County shapes</h2>
  <!-- list all pages where a countyid is set -->

  <ul>
    {% comment %} Only include pages with `countyid` in the front-matter; sort on title{% endcomment %}
    {% assign pages = (site.pages | sort: "title" ) %}
    {% for item in pages %}
      {% if item.countyid  %}
      <li ><a href="{{ item.url | prepend: site.baseurl }}">{{ item.title }}</a></li>
      {% endif %}
    {% endfor %}
  </ul>
</div>
