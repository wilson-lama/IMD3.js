let lineChart;

// load data using promises
let promises1 = [d3.tsv("data/title.basics.tsv")];

Promise.all(promises1)
    .then(function (data) {
        initMainPage1(data);
    })
    .catch(function (err) {
        console.log(err);
    });

function initMainPage1(allDataArray) {
    lineChart = new LineChart("lineChart", allDataArray[0]);
}
