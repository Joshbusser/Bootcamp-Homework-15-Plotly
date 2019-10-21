function buildMetadata(sample) {

  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to Select the Panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to Clear any Existing Metadata
    PANEL.html("");
    // Use `Object.entries` to Add Each Key & Value Pair to the Panel
    // Hint: Inside the Loop, Use d3 to Append New Tags for Each Key-Value in the Metadata
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}:${value}`);
    })
    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
  })
}
function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then((data) => {
    // @TODO: Build a Bubble Chart Using the Sample Data
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;
    // @TODO: Build a Pie Chart
    let bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closests",
      xaxis: { title: "OTU ID"}
    }

    let bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ]

    Plotly.plot("bubble", bubbleData, bubbleLayout);
    
    let pieData = [
      {
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "pie"
      }
    ];
    
    let pieLayout = {
      margin: { t: 0, l: 0 }
    };

    Plotly.plot("pie", pieData, pieLayout)
})
}


  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

function init() {
  // Drawdown
  var selector = d3.select("#selDataset");

  // sampleanems
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // First sample
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  
  buildCharts(newSample);
  buildMetadata(newSample);
}
// Initialize
init();
