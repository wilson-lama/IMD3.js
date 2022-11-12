let lineChart;

loadData();

function loadData() {
    d3.tsv("data/title.ratings.tsv").then(data => {
        console.log(data)

        lineChart = new LineChart("lineChart", data)
    });
}