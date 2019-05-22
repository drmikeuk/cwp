// SETUP
////////////////////////////
// create SVG object
var width = 1600,
    height = 950;

// albers projection with this center & rotation is good for (whole of) UK
// (manually) tweak for yorkshire
// can  I automate this?
// --> maybe just show UK & add zoom so can zoom in?
// dont set center and scale  here - do on bounds once loaded instead
var projection = d3.geoAlbers()
    .center([-1.345980498,	54.33668813])  // centriod from qgis
    .center([3.07,	54.3]) // tweaked (I guess the rotate skews it?)
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(38000*2)
    .translate([width / 2, height / 2]);


var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("id", "svg")
    //.attr("width", width)
    //.attr("height", height)  // responsive instead
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1600 950")
    .classed("responsive-svg", true) //container class to make it responsive


// add zoom see https://bl.ocks.org/vasturiano/f821fc73f08508a3beeb7014b2e4d50f
// using SVG transforms to avoid the overhead of reprojecting at every zoom iteration.
/*

THIS DOESNT ZOOM THE DOTS AS THEY ARE  TRANSFORMED INTO PLACE
--> LOOK INTO REPROJECT ?

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var g = svg.append("g");
svg.call(zoom);
*/


// Setup tooltip div
var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


// LOAD DATA (map & places)
//////////////////////////////////////////////////////
// see http://bl.ocks.org/mapsam/6090056

var data = [];                           // global
var pins = [];
var legend;
queue()
  .defer(d3.json, '/assets/northyorkshire.dissolved.wgs84.topojson.json')    // Load map shape
  .defer(d3.csv, "/assets/northyorkshire.latlng.test3.csv") 						  // Load statistics/data
  .defer(d3.csv, "/assets/northyorkshire.labels.csv") 						 // Load labels for selected places
  .await(makeMyMap);


