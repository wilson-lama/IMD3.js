class LineChart {
    constructor(parentElement, basicsData) {
        this.parentElement = parentElement;
        this.basicsData = basicsData;
        this.displayData = [];

        this.parseDate = d3.timeParse("%Y");

        this.initVis();
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 40, right: 40, bottom: 60, left: 80};

        vis.width = 1100;
        vis.height = 500;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleTime()
            .domain([vis.parseDate("1980"), vis.parseDate("2025")])
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .domain([0, 45])
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);

        // axis titles
        vis.svg
            .append("text")
            .attr("x", vis.width / 2)
            .attr("y", 550)
            .attr("fill", "grey")
            .attr("font-weight", 10)
            .text("Year");

        vis.svg
            .append("text")
            .attr("x", -300)
            .attr("y", -40)
            .attr("fill", "grey")
            .attr("transform", "rotate(-90)")
            .text("Movie Count");

        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;

        vis.movieCount = []

        let prevYearCount = 0;
        vis.basicsData.forEach(element => {
            let currentYear = element["startYear"];
            let existingElementIndex = vis.movieCount.findIndex(e => {
                return e.YEAR === currentYear
            })

            if(existingElementIndex == -1) {
                vis.movieCount.push({
                    YEAR: currentYear,
                    COUNT: 1 + prevYearCount,
                })
            } else {
                vis.movieCount[existingElementIndex] = {
                    YEAR: currentYear,
                    COUNT: vis.movieCount[existingElementIndex].COUNT += 1,
                }
            }
            prevYearCount = vis.movieCount[vis.movieCount.length - 1].COUNT;
        })

        console.log(vis.movieCount)

        vis.updateVis();
    }

    updateVis(){
        let vis = this;

        // Create the line chart path
        vis.svg.append("path")
            .datum(vis.movieCount)
            .attr("class", "line")
            .attr("stroke", "black")
            .attr("d", d3.line()
                .x(d => vis.x(vis.parseDate(d.YEAR)))
                .y(d => vis.y(d.COUNT))
            )
            .attr("fill", "none")
    }
}