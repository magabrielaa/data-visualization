let height = 400,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });
  
const svg = d3.select("#chart") 
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('penguins.csv').then(data => {
  
  let x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.body_mass_g)).nice()
    .range([margin.left, width - margin.right]);

  let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.flipper_length_mm)).nice()
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x).tickFormat(d => (d/1000) + "kg").tickSize(-height + margin.top + margin.bottom)) //divide by 1000 to turn gram into kg

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right)) //tickSize creates the grids by drawing ticks negatively

  svg.append("g")
    .attr("fill", "black")
    .selectAll("circle") //select all circles before putting them on page
    .data(data)
    .join("circle") //join data to each circle
    .attr("cx", d => x(d.body_mass_g)) // how circles are positioned, with x scale(body mass) and data
    .attr("cy", d => y(d.flipper_length_mm)) // how circles are positioned, with y scale(flipper length) and data
    .attr("r", 2)
    .attr("opacity", 0.75);

  const tooltip = d3.select("body").append("div") //selects body from HTML and appends div
    .attr("class", "svg-tooltip") //sets CSS class for styling
    .style("position", "absolute")
    .style("visibility", "hidden");

  d3.selectAll("circle")
    .on("mouseover", function(event, d) {  //event listener in D3 is .on, when passed, it selects the data you're on
      d3.select(this).attr("fill", "red"); //adds attribute and fills it with red
      tooltip
        .style("visibility", "visible") //change to visible
        .html(`Species: ${d.species}<br />Island: ${d.island}<br />Weight: ${d.body_mass_g/1000}kg`); //string literals come from data
    })
    .on("mousemove", function(event) { // mouse move listening, it gets the event, which contains the cursor position
      tooltip
        .style("top", (event.pageY - 10) + "px") // where on page mouse is located, -10 or tooltip directly on top of circle (aka padding)
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() { //when mouse off circle, selects circle we were on, fills it back to black
      d3.select(this).attr("fill", "black");
      tooltip.style("visibility", "hidden"); // make tooltip hidden again 
    })
    
});