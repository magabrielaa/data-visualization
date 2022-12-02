// Choropleth Map of Ecuador, rural households per 10.000

Promise.all([ 
    d3.csv("data/provinces_clean.csv"),
    d3.json("data/provincias.json")
  ]).then(([data, ecuador]) => { 
  
      const svg = d3.select("#chart10")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);
  
      const dataById = {};
  
      for (let d of data) {
          d.rural_per = +d.rural_per;
  
          //lookup table from the array 
          dataById[d.province] = d; //key is province name
        }

      const provinces = topojson.feature(ecuador, ecuador.objects.provincias);
  
      const color = d3.scaleQuantize() 
          .domain([0, 23]).nice() //color distribution, from 0 to 23 rural households per 10.000
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
              d3.scaleOrdinal( 
              ["<5", "6-8", "9-11", "12-14", "15-17", "18-20", "21+"], 
              d3.schemeGreens[7] 
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
          .on("mousemove", function (event, d) { //tool tip event listener "on" mousemove, conditioned to change color
          let info = dataById[d.properties.dpa_despro];
          if (info) 
          {tooltip
              .style("visibility", "visible")
              .html(`${info.province}<br>${info.rural_per}%`)
              .style("top", (event.pageY - 10) + "px") // event returns pageY and pageX which is location of the mouse, padding of +/- so it's not exactly on mouse's location
              .style("left", (event.pageX + 10) + "px");
          d3.select(this).attr("fill", d3.schemeTableau10[5]);} // selects and fills it with yellow
          })
          .on("mouseout", function () {
          tooltip.style("visibility", "hidden");
          d3.select(this).attr("fill", d => (d.properties.dpa_despro in dataById) ? color(dataById[d.properties.dpa_despro].rural_per) : '#ccc');
          });
      
  })
  
  
// Helper function to find the max value of the domain (for legend purposes)
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

d3.csv("data/provinces_clean.csv").then(data => { 
    max_val = getMax(data, "rural_per")
    })