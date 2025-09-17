---
layout: default
title: "All (clusters)"
nav: "yes"
sortTitle: "7"
# leaflet.1.0.1 + awesome-markers + MarkerCluster
customcss:
  - /vendor/leaflet.css
  - /vendor/leaflet.awesome-markers.css
  - /vendor/MarkerCluster.css
  - /vendor/MarkerCluster.Default.css
customjs:
  - /vendor/leaflet.js
  - /vendor/papaparse.min.js  
  - /vendor/leaflet.awesome-markers.min.js
  - /vendor/leaflet.markercluster-src.js
  - /vendor/subgroup.js
  - http://maps.stamen.com/js/tile.stamen.js?v1.2.4
  - /assets/allpayments.js
---

<div id="map" class="map leaflet"></div>

<div class="container" markdown="1">

Notes
-----
- Tiled map of UK (can change background)
- <i class="fas fa-exclamation-circle"></i> plus county boundaries
- Clustered pins (using leaflet library), zoom in on click
- Red pins for Parliamentarian; Blue for Royalist
- Can filter map to show just Parliamentarian / Royalist pins
- On load zooms to bounds of pins (ie focuses on area of interest)
- <i class="fas fa-exclamation-circle"></i> Don’t display pin if latlng is null or 0,0

{% include datanote.md %}

</div>
