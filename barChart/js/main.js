let barChart;

// load data using promises
let promises = [
    d3.tsv("data/title.ratings.tsv"),
    d3.tsv("data/title.principals.tsv"),
    d3.tsv("data/title.basics.tsv"),
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

function initMainPage(allDataArray) {
    console.log(allDataArray)
    barChart = new BarChart("barChart", allDataArray[0], allDataArray[1], allDataArray[2])
}