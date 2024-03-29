/* Horizontal bar chart of fatal shootings by race */

// define global variables
const height = 600,
width = 800,
margin = ({ top: 50, right: 50, bottom: 80, left: 80 });

// create svg
let svg = d3.select("#horizontal-bar") //append to DOM
.append("svg")
.attr("viewBox", [0, 0, width, height], ); // for resizing element in browser

d3.json("shootings_data.json").then(d => { 
    // rearrange data to get counts by race
    let data = d3.nest()
    .key(function(a) { return a.Race; })
    .rollup(function(v) { return v.length; })
    .entries(d);

    // sort data by counts
    data.sort((a, b) => b.value - a.value);

    let x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([margin.left, width - margin.right]);

    let y = d3.scaleBand()
    .domain(data.map(d => d.key))
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

    svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
    .attr("class", "xaxis")
    .call(d3.axisBottom(x));

    svg.append("g")
    .attr("transform", `translate(${margin.left - 5},0)`)
    .attr("class", "yaxis")
    .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") // create bar groups
    .append("g")
    .data(data)
    .join("g")
    .attr("class", "bar");

    bar.append("rect") // add rect to bar group
    .attr("fill", "#1f77b4")
    .attr("x", margin.left)
    .attr("width", d => x(d.value))
    .attr("y", d => y(d.key))
    .attr("height", y.bandwidth());

    bar.append('text') // add value labels to bars
    .text(d => d.value) 
    .attr('x', d => margin.left + x(d.value) - 10)
    .attr('y', d => y(d.key) + (y.bandwidth()/2))
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .style('fill', 'white')
    .attr("class", "labels");

    // x-label
    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em") //shifting attributes
      .attr("dy", "-1.8em") //shifting attributes
      .text("Number of People Shot →");
  
  // y-label
  svg.append("text")
    .attr('fill', 'currentColor')
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top/2)
    .attr("dx", "-0.5em")
    .attr("y", 10)
    .attr("transform", "rotate(-90)")
    .text("↑ Race");

})