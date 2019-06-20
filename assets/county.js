
// Grab countyID and use for topojson name + objects too

var countyid = document.getElementById("countyid").innerText;

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
/*
var projection = d3.geoAlbers()
    .center([-1.345980498,	54.33668813])  // centriod from qgis
    .center([3.07,	54.3]) // tweaked (I guess the rotate skews it?)
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(38000*2)
    .translate([width / 2, height / 2]);


var path = d3.geoPath()
    .projection(projection);
*/
var svg = d3.select("#map").append("svg")
    .attr("id", "svg")
    //.attr("width", width)
    //.attr("height", height)  // responsive instead
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1600 950")
    .classed("responsive-svg", true) //container class to make it responsive


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
  .defer(d3.json, '/counties/' + countyid + '.topojson.json')    // Load map shape
  //.defer(d3.csv, "/assets/northyorkshire.latlng.test3.csv") 						  // Load statistics/data
  //.defer(d3.csv, "/assets/northyorkshire.labels.csv") 						 // Load labels for selected places
  .await(makeMyMap);


function makeMyMap(error, uk, data, labels) {
  // read data from CSV (Parish, Royalist,Parliamentarian,lat,lng)

  // ==> MOVED HERE SO CAN USE FITSIZE
  // Create a unit projection
  var projection = d3.geoAlbers()
      //.center([3.07,	54.3]) // tweaked (I guess the rotate skews it?)
      //.fitSize([width, height], uk)  // where uk = geojson
      .rotate([4.4, 0])
      .parallels([50, 60])
      //.scale(38000*2)
      .scale(1)
      .translate([0, 0]);
      //.translate([width / 2, height / 2]);

  // Create a path generator
  var path = d3.geoPath()
      .projection(projection);

  // Compute the bounds of a feature of interest, then derive scale & translate.
  county = topojson.feature(uk, uk.objects[countyid]);
  var b = path.bounds(county),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  // Update the projection to use computed scale & translate.
  projection
      .scale(s)
      .translate(t);



  // add parishes to svg (NB. if zoom then add to g not svg)
  // parishes are all within "northyorkshire" (ie layername) within objects
  svg.selectAll("path")
    .data(topojson.feature(uk, uk.objects[countyid]).features)
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


}; // end makeMyMap
