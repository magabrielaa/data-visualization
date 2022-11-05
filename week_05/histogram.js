// Simple Histogram

const height = 400,
    width = 600,
    margin = ({ top: 25, right: 10, bottom: 50, left: 10 }),
    padding = 1; // padding is space between bins/bars

const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.json('climate-jan.json').then((data) => {

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.average)).nice()
    .range([margin.left, width - margin.right]);
  
  const y = d3.scaleLinear()
    .range([height - margin.bottom, margin.top])
    .domain([0,10]); // manually assigning domain valus
    
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom + 5})`)
    .call(d3.axisBottom(x)); //only x axis, no yaxis

  const binGroups = svg.append("g")
    .attr("class", "bin-group");

  const bins = d3.bin() // function that bins data
    .thresholds(10)
    .value(d => d.average)(data);
  
  console.log(bins)

  let g = binGroups.selectAll("g") //selects all previously created g elements. Joins can be separated by enter, join and exit. One bin for each group
    .data(bins)
    .join("g"); // joins data to g element, joining rect and text

  g.append("rect")
    .attr("x", d => x(d.x0) + (padding / 2)) //dividing padding in half to make bins closer
    .attr("y", height-margin.bottom) // start position for y
    .attr("height", 0) // start position for height
    .attr("width", d => x(d.x1) - x(d.x0) - padding) //x0 first position of the bin
    
    .attr("fill", "steelblue")
    .transition() //creates animation
    .duration(750) //animation duration
    .attr("y", d => y(d.length))
    .attr("height", d => height - margin.bottom - y(d.length))

  g.append("text")
    .text(d => d.length)
    .attr("x", d => x(d.x0) + (x(d.x1) - x(d.x0)) / 2)
    .attr("y", d => y(d.length) - 5)
    .attr("text-anchor", "middle")
    .attr("fill", "#333");

});