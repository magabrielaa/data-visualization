// Treemap of Population Ethnicity

d3.csv("data/ethnicity_counts2.csv").then(data => { 

    for (let d of data) {
        d.value = +d.value;
    };

    let height = 600,
        width = 650;

    const svg = d3.select("#chart11")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    
    var root = d3.stratify()
      .id(function(d) { return d.name; })   
      .parentId(function(d) { return d.parent; })  
      (data);
    root.sum(function(d) { return +d.value })  
    
    d3.treemap()
        .size([width, height])
        .padding(3)
        (root)
    
    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "white")
        .style("fill", function(d) {
            if (d.id == "Indigenous"){
              return d3.schemePaired[2]
            } else {
              return "#ccc"
            }
          })

    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
            .attr("x", function(d){ return d.x0 + 10})    // +10 to adjust position (more right)
            .attr("y", function(d){ return d.y0 + 20})    // +20 to adjust position (lower)
            .text(function(d){ return d.data.name})
            .attr("font-size", "11px")
            .attr("fill", "black")
})  

