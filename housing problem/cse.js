function choose(selectNum) {
    svg = d3.select('svg');
    width=+svg.style('width').replace('px','');
    height=+svg.style('height').replace('px','');
d3.csv('density.csv').then(function(localData4){
    densitydata=localData4
  d3.csv('Incomebygender.csv').then(function(localData3) {
      racedata=localData3;
    d3.json('usa.json').then(geojsonData => {
        geodata=geojsonData;
        d3.csv('income.csv').then(localData => {
            incomedata=localData;
            d3.csv('costOfhousing.csv').then(localData1 =>{
            housingdata=localData1;
            if(selectNum=="1")
            draw1();
            if(selectNum=="2")
            draw2();
            if(selectNum=="3")
            draw3();
            if(selectNum=="4")
            draw4();
            if(selectNum=="5")
            draw6();
            })
        })
    })
})
});
         }
    function draw6() {
    svg.select('g').remove();
    var g = svg.append('g').attr('width', width * 0.7).attr('height', height * 0.7);
    height=height*0.85;
    width=width*0.85;
    const stripeHeight = height / 13;
    const blueAreaWidth = width * 0.4;
    const starSpacing = 70;
    const starRadius = 45;
    const dropdown2 = g.append('foreignObject')
        .attr('x', 50)
        .attr('y', 5) // Adjust position as needed
        .attr('width', 250)
        .attr('height', 90)
        .append('xhtml:div');

    dropdown2.append('text')
        .text('Select State')
        .style('font-weight', 'bold')
        .style('margin-right', '5px');
    const titleText = g.append('text')
        .attr('x', 400)
        .attr('y', 70)
        .style('font-size', '40px')
        .style('font-weight', 'bold')
        .text('More star=Higher pressure of affording the houses');
    const select2 = dropdown2.append('select')
        .attr('id', 'typeSelect')
        .on('change', function () {
            selectedstate=this.value;
      
    // Draw stripes
    for (let i = 0; i < 13; i++) {
        const stripe = g.append('rect')
            .attr('x', 100)
            .attr('y', i * stripeHeight+100)
            .attr('width', width)
            .attr('height', stripeHeight)
            .attr('fill', i % 2 === 0 ? 'red' : 'white');
    }

    // Draw blue rectangle
    const blueRect = g.append('rect')
        .attr('x', 100)
        .attr('y', 100)
        .attr('width', blueAreaWidth)
        .attr('height', 7 * stripeHeight)
        .attr('fill', 'blue');

    // Draw stars
    const starGroup = g.append('g');
    const starRadiusOuter = starRadius * 2;
    const yScale = d3.scaleLinear()
            .domain([d3.min(incomedata, d => d.need), d3.max(incomedata, d => d.need)]) // Adjusted to dynamically set the maximum value
            .range([0,45]);
    const stateData = incomedata.find(data => data.State === selectedstate);
    index = yScale(stateData.need);
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 9; col++) {
            const starIndex = row * 10 + col;
            if (starIndex >= index) break;

            const star = starGroup.append('image')
                .attr('xlink:href', '1.jpg') // Replace '1.jpg' with your image file path
                .attr('x', 120+col * starSpacing)
                .attr('y', 120+row * starSpacing)
                .attr('width', starRadius)
                .attr('height', starRadius);
        }
    }
});
const states = Array.from(new Set(incomedata.map(d => d.State))); // Extract unique state names
 console.log(states);
select2.selectAll('option')
    .data(states)
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => d);
}
    
    // Now create bar charts for each year
    function draw4() {
    const margin = { top: 60, right: 100, bottom: 100, left: 60 };
    svg.select('g').remove();
    const g=svg.append('g').attr('transform','translate('+margin.left+','+margin.top+')');
    const imgWidth = 1600; // Adjust the width of the image as needed
    const imgHeight = 1000; // Adjust the height of the image as needed
    g.append('image')
        .attr('href', '2.jpg')
        .attr('width', imgWidth)
        .attr('height', imgHeight)
        .attr('x',0)
        .attr('y', 0);

    const dropdown2 = g.append('foreignObject')
        .attr('x', 50)
        .attr('y', 5) // Adjust position as needed
        .attr('width', 200)
        .attr('height', 100)
        .append('xhtml:div');

    dropdown2.append('text')
        .text('Select Type')
        .style('font-weight', 'bold')
        .style('margin-right', '5px');
        const titleText = g.append('text')
        .attr('x', 300)
        .attr('y', 30)
        .style('font-size', '90px')
        .style('font-weight', 'bold')
        .text('Income Percentage of ');

       const yearText = titleText.append('tspan')
        .attr('fill', 'blue') // Change the color as desired
        .text('');

    const select2 = dropdown2.append('select')
        .attr('id', 'typeSelect')
        .on('change', function () {
    selectedType=this.value;
    const years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'];
    let currentYearIndex = 0;
        function updateTitle(year) {
        yearText.text(year);
    }

    function animate() {
        const year = years[currentYearIndex];
        
        updateTitle(year);
    
       
        const yearData = racedata.find(entry => entry.Year === year);
        const female = yearData.Female;
        const male = yearData.Male;
        const white = yearData.white;
        const black = yearData.black;
        const asian = yearData.asian;
        const hispanic = yearData.hispanic;

        const genderset = [
            { category: 'Male', value: parseInt(male.replace(/,/g, ''), 10) },
            { category: 'Female', value: parseInt(female.replace(/,/g, ''), 10) }
        ];

        const raceset = [
            { category: 'white', value: parseInt(white.replace(/,/g, ''), 10) },
            { category: 'black', value: parseInt(black.replace(/,/g, ''), 10) },
            { category: 'asian', value: parseInt(asian.replace(/,/g, ''), 10) },
            { category: 'hispanic', value: parseInt(hispanic.replace(/,/g, ''), 10) }
        ];
        if(selectedType=="gender"){
        pie1(genderset);}
        else{
        pie2(raceset);}

        currentYearIndex++;
        if (currentYearIndex === years.length) {
            currentYearIndex = 0;
        }
    }

    animate(); // Initial call

    setInterval(animate, 2000); // Change year every 2 seconds
    });
        select2.selectAll('option')
        .data(['race','gender']) // Replace with your options
        .enter().append('option')
        .attr('value', d => d)
        .text(d => d);

      

        function pie1(dataset) {
        const radius = 193;

        const color = d3.scaleOrdinal().range(['#4CAF50', '#FFC107']); // Colors for Male and Female

        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        const pie = d3.pie().value(d => d.value);

        const arcs = pie(dataset);

        const arcGroup = g.append('g')
            .attr('transform', `translate(${width / 2 - 180},${height / 2+92})`);

        const path = arcGroup.selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(i))
            .append('title')
            .text(d => `${d.data.category}: ${d.data.value}`);

        const text = arcGroup.selectAll('text')
            .data(arcs)
            .enter()
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '.35em')
            .text(d => `${d.data.category}`)
            .style('text-anchor', 'middle')
            .style('fill', 'white'); // Text color
    }
    function pie2(dataset) {
        const radius = 193;

        const color = d3.scaleOrdinal().range(d3.schemeCategory10); // Color scheme for race categories

        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        const pie = d3.pie().value(d => d.value);

        const arcs = pie(dataset);

        const arcGroup = g.append('g')
        .attr('transform', `translate(${width / 2 - 180},${height / 2+92})`);

        const path = arcGroup.selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(i))
            .append('title')
            .text(d => `${d.data.category}: ${d.data.value}`);

        const text = arcGroup.selectAll('text')
            .data(arcs)
            .enter()
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '.35em')
            .text(d => `${d.data.category}`)
            .style('text-anchor', 'middle')
            .style('fill', 'white'); // Text color
    }

    }

    function draw1(){
    const margin = { top: 10, right: 100, bottom: 100, left: 10 };
    svg.select('g').remove();
    const g=svg.append('g').attr('transform','translate('+margin.left+','+margin.top+')');
        const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px");

        selectedYear = 2017;
    const data1 = incomedata.map(d => ({
        State: d.State,
        Income2015: +d[2017].replace(/,/g, '')
    }));
    const data2 = housingdata.map(d => ({
        State: d.RegionName,
        House2015: +d[2023].replace(/,/g, '')
    }));
    const incomeExtent = d3.extent(data1, d => d.Income2015);
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
                         .domain(incomeExtent);
    // Create the projection and path generator
    const projection = d3.geoAlbersUsa().fitSize([width, height], geodata);
    const path = d3.geoPath().projection(projection);

    // Match income data to states
    const incomeMap = new Map(data1.map(d => [d.State, +d.Income2015]));
    const houseMap= new Map(data2.map(d => [d.State, +d.House2015]));

    // Draw paths for each state
    g.selectAll('path')
       .data(geodata.features)
       .enter().append('path')
       .attr('d', path)
       .attr('fill', "lightblue")
       .attr('stroke', 'white')
       .on("mouseover", function(event, d) {
       tooltip.transition()
          .duration(200)
          .style("opacity", .9);
       tooltip.html("State: " + d.properties.NAME + "<br/>Income: $" + incomeMap.get(d.properties.NAME)+"<br/>Median housing price: $"+houseMap.get(d.properties.NAME))
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 30 + "px");
   })
   // Mouseout event
   .on("mouseout", function(d) {
       tooltip.transition()
          .duration(100)
          .style("opacity", 0);})
    .on('click', function (event, d) {
        const stateName = d.properties.NAME;
        tooltip.style("opacity", 0);
        draw5(stateName);
    });
   g.selectAll('text')
    .data(geodata.features)
    .enter().append('text')
    .attr('x', d => path.centroid(d)[0])
    .attr('y', d => path.centroid(d)[1])
    .text(d => d.properties.NAME)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('fill', 'black')
    .attr('font-size', '10px');
   g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -20 + 20)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('move your mouse to explore and click for populationdensity');
}


// Your existing code
function draw2() {
    const margin = { top: 50, right: 20, bottom: 30, left: 40 };
    svg.select('g').remove();
    const g = svg.append('g').attr('transform', `translate(0, ${margin.top})`);
    const titleText = g.append('text')
        .attr('x', 500)
        .attr('y', 30)
        .style('font-size', '60px')
        .style('font-weight', 'bold')
        .text('Income difference across US');

    const dropdown = g.append('foreignObject')
        .attr('x', 45)
        .attr('y', 15)
        .attr('width', 200)
        .attr('height', 100)
        .append('xhtml:div');

    dropdown.append('text')
        .text('Select Year')
        .style('font-weight', 'bold')
        .style('margin-right', '5px');

    const select = dropdown.append('select')
        .attr('id', 'yearSelect')
        .on('change', function () {
            const selectedYear = this.value;
            const selectedData = incomedata.map(d => ({
                State: d.State,
                Income: +d[selectedYear].replace(/,/g, '')
            }));
            bar(selectedData);
        });

    select.selectAll('option')
        .data(['2015', '2016', '2017', '2018', '2019', '2020'])
        .enter().append('option')
        .attr('value', d => d)
        .text(d => d);

    function bar(data) {
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.State))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Income)]) // Adjusted to dynamically set the maximum value
            .range([height - margin.bottom - margin.top, 100]);

        const bars = g.selectAll('.bar')
            .data(data);

        bars.exit().remove();

        bars.attr('x', d => xScale(d.State))
            .attr('y', d => yScale(d.Income))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - margin.bottom - margin.top - yScale(d.Income));

        bars.enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.State))
            .attr('y', d => yScale(d.Income))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - margin.bottom - margin.top - yScale(d.Income))
            .attr('fill', 'lightblue');
        bars.enter().append('text')
            .attr('x', d => -700)
            .attr('y', d => 10+xScale(d.State) + xScale.bandwidth() / 2) // Adjust the vertical positioning inside the bars
            .attr('text-anchor', 'middle')
            .text(d => d.State)
            .attr('transform', 'rotate(-90)');

        g.select('.x-axis').remove();
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height - margin.bottom - margin.top})`)
            .call(d3.axisBottom(xScale));

        g.select('.y-axis').remove();

        g.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));
    }
}


function draw3() {
    svg.select('g').remove();
    const margin = { top: 50, right: 20, bottom: 30, left: 40 };
    const g = svg.append('g').attr('transform', `translate(0, ${margin.top})`);
    const titleText = g.append('text')
        .attr('x', 500)
        .attr('y', 30)
        .style('font-size', '60px')
        .style('font-weight', 'bold')
        .text('Housing Price heatmap');

    const dropdown = g.append('foreignObject')
        .attr('x', 45)
        .attr('y', 15)
        .attr('width', 200)
        .attr('height', 100)
        .append('xhtml:div');

    dropdown.append('text')
        .text('Select Year')
        .style('font-weight', 'bold')
        .style('margin-right', '5px');

    const select = dropdown.append('select')
        .attr('id', 'yearSelect')
        .on('change', function () {
            const selectedYear = this.value;
            const data1 = housingdata.map(d => ({
                State: d.RegionName,
                House2015: +d[selectedYear].replace(/,/g, '')
            }));
            heatmap(data1, selectedYear);
        });

    select.selectAll('option')
        .data(['2018', '2019', '2020', '2021', '2022', '2023'])
        .enter().append('option')
        .attr('value', d => d)
        .text(d => d);

    heatmap(housingdata.map(d => ({
        State: d.RegionName,
        House2015: +d['2018'].replace(/,/g, '') // Default to 2018 on initial load
    })), '2018'); // Initial load for 2018 data

    function heatmap(data1, selectedYear) {
        g.selectAll('path').remove(); // Clear existing paths

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        const incomeExtent = d3.extent(data1, d => d.House2015);
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
                             .domain(incomeExtent);
                            
        const projection = d3.geoAlbersUsa().fitSize([width, height], geodata);
        const path = d3.geoPath().projection(projection);

        const houseMap = new Map(data1.map(d => [d.State, +d.House2015]));

        g.selectAll('path')
           .data(geodata.features)
           .enter().append('path')
           .attr('d', path)
           .attr('fill', d => colorScale(houseMap.get(d.properties.NAME)))
           .attr('stroke', 'white')
           .on("mouseover", function(event, d) {
               tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
               tooltip.html("State: " + d.properties.NAME + "<br/>Median House Price: " + houseMap.get(d.properties.NAME))
                   .style("left", (event.pageX) + "px")
                   .style("top", (event.pageY - 28) + "px");
           })
           .on("mouseout", function(d) {
               tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
           });
    }
}




function draw5(selectedState) {
    const margin = { top: 100, right: 100, bottom: 100, left: 100 };
    svg.select('g').remove();
    const g=svg.append('g');
    function getStateData(stateName) {
        return densitydata.find(state => state.Name === stateName);
    }

    // Get data for the selected state
    var statedata = getStateData(selectedState);
    delete statedata.Name; // Remove 'Name' property
    svgWidth=width;
    svgHeight=height;
    // Assuming you have an SVG element with width and height attributes
     width = svgWidth - margin.left - margin.right;
     height = svgHeight - margin.top - margin.bottom;

    // Define the inner dimensions of the chart
    const innerWidth = width;
    const innerHeight = height;

    // Get the maximum value from the state data
    const max = Math.max(...Object.values(statedata));

    const xScale = d3.scaleLinear()
        .domain([1960, 2020])
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([innerHeight, 0]);

    const line = d3.line()
        .x((d, i) => xScale(1960 + i * 10))
        .y(d => yScale(d));

    // Append a group for the chart within the SVG
    const chart = g.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Append the line path
    chart.append('path')
        .datum(Object.values(statedata))
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('d', line);

    // Append x-axis
    chart.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));

    // Append y-axis
    chart.append('g')
        .call(d3.axisLeft(yScale));

    // X-axis label
    chart.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + margin.bottom - 10)
        .style('text-anchor', 'middle')
        .text('Year');
     chart.selectAll('.datatext')
        .data(Object.values(statedata))
        .enter().append('text')
        .attr('class', 'datatext')
        .attr('x', (d, i) => xScale(1960 + i * 10))
        .attr('y', d => yScale(d) - 8)
        .attr('text-anchor', 'middle')
        .text(d => d);

    // Y-axis label
    chart.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -margin.left + 20)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('density value');
    g.append('text')
        .attr('x', svgWidth / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('font-size', '1.5em')
        .text(`Population density for ${selectedState}`);
    
}