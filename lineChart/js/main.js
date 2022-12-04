let lineChart;

// load data using promises
let promises = [
    d3.tsv("data/title.basics.tsv"),
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data);
    })
    .catch(function (err) {
        console.log(err);
    });

function initMainPage(allDataArray) {
    console.log(allDataArray);
    lineChart = new LineChart(
        "lineChart",
        allDataArray[0],
    );
}
