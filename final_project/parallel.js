// Parallel Set of Types of Employment, by Gender

const margin = { top: 25, right: 0, bottom: 20, left: 0 },
  nodeWidth = 5,
  nodePadding = 15; //separation between category lines

const svg = d3.select("#chart3")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height]);

d3.csv("data/jobs_by_gender.csv").then((data) => {

  for (let d of data) {
    d.value = +d.value;
  }

  let genders = [...new Set(data.map(d => d.source))]; //spread syntax
  
  let graph = nodeLinkData(data, ["source", "target"]); // helper function nodeLinkData below

  let sankey = d3.sankey() //sets up function used later to modify data
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .extent([
      [margin.left, margin.top], 
      [width - margin.right, height - margin.bottom]
    ]);

  let color = d3.scaleOrdinal()
    .range([d3.schemePaired[8], d3.schemePaired[7]])
    .domain(genders);

  const { nodes, links } = sankey(graph); // modifies and returns graph, object destructuring syntax

  svg.append("g") // turns node data into rectangles on the sides
    .selectAll("rect")
    .data(nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .style("fill", "rgb(86, 85, 85)")
    .append("title")
    .text(d => d.name);

  svg.append("g") // creates ribbons (ie. paths)
    .attr("fill", "none")
    .selectAll("g")
    .data(links)
    .join("path")
    .attr("d", d3.sankeyLinkHorizontal()) //  d3.sankeyLinkHorizontal comes from sankey library
    .attr("stroke", d => color(d.source.name))
    .attr("stroke-width", d => d.width)
    .attr("opacity", 0.75)
    .style("mix-blend-mode", "multiply")
    .on("mouseover", function() {
      d3.select(this)
        .attr("opacity", 1);
    })
    .on("mouseout", function() {
      d3.select(this)
        .attr("opacity", 0.75);
    })
    .on("click", function(e, d) { //on click, changes the message at the top
      let str = `${d.value.toLocaleString()} ${d.source.name}S  under poverty <br> are  ${d.target.name}`; //toLocaleString adds commas to number
      d3.select(".c3-header") //selects H2 element on the HTML and adds string
        .html(str);
    })
    .append("title")
    .text(d => `${d.source.name} ${d.target.name}`);

  // Text elements below
  svg.append("g")
    .style("font-weight", "bold")
    .attr("fill", "rgb(86, 85, 85)")
    .attr("font-size", 19)
    .append("text")
    .attr("x", 0)
    .attr("y", 16)
    .text("GENDER");

  svg.append("g")
    .attr("class", "parallel-label")
    .attr("fill", "rgb(86, 85, 85)")
    .style("font-weight", "bold")
    .attr("font-size", 19)
    .append("text")
    .attr("x", width - margin.left)
    .attr("y", 20)
    .attr("text-anchor", "end")
    .text("EMPLOYMENT TYPE");

  svg.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.name);
});

// This function separates data into links and nodes
function nodeLinkData(data, [source, target]) {
  const keys = [source, target];
  const seenNodes = new Set();
  const indexByName = {};
  let index = -1;

  // form nodes
  const nodes = [];
  for (const k of keys) {
    for (const d of data) {
      const name = d[k];
      if (seenNodes.has(name)) continue;
      const node = { name };
      nodes.push(node);
      seenNodes.add(name);
      indexByName[name] = ++index;
    }
  }

  // form links
  const links = [];
  for (const d of data) {
    links.push({
      source: indexByName[d[source]],
      target: indexByName[d[target]],
      value: d.value 
    });
  }

  return { nodes, links };
}