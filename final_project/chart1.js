const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 610,
  width = 975;

const svg = d3.select("#chart1")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);


Promise.all([ 
  d3.csv("data/province.csv"),
  d3.json("data/map.json")
]).then(([data, ecuador]) => { 
    console.log("my data", data)
    console.log("topojson file", ecuador)

    const dataById = {};

    for (let d of data) {
        d.extremely_poor = +d.extremely_poor;
        //making a lookup table from the array (
        dataById[d.province] = d; //key is county id
      }
      console.log("DATA BY ID", dataById)
    
    // const counties = topojson.feature(us, us.objects.counties);
    const provinces = topojson.feature(ecuador, ecuador.objects.map);
    console.log("provinces", provinces)

      // Quantize evenly breakups domain into range buckets
    const color = d3.scaleQuantize() //color buckets depending on data, scaleQuantize breaks up domain into ranges for different colors
        .domain([0, 10]).nice() //color distribution, from 0 to 23 extremely poor
        .range(d3.schemeGreens[9]);
    
    const path = d3.geoPath(); //creates path element in the browser

    // builds legend and places it on the HTML
    d3.select("#legend")
        .node() // creates node and then appends child to it (ie. legend)
        .appendChild(
        Legend(
            d3.scaleOrdinal( //scaleOrdinal or scaleQuantisize
            ["<4", "4-6", "7-9", "10-12", "13-15", "16-18", "19-21", "22+"], //array is placed into buckets, can include strings
            d3.schemeGreens[9] //scale given but not required, can just replace with "color", here same scheme as the rest of the page
            ),
            { title: "Extreme Poverty Level" }
        ));
 
    svg.append("g") 
        .selectAll("path") //select all paths before data join
        .data(provinces.features) //join on features (aka 24 provinces)
        .join("path") // join on path
        .attr("fill", d => (d.province in dataById) ? color(dataById[d.province].extremely_poor) : '#ccc') //fill is the color of that path, for each row, loop  and if there is date, use rate to determine color, color was prev declared as a scale, if no data, fill it with grey #ccc, "?" is if else statement
        .attr("d", path)
        .on("mousemove", function (event, d) { //tool tip event listener "on" mousemove / click/ select, event is "on" path, so condition to change color
        let info = dataById[d.province];
        tooltip
            .style("visibility", "visible")
            .html(`${info.province}<br>${info.extremely_poor}%`)
            .style("top", (event.pageY - 10) + "px") // event returns pageY and pageX which is location of the mouse, padding of +/- so it's not exactly on mouse's location
            .style("left", (event.pageX + 10) + "px");
        d3.select(this).attr("fill", "goldenrod"); // selects and fills it with yellow
        })
        .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", d => (d.province in dataById) ? color(dataById[d.province].extremely_poor) : '#ccc');
        });
    
})