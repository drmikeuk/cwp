// SETUP
////////////////////////////
// for SVG object
var width = 1600,
    height = 950;


// LOAD DATA (map & places)
//////////////////////////////
RoyalistbyParish = {};            // global
ParliamentarianbyParish = {};
var current = 'Royalist';         // global; default dataset (ie column from CSV)
queue()
  .defer(d3.json, '/assets/northyorkshire.wgs84.topojson.json')    // Load map shape
  .defer(d3.csv, "/assets/northyorkshire.csv") 						  // Load statistics/data
  .await(makeMyMap);




// FUNCTIONS
// =========
function makeMyMap(error, uk, data) {
    // read data from CSV (Parish, Royalist) -> map to array per PARISH for lookups...
    data.forEach(function(d) {
      ParliamentarianbyParish[d.Parish] = +d.Parliamentarian;
      RoyalistbyParish[d.Parish] = +d.Royalist;
    });

    // find max Royalist OR Parliamentarian count as use as max in BOTH scales
    maxRoyalist = d3.max(data, function(d) { return parseFloat(d.Royalist); });
    maxParliamentarian = d3.max(data, function(d) { return parseFloat(d.Parliamentarian); });
    max = Math.max(maxRoyalist, maxParliamentarian);
    max =  Math.ceil(max / 10) * 10;
    //console.log ('max: '+ max + ' maxRoyalist: ' + maxRoyalist + ' maxParliamentarian: ' + maxParliamentarian)

    // setup scales
    colorRoyalist = d3.scaleQuantize()
        .domain([0, max])
        .range(['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c']); // 5 blues from colorbrewer2.org
    legendRoyalist = d3.legendColor()
      .scale(colorRoyalist) 						// creates lengend based on this D3 scale
      .title('Number of Royalists per parish')
      .labelFormat(d3.format("d")) 		 // Takes a d3.format and applies that styling to the legend labels; d = dgits, no decimal places
      // DONT specify labels and library will do for you
      .shapeWidth(100)						      // wider so can fit labels in
      .orient('horizontal');

    colorParliamentarian = d3.scaleQuantize()
        .domain([0, max])
        .range(['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15']); // 5 reds from colorbrewer2
    legendParliamentarian = d3.legendColor()
      .scale(colorParliamentarian) 						// creates lengend based on this D3 scale
      .title('Number of Parliamentarians per parish')
      .labelFormat(d3.format("d")) 		 // Takes a d3.format and applies that styling to the legend labels; d = dgits, no decimal places
      // DONT specify labels and library will do for you
      .shapeWidth(100)						      // wider so can fit labels in
      .orient('horizontal');

      // add parishes to svg
      //////////////////////
      drawMap("Royalist", "#mapRoyalist");                // dataset, target DIV
      drawMap("Parliamentarian", "#mapParliamentarian");


  function drawMap (current, target){
    // SETUP
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

    var svgcontainer = d3.select(target)
        .append("div")
        .classed("svg-container", true)

    var svg = svgcontainer
        .append("svg")
        .attr("id", current)
        //.attr("width", width)
        //.attr("height", height)  // responsive instead
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 1600 950")
        .classed("responsive-svg", true) //container class to make it responsive

    // Setup tooltip div
    var div = d3.select(target).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // DRAW PARISHES ie add to svg
    ///////////////////////////////
    // parishes are all within "northyorkshire" (ie layername) within objects
    svg.selectAll("path")
      .data(topojson.feature(uk, uk.objects.northyorkshire).features)
      .enter().append("path")
        .attr("class", function(d) { return "parish " + d.properties.PAR; })
        .attr("d", path)
        .on("mouseover", function(d) {
  			    div.style("opacity", 1);
            var html = '<h4>' + d.properties.PAR +  '</h4><p>Royalists: ';
            html += RoyalistbyParish[d.properties.PAR] + '<br/>Parliamentarians: '
            html += ParliamentarianbyParish[d.properties.PAR] + '</p>';
  				  div.html(html)
  		          .style("left", (d3.event.pageX) + "px")  	    // 200 wide so this is half;  was -100
  			        .style("top", (d3.event.pageY) + "px"); 	  // move so above clearer; was  -60
  			})
  			.on("mouseout", function() {
  			    div.style("opacity", 0);			// remove change opacity
  			 })
        .style("fill", function(d) {
          return (colourise(current, d.properties.PAR));		// colourise ie lookup value on colour scale
        })

        // ADD LEGEND see http://d3-legend.susielu.com/
        ///////////////////////////////////////////////

        /* v1: within map svg & translate to bottom of map...

        var legendsvg = svg.append("g")               // add to current SVG (ie within map)
            .attr("class", "mylegend")
            .attr("transform", "translate(20," + (height - 60) + ")");


        v2: below map svg -- breaks responsive!
        var legendsvg = d3.select(target).append("svg")   // add to map DIV (ie new SVG below map SVG)
            .attr("class", "mylegend")
            .attr("width", width)
            .attr("height", 200)
        */


        //var legendsvg = svg.append("g")               // add to current SVG (ie within map)
        var svgcontainer = d3.select(target)
            .append("div")
            .classed("svg-container", true)
            .attr("style", "padding-bottom: 12.5%; /* aspect ratio */")

        var legendsvg = svgcontainer.append("svg")    // add to map DIV (ie new SVG below map SVG)
            .attr("class", "mylegend")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 800 100")
            .classed("responsive-svg", true) //container class to make it responsive

        var legendg = legendsvg.append("g")
            .attr("transform", "translate(20,20)");

        // call(legendRoyalist) or legendParliamentarian
        legendg.call(eval('legend' + current));





  }; // end drawMap

}; // end makeMyMap



function colourise (current, PAR){
  // Got PAR (parish name eg ROMFORD) from shapefile
  // Lookup in datafile (Parish:Royalists) to get % Royalists
    // Pass this to d3.scale to get colour
  // Else return grey

  var dataset = current + 'byParish';  // dataset for lookup; eg RoyalistbyParish or ParliamentarianbyParish
  var color = 'color' + current;       // colour scale eg colourRoyalist or colourParliamentarian
  // console.log ('Parish: ' + PAR + ' current: ' + current + '. So dataset: ' + dataset + ' and colorscale: ' + color);

  if (eval(dataset)[PAR])
  {
		// PAR (ie parish) exists in array of data from CSV...
	  //console.log (PAR + '. ' + dataset + ' = ' + eval(dataset)[PAR] + ' = ' + eval(color)(eval(dataset)[PAR]));
    return eval(color)(eval(dataset)[PAR]); // lookup colour using d3 scale...
	 } else {
		// PAR does NOT exist in array of data from CSV
		//console.log('Miss: No data for Parish:' + PAR);
    //console.log ('MISS ' + PAR + '. ' + dataset + ' = ' + eval(dataset)[PAR]);
    return '#FAFAFA'; // was #E6E6E6 grey; now paler FAFAFA so pale blues stand out
	}
};
