/* D3 Line Chart */

// height, width, svg defined before loading data because they're not dependent on data -> performance boost
// svg gets put on the page, while the data is loading
const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('long-term-interest-monthly.csv').then(data => {
    
    let timeParse = d3.timeParse("%Y-%m") //parse string date format, parameter is current format

    for (let d of data) {
        d.Value = +d.Value; //convert to number, in console if blue = it's a number
        d.Date = timeParse(d.Date);
    }

    // console.log(data);

    // Create scales
    let x = d3.scaleTime()
        .domain(d3.extent(data, d => d.Date)) //domain from min to max in dates (from the data)
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value)]) // y scales always start at 0
        .range([height - margin.bottom, margin.top]);
    
    svg.append("g") //appending group element to the svg
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "yaxis") // specifies class as "yaxis" for css on HTML
      .call(d3.axisLeft(y).tickSizeOuter(0).tickFormat(d => d + "%").tickSize(-width));// tickSizeOuter gets rid of outer tick on y axis, adds % to interest rates,tickSize(-width) creates grid lines

    svg.append("g") //appending group element to the svg
      .attr("transform", `translate(0,${height - margin.bottom})`) //needed so x axis is at the bottom
      .call(d3.axisBottom(x).tickSizeOuter(0)); //tickSizeOuter gets rid of outer tick on x axis

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em") //shifting attributes
      .attr("dy", "-0.5em") //shifting attributes
      .text("Year");
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Interest rate");
    
    // Draw lines
    let line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.Value))
        // .curve(d3.curveNatural); // curve the line
        // .curve(d3.curveBasis); 
    
    svg.append("path")
        .datum(data)
        .attr("d", line) // "d" has nothing to do with D3, it's an attribute, returns a filled line
        .attr("fill", "none") //gets rid of filled in color
        .attr("stroke", "steelblue");
    
    // console.log(line)
  });