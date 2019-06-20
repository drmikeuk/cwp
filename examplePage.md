---
layout: default
title: "Sample page"
nav: "yes"
sortTitle: "8"
customjs:
  - /vendor/d3.v4.min.js
  - /vendor/topojson.v1.min.js  
  - /vendor/d3.queue.v1.min.js
  - /assets/examplePage.js
---
<link href="https://fonts.googleapis.com/css?family=Merriweather&display=swap" rel="stylesheet" >
<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">

<div class="wordpress">

  <div class="container">

  adding a line or two of text to this stats page to explain exactly what documentary evidence we have surviving for that county (e.g. we have very little royalist data for Essex, so we don’t want users to surmise that the lack of royalist data means there were no royalists in Essex)

  </div>


  <div class="map-container">
    <h2>Claimants resident in  the county</h2>
    <div id="map" class="map svg-container"></div>
    <p>ClaimantsNotes: Edit in admin config somewhere; appears on all county pages. The same for all counties<p>
    <p>Optional free text box in page template; optional; different per page</p>
  </div>


  <div class="container" >
    <h2>Claimants resident in  the county</h2>
    <div id="claimants"></div>
    <p>ClaimantsNotes: Edit in admin config somewhere; appears on all county pages. The same for all counties<p>
    <p>Optional free text box in page template; optional; different per page</p>

    <h2>Gratuities paid in the county</h2>
    <div id="gratuities"></div>
    <p>table...</p>
    <p>GratuitiesNotes: Edit in admin config somewhere; appears on all county pages. The same for all counties<p>
    <p>Optional free text box in page template; optional; different per page</p>

    <h2>Pensions paid in the county</h2>
    <div id="pensions"></div>
    <p>table...</p>
    <p>PensionsNotes: Edit in admin config somewhere; appears on all county pages. The same for all counties<p>
    <p>Optional free text box in page template; optional; different per page</p>
  </div>

</div>
