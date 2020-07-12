// Width and height of map
var width = 775;
var height = 500;

// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([width/2.15, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

// Define Colors and Text for Scales
var scaleText = ["States to Visit", "States Visited", "Cities to Visit", "Cities Visited"];
var scaleColor = ["rgb(213,222,217)", "rgb(69,173,168)", "rgb(250,250,250)", "rgb(217,91,67)"];

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
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + " " + height);
        
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
            .attr("class", function(d) { return d.properties.NAME.toLowerCase().replace(/\ /g,"-"); })
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function(d,i) {
                return colorScale(d.properties.hasVisited);
            });

        // Plot city paths by binding CSV data to SVG
        svg.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("class", function(d) {
                var city = " " + d.place.toLowerCase().replace(/\ /g,"-");
                return (d.hasVisited==1) ? "map-visited"+city:"map-will-visit"+city;
            })
            .attr("cx", function(d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", 4)
            .attr("fill", function(d) {
                return (d.hasVisited==1) ? "rgb(217,91,67)":"rgb(250,250,250)";
            })
            .attr("stroke", "rgb(217,91,67)")
            .attr("stroke-width", 2)
            .style("opacity", 0.85)
            .on("mouseover", function(d) {
                var height = document.querySelector(".post-title").offsetHeight;
                var left = document.querySelector(".container").offsetLeft;
                d3.select(this)
                    .transition()
                    .attr("r", 8);
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);      
                tooltip.text(d.place)
                    .style("top", d3.event.pageY - height + 10 + "px")  // d3.select(this).attr("cy")
                    .style("left", d3.event.pageX - left - 55 + "px");  // d3.select(this).attr("cx")
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
var legendText = ["Will Visit", "Visited", "Will Visit", "Visited"];
var legendCityColor = ["rgb(250,250,250)", "rgb(217,91,67)"];
var legendStateColor = ["rgb(213,222,217)", "rgb(69,173,168)"];

// Legend titles
d3.selectAll(".legend-title")
    .data(legendTitle)
    .join("text")
    .text(function(d) {return d;});

// State icons for legend
d3.select(".legend-states")
    .selectAll(".legend-icon")
    .data(legendStateColor)
    .append("svg")
    .attr("width", 18)
    .attr("height", 8)
    .append("rect")
    .join("rect")
    .attr("width", 18)
    .attr("height", 8)
    .attr("fill", function(d) { return d; });

// Text for legend
d3.selectAll(".legend-description")
    .data(legendText)
    .join("text")
    .text(function(d) { return d; });

// City icons for legend
d3.select(".legend-cities")
    .selectAll(".legend-icon")
    .data(legendCityColor)
    .append("svg")
    .attr("width", 16)
    .attr("height", 16)
    .append("circle")
    .join("circle")
    .attr("class", function(d,i) {
        return (i==1) ? "map-visited":"map-will-visit";
    })
    .attr("cx", 8)
    .attr("cy", 8)
    .attr("r", 4)
    .attr("stroke", "rgb(217,91,67)")
    .attr("stroke-width", 2)
    .attr("fill", function(d) { return d; });

// Event handlers for legend
d3.select(".legend")
    .selectAll("circle")
    .on("mouseover", function() {
        d3.select(this)
            .transition()
            .attr("r", 7);  
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


d3.csv("favorites.csv").then(function(data) {
    var states = data.filter(function(d) {return d.type == 'state'})
    var cities = data.filter(function(d) {return d.type == 'city'})
    var sites = data.filter(function(d) {return d.type == 'site'})

    states = states.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
    cities = cities.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
    sites = sites.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));

    var starGenerator = d3.symbol()
        .type(d3.symbolStar)
        .size(80);

    var pathData = starGenerator();

    var svg = d3.selectAll('.metric-state')
        .selectAll('.metric-row')
        .data(states)
        .join('div')
        .attr('class', 'metric-row')
    svg.append('div')
        .attr('class', 'metric-icon')
        .append('svg')
        .attr('width', 16)
        .attr('height', 16)
        .attr('class', 'star-icon')
        .attr('viewBox', '0 0 16 16')
        .append('path')
        .attr('d', pathData)
        .attr('transform', 'translate(8,8)')
    svg.append('div')
        .attr('class', 'metric-description')
        .text(function(d) {
            return d.place.replace(/\-/g," ").split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');
        })
    svg.on("mouseover", function(d) {
        var star = this.querySelector(".metric-icon");
        d3.select(star).select(".star-icon")
            .transition()
            .duration(400)
            .style("fill", "#fff59d")
            .attr("transform", "rotate(-73)");
        var state = this.querySelector(".metric-description").textContent.toLowerCase().replace(/\ /g,"-");
        var stateClass = "." + state;
        d3.select(stateClass)
            .transition()
            .duration(400)
            .style("fill", "#fff59d");
    })
    svg.on("mouseout", function() {  
        var star = this.querySelector(".metric-icon");  
        d3.select(star).select(".star-icon")
            .transition()
            .duration(400)
            .style("fill", "white")
            .attr("transform", "rotate(0)");
        var state = this.querySelector(".metric-description").textContent.toLowerCase().replace(/\ /g,"-");
        var stateClass = "." + state;
        d3.select(stateClass)
            .transition()
            .duration(400)
            .style("fill", function(d) {
                return colorScale(d.properties.hasVisited);
            });
    });
    
    var svg = d3.selectAll('.metric-city')
        .selectAll('.metric-row')
        .data(cities)
        .join('div')
        .attr('class', 'metric-row')
    svg.append('div')
        .attr('class', 'metric-icon')
        .append('svg')
        .attr('width', 16)
        .attr('height', 16)
        .attr('class', 'star-icon')
        .attr('viewBox', '0 0 16 16')
        .append('path')
        .attr('d', pathData)
        .attr('transform', 'translate(8,8)')
    svg.append('div')
        .attr('class', 'metric-description')
        .text(function(d) { return d.place; })
    svg.on("mouseover", function(d) {
        var star = this.querySelector(".metric-icon");
        d3.select(star).select(".star-icon")
            .transition()
            .duration(400)
            .style("fill", "yellow")
            .attr("transform", "rotate(-73)");
        var city = this.querySelector(".metric-description").textContent.toLowerCase().replace(/\ /g,"-");
        var cityClass = "." + city;
        d3.select(cityClass)
            .transition()
            .duration(400)
            .style("fill", "#fff59d");
    })
    svg.on("mouseout", function() {  
        var star = this.querySelector(".metric-icon");  
        d3.select(star).select(".star-icon")
            .transition()
            .duration(400)
            .style("fill", "white")
            .attr("transform", "rotate(0)");
        var city = this.querySelector(".metric-description").textContent.toLowerCase().replace(/\ /g,"-");
        var cityClass = "." + city;
        d3.select(cityClass)
            .transition()
            .duration(400)
            .style("fill", "rgb(217,91,67)");
    });
    
    var svg = d3.selectAll('.metric-site')
        .selectAll('.metric-row')
        .data(sites)
        .join('div')
        .attr('class', 'metric-row')
    svg.append('div')
        .attr('class', 'metric-icon')
        .append('svg')
        .attr('width', 16)
        .attr('height', 16)
        .attr('class', 'star-icon')
        .attr('viewBox', '0 0 16 16')
        .append('path')
        .attr('d', pathData)
        .attr('transform', 'translate(8,8)');
    svg.append('div')
        .attr('class', 'metric-description')
        .text(function(d) { return d.place; })
    svg.on("mouseover", function(d) {
        var star = this.querySelector(".metric-icon");
        d3.select(star).select(".star-icon")
            .transition()
            .duration(400)
            .style("fill", "yellow")
            .attr("transform", "rotate(-73)");
    })
    svg.on("mouseout", function() {  
        var star = this.querySelector(".metric-icon");  
        d3.select(star).select(".star-icon")
            .transition()
            .duration(400)
            .style("fill", "white")
            .attr("transform", "rotate(0)");
    });
});