let lineChart;

loadData();

function loadData() {
    d3.tsv("data/title.basics.tsv").then(data => {
        lineChart = new LineChart("lineChart", data);
    });
}
