function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    optionChanged(sampleNames[0]);
  })
}

// buildMetadata function to populate the Demographics table based upon ID number
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("ID: "+result.id);
    PANEL.append("h6").text("Ethnicity: "+result.ethnicity);
    PANEL.append("h6").text("Gender: "+result.gender);
    PANEL.append("h6").text("Age: "+result.age);
    PANEL.append("h6").text("Location: "+result.location);
    PANEL.append("h6").text("bbtype: "+result.bbtype);
    PANEL.append("h6").text("wfreq: "+result.wfreq);

    buildGauge(result.wfreq);
  
  });

}  

// Create a bar chart displaying top 10 OTUs found in specified individual
function buildCharts(sample){
  d3.json("samples.json").then((data) => {
    var sample_values = data.samples;
    var resultArray = sample_values.filter(sampleData => sampleData.id == sample);
    var result = resultArray[0];

    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    var filteredData = otuIds.slice(0, 10).map(otuIdBarChart => `OTU${otuIdBarChart}`).reverse();

    
    var trace = {
      x: sampleValues.slice(0, 10).reverse(),
      y: filteredData,
      text: otuLabels.slice(0, 10).reverse(),
      orientation: "h",
      type: "bar",
      marker: {
        color: "#94d1c2",
      }
    };
    var data = [trace];
    var layout = {
      title: "Top 10 bacterial species (OTU's)",
      margin: {t: 30, l: 100},
      xaxis: { title: "Sample Values"},

    };

    Plotly.newPlot("bar", data, layout);

    // Create a bubble chart to visuaize the relative frequency of ALL bacterial spp. found in specified individual
    var trace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIds,
        colorscale: "YlGnBu",
        type: "heatmap",
        opacity: 0.5,
        size: sampleValues,
        sizemode: "diameter"
      }
    };

    var data = [trace1];
    var layout = {
      title: "All Bacterial Species per Volunteer",
      xaxis: { title: "OTI ID" },
      showlegend: false,
      height: 600,
      width: 1300
    };

    Plotly.newPlot("bubble", data, layout)
    
  });
}

// Create a gauge chart displaying belly button washing frequency of specified individual
function buildGauge(wfreq){
  var gauge = document.getElementById("gauge");

  var traceA = {
    type: "pie",
    showlegend: false,
    hole: 0.4, 
    rotation: 90, 
    values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
    text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
    direction: "clockwise",
    textinfo: "text",
    textposition: "inside",
    marker: {
      colors: ["#7575d7", "#758dd7", "#75a6d7", "#75bed7", "#79d2d2", "#90d5b3", "#a6d9a6", "#cbe0b8", "#eff8d3", "white"]
    },
    labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
    hoverinfo: "label",
  };

  var level = parseFloat(wfreq) * 20;
  var degrees = 180 - level;
  var radius = 0.5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // var mainPath = "M -.0 -0.025 L .0 0.0255 L",
  // var pathX = String(x),
  // var space = " ",
  // var pathY = String(y),
  // var pathEnd = " Z";
  // var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var layout = {
    shapes:[{
      type: "line",
      x0: 0.5,
      y0: 0,
      x1: x,
      y1: 0.5,
      line: {
        color: "black",
        width: 2
      }
    }],
    title: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week</br>",
    height: 700,
    width: 700,
    xaxis: {visible: false, range: [-1, 1]},
    yaxis: {visible: false, range: [-1, 1]} 
  };

  var data = [traceA];

  Plotly.newPlot(gauge, data, layout);

}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  buildGauge(newSample);
}

init();




  












// d3.json("samples.json").then(function(data){
//     console.log(data);
// });

// // Extract only the wfreq of each person and put into a new array
// d3.json("samples.json").then(function(data){
//     wfreq = data.metadata.map(person => person.wfreq);
//     console.log(wfreq);
// });

// // Sort the wfreq array in descending order
// d3.json("samples.json").then(function(data){
//     wfreq = data.metadata.map(person =>
// person.wfreq).sort((a,b) => b - a);
//     console.log(wfreq);
// });

// // Filter out null values
// d3.json("samples.json").then(function(data){
//     wfreq = data.metadata.map(person =>
// person.wfreq).sort((a,b) => b - a);
//     filteredWfreq = wfreq.filter(element => element !=
// null);
//     console.log(filteredWfreq);
// });

// // Print all metadata of the first person 
// d3.json("samples.json").then(function(data){
//     firstPerson = data.metadata[0];
//     Object.entries(firstPerson).forEach(([key, value]) =>
//       {console.log(key + ': ' + value);});
// });