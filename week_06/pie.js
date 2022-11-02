
d3.json("shootings_data.json").then(d => { 
    // Rearrange data to get counts of shootings by gender
    let data = d3.nest()
    .key(function(a) { return a.Gender; })
    .rollup(function(v) { return v.length; })
    .entries(d);
    console.log("MY DATA:,", data)

    const height = 600,
    width = 800, 
    margin = ({ top: 25, right: 30, bottom: 35, left: 50 }),
    radius = 200;

    let svg = d3.select("#chart2")
        .append("svg")
        .attr("viewBox", [0, 0, width, height], ); // for resizing element in browser

    const g = svg.append("g")
        .attr('transform', `translate(${width/2}, ${height/2})`)

    // Set color
    d3.scaleOrdinal(['orange', 'green']);

    // Create pie
    d3.pie().value();

    //Create arc
    const path = d3.arc().outerRadius(radius).innerRadius(0); 
    
    //render chart
    const pies = g.selectAll(".arc") //pases data to each arc
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'arc')

    pies.append('path') //path to be used on generates pies
        .attr('d', path)
        .attr('fill', d => d.data.value)
})