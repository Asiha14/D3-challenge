// Svg Set UP
var svgWidth = 1000;
var svgHeight = 700;

var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

  // Add Chart Group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("class", "chart");

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";
console.log(chosenXAxis)
console.log(chosenYAxis)


// function used for updating x and y scales var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(censusData, chosenyAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenyAxis]) * 0.8,
      d3.max(censusData, d => d[chosenyAxis]) * 1.2
    ])
    .range([height,0]);

  return yLinearScale;

}
// function used for updating  a and y Axes var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var sideAxis = d3.axisLeft(newYScale);
  

  yAxis.transition()
    .duration(1000)
    .call(sideAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis,newYScale,chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating tooltips on circles
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {

  var xlabel;
  var ylabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty: ";
  }
  else if (chosenXAxis === "age")  {
    xlabel = "Age:";
  }
  else {
    xlabel = "Income:";
  }

  if (chosenYAxis === "healthcare") {
    ylabel = "Healthcare: ";
  }
  else if (chosenYAxis === "smokes")  {
    ylabel = "Smokes:";
  }
  else {
    ylabel = "Obesity:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}%<br>${ylabel} ${d[chosenYAxis]}%`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// reading in the data
d3.csv("assets/data/data.csv").then(function(data){
    
  // Convert to float as opposed to strings
  data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
      d.age = +d.age;
      d.smokes = +d.smokes;
      d.obesity = +d.obesity;
      d.income = +d.income;
  });

  // Creating Initial Scales and  Axes
  var xLinearScale = xScale(data, "poverty");
  var yLinearScale = yScale(data, "healthcare");

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

    // append axes
  var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

  var yAxis = chartGroup.append("g")
      .call(leftAxis);


    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 15)
      .attr("stroke-width", "1")
      .attr("class", "stateCircle")

    // append state abbreviations
    var abbr= chartGroup.selectAll(null)
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]-.25))
      .text(d => d.abbr)
      .attr("class", "stateText");

    //  x and y axes labels
    var xlabels = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height+20})`)

    var povertyLabel = xlabels.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .attr("class", "aText active")
    .text("Poverty (%)");

    var ageLabel = xlabels.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .attr("class", "aText")
    .text("Age (Median)");

    var incomeLabel = xlabels.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .attr("class", "aText")
    .text("Household Income (Median)");


    var ylabels = chartGroup.append("g")

    
    var healthcareLabel = ylabels.append("text")
    .attr("transform", `translate(-35, 200)rotate(270)`)
    .attr("value", "healthcare")
    .attr("class", "aText active")
    .text("Lacks HealthCare (%)");
    
    var smokesLabel = ylabels.append("text")
    .attr("transform", `translate(-55, 200)rotate(270)`)
    .attr("value", "smokes")
    .attr("class", "aText")
    .text("Smokes (%)");

    var obesityLabel = ylabels.append("text")
    .attr("transform", `translate(-75, 200)rotate(270)`)
    .attr("value", "obesity")
    .attr("class", "aText")
    .text("Obese (%)");

    // Update the tooltip
    var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

    // Manage change events
    ylabels.selectAll("text")
    .on("click", function() {
      // get value of selection and (de)activate text
      var value = d3.select(this).attr("value");
           
      if (value === "healthcare") {
        chosenYAxis = "healthcare";
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
        .classed("active", false)
        .classed("inactive", true);
      }
      else if (value === "smokes") {
        chosenYAxis = "smokes";
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
        .classed("active", false)
        .classed("inactive", true);
      }
      else if (value === "obesity") {
        chosenYAxis = "obesity";
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
        .classed("active", true)
        .classed("inactive", false);
      }

      // remove old state circle labels
      abbr.remove();
      
        // functions here found above csv import
        // updates yscale for new data

      yLinearScale = yScale(data, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);
      abbr= chartGroup.selectAll(null)
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]-.25))
            .text(d => d.abbr)
            .attr("class", "stateText");
      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
    })
    .on("mouseover", function() {
      d3.select(this)
            .attr("fill", "red");
    })
    // event listener for mouseout
    .on("mouseout", function() {
      d3.select(this)
            .attr("fill", "black");
    });;

    xlabels.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value === "poverty") {

        // replaces chosenXAxis with value
        chosenXAxis = "poverty";
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
        .classed("active", false)
        .classed("inactive", true);
      }
      else if (value === "age") {
        chosenXAxis = "age";
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
        .classed("active", false)
        .classed("inactive", true);
      }
      else if (value === "income") {
        chosenXAxis = "income";
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
        .classed("active", true)
        .classed("inactive", false);
      }
      
        console.log(value)
      abbr.remove()
        // functions here found above csv import
        // updates x scale for new data
      xLinearScale = xScale(data, chosenXAxis);


      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);


      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

      abbr= chartGroup.selectAll(null)
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]-.25))
      .text(d => d.abbr)
      .attr("class", "stateText");
    })
    .on("mouseover", function() {
      d3.select(this)
            .attr("fill", "red");
    })
    // event listener for mouseout
    .on("mouseout", function() {
      d3.select(this)
            .attr("fill", "black");
    });;
});
