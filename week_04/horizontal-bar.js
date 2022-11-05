/* Horizontal bar chart for COVID country cases */

d3.csv("covid.csv").then(data => {
    console.log(data)

    for (let d of data) {
        d.cases = +d.cases; //force a number
    };

    // data.sort((a, b) => b.cases - a.cases); //a and b means nothing, just to sort. b first because largest bar on top. 

    data.sort((a,b) => d3.ascending(a.country, b.country)); // sort by country name

    const height = 600,
          width = 800, //if width is in blue, it's a VARIABLE
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#horizontal-chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser

    let x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cases)]).nice()
        .range([margin.left, width - margin.right]);
    
    let y = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") // add rect to bar group
        .attr("fill", "steelblue")
        .attr("x", margin.left)
        .attr("width", d => x(d.cases)) //if width is in quotes, it's an ATTRIBUTE
        .attr("y", d => y(d.country))
        .attr("height", y.bandwidth());
    
    bar.append('text') // add labels
        .text(d => d.cases) // "d.something" means we are looping through rows of data
        .attr('x', d => margin.left + x(d.cases) - 10)
        .attr('y', d => y(d.country) + (y.bandwidth()/2))
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('fill', 'white');

});