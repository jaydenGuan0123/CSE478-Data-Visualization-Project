const svg = d3.select('#svg1');
width=+svg.style('width').replace('px','');
height=+svg.style('height').replace('px','');
margin={top:50,bottom:50,right:60,left:60};
innerHeight=height-margin.top-margin.bottom;
innerWidth=width-margin.left-margin.right;
//Declar the variable
let data; 
let sectors;
//import the data
d3.csv('data/countries_regions.csv').then(regionData => {
d3.csv('data/global_development.csv').then(localdata => {
const regionMap = new Map();
regionData.forEach(entry => {
    regionMap.set(entry.name, entry['World bank region']);
});
//merge two forms
localdata = localdata.map(entry => {
    const region = regionMap.get(entry.Country);
    return {
        ...entry,
        region: region,
    };
});
data = localdata; // Assign localdata to the data variable
data.forEach(d => {
d.Year = parseInt(d.Year, 10); // Convert to integer
});
//call the function
draw();
});
});
function draw(){
//declear the data
let selectedYear = 1900; 
let selectedXAxis = "Data.Health.Death Rate"; 
let selectedSize = "Default"; 
let selectedBox="Data.Health.Death Rate"
let checkedValues = []; 

// scale initial
let yScale = d3.scaleLinear().range([200,innerWidth-200]);
let size = d3.scaleSqrt().range([3, 30]);
let color = d3.scaleOrdinal().domain([...new Set(data.map(d => d.region))]).range(d3.schemePaired);

// Update function
function updateVisualization() {
//declear the data
var selectedRegionData1=data;
var selectedRegionData=[];
//filter the data store the filtered data in selected region data
for(let i=0;i<checkedValues.length;i++){
let region1=checkedValues[i];
selectedRegionData1 = data.filter(country => country.region === region1&&country.Year === selectedYear);
selectedRegionData=[...selectedRegionData,...selectedRegionData1];
}
//for EC draw the box plot
if (selectedRegionData.length > 0){
drawBoxPlot(selectedBox,selectedRegionData,checkedValues);
}

//error message
svg.append("text")
 .attr("class", "error-message")
 .attr("x", width / 2)
 .attr("y", 20)
 .attr("text-anchor", "middle")
.attr("fill", "red")
.style("visibility", "hidden")
.attr("fill", "red") 
.text("");
//data not exist
if ((selectedYear >= 1980 && selectedYear <= 2013)&& data.length === 0) {
    svg.select(".error-message")
      .style("visibility", "visible")
      .text("The data set is empty, choose other year.");
    return;
  }
//two attribute could not be same
if (selectedSize === selectedXAxis) {
    svg.select(".error-message")
      .style("visibility", "visible")
      .text("The selected size and x-axis attributes cannot be the same.");
    return; 
  }
// hide the message if it is find.
svg.select(".error-message")
    .style("visibility", "hidden");


// indicator circle for EC
const indicatorX = innerWidth-200;
const indicatorY = 40;
const indicatorGroup = svg.append("g")
  .attr("class", "indicator-group")
  .style("visibility", "hidden");  

indicatorGroup.append("circle")
  .attr("class", "indicator-circle")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", 3);

  indicatorGroup.append('line')
  .attr('class', 'indicator-line')
  .attr('x1', indicatorX)
  .attr('y1', indicatorY)
  .attr('x2', indicatorX) 
  .attr('y2', indicatorY)
  .style('stroke', 'black')
  .style('stroke-width', 4);

indicatorGroup.append('text')
  .attr('class', 'indicator-text')
  .attr('x', indicatorX + 5)
  .attr('y', indicatorY - 15) 
  .attr('alignment-baseline', 'middle');

  indicatorGroup.append('text')
  .attr('class', 'circle-sizes-reference')
  .attr('x', indicatorX-150) 
  .attr('y', indicatorY) 
  .attr('text-anchor', 'middle') 
  .style('font-size', '20px') 
  .style('font-weight', 'bold') 
  .text('Circle Sizes Reference'); 


// Update scales domain
yScale.domain(d3.extent(selectedRegionData, d => +d[selectedXAxis]));
size.domain(d3.extent(selectedRegionData, d => +d[selectedSize])).range([3,40]);

// Map data to nodes
const nodes = selectedRegionData.map((d) => ({
data: d,
radius: size(d[selectedSize]),
x: yScale(d[selectedXAxis]),
y: innerHeight/2,
}));

// Create a simulation using nodes
const simulation = d3.forceSimulation(nodes)
.force("x", d3.forceX((d) => d.x).strength(1))
.force("y", d3.forceY(innerHeight/2).strength(1))
.force("collide", d3.forceCollide((d) => d.radius).strength(2)) 
.alpha(0.04)   //cooling seting
.alphaDecay(0.02) 
.alphaMin(0.001) 
.on("tick", tick);

// svg append nodes
const nodeGroups = svg.selectAll(".node")
.data(nodes, d => d.data.id);
//enter node
const enterNodeGroups = nodeGroups.enter()
.append("g")
.attr("class", "node");
//node append circle
enterNodeGroups.append("circle")
.attr("r", d => d.radius)
.attr("fill", d => color(d.data.region))
.attr("stroke", "black")
.attr("stroke-width", 1);
//mouse interaction
enterNodeGroups
  .on("mouseover", function(event, d) {
    indicatorGroup.style("visibility", "visible");
    indicatorGroup.select(".indicator-circle")
      .attr("cx", indicatorX)
      .attr("cy", indicatorY)
      .attr("r", d.radius);
    indicatorGroup.select('.indicator-line')
      .attr('x1', indicatorX)
      .attr('y1', indicatorY)
      .attr('x2', indicatorX + d.radius) 
      .attr('y2', indicatorY);
    indicatorGroup.select('.indicator-text')
      .attr('x', indicatorX + d.radius + 5)
      .attr('y', indicatorY - 15)
      .text(`r = ${d.radius}`);
    d3.select("#tooltip")
      .style("visibility", "visible")
      .html(`Country: ${d.data.Country}<br>${selectedXAxis}: ${d.data[selectedXAxis]}<br>${selectedSize}: ${d.data[selectedSize]}`);
  })
  .on("mousemove", function(event, d) {
    // move the tooltip with the mouse
    d3.select("#tooltip")
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px");
  })
  .on("mouseout", function() {
    // hide the indicator group and tooltip when the mouse leaves the circle
    indicatorGroup.style("visibility", "hidden");
    d3.select("#tooltip")
      .style("visibility", "hidden");
  });
  
// update selection
nodeGroups.select("circle")
.transition().duration(1000)
.attr("r", d => d.radius)
.attr("fill", d => color(d.data.region));

// exist node
nodeGroups.exit().remove();
// update the transform on tick
simulation.on("tick", () => {
nodeGroups.merge(enterNodeGroups)
    .attr("transform", d => `translate(${d.x},${d.y})`);
});

function tick() {
nodeGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);
}

// Create the x-axis component
let xAxis = d3.axisBottom(yScale); 
let xAxisG = svg.selectAll('.x-axis').data([null]);
xAxisG = xAxisG.enter().append('g')
.attr("class", "x-axis")
.merge(xAxisG)
.attr("transform", `translate(0,${innerHeight-50})`);

// x-axis transition
xAxisG.transition().duration(1000)
.call(xAxis)
.selectAll('.axis-label').remove(); 
}

