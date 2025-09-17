---
layout: default
title: sussex
countyid: sussex
customjs:
  - /vendor/d3.v4.min.js
  - /vendor/topojson.v1.min.js  
  - /vendor/d3.queue.v1.min.js
  - /assets/county.js
---
<link href="https://fonts.googleapis.com/css?family=Merriweather&display=swap" rel="stylesheet" >
<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">

<div class="wordpress">


  <div class="map-container">
    <h2>{{page.title}}</h2>
    <div id="map" class="map svg-container"></div>
  </div>


  <div class="container" >
    <p id="countyid">{{page.countyid}}</p>
    <p><a href="/counties/{{page.countyid}}.topojson.json">County shape JSON</a></p>
  </div>

</div>
