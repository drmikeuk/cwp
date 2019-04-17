---
layout: default
title: "About"
nav: "yes"
sortTitle: "1"
---

<div class="container" markdown="1">
<br/>

Different ways of displaying data on maps
-----------------------------------------

These examples explore different visualisations for the same dataset of payments from the North Riding of Yorkshire.

- the [choropleth]({% link choropleth.md %}) technique colours in the parish depending on number of Royalists / Parliamentarians.
- the [clusters]({% link leafletclusters.md %}) technique allows you to zoom in and see payment details on a pop-up. Because of the  clusters you **can't** see the spread of Royalists / Parliamentarians until you zoom in.
- the [dots]({% link dots.md %}) example shows one dot per payment but as many have the same location they are stacked and so you **can't** see the number of Royalists / Parliamentarians.
- the [bubbles]({% link bubbles.md %}) example uses the size of bubbles to show the number of Royalists / Parliamentarians at each location.
- the [dots plus forced layout]({% link dotsforced.md %}) example uses smaller dots and applies forces so they don’t overlap but cluster *near* the location.

NB. The choropleth uses the **parish** for location; all the others use the **lat/lng**.

### Sketch from Andy Hopper

<img src="/images/northridingsketch.png" alt="original sketch" class="img-fluid">




{% include datanote.md %}

Statistics
----------

- <i class="fas fa-exclamation-triangle"></i> work in progress...
- D3 Rollup  -> summary dataset

Further information
-------------------

- [Parishes and shapefile]({% link parishes.md %})

</div>
