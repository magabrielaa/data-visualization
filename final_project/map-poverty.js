// Choropleth Map of Ecuador, by Poverty per 10.000 habitants

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "map-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 600,
  width = 800;


Promise.all([ 
  d3.csv("data/provinces_clean.csv"),
  d3.json("data/provincias.json")
]).then(([data, ecuador]) => { 

    const svg = d3.select("#chart1")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    const dataById = {};

    for (let d of data) {
        d.poor_total_norm = +d.poor_total_norm;

        //making a lookup table from the array (
        dataById[d.province] = d; //key is county id
      }
  
    const provinces = topojson.feature(ecuador, ecuador.objects.provincias);

    // Quantize evenly breakups domain into range buckets
    const color = d3.scaleQuantize() //color buckets depending on data, scaleQuantize breaks up domain into ranges for different colors
        .domain([0, 15]).nice() //color distribution, from 0 to 15 poverty per 10.000 habitants
        .range(d3.schemeBlues[9]);

    const projection = d3
        .geoIdentity()
        .reflectY(true)
        .fitSize([width, height], provinces);

    const path = d3.geoPath(projection); //creates path element in the browser

    // Builds legend and places it on the HTML
    d3.select("#legend1")
        .node() // creates node and then appends child to it (ie. legend)
        .appendChild(
        Legend(
            d3.scaleOrdinal( 
            ["<5", "6", "7", "8", "9", "10", "11", "12", "13+"], //array is placed into buckets
            d3.schemeBlues[9]
            ),
            { title: "Poverty per 10.000 habitants" }
        ));
 
    svg.append("g") 
        .selectAll("path") //select all paths before data join
        .data(provinces.features) //join on features (aka 24 provinces)
        .join("path") // join on path
        .attr("fill", d => (d.properties.dpa_despro in dataById) ? color(dataById[d.properties.dpa_despro].poor_total_norm) : '#ccc')
        .attr("stroke", "#d3d3d3") //set province boundaries to gray
        .attr("d", path)
        .on("mousemove", function (event, d) { //tool tip event listener "on" mousemove, condition to change color
        let info = dataById[d.properties.dpa_despro];
        if (info) 
        {tooltip
            .style("visibility", "visible")
            .html(`${info.province}<br>${info.poor_total_norm}%`)
            .style("top", (event.pageY - 10) + "px") // event returns pageY and pageX which is location of the mouse, padding of +/- so it's not exactly on mouse's location
            .style("left", (event.pageX + 10) + "px");
        d3.select(this).attr("fill", d3.schemeTableau10[5]);} // selects and fills it with yellow
        })
        .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", d => (d.properties.dpa_despro in dataById) ? color(dataById[d.properties.dpa_despro].poor_total_norm) : '#ccc');
        });
    
})