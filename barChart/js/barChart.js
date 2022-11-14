class BarChart {
    constructor(parentElement, ratingsData, principalsData, basicsData) {
        this.parentElement = parentElement;
        this.ratingsData = ratingsData;
        this.principalsData = principalsData;
        this.basicsData = basicsData;
        this.displayData = [];

        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 40, right: 40, bottom: 200, left: 40};

        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.width = 2000;
        vis.height = 500;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.3)
            .paddingOuter(0.3);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([0, 10]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")")

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;

        vis.titles = []
        vis.principalsData.forEach(e => {
            vis.titles.push(vis.basicsData.find(d => e["tconst"] == d["tconst"])["primaryTitle"])
        })

        vis.updateVis();
    }

    updateVis(){
        let vis = this;

        // update domain
        vis.x.domain(vis.titles)

        // bind data to bars
        vis.bar = vis.svg.selectAll("rect")
            .data(vis.principalsData)

        // enter and init new elements
        vis.bar.enter().append("rect")

        // enter and update dynamic properties
            .merge(vis.bar)
            .transition()
            .attr("x", d => vis.x(vis.basicsData.find(e => e["tconst"] == d["tconst"])["primaryTitle"]))
            .attr("y", d => vis.y(vis.ratingsData.find(e => e["tconst"] == d["tconst"])["averageRating"]))
            .attr("width", vis.x.bandwidth())
            .attr("height", d => vis.height - vis.y(vis.ratingsData.find(e => e["tconst"] == d["tconst"])["averageRating"]))
            .attr("class", "bar")

        vis.bar.exit().remove()

        vis.svg.select(".x-axis")
            .call(vis.xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

        vis.svg.select(".y-axis").call(vis.yAxis);
    }
}