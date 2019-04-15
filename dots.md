---
layout: default
title: "Dots"
nav: "yes"
sortTitle: "4"
customjs:
  - /vendor/d3.v4.min.js
  - /vendor/topojson.v1.min.js  
  - /vendor/d3.queue.v1.min.js
  - /vendor/d3-legend.min.js
  - /assets/dots.js
---

<div id="map" class="map svg-container"></div>

<div class="container" markdown="1">

Notes
-----
- Outline map of parish boundaries (just) for Yorkshire North Riding
- Dot per payment
- Red for Parliamentarian; Blue for Royalist
- <i class="fas fa-exclamation-triangle"></i> NOT YET: On load zooms to bounds of pins (ie focuses on county of interest)
- <i class="fas fa-exclamation-circle"></i> Don’t display dot if latlng is null or 0,0

{% include datanote.md %}

</div>
