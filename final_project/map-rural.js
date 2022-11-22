// Choropleth Map of Ecuador, poverty as a percentage of the population

Promise.all([ 
    d3.csv("data/provinces_clean.csv"),
    d3.json("data/provincias.json")
  ]).then(([data, ecuador]) => { 
      console.log("my data", data)
      // console.log("topojson file", ecuador)
  
      const svg = d3.select("#chart10")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);
  
      const dataById = {};
  
      for (let d of data) {
          d.rural_per = +d.rural_per;
  
          //making a lookup table from the array (
          dataById[d.province] = d; //key is county id
        }
        // console.log("DATA BY ID", dataById)
      
      // const counties = topojson.feature(us, us.objects.counties);
      const provinces = topojson.feature(ecuador, ecuador.objects.provincias);
      // console.log("provinces", provinces)
  
        // Quantize evenly breakups domain into range buckets
      const color = d3.scaleQuantize() //color buckets depending on data, scaleQuantize breaks up domain into ranges for different colors
          .domain([0, 21]).nice() //color distribution, from 0 to 23 extremely poor
          .range(d3.schemeGreens[7]);
  
      const projection = d3
          .geoIdentity()
          .reflectY(true)
          .fitSize([width, height], provinces);
  
      const path = d3.geoPath(projection); //creates path element in the browser
  
      // builds legend and places it on the HTML
      d3.select("#legend5")
          .node() // creates node and then appends child to it (ie. legend)
          .appendChild(
          Legend(
              d3.scaleOrdinal( //scaleOrdinal or scaleQuantisize
              // color.domain(),
              ["<5", "6-8", "9-11", "12-14", "15-17", "18-20", "21+"], //array is placed into buckets, can include strings
              d3.schemeGreens[7] //scale given but not required, can just replace with "color", here same scheme as the rest of the page
              ),
              { title: "Rural households per 10.000" }
          ))
          ;
      
      svg.append("g") 
          .selectAll("path") //select all paths before data join
          .data(provinces.features) //join on features (aka 24 provinces)
          .join("path") // join on path
          .attr("fill", d => (d.properties.dpa_despro in dataById) ? color(dataById[d.properties.dpa_despro].rural_per) : '#ccc')
          .attr("stroke", "#d3d3d3")
          .attr("d", path)
          .on("mousemove", function (event, d) { //tool tip event listener "on" mousemove / click/ select, event is "on" path, so condition to change color
          let info = dataById[d.properties.dpa_despro];
          // console.log("info", info)
          if (info) 
          {tooltip
              .style("visibility", "visible")
              .html(`${info.province}<br>${info.rural_per}%`)
              .style("top", (event.pageY - 10) + "px") // event returns pageY and pageX which is location of the mouse, padding of +/- so it's not exactly on mouse's location
              .style("left", (event.pageX + 10) + "px");
          d3.select(this).attr("fill", "goldenrod");} // selects and fills it with yellow
          })
          .on("mouseout", function () {
          tooltip.style("visibility", "hidden");
          d3.select(this).attr("fill", d => (d.properties.dpa_despro in dataById) ? color(dataById[d.properties.dpa_despro].rural_per) : '#ccc');
          });
      
  })
  
  
  d3.csv("data/provinces_clean.csv").then(data => { 
  max_val = getMax(data, "rural_per")
  console.log("THIS IS THE MAX MAP", max_val)
  })
  
  
  function getMax(data, field) {
  
    let max = 0
  
      for (let d of data) {
          d[field] = +d[field];
    }
    
    data.forEach(d => {
        if (d[field] > max) {
            max = d[field]
        }
    })
    return max
  }