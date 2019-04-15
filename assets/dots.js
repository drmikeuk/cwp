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
var legend;

//  --> DONT THINK NEED THIS....

var current = 'percentRoyalist';         // global; default dataset (ie column from CSV)
queue()
  .defer(d3.json, '/assets/northyorkshire.wgs84.topojson.json')    // Load map shape
  .defer(d3.csv, "/assets/northyorkshire.latlng.csv") 						  // Load statistics/data
  .await(makeMyMap);


function makeMyMap(error, uk, data) {
  // read data from CSV (Parish, Royalist,Parliamentarian,lat,lng)

  // add parishes to svg
  // parishes are all within "northyorkshire" (ie layername) within objects
  svg.selectAll("path")
    .data(topojson.feature(uk, uk.objects.northyorkshire).features)
    .enter().append("path")
      .attr("class", function(d) { return "parish " + d.properties.PAR; })
      .attr("d", path)
      //.style("fill", "#FAFAFA") // style in css
      .on("mouseover", function(d) {
			    div.transition().duration(300).style("opacity", 1);
          var html = '<h4>' + d.properties.PAR + '</h4>';
				  div.html(html)
		          .style("left", (d3.event.pageX) + "px")  	    // 200 wide so this is half;  was -100
			        .style("top", (d3.event.pageY) + "px"); 	  // move so above clearer; was  -60
			})
			.on("mouseout", function() {
			    div.transition()
            .duration(300)
			      .style("opacity", 0);			// remove change opacity
			 })

  // add circles for items (places) from CSV
  // NB blue for Royalist: #2c7bb6; Red for #d7191c Parliamentarian
  // person (aka post title), parish, allegiance, latlng
  /* NB convert lat long to projection
        see http://stackoverflow.com/questions/20987535/plotting-points-on-a-map-with-d3 */
  svg.selectAll("circle")
  .data(data).enter()
  .append("circle")
  .attr("r", "5px")
  .attr("class", function(d) {
    //console.log (d.allegiance);
    return d.allegiance + 'Dot';
  })
  .attr("transform", function(d) {
    var pieces = d.latlng.split(",");
    var lat = pieces[0];
    var long = pieces[1];
    //console.log (d.person + ' ' + d.parish + ': ' + d.latlng + ' = ' + lat + ' and ' + long);
    return "translate(" + projection([long,lat]) + ")"; // NB projection wants LONG then LAT !!
   });


  // DOWNLOAD SVG button ??


}; // end makeMyMap



// FUNCTIONS
//////////////////////////////////////////

// zoom...
function zoomed() {
  console.log ('Zoomed')
    g
        .selectAll('path') // To prevent stroke width from scaling
        .attr('transform', d3.event.transform);
    }
