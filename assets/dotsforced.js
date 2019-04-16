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

// Setup tooltip div
var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);



// LOAD DATA (map & places)
//////////////////////////////////////////////////////
// see http://bl.ocks.org/mapsam/6090056
var data = [];                           // global
queue()
  .defer(d3.json, '/assets/northyorkshire.wgs84.topojson.json')    // Load map shape
  .defer(d3.csv, "/assets/northyorkshire.latlng.csv") 						  // Load statistics/data
  .await(makeMyMap);


function makeMyMap(error, uk, data) {
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

  // add force-directed circles for items (places) from CSV
  // https://d3indepth.com/force-layout/
  // Style via css: Dots & Bubbles: blue for Royalist: #2c7bb6; Red for #d7191c Parliamentarian */
  //    .RoyalistDot         {fill: #2c7bb6;}
  //    .ParliamentarianDot  {fill: #d7191c;}
  /* NB convert lat long to projection
        see http://stackoverflow.com/questions/20987535/plotting-points-on-a-map-with-d3 */

  // data contains: person (aka post title), parish, allegiance, latlng
  // populate nodes array with X and Y converted via projection from latlng
  var nodes=[];
  for (var i = 0, len = data.length; i < len; i++)
  {
    var allegiance = data[i]["allegiance"];

    var pieces = data[i]["latlng"].split(",");
    var lat = pieces[0];
    var long = pieces[1];
    var location = projection([long,lat]);
    var x = location[0];
    var y = location[1];

    //console.log (data[i]["id"] + ' ' + data[i]["parish"] + ' ' + allegiance + ' latlng ' + data[i]["latlng"] + ' = ' + x + ", " + y)
    nodes.push({id: data[i]["id"], x: x, y: y, allegiance: allegiance, latlng: data[i]["latlng"]});
  }
  //console.log ('Nodes...')
  //console.log (nodes)


  var radius=4;

  var simulation = d3.forceSimulation(nodes)
     // attract to other elements (so clump) - was 5; reduce so less bigger clumps & more focused on location
    .force('charge', d3.forceManyBody().strength(0))

    // attract to location: set X and Y
    .force('x', d3.forceX().x(function(d) {
      return d.x
    }))
    .force('y', d3.forceY().y(function(d) {
      return d.y
    }))

    // collision/overlap: no overlap + little bit padding
    .force('collision', d3.forceCollide().radius(radius + 1))
    .on('tick', ticked);


  function ticked() {
      var u = d3.select('svg')
        .selectAll('circle')
        .data(nodes);

      u.enter()
        .append('circle')
        .attr('r', radius)
        .attr("class", function(d) {
          //console.log (d.allegiance);
          return d.allegiance + 'Dot';
        })
        .merge(u)
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        })

      u.exit().remove();
  }


/* plain dots....
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
*/



}; // end makeMyMap
