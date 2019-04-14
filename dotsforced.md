---
layout: default
title: "Dots (forced)"
nav: "yes"
sortTitle: "6"
---

full width responsive D3 dots + force layout

<div id="map" class="map"></div>

<div class="container" markdown="1">

Notes
-----
- Outline map of parish boundaries (just) for Yorkshire North Riding
- Dot per payment
- <i class="fas fa-exclamation-triangle"></i> NOT YET: Force layout dots so  don't overlap
- Red for Parliamentarian; Blue for Royalist
- <i class="fas fa-exclamation-triangle"></i> NOT YET: On load zooms to bounds of pins (ie focuses on county of interest)
- <i class="fas fa-exclamation-circle"></i> Don’t display dot if latlng is null or 0,0

{% include datanote.md %}

</div>
