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
})}


init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}



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
  
  });

function buildCharts(sample){
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    var sortedResults = resultArray.sort((a,b) => a.sample_values - b.sample_values).reverse();
    var result = sortedResults[0];
    var sampleValues = result.sample_values;
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    otuIdString = otuIds.map(otuChartLabel => `OTU ${otuChartLabel}`);
    
    var trace = {
      x: sampleValues.slice(0,10).reverse(),
      y: otuIdString.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };

    var data = [trace];
    var layout = {
      title: "Top 10 bacterial species (OTU's)",
      margin: {t:50, l:150}
    };

    Plotly.newPlot("bar", data, layout);



    
  });

}

}

  












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