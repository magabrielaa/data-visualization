/* D3 line chart */
/* Long term interest rates in Canada */

// Define constants non-dependent on data to gain a D3 performance boost
const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]); //ViewBox allows chart to grow dynamicaly

const tooltip = d3.select('#line-chart')
    .append('div')
    .attr('class', 'tooltip');

d3.csv('long-term-interest-canada.csv').then(data => { // promise to load data first, then run function
    
    let timeParse = d3.timeParse("%Y-%m") //parse string date format, parameter is current date format: YYYY-MM

    for (let d of data) {
        d.Value = +d.Num; //convert interest rate from string to number
        d.Month = timeParse(d.Month); // parse time variable
    }
    
    // Set up scales
    let xScale = d3.scaleTime() // scaleTime because month is a time variable
        .domain(d3.extent(data, d => d.Month)) // set domain from min to max month
        .range([margin.left, width - margin.right]); // xaxis drawing space
        
    let yScale = d3.scaleLinear() // linear because interest rate is a continuous variable
        .domain([0, d3.max(data, d => d.Num)]) // y scales always start at 0
        .range([height - margin.bottom, margin.top]); // yaxis drawing space

    // Define xAxis
    svg.append("g") //append group element to the svg
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickSizeOuter(0).tickSize(-width).tickPadding([5])); //tickSizeOuter(0) gets rid of over-extending axis, tickSize sets gridlines
    
    // Define yAxis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).tickSizeOuter(0).tickSize(-width).tickFormat(d => d + "%")); //tickSizeOuter(0) gets rid of over-extending axis, tickSize sets gridlines

    // Set x-axis label
    svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("x", 400) //move position of label left/right
        .attr("y", height)
        .attr("dx", "0.5em") //shifting attributes
        .attr("dy", "-0.5em") //shifting attributes
        .text("Month");
        
    // Set y-axis label
    svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("x", -160) //move position of label up/down
        .attr("dx", "-0.5em")
        .attr("y", 10)
        .attr("transform", "rotate(-90)") // rotates label vertically
        .text("Interest rate");
    
    // Draw line
    let line = d3.line()
        .x(d => xScale(d.Month))
        .y(d => yScale(d.Num))
        .curve(d3.curveNatural); // curves the line to make it more smooth
    
    // Append path to SVG
    svg.append("path")
        .datum(data)
        .attr("d", line) // "d" returns a filled line
        .attr("fill", "none") // gets rid of filled-in color
        .attr("stroke", "steelblue"); // format line color

    // Add data points/circles
    svg.selectAll("line-circle")
    	.data(data)
    	.enter().append("circle")
        .attr("id", "circles")
        .attr("r", 3)
        .attr("cx", function(d) { return xScale(d.Month); })
        .attr("cy", function(d) { return yScale(d.Num); });

  });