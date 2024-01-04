d3.csv('cleaned_5250.csv').then(data1 =>{
    data=data1;
    update();
})
function update(){
    var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = 200, 
    center = { x: width / 2, y: height / 2 }; 
    svg.append("image")
       .attr("xlink:href", "nasa.png") 
       .attr("x", center.x - 437.5) 
       .attr("y", center.y - 437.5) 
        .attr("height", 875) 
        .attr("width", 875)
        .attr("preserveAspectRatio", "none") 
        .style("opacity", 0.2); 
        function hexagonPoints(radius) {
            var points = [];
            for (var i = 0; i < 6; i++) {
                var angle = (Math.PI / 3) * i, 
                    x = center.x + radius * Math.cos(angle),
                    y = center.y + radius * Math.sin(angle);
                points.push([x, y]);
            }
            return points;
        }
        for(var i=0;i<3;i++){
        var points = hexagonPoints(radius);
        var hexagon = svg.append("polygon")
                         .attr("points", points.join(" "))
                         .style("fill", "none")
                         .style("stroke", "black")
                         .style("stroke-width", 2);
         radius=radius+100;
        }
        var attributes = ['distance', 'stellar_magnitude', 'discovery_year', 'eccentricity', 'radius_multiplier', 'orbital_period'];
        var radius = 400; 
        var labelRadius = radius + 20; 
        function angle(i, total) {
         return (i / total) * 2 * Math.PI;
         }
    var maxValues = {
    distance: d3.max(data, d => d.distance),
    stellar_magnitude: d3.max(data, d => d.stellar_magnitude),
    discovery_year: d3.max(data, d => d.discovery_year),
    eccentricity: d3.max(data, d => d.eccentricity),
    radius_multiplier: d3.max(data, d => d.radius_multiplier),
    orbital_period: d3.max(data, d => d.orbital_period)
    };
    var minValues = {
        distance: d3.min(data, d => d.distance),
        stellar_magnitude: d3.min(data, d => d.stellar_magnitude),
        discovery_year: d3.min(data, d => d.discovery_year),
        eccentricity: d3.min(data, d => d.eccentricity),
        radius_multiplier: d3.min(data, d => d.radius_multiplier),
        orbital_period: d3.min(data, d => d.orbital_period)
        };
    var scales = {
    distance: d3.scaleLinear().domain([minValues.distance, maxValues.distance]).range([0, radius]),
    stellar_magnitude: d3.scaleLinear().domain([minValues.stellar_magnitude, maxValues.stellar_magnitude]).range([0, radius]),
    discovery_year: d3.scaleLinear().domain([minValues.discovery_year, maxValues.discovery_year]).range([0, radius]),
    eccentricity: d3.scaleLinear().domain([minValues.eccentricity, maxValues.eccentricity]).range([0, radius]),
    radius_multiplier: d3.scaleLinear().domain([minValues.radius_multiplier, maxValues.radius_multiplier]).range([0, radius]),
    orbital_period: d3.scaleLinear().domain([minValues.orbital_period, maxValues.orbital_period]).range([0, radius])
    };

      var planetTypeColors = d3.scaleOrdinal()
        .domain(["Gas Giant", "Rocky Planet", "Ice Giant", "Dwarf Planet", "Other"])
        .range(["red", "green", "blue", "orange", "gray"]); 
    var legendData = planetTypeColors.domain();
    var legendX = 0; 
    var legendY = 30;  
    var spacing = 30;  
    legendData.forEach(function(type, index) {
        svg.append("circle")
            .attr("cx", legendX)
            .attr("cy", legendY + index * spacing)
            .attr("r", 10)
            .style("fill", planetTypeColors(type));
        svg.append("text")
            .attr("x", legendX + 15)
            .attr("y", legendY + index * spacing)
            .text(type)
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle");});
            function addTicksForScale(scale, attributeIndex, ticksCount) {
                var tickValues = scale.ticks(ticksCount);
                var angle = Math.PI / 3 * attributeIndex; 
                tickValues.forEach(function(tickValue) {
                var radius = scale(tickValue);
                var x1 = center.x + radius * Math.cos(angle);
                var y1 = center.y + radius * Math.sin(angle);
                var x2 = center.x + (radius + 10) * Math.cos(angle);
                var y2 = center.y + (radius + 10) * Math.sin(angle);
                svg.append("line")
                   .attr("x1", x1)
                   .attr("y1", y1)
                   .attr("x2", x2)
                   .attr("y2", y2)
                   .style("stroke", "black")
                   .style("stroke-width", 1);
                svg.append("text")
                   .attr("x", x2)
                   .attr("y", y2)
                   .attr("dy", ".35em")
                   .style("text-anchor", "middle")
                   .text(tickValue);
                });
                }
                for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];
                if (scales[attribute]) {
                addTicksForScale(scales[attribute], i, 5); 
                }
                }
    attributes.forEach(function(attribute, i) {
    var a = angle(i, attributes.length);
    var x = center.x + labelRadius * Math.cos(a);
    var y = center.y + labelRadius * Math.sin(a);
    var textAnchor = (a > Math.PI / 2 && a < 3 * Math.PI / 2) ? 'end' : 'start';
    x += (a > Math.PI / 2 && a < 3 * Math.PI / 2) ? -5 : 5; 
    svg.append('text')
     .attr('x', x)
     .attr('y', y)
     .attr('dy', '.35em') 
     .style('text-anchor', textAnchor)
     .style('font-size',20)
     .text(attribute);
    });
    
        points.forEach(function(point) {
            svg.append("line")
               .attr("x1", center.x)
               .attr("y1", center.y)
               .attr("x2", point[0])
               .attr("y2", point[1])
               .style("stroke", "black")
               .style("stroke-width", 1)
               .style("stroke-dasharray", "4");
    });
    svg.append("image")
    .attr("class", "image1")
    .attr("xlink:href", "1.jpg") 
    .attr("x", center.x - 50) 
    .attr("y", center.y - 50) 
    .attr("height", 100) 
    .attr("width", 100);

        document.getElementById('submitPlane').addEventListener('click', function() {
        var selectedPlanet = document.getElementById('planeInput').value;
        var selectedAttribute = document.getElementById('planeSelect').value;
        var match = data.find(function(entry) {
            return entry.name.toLowerCase() === selectedPlanet.toLowerCase();
        });
        var svg = d3.select("svg");
        svg.append("text")
        .attr("class", "error-message")
        .attr("x", 600)
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .attr("fill", "red")
        .style("visibility", "hidden")
        .attr("fill", "red") 
        .text("");
        if (!match) {
            svg.select(".error-message")
            .style("visibility", "visible")
            .text("No brand found");
             return;
        }
        else{
            svg.select(".error-message")
               .style("visibility", "hidden");
            draw(selectedPlanet,selectedAttribute);
            var data3 = data.filter(function(row) {
                return row.name === selectedPlanet;});
                selectType=data3[0]["planet_type"];
                
        }
    });

function draw(selectedPlanet,selectedAttribute){
    svg.select(".image1")
    .attr("x", center.x - 50) 
    .attr("y", center.y - 50);
var data2 = data.filter(function(row) {
    return row.name === selectedPlanet;});
    selectValues=data2[0][selectedAttribute];
    selectType=data2[0]["planet_type"];
var planetColor=planetTypeColors(selectType);
var planetCircle = svg.selectAll(".planet-circle").data([planetColor]);
    planetCircle.enter()
        .append("circle")
        .attr("class", "planet-circle")
        .merge(planetCircle)
        .attr("cx", 100)
        .attr("cy", 30)
        .attr("r", 10)
        .style("fill", d => d);
var textData = [
        "Planet: " + selectedPlanet,
        selectedAttribute + ": " + selectValues,
        "Planet Type: " + selectType
    ];
var textElements = svg.selectAll(".planet-text").data(textData);
    textElements.enter()
        .append("text")
        .attr("class", "planet-text")
        .merge(textElements)
        .attr("x", 130)
        .attr("y", (d, i) => 30 + i * 20) 
        .text(d => d)
        .style("font-size", "15px")
        .attr("alignment-baseline", "middle")
        .style("fill", (d, i) => i === 2 ? planetColor : null); 
 svg.select(".image1")
    .each(rotateImage); 
function rotateImage() {
index=attributes.indexOf(selectedAttribute);
angle = Math.PI / 3 * index+ Math.PI/2; 
var angleInDegrees = angle * (180 / Math.PI);
scaleValue = scales[selectedAttribute](selectValues);
svg.select(".image1")
.transition()
.duration(2000) 
.attrTween("transform", function() {
    var startRotation = "rotate(0," + center.x + "," + center.y + ")";
    var endRotation = "rotate(" + angleInDegrees + "," + center.x + "," + center.y + ")";
    return d3.interpolateString(startRotation, endRotation);
})
.on("end", function() {
    d3.select(this)
      .transition()
      .duration(2000) 
      .attr("x", 550)
      .attr("y", 550-scaleValue);
})
}
}
}

