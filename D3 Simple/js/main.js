// Hint: This is a good place to declare your global variables
var svg;
var data,width,height,margin,innerHeight;
let female,male;
var maxMale,maxFemale,max;
// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
  // Hint: create or set your svg element inside this function
  svg = d3.select('svg');
  width=+svg.style('width').replace('px','');
  height=+svg.style('height').replace('px','');
  margin={top:50,bottom:50,right:60,left:60};
  innerHeight=height-margin.top-margin.bottom;
  innerWidth=width-margin.left-margin.right;
  // This will load your two CSV files and store them into two arrays.
  Promise.all([d3.csv('data/females_data.csv'),d3.csv('data/males_data.csv')])
       .then(function (values) {
           console.log('loaded females_data.csv and males_data.csv');
           female_data = values[0];
           male_data = values[1];
           // Hint: This is a good spot for doing data wrangling
           female_data.forEach(function(d){
            d.year=+d.year;
            d.China=+d.China;
            d.Japan=+d.Japan;
            d.France=+d.France;
            d.UnitedStates=+d.UnitedStates;
            d.UnitedKindom=+d.UnitedKindom;
           })
           
           male_data.forEach(function(c){
            c.year=+c.year;
            c.China=+c.China;
            c.Japan=+c.Japan;
            c.France=+c.France;
            c.UnitedStates=+c.UnitedStates;
            c.UnitedKindom=+c.UnitedKindom;
           })
           female=female_data;
           
           male=male_data;
           drawLolliPopChart();
       
});
});

// Use this function to draw the lollipop chart.
function drawLolliPopChart() {
  
  const yAttrib =d3.select('#countries').property('value');
   console.log(yAttrib);
   const xScale=d3.scaleTime()
                  .domain([new Date('1990'),new Date('2023')]).range([0,innerWidth]);
                  //d3.extent(female,function(d){return d.Year})
  maxFemale=d3.max(female,d=>d[yAttrib]);
  maxMale=d3.max(male,d=>d[yAttrib]);
  max=Math.max(maxFemale,maxMale);
  const yScale=d3.scaleLinear()
  .domain([0,max]).range([innerHeight,0]);

  svg.select('g').remove();
  const g=svg.append('g').attr('transform','translate('+margin.left+','+margin.top+')');
   g.selectAll('circle')
      .data(female)
      .enter()
      .append('circle')
      .attr("cx", d=>xScale(new Date(d.Year))-5)
      .attr("cy", d=>yScale(d[yAttrib]))
      .attr("r", 5)
      .attr("fill", "steelblue")
      .transition()
      .duration(1000);
    g.selectAll(".bar")
      .data(female)
      .enter()
      .append("line")
      .attr("x1", d=>xScale(new Date(d.Year))-5)
      .attr("x2", d=>xScale(new Date(d.Year))-5)
      .attr("y1", innerHeight)
      .attr("y2", d=>yScale(d[yAttrib]))
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);
      g.selectAll('circle2')
      .data(male)
      .enter()
      .append('circle')
      .attr("cx", d=>xScale(new Date(d.Year))+5)
      .attr("cy", d=>yScale(d[yAttrib]))
      .attr("r", 5)
      .attr("fill", "Red");
    g.selectAll(".bar")
      .data(male)
      .enter()
      .append("line")
      .attr("x1", d=>xScale(new Date(d.Year))+5)
      .attr("x2", d=>xScale(new Date(d.Year))+5)
      .attr("y1", innerHeight)
      .attr("y2", d=>yScale(d[yAttrib]))
      .attr("stroke", "Red")
      .attr("stroke-width", 2);
     yAxis=d3.axisLeft(yScale);
    xAxis=d3.axisBottom(xScale).ticks(8);
  g.append('g').call(yAxis);
  g.append('g').call(xAxis).attr("transform", `translate(0,${innerHeight})`);
  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight/ 2)
    .attr("y", '-40px')
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Employee Rate");

   g.append("text")
    .attr("x", innerWidth/2)
    .attr("y", innerHeight+40)
    .style("font-weight", "bold")
    .text("Year");


    g.append("text")
    .attr("x", width-245) // Adjust the position
    .attr("y", 0)
    .text("Female Employment Rate")
  
  g.append("rect")
    .attr("x", width-265) // Adjust the position
    .attr("y", -10) // Adjust the position
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "steelblue"); // Use the color you used for the Female data
  
  // Legend item for Male data
  g.append("text")
    .attr("x", width-245)  // Adjust the position
    .attr("y", 20) // Adjust the position
    .text("Male Employment Rate");
  
   g.append("rect")
    .attr("x", width-265) // Adjust the position
    .attr("y", 10) // Adjust the position
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "red"); // Use the color you used for the Male data
  console.log('trace:drawLollipopChart()');
}
