class BeeswarmChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];

        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 40, right: 40, bottom: 60, left: 40};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleLog()
            .rangeRound([0, vis.width]);

        let revenueMin = d3.min(vis.data, d => Number(d.revenue.slice(1).split(',').join('')));
        let revenueMax = d3.max(vis.data, d => Number(d.revenue.slice(1).split(',').join('')));
        let revenueScale = d3.scaleLinear()
            .domain([revenueMin, revenueMax])
            .range([5, 30]);

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieTooltip')

        let circles = vis.svg.selectAll("circle").data(vis.data).enter().append("circle")
            .attr("r", (row_data, row_number) => {
                console.log(row_data)
                return revenueScale(Number(row_data.revenue.slice(1).split(',').join('')));
            })
            .attr("cx", (row_data, row_number) => {
                return ((row_data.rank - 1) % 10) * 100;
            })
            .attr("cy", (row_data, row_number) => {
                return 50 * (row_data.rank / 10);
            })
            .attr("fill", "royalblue")
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
             <h3>Ranking #${d.rank}<h3>
             <h4> Movie: ${d.movie}</h4>      
             <h4> Year: ${d.year}</h4> 
             <h4> Revenue: ${d.revenue}</h4>                          
         </div>`);
            });

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");
        console.log("vis.data", vis.data)

        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;

        vis.updateVis();
    }

    updateVis(){
        let vis = this;

        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }
}