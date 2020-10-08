var svgWidth = 1000;
var svgHeight = 560;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("class", "chart");

d3.csv("assets/data/data.csv").then(function(data){
    
    
    data.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    console.log(data)
    // create scales
    var xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.poverty))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.healthcare))
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);


    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("stroke-width", "1")
      .attr("class", "stateCircle")



    //   chartGroup.selectAll("circle")
    //   .data(data)
    //   .enter()
    //   .attr("x", d => xScale(d.poverty))
    //   .attr("y", d => yLinearScale(d.healthcare))
    data.forEach(d=> console.log(d.abbr))
      chartGroup.selectAll(null)
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare-.25))
      .text(d => d.abbr)
      .attr("class", "stateText");

    
      chartGroup.append("text")
      .attr("transform", `translate(500, 500)`)
      .attr("class", "aText")
      .text("Poverty (%)");
      chartGroup.append("text")
      .attr("transform", `translate(-35, 200)rotate(270)`)
      .attr("class", "aText")
      .text("Lacks HealthCare (%)");


});
