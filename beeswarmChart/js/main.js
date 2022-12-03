let beeswarmChart;

loadData();

function loadData() {
    d3.tsv("data/popular.movies.tsv").then((data) => {
        beeswarmChart = new BeeswarmChart("beeswarmChart", data);
    });
}