// Event listeners
document.getElementById("X-axis").addEventListener("change", function () {
selectedXAxis = this.value;
updateVisualization();
});

document.getElementById("size").addEventListener("change", function () {
selectedSize = this.value;
updateVisualization();
});
document.getElementById("box").addEventListener("change", function () {
  selectedBox = this.value;
  updateVisualization();
  });

document.getElementById("tentacles").addEventListener("input", function () {
selectedYear = +this.value;
updateVisualization();
});

document.getElementById("getCheckedValuesButton").addEventListener("click", function() {
let checkboxes = document.querySelectorAll('#kk .form-check-input');
checkedValues = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
updateVisualization();
});

play=false;
const playButton = document.getElementById('play-button');
playButton.addEventListener('click', playAnimation);

let animationTimer;

function playAnimation() {
play = !play;
if (play) {
console.log(selectedYear)
playButton.textContent = "Pause";
animateThroughYears(selectedYear);
} else  {
clearTimeout(animationTimer);
playButton.textContent = "Play";
}
}
//animate the chart by years
function animateThroughYears(year) {
if (!play || year > 2013) {
play = false;
playButton.textContent = "Play";
return;
}
selectedYear = year;
document.getElementById("tentacles").value = selectedYear;
updateVisualization(); 
animationTimer = setTimeout(() => {
animateThroughYears(year + 1); 
}, 3000); 
}

// Initial visualization setup
updateVisualization();

function drawBoxPlot(selectedBox,selectedRegionData,checkedValues) {
  d3.select("#svg2").select("svg").remove();
  
  const margin1 = { top: 10, right: 30, bottom: 30, left: 40 },
  width1 = 1500 - margin1.left - margin1.right,
  height1 = 400 - margin1.top - margin1.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#svg2")
.append("svg")
.attr("width", width1 + margin1.left + margin1.right)
.attr("height", height1 + margin1.top + margin1.bottom)
.append("g")
.attr("transform", `translate(${margin1.left},${margin1.top})`);
var center=200; 

// Read the data and compute summary statistics for the box plot
let selectedRegionData2
for(let i=0;i<checkedValues.length;i++){
  let region1=checkedValues[i];
  selectedRegionData2 = selectedRegionData.filter(country => country.region === region1);

const q1 = d3.quantile(selectedRegionData2.map(d => parseFloat(d[selectedBox])).sort(d3.ascending), .25);
const median = d3.quantile(selectedRegionData2.map(d => parseFloat(d[selectedBox])).sort(d3.ascending), .5);
const q3 = d3.quantile(selectedRegionData2.map(d => parseFloat(d[selectedBox])).sort(d3.ascending), .75);
const interQuantileRange = q3 - q1;
const min = q1 - 1.5 * interQuantileRange;
const max = q3 + 1.5 * interQuantileRange;

// Show the Y scale
const y = d3.scaleLinear()
.domain([min, max])
.range([height1, 0]);
svg.append("g")
  .attr("transform", `translate(${center-100}, 0)`)
  .call(d3.axisLeft(y));

const width2 = 100;

// Show the main vertical line
svg.append("line")
   .attr("x1", center)
   .attr("x2", center)
   .attr("y1", y(min))
   .attr("y2", y(max))
   .attr("stroke", "black");
 
// Show the box
svg.append("rect")
  .attr("x", center - width2 / 2)
   .attr("y", y(q3))
   .attr("height", y(q1)-y(q3))
  .attr("width", width2)
  .attr("stroke", "black")
  .style("fill", "#69b3a2");

// show median, min and max horizontal lines
svg
.selectAll("toto")
.data([min, median, max])
.enter()
.append("line")
.attr("x1", center - width2 / 2)
.attr("x2", center + width2 / 2)
.attr("y1", d => y(d))
.attr("y2", d => y(d))
.attr("stroke", "black");
svg.append("text")
    .attr("x", center ) 
    .attr("y", height1+margin1.bottom-10) 
    .attr("text-anchor", "middle") 
    .style("font-size", "12px") 
    .text(region1);
center=center+220;
}
}
}