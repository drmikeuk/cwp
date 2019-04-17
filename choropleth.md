---
layout: default
title: "Choropleth"
nav: "yes"
sortTitle: "2"
customjs:
  - /vendor/d3.v4.min.js
  - /vendor/topojson.v1.min.js  
  - /vendor/d3.queue.v1.min.js
  - /vendor/d3-legend.min.js
  - /assets/choropleth.js
---


<div class="container-fluid">
  <div class="row">
    <div id="mapRoyalist" class="map col-md"></div>
    <div id="mapParliamentarian" class="map col-md"></div>
  </div>
</div>

<div class="container" markdown="1">

Notes
-----
- Outline map of parish boundaries (just) for Yorkshire North Riding
- Colour in parish shape depending on count of Royalists / Parliamentarians
- Range of blues for Royalists and reds for Parliamentarians
- <i class="fas fa-exclamation-triangle"></i> NOT YET: On load zooms to bounds of map (ie focuses on county of interest)
- <i class="fas fa-exclamation-triangle"></i> Don't display if no Parish

{% include datanote.md %}

</div>
