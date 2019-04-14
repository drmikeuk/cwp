// SETUP MAP
////////////

var StamenTonerLite = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  noWrap: true
});

var EsriWorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
  noWrap: true
});

var EsriWorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  maxZoom: 16,
  noWrap: true
});

var EsriWorldPhysical = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
  maxZoom: 8,
    noWrap: true
});

// create a map in the "map" div
var map = L.map('map', {
    zoom: 6,
    maxZoom: 12,
    center: [53.396432,-1.71753],
    layers: [StamenTonerLite]
});

// add layers control
var baseMaps = {
    "Esri Gray Canvas": EsriWorldGrayCanvas,
    "Esri Topo": EsriWorldTopoMap,
    "Esri Physical": EsriWorldPhysical,
    "Stamen Toner": StamenTonerLite
};


// map categories to FA icon colours
var colours = {
  "Royalist":'darkblue',
  "Parliamentarian":'red',
  "":'lightgray'
}




// LOAD DATA
//////////////////////////////////////////

// northyorkshire.latlng.test.csv
// id,allegiance,person,parish,latlng

var data = [];
$(document).ready(function() {
  // LOAD COUNTY SHAPE
  var counties = $.ajax({
    url:"/assets/northyorkshire.wgs84.geojson",
    dataType: "json",
    //success: console.log("County data successfully loaded."),
    error: function (xhr) {
      alert(xhr.statusText)
    }
  });

  $.when(counties).done(function() {
    var countiesStyle = {
        "color": "#72AF26",
        "weight": 1,
        "opacity": 0.65,
        "fillOpacity": 0
    };
    //L.control.layers(baseMaps).addTo(map); - add later
      // Add external GeoJSON to map
      var mycounties = L.geoJSON(counties.responseJSON,
         {
           style: countiesStyle,
           onEachFeature: function (feature, layer) {
               layer.bindTooltip(feature.properties.PAR, {className: 'parishtooltip'});

               layer.on({
                   mouseover: function () {
                       this.setStyle({
                          "weight": 3
                       });
                   },
                   mouseout: function () {
                       this.setStyle({
                           "weight": 1
                       });
                   }
                })

           } // end onEachFeature
         }).addTo(map);
    });

  // LOAD PLACES / PINS
  $.ajax({
    type: "GET",
    url: "/assets/northyorkshire.latlng.csv",
    dataType: "text",
    success: function(csvdata) {
      //console.log(csvdata);
      data = Papa.parse(csvdata, {header: true});
      //console.log(data);

      // MARKER CLUSTERER...
      // create markerClusterGroup  (BUT will now add markers to subgroups)
      var markersgroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        spiderfyDistanceMultiplier: 1.5
      }),
      // add subgroups too - will add markers to these
      Royalist = L.featureGroup.subGroup(markersgroup),
      Parliamentarian = L.featureGroup.subGroup(markersgroup),
      Other = L.featureGroup.subGroup(markersgroup);

      data.data.forEach(function(place) {
        //console.log(place);
        if (place.latlng != "0,0")
        {
          var parts = place.latlng.split(",");   // split this one filed into the 2 parts...
          var lat = parseFloat(parts[0]);         //convert to integers!
          var lng = parseFloat(parts[1]);
          //console.log(place.id + ' ' + place.latlng + ' => Lat: ' + lat + ' Lng: ' + lng)
          var popup = '<div class="popup-content">';
          popup += "<h2>" + place.person + "</h2>";
          popup += '<div class="city">Parish: ' + place.parish + '. ID: ' + place.id + '</div>';
          popup += "<p>Allegiance: " + place.allegiance + "</p>";
          popup += "</div>";

        	//var marker = L.marker([lat, lng]).bindPopup(popup);
          // swap to FA marker (NB ver5 extraClasses: 'fas'); lookup  colour from colours array based on allegiance
          // move below  var marker = L.marker([lat, lng], {icon: L.AwesomeMarkers.icon({icon: 'crown', prefix: 'fa', extraClasses: 'fas', markerColor: colours[place.allegiance]}) }).bindPopup(popup)


        	//markersgroup.addLayer(marker);
          // add to subgroups instead...
          //console.log("allegiance: " + place.allegiance);
          if (place.allegiance == "Royalist") {
              var marker = L.marker([lat, lng], {icon: L.AwesomeMarkers.icon({icon: 'crown', prefix: 'fa', extraClasses: 'fas', markerColor: colours[place.allegiance]}) }).bindPopup(popup)
              Royalist.addLayer(marker);
              //console.log("    -> Royalist");
          } else if (place.allegiance == "Parliamentarian") {
              var marker = L.marker([lat, lng], {icon: L.AwesomeMarkers.icon({icon: 'university', prefix: 'fa', extraClasses: 'fas', markerColor: colours[place.allegiance]}) }).bindPopup(popup)
              Parliamentarian.addLayer(marker);
              //console.log("    -> Parliamentarian");
          } else {
              var marker = L.marker([lat, lng], {icon: L.AwesomeMarkers.icon({icon: 'circle', prefix: 'fa', extraClasses: 'fasr', markerColor: colours[place.allegiance]}) }).bindPopup(popup)
              Other.addLayer(marker);
              console.log(place.id + ' ' + place.allegiance + " -> Other");
          }


        }
      });
      // add  to map
  		map.addLayer(markersgroup);
      // add subgroups too
      map.addLayer(Royalist);
      map.addLayer(Parliamentarian);
      map.addLayer(Other);

      // CONTROLS
      var overlays = {
      "<i class='fa fa-circle darkblue'></i> Royalist": Royalist,
      "<i class='fa fa-circle red'></i> Parliamentarian": Parliamentarian,
      "<i class='fa fa-circle lightgray'></i> Other": Other
      };
      // ORIGINAL (collapsed) L.control.layers(baseMaps).addTo(map);
      // expanded... L.control.layers(baseMaps, overlays, options).addTo(map);
      L.control.layers(baseMaps, overlays, {collapsed: false}).addTo(map);

      //fit the map to the markers plus add some padding so markers not so close to edge
      // see https://groups.google.com/d/msg/leaflet-js/F66YlMCaQK4/FWY9itdTvFMJ (same thread as above)
      map.fitBounds(markersgroup.getBounds().pad(0.04));

      } //end success
}); // end ajax


}); // end document ready
