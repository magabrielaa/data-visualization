// Choropleth Map of Ecuador, by Poverty per 10.000 habitants

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 600,
  width = 800;


Promise.all([ 
  d3.csv("data/provinces_clean.csv"),
  d3.json("data/provincias.json")
]).then(([data, ecuador]) => { 
    // console.log("my data", data)
    // console.log("topojson file", ecuador)

    const svg = d3.select("#chart1")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);


    const dataById = {};

    for (let d of data) {
        d.poor_total_norm = +d.poor_total_norm;

        //making a lookup table from the array (
        dataById[d.province] = d; //key is county id
      }
      // console.log("DATA BY ID", dataById)
    
    // const counties = topojson.feature(us, us.objects.counties);
    const provinces = topojson.feature(ecuador, ecuador.objects.provincias);
    // console.log("provinces", provinces)

      // Quantize evenly breakups domain into range buckets
    const color = d3.scaleQuantize() //color buckets depending on data, scaleQuantize breaks up domain into ranges for different colors
        .domain([0, 15]).nice() //color distribution, from 0 to 23 extremely poor
        .range(d3.schemePurples[9]);

    // console.log("COLOR", color.domain())

    const projection = d3
        .geoIdentity()
        .reflectY(true)
        .fitSize([width, height], provinces);

    const path = d3.geoPath(projection); //creates path element in the browser

    // builds legend and places it on the HTML
    d3.select("#legend1")
        .node() // creates node and then appends child to it (ie. legend)
        .appendChild(
        Legend(
            d3.scaleOrdinal( //scaleOrdinal or scaleQuantisize
            // color.domain(),
            ["<5", "6", "7", "8", "9", "10", "11", "12", "13+"], //array is placed into buckets, can include strings
            d3.schemePurples[9] //scale given but not required, can just replace with "color", here same scheme as the rest of the page
            ),
            { title: "Poverty per 10.000 habitants" }
        ));
 
    svg.append("g") 
        .selectAll("path") //select all paths before data join
        .data(provinces.features) //join on features (aka 24 provinces)
        .join("path") // join on path
        // .attr("fill", d => { console.log("WHAT'S d", d);
        //     return (d.properties.dpa_despro in dataById) ? color(dataById[d.properties.dpa_despro].poor_total_norm) : '#ccc'}
        //     ) //fill is the color of that path, for each row, loop  and if there is date, use rate to determine color, color was prev declared as a scale, if no data, fill it with grey #ccc, "?" is if else statement
        .attr("fill", d => (d.properties.dpa_despro in dataById) ? color(dataById[d.properties.dpa_despro].poor_total_norm) : '#ccc')
        .attr("stroke", "#d3d3d3")
        .attr("d", path)
        .on("mousemove", function (event, d) { //tool tip event listener "on" mousemove / click/ select, event is "on" path, so condition to change color
        let info = dataById[d.properties.dpa_despro];
        // console.log("info", info)
        if (info) 
        {tooltip
            .style("visibility", "visible")
            .html(`${info.province}<br>${info.poor_total_norm}%`)
            .style("top", (event.pageY - 10) + "px") // event returns pageY and pageX which is location of the mouse, padding of +/- so it's not exactly on mouse's location
            .style("left", (event.pageX + 10) + "px");
        d3.select(this).attr("fill", "goldenrod");} // selects and fills it with yellow
        })
        .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", d => (d.properties.dpa_despro in dataById) ? color(dataById[d.properties.dpa_despro].poor_total_norm) : '#ccc');
        });
    
})


// d3.csv("data/provinces_clean.csv").then(data => { 
// // getMax(data) 
// console.log("THIS IS MY DATA", data)
// max_val = getMax(data, "poor_total_norm")
// console.log("THIS IS THE MAX", max_val)
// })


// function getMax(data, field) {

//   let max = 0
//   for (let d of data) {
//     d.poor_total_norm = +d.poor_total_norm;
//   }
  
//   data.forEach(d => {
//       if (d[field] > max) {
//           max = d[field]
//       }
//   })
//   return max
// }