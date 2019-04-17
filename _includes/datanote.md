Parish boundaries
-----------------
- 1831Counties shapefile
- Filter for GAZ_CNTY = YORKSHIRE, NORTH RIDING
- Save selected features as new geojson file
- Simplify 50% on mapshaper.org & save as topojson (reduces filesize & thus load time)
- <i class="fas fa-exclamation-circle"></i> Not consolidated parishes into one shape (so eg Skelton = 6 neighbouring shapes)


Payments data
-------------
- CSV from export listing all payments
- Filter for person_location_county = yorkshire, north riding
- Calculate allegiance based on payment date (<1660 = Parliamentarian; >1660 = Royalist)
- Save CSV with fields as listed below
- <i class="fas fa-exclamation-circle"></i> Export contains latlng but not name of this place

| Field | Example | Note |
| ----- | ------- | ---- |
| id | 1 | row number; just for internal reference |
| allegiance | Parliamentarian | used for pin colours |
| person | Abraham Barringham of Marrick, North Riding of Yorkshire | used for pop-up |
| parish | MARRICK | used for pop-up |
| latlng | 54.3794,-1.88327 | |
{: .table .table-sm .table-striped .thead-dark .tableauto}
