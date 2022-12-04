class LineChart {
    constructor(parentElement, basicsData) {
        this.parentElement = parentElement;
        this.basicsData = basicsData;
        this.displayData = [];
        this.parseDate = d3.timeParse("%Y");
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 40, right: 40, bottom: 60, left: 80 };

        vis.width = 1100;
        vis.height = 500;

        // SVG drawing area
        vis.svg = d3
            .select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr(
                "transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")"
            );

        // Scales and axes
        vis.x = d3
            .scaleTime()
            .domain([vis.parseDate("1990"), vis.parseDate("2020")])
            .range([0, vis.width]);

        vis.y = d3.scaleLinear().domain([0, 5]).range([vis.height, 0]);

        vis.xAxis = d3.axisBottom().scale(vis.x);

        vis.yAxis = d3.axisLeft().scale(vis.y).tickValues([0, 1, 2, 3, 4, 5]);

        vis.svg
            .append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g").attr("class", "y-axis axis");

        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);

        // axis titles
        vis.svg
            .append("text")
            .attr("x", vis.width / 2)
            .attr("y", 550)
            .attr("fill", "lightgrey")
            .attr("font-weight", 10)
            .text("Year");

        vis.svg
            .append("text")
            .attr("x", -300)
            .attr("y", -40)
            .attr("fill", "lightgrey")
            .attr("transform", "rotate(-90)")
            .text("Movie Count");

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        const countsObj = {};

        vis.basicsData.forEach((d) => {
            if (d.titleType == "movie") {
                if (countsObj[d.startYear] === undefined) {
                    countsObj[d.startYear] = 1;
                }
                countsObj[d.startYear] += 1;
            }
        });

        vis.minYear = Number.parseInt(d3.min(Object.keys(countsObj)));
        vis.maxYear = Number.parseInt(d3.max(Object.keys(countsObj)));

        const countsArray = [];

        for (let i = vis.minYear; i < vis.maxYear; i++) {
            let currCount = 0;
            if (Object.keys(countsObj).includes(String(i))) {
                currCount = countsObj[String(i)];
            }
            countsArray.push({
                YEAR: i,
                COUNT: currCount,
            });
        }

        vis.movieCount = countsArray.sort(
            (a, b) => Number.parseInt(a.YEAR) - Number.parseInt(b.YEAR)
        );

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Create the line chart path
        vis.svg
            .append("path")
            .datum(vis.movieCount)
            .attr("class", "line")
            .attr("stroke", "black")
            .attr(
                "d",
                d3
                    .line()
                    .x((d) => vis.x(vis.parseDate(d.YEAR)))
                    .y((d) => vis.y(d.COUNT))
            )
            .attr("fill", "none");
    }
}