function makeMyMap(error, uk, data, labels) {
  // read data from CSV (Parish, Royalist,Parliamentarian,lat,lng)

  // add parishes to svg (NB. if zoom then add to g not svg)
  // parishes are all within "northyorkshire" (ie layername) within objects
  svg.selectAll("path")
    .data(topojson.feature(uk, uk.objects.northyorkshire).features)
    .enter().append("path")
      .attr("class", function(d) { return "parish " + d.properties.PAR; })
      .attr("d", path)
      //.style("fill", "#FAFAFA") // style in css
      .on("mouseover", function(d) {
			    div.style("opacity", 1);
          var html = d.properties.PAR;
				  div.html(html)
		          .style("left", (d3.event.pageX) + "px")  	    // 200 wide so this is half;  was -100
			        .style("top", (d3.event.pageY) + "px"); 	  // move so above clearer; was  -60
			})
			.on("mouseout", function() {
			    div.style("opacity", 0);			// remove change opacity
			 })


  // ROLLUP for MAP. Data: allegiance, id, latlng, parish, person (aka item Title)
  // so COUNT of Royalist/Parliamentarian per distinct place (latlng)
  rollup = d3.nest()
    .key(function(d) { return d.latlng; })
    .key(function(d) { return d.allegiance; })
    .rollup(function(v) { return {
       count: v.length,
       //parish: d3.values(v, function(d) { return d.parish; })
     }; })
    .map(data);
  //console.log ("Rollup...")
  //console.log (JSON.stringify(rollup))


  // ROLLUP FOR SUMMARY STATS
  ///////////////////////////
  claimants = d3.nest()
    .key(function(d) { return d.type; })
    .key(function(d) { return d.allegiance; })
    .rollup(function(v) { return {
       count: v.length,
     }; })
    .map(data);
  //console.log ("claimants...")
  //console.log (JSON.stringify(claimants))

  // Locatable - only those where latlng not empty
  // https://stackoverflow.com/questions/33572531/ignoring-a-group-with-the-d3-nest-function
  var dataLocatable = filtered = data.filter(function(d) { return d.latlng !== '0,0' && d.latlng !== ''; });
  claimantsLocatable = d3.nest()
    .key(function(d) { return d.type; })
    .key(function(d) { return d.allegiance; })
    .rollup(function(v) { return {
       count: v.length,
     }; })
    .map(dataLocatable);
  //console.log ("claimants locatable...")
  //console.log (JSON.stringify(claimantsLocatable))

  // strip leading $ from variables...
  //var latlng = key.replace(/^\$/, '');

  function tabulate(data, target) {
  		var table = d3.select(target).append('table').attr('class', 'table tableauto')
  		var thead = table.append('thead')
  		var	tbody = table.append('tbody');



  		// append the header row
      var headers = [' ', 'Number', 'Locatable'];
      thead.append('tr')
  		  .selectAll('th')
  		  .data(headers)
        .enter()
  		  .append('th')
  		  .text(function (headers) { return headers; });

      function displayRow(data, classed) {
        row = tbody.append('tr')
          .attr('class', classed)
          .selectAll('td')
          .data(data)
          .enter()
          .append('td')
          .text(function (data) { return data; });

      }

      // add data rows from claimants and claimantsLocatable rollups
      // displayRow (data, classed) where data = [label, Number, Locatable]
      // note rollup array has extra $ in array keys so "$Maimed soldier"
      displayRow (['Maimed soldiers', , ], 'subhead');
      displayRow (['Royalists', claimants["$Maimed soldier"]["$Royalist"]["count"], claimantsLocatable["$Maimed soldier"]["$Royalist"]["count"]], 'data');
      displayRow (['Parliamentarians', claimants["$Maimed soldier"]["$Parliamentarian"]["count"], claimantsLocatable["$Maimed soldier"]["$Parliamentarian"]["count"]], 'data');

      displayRow (['War widows', , ], 'subhead');
      displayRow (['Royalists', claimants["$War widow"]["$Royalist"]["count"], claimantsLocatable["$War widow"]["$Royalist"]["count"]], 'data');
      displayRow (['Parliamentarians', claimants["$War widow"]["$Parliamentarian"]["count"], claimantsLocatable["$War widow"]["$Parliamentarian"]["count"]], 'data');

      displayRow (['ALL', , ], 'subhead');
      displayRow (['Royalists', claimants["$Maimed soldier"]["$Royalist"]["count"] + claimants["$War widow"]["$Royalist"]["count"], claimantsLocatable["$Maimed soldier"]["$Royalist"]["count"] + claimantsLocatable["$War widow"]["$Royalist"]["count"]], 'data');
      displayRow (['Parliamentarians', claimants["$Maimed soldier"]["$Parliamentarian"]["count"] + claimants["$War widow"]["$Parliamentarian"]["count"], claimantsLocatable["$Maimed soldier"]["$Parliamentarian"]["count"] + claimantsLocatable["$War widow"]["$Parliamentarian"]["count"]], 'data');

  	  return table;
  	}

  	// render the tables
  	tabulate(data, '#claimants');





  // populate pins array so easy to sort by count & then plot
  for (var key in rollup)
  {
      if (rollup.hasOwnProperty(key))
      {
          var latlng = key.replace(/^\$/, '');
          // iterate through allegiance(s)
          for (var key2 in rollup[key])
          {
              if (rollup[key].hasOwnProperty(key2))
              {
                  var allegiance = key2.replace(/^\$/, '');
                  var count = rollup[key][key2]["count"];
                  //console.log(latlng + ' ' + key2 + ' = ' + rollup[key][key2]["count"]);
                  //console.log(latlng + ' ' + allegiance + ' = ' + count);
                  // ---> push to pins array (drop if no latlng)!
                  if (latlng != ''){
                    pins.push({parish: "x", allegiance: allegiance, latlng: latlng, count: count});
                  }
              }
          }
      }
  }

  pins.sort(function(a, b) { return b.count - a.count })

  //console.log(pins)

  // create scale
  // NB When using circle size to represent data, it’s considered better practice to set the area, rather than the radius proportionally to the data.
  // so use The scaleSqrt scale is a special case of the power scale (where k = 0.5) and is useful for sizing circles by area (rather than radius).
  // https://d3indepth.com/scales/
  var max = d3.max(pins, function(d) { return parseFloat(d.count); });
  max =  Math.ceil(max / 10) * 10;
  //console.log ('Max: ' + max)
  var radius = d3.scaleSqrt()
      .domain([0, max])
      .range([0, 60]);

  // draw Bubbles
  svg.selectAll("circle")
    .data(pins)
    .enter()
    .append("circle")
    .attr("r", function(d) {
      //console.log (d.parish  + ' ' + d.allegiance  + ' : ' + radius(d.count));
      return radius(d.count);
    })
    .attr("class", function(d) {
      //console.log (d.allegiance);
      return d.allegiance;
    })
    .on("mouseover", function(d) {
        div.style("opacity", 1);
        div.classed(function(d) {console.log ('classed: ' + d.allegiance); return d.allegiance;}, true); // this isnt working!
        var html = d.allegiance + ': ' + d.count;
        div.html(html)
            .style("left", (d3.event.pageX) + "px")  	    // 200 wide so this is half;  was -100
            .style("top", (d3.event.pageY) + "px"); 	  // move so above clearer; was  -60
    })
    .on("mouseout", function() {
        div.style("opacity", 0);			// remove change opacity
        div.classed(function(d) {return d.allegiance;}, false);    //  remove Parliamentarian/Royalist class
     })
    .attr("transform", function(d) {
      var pieces = d.latlng.split(",");
      var lat = pieces[0];
      var long = pieces[1];
      //console.log (d.person + ' ' + d.parish + ': ' + d.latlng + ' = ' + lat + ' and ' + long);
      return "translate(" + projection([long,lat]) + ")"; // NB projection wants LONG then LAT !!
     });


     // LABELS for selected places
/* dont need circles as already got one per place
    svg.selectAll("places")
     .data(labels).enter()
     //.append('rect')
     //.attr("width", "12px")
     //.attr("height", "12px")
     .append("circle")
     .attr("r", "20px")
     .attr("fill", "rgba(0,0,0,0.1)")
     // classed so fill & stroke
     .attr("transform", function(d) {
       var pieces = d.latlng.split(",");
       var lat = pieces[0];
       var long = pieces[1];
       return "translate(" + projection([long,lat]) + ")"; // NB projection wants LONG then LAT !!
      });
      */

      /* labels */
      svg.selectAll(".place-label")
      .data(labels).enter()
      .append("text")
      .attr("class", "place-label")
      .attr("transform", function(d) {
        var pieces = d.latlng.split(",");
        var lat = pieces[0];
        var long = pieces[1];
        return "translate(" + projection([long,lat]) + ")"; // NB projection wants LONG then LAT !!
       })
      .attr("dy", "0.55em")
      .attr("dx", "24px")
      .text(function(d) { return d.place; });



     // LEGEND
     ////////////////////////////////////
     var legendData = [5, max/2,  max];

     var legend = svg.append("g")
         .attr("class", "legend")
         .attr("transform", "translate(" + (width - 100) + "," + (height - 20) + ")")
         .selectAll("g")
         .data(legendData)
         .enter().append("g");

     legend.append("circle")
         .attr("cy", function(d) { return -radius(d); })
         .attr("r", radius);

     legend.append("text")
         .attr("y", function(d) { return -2 * radius(d); })
         .attr("dy", "1.3em")
         .text(d3.format(""));

     // add bubbles for Royalist and Parliamentarian
     var legendDots = svg.append("g")
         .attr("transform", "translate(" + (width - 330) + "," + (height - 80) + ")");

     legendDots.append("circle")
         .attr("cx", "20")
         .attr("cy", "20")
         .attr("r", "12")
         .attr("class", "Royalist");

     legendDots.append("text")
          .attr("dx", "40")
          .attr("dy", "26")
          .text("Royalist")


     legendDots.append("circle")
         .attr("cx", "20")
         .attr("cy", "50")
         .attr("r", "12")
         .attr("class", "Parliamentarian");

     legendDots.append("text")
        .attr("dx", "40")
        .attr("dy", "56")
        .text("Parliamentarian")


    // DOWNLOAD SVG button
    // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
    var svgData = document.getElementById("svg").outerHTML;
    var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.id = 'downloadLink';
    downloadLink.href = svgUrl;
    downloadLink.download = "map.svg";
    var linkText = document.createTextNode("Download as SVG");
    downloadLink.appendChild(linkText);
    document.getElementById("download").appendChild(downloadLink);

}; // end makeMyMap


// FUNCTIONS
// =========
// zoom...
function zoomed() {
 console.log ('Zoomed')
   g
       .selectAll('path') // To prevent stroke width from scaling
       .attr('transform', d3.event.transform);
}
