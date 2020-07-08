// Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

// Define Colors and Text for Scales
var scaleText = ["States to Visit", "States Visited", "Cities to Visit", "Cities Visited"];
var scaleColor = ["rgb(213,222,217)", "rgb(69,173,168)", "rgb(255,255,255)", "rgb(217,91,67)"];

// Define ordinal scale for color output
var colorScale = d3.scaleOrdinal()
                   .domain(scaleText)
                   .range(scaleColor);

// Define ordinal scale for shape output
var symbolScale = d3.scaleOrdinal()
                    .domain(scaleText)
                    .range(scaleColor);

// Create SVG element and append map to the SVG
var svg = d3.select(".map")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        
// Append Div for tooltip to SVG
var tooltip = d3.select(".map")
                .select(".tooltip");

// Load GeoJSON data and merge with states data
d3.json("states.json").then(function(json) {

    // Map the cities I have lived in!
    d3.csv("cities.csv").then(function(data) {
        
        // Convert states column to array
        var statesVisited = data.filter(function(d){ return d.hasVisited==1 }).map(function(d){ return d.state });

        // Map visited states to json GeoJSON data
        for (var i = 0; i < json.features.length; i++) {
            var hasVisited = statesVisited.includes(json.features[i].properties.NAME);
            json.features[i].properties.hasVisited = hasVisited;
        }

        // Plot state paths by binding GeoJSON data to SVG
        svg.selectAll("path")
            .data(json.features)
            .join("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function(d) {
                return colorScale(d.properties.hasVisited);
            });

        // Plot city paths by binding CSV data to SVG
        svg.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("class", function(d) {
               return (d.hasVisited==1) ? "map-visited":"map-will-visit";
            })
            .attr("cx", function(d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", 4)
            .attr("fill", function(d) {
                return (d.hasVisited==1) ? "rgb(217,91,67)":"rgb(255,255,255)";
            })
            .attr("stroke", "rgb(217,91,67)")
            .attr("stroke-width", 2)
            .style("opacity", 0.85)
            .on("mouseover", function(d) {
                d3.select(this)
                    .transition()
                    .attr("r", 8);
                tooltip.transition()        
                    .duration(200)
                    .style("opacity", .9);      
                tooltip.text(d.place)
                    .style("left", (d3.event.pageX - 32) + "px")     
                    .style("top", this.getBBox().y + 30 + "px");
            })
            .on("mouseout", function(d) {    
                d3.select(this)
                    .transition()
                    .attr("r", 4);   
                tooltip.transition()
                    .duration(500)      
                    .style("opacity", 0);   
            });
    });
});

// Define Colors and Text for Legends
var legendTitle = ["States", "Cities & Sites"];
var legendText = ["Will Visit", "Visited"];
var legendCityColor = ["rgb(255,255,255)", "rgb(217,91,67)"];
var legendStateColor = ["rgb(213,222,217)", "rgb(69,173,168)"];

// Legend for Titles
d3.select(".legend").append("svg")
    .attr("width", 140)
    .attr("height", 200)
    .attr("class", "title-legend")
    .selectAll("text")
    .data(legendTitle)
    .join("text")
    .attr("fill", "rgb(80, 80, 80)")
    .attr("font-size", 12)
    .attr("transform", function(d, i) { return "translate(0," + i * 62 + ")"; })
    .attr("x", 20)
    .attr("y", 20)
    .text(function(d) {return d;});

// Legend for State Colors
d3.select(".legend").append("svg")
    .attr("width", 140)
    .attr("height", 70)
    .attr("class", "state-legend-color")
    .selectAll("rect")
    .data(legendStateColor)
    .join("rect")
    .attr("transform", function(d, i) { return "translate(0," + i * 18 + ")"; })
    .attr("x", 20)
    .attr("y", 26)
    .attr("width", 18)
    .attr("height", 12)
    .attr("fill", function(d) { return d; });

// Legend for State Text
d3.select(".legend").append("svg")
    .attr("width", 140)
    .attr("height", 70)
    .attr("class", "state-legend-text")
    .selectAll("text")
    .data(legendText)
    .join("text")
    .attr("fill", "rgb(80, 80, 80)")
    .attr("font-size", 12)
    .attr("transform", function(d, i) { return "translate(0," + i * 18 + ")"; })
    .attr("x", 45)
    .attr("y", 36)
    .text(function(d) {return d;});

// Legend for City Colors
d3.select(".legend").append("svg")
    .attr("width", 140)
    .attr("height", 70)
    .attr("class", "city-legend-color")
    .selectAll("circle")
    .data(legendCityColor)
    .join("circle")
    .attr("class", function(d,i) {
        return (i==1) ? "map-visited":"map-will-visit";
    })
    .attr("transform", function(d,i) { return "translate(0," + i * 18 + ")"; })
    .attr("cx", 29)
    .attr("cy", 40)
    .attr("r", 5)
    .attr("stroke", "rgb(217,91,67)")
    .attr("stroke-width", 2)
    .attr("fill", function(d) { return d; });

// Legend for City Text
d3.select(".legend").append("svg")
    .attr("width", 140)
    .attr("height", 70)
    .attr("class", "city-legend-text")
    .selectAll("text")
    .data(legendText)
    .join("text")
    .attr("fill", "rgb(80, 80, 80)")
    .attr("font-size", 12)
    .attr("transform", function(d, i) { return "translate(0," + i * 18 + ")"; })
    .attr("x", 45)
    .attr("y", 44)
    .text(function(d) {return d;});

d3.select(".city-legend-color")
    .selectAll("circle")
    .on("mouseover", function() {
        d3.select(this)
            .transition()
            .attr("r", 8);  
    })
    .on("mouseout", function() {    
        d3.select(this)
            .transition()
            .attr("r", 4); 
    })
    .on("click", function() {
        var pointClass = "." + this.getAttribute("class");
        currentOpacity = d3.select(".map")
                            .selectAll(pointClass)
                            .style("opacity");
        d3.select(".map")
            .selectAll(pointClass)
            .transition()
            .style("opacity", currentOpacity == 0.85 ? 0:0.85);
    });