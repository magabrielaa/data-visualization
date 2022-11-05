/* Scatterplot with symbols of fatal police force by month and age, 
categorized by manner of death*/

d3.json("shootings_data.json").then(d => { 
    //rearrange data to get counts by manner of death
    let data = d3.nest()
    .key(function(a) { return a.Manner_of_death; })
    .rollup(function(v) { return v.length; })
    .entries(d)
    ;})

// color assignment by specified colors per category
const assignColor = d3
	.scaleOrdinal()
	.domain(['Shot', 'Shot and Tasered', 'Tasered', 'Other'])
	.range(['#ff7f0e', '#1f77b4', '#23b423', '#e377c2' ]);

// symbol assignment per category
const assignSymbol = d3
	.scaleOrdinal()
	.domain(['Shot', 'Shot and Tasered', 'Tasered', 'Other'])
	.range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle, d3.symbolStar]);


d3.json("shootings_data.json").then(data => { 

      let timeParse = d3.timeParse("%m/%e/%Y") //parse string date format, parameter is current format
  
      for (let d of data) {
          d.Date = timeParse(d.Date);
      }

      let chart = Scatterplot(data, {
        x: d => d.Date,
        y: d => d.Age,
        xLabel: "Date →",
        yLabel: "↑ Age",
        width: 1000,
        height: 750,
        assignSymbol: (d) => assignSymbol(d.Manner_of_death),
        fill: (d) => assignColor(d.Manner_of_death)
      })
      document.getElementById("scatterplot").appendChild(chart) //append to DOM
    })


// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/scatterplot
function Scatterplot(
	data,
	{
		x = ([x]) => x, // given d in data, returns the (quantitative) x-value
		y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
		r = 3, // (fixed) radius of dots, in pixels
		title, // given d in data, returns the title
		marginTop = 20, // top margin, in pixels
		marginRight = 30, // right margin, in pixels
		marginBottom = 80, // bottom margin, in pixels
		marginLeft = 80, // left margin, in pixels
		inset = r * 2, // inset the default range, in pixels
		insetTop = inset, // inset the default y-range
		insetRight = inset, // inset the default x-range
		insetBottom = inset, // inset the default y-range
		insetLeft = inset, // inset the default x-range
		width = 800, // outer width, in pixels
		height = 800, // outer height, in pixels
		xType = d3.scaleLinear, // type of x-scale
		xDomain, // [xmin, xmax]
		xRange = [marginLeft + insetLeft, width - marginRight - insetRight], // [left, right]
		yType = d3.scaleLinear, // type of y-scale
		yDomain, // [ymin, ymax]
		yRange = [height - marginBottom - insetBottom, marginTop + insetTop], // [bottom, top]
		xLabel, // a label for the x-axis
		yLabel, // a label for the y-axis
		xFormat, // a format specifier string for the x-axis
		yFormat, // a format specifier string for the y-axis
		fill = 'none', // fill color for dots
		stroke = 'currentColor', // stroke color for the dots
		strokeWidth = 1.5, // stroke width for dots
		halo = '#fff', // color of label halo
		haloWidth = 3, // padding around the labels,

		// added arguments
		symbolSize = 20,
		assignSymbol
	} = {}
) {
	// Compute values.
	const X = d3.map(data, x);
	const Y = d3.map(data, y);
	const T = title == null ? null : d3.map(data, title);
	const I = d3.range(X.length).filter((i) => !isNaN(X[i]) && !isNaN(Y[i]));

	if (assignSymbol === undefined) assignSymbol = d3.symbolCircle;

	// Compute default domains.
	if (xDomain === undefined) xDomain = d3.extent(X);
	if (yDomain === undefined) yDomain = d3.extent(Y);

	// Construct scales and axes.
	const xScale = xType(xDomain, xRange);
	const yScale = yType(yDomain, yRange);
	const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat).tickFormat(d3.timeFormat("%b"));
	const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);

	const svg = d3
		.create('svg')
		.attr('width', width)
		.attr('height', height)
        .attr("viewBox", [0, 0, width, height]);
		// .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

	svg
		.append('g')
		.attr('transform', `translate(0,${height - marginBottom})`)
		.call(xAxis)
        .attr("class", "xaxis") // added my class to format tick label size
		.call((g) => g.select('.domain').remove())
		.call((g) =>
			g
				.selectAll('.tick line')
				.clone()
				.attr('y2', marginTop + marginBottom - height)
				.attr('stroke-opacity', 0.1)
		)
		.call((g) =>
			g
				.append('text')
				.attr('x', width)
				.attr('y', marginBottom -40)
				.attr('fill', 'currentColor')
				.attr('text-anchor', 'end')
                .attr("class", "x-label") // added my class to format axis label
				.text(xLabel)
		);

	svg
		.append('g')
		.attr('transform', `translate(${marginLeft},0)`)
		.call(yAxis)
        .attr("class", "yaxis") // added my class to format tick label size
		.call((g) => g.select('.domain').remove())
		.call((g) =>
			g
				.selectAll('.tick line')
				.clone()
				.attr('x2', width - marginLeft - marginRight)
				.attr('stroke-opacity', 0.1)
		)
		.call((g) =>
			g
                .append('text')
                .attr('fill', 'currentColor')
                .attr("class", "y-label")
                .attr("text-anchor", "end")
                .attr("x", -margin.top/2)
                .attr("dx", "-0.5em")
                .attr("y", -50)
                .attr("transform", "rotate(-90)")
                .attr("class", "y-label") // added my class to format axis label
                .text(yLabel)
		);

	if (T)
		svg
			.append('g')
			.attr('font-family', 'sans-serif')
			.attr('font-size', 10)
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round')
			.selectAll('text')
			.data(I)
			.join('text')
			.attr('dx', 7)
			.attr('dy', '0.35em')
			.attr('x', (i) => xScale(X[i]))
			.attr('y', (i) => yScale(Y[i]))
			.text((i) => T[i])
			.call((text) => text.clone(true))
			.attr('fill', 'none')
			.attr('stroke', halo)
			.attr('stroke-width', haloWidth);

    // Handmade legend
    svg.append("circle").attr("cx",50).attr("cy",10).attr("r", 6).style("fill", "#ff7f0e")
    svg.append("circle").attr("cx",105).attr("cy",10).attr("r", 6).style("fill", "#1f77b4")
    svg.append("circle").attr("cx",220).attr("cy",10).attr("r", 6).style("fill", '#23b423')
    svg.append("circle").attr("cx",290).attr("cy",10).attr("r", 6).style("fill", '#e377c2')
    svg.append("text").attr("x", 60).attr("y", 10).text("Shot").attr("class", "x-label").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 115).attr("y", 10).text("Shot and Tasered").attr("class", "x-label").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 230).attr("y", 10).text("Tasered").attr("class", "x-label").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 300).attr("y", 10).text("Other").attr("class", "x-label").attr("alignment-baseline","middle") 
        
    
    // create a group for each symbol
	const symbol = svg
		.selectAll('.dots')
		.data(I)
		.enter()
		.append('g')
		.attr('transform', (i) => `translate(${xScale(X[i])} , ${yScale(Y[i])})`);

	// draw path for each symbol
	symbol
		.append('path')
		.attr(
			'd',
			d3
				.symbol()
				.type((i) => assignSymbol(data[i]))
				.size(symbolSize)
		)
		.attr('fill', (i) => fill(data[i]));

	return svg.node();
}