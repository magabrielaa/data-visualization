// January 2022 Library Visits


d3.csv("library_visits_jan22.csv").then(data => {   // promise to load data, then run function
    for (let d of data) {
        d.num = +d.num; // convert num from string to integer
    }
    
    const height = 500,
        width = 800,
        margin = ({top: 25, right: 30, bottom:35, left:50});
    
    // select chart container from HTML document and append svg
    let svg = d3.select("#chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // resize svg dynamically by width and height 
    
    // Define x and y scales
    let x = d3.scaleBand() //scaleBand splits range into n bands (where n is the number of branches)
        .domain(data.map(d => d.branch)) // map branches into an array
        .range([margin.left, width - margin.right]) // drawing space
        .padding(0.2); //set padding between bars
    
    let y = d3.scaleLinear() //scaleLinear because num is a continuous variable
        .domain([0, d3.max(data, (d) => d.num)]).nice() //range from 0 to max num, nice rounds the top value
        .range([height - margin.bottom, margin.top]); 
    
    // Set axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move x axis from top to bottom
        .call(d3.axisBottom(x)); // call xaxis function

    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y)); // call yaxis function
    
    // Draw and style bars
    let bar = svg.selectAll(".bar") //select all elements of class bar we have not yet created
        .append("g")
        .data(data) 
        .join("g") // join data to group element g
        .attr("class", "bar");
    
    bar.append("rect")
        .attr("fill", "orange")
        .attr("x", d => x(d.branch)) // x position, where x is library branches
        .attr("width", x.bandwidth()) // bandwith particular to x scale we are using
        .attr("y", d => y(d.num)) // y position, where y is num of visits
        .attr("height", d => y(0) - y(d.num)); // bar height determined by element attribute
    
    bar.append('text') // add labels on each bar
        .text(d => d.num)
        .attr('x', d => x(d.branch) + (x.bandwidth()/2))
        .attr('y', d => y(d.num) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'black') // black font
        .style("font-size", "12px"); // font size

});
        