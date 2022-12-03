"use strict";

/*
 * a function that produces an svg as an interactive graph
 */
async function constructGraph(nodes, links) {
    // // import data
    // const dataRes = await fetch("data/leo.json");
    // const data = await dataRes.json();

    // const nodes = data["nodes"];
    // const links = data["links"];

    // tooltip for nodes
    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "nodeTooltip");

    const vertices = nodes.map((d) => d.id);

    // make adjacency list
    const graph = {};

    nodes.forEach((d) => {
        graph[cleanUpName(d.id)] = [];
    });

    links.forEach((d) => {
        graph[cleanUpName(d.source)].push(cleanUpName(d.target));
        graph[cleanUpName(d.target)].push(cleanUpName(d.source));
    });

    // construct forces
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id(({ index: i }) => vertices[i]);

    let distance = 150,
        strength = -550;

    const simulation = d3
        .forceSimulation(nodes)
        .force("link", forceLink.distance(distance))
        .force("charge", forceNode.strength(strength))
        .force("center", d3.forceCenter())
        .on("tick", ticked);

    // create DOM elements
    const width = getViewportWidth(), // helper vars - old: 1400 x 700
        height = getViewportHeight() - 40;
    let yOffset = 0;

    const svg = d3
        .create("svg")
        .attr("id", "graph-svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const link = svg
        .append("g")
        .attr("stroke", "#ccc")
        // .attr("stroke-width", 1.5)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", (d) => d.value * 2) // edge width by synergy strength
        .attr("class", (d) =>
            makeEdgeId(cleanUpName(d.source.id), cleanUpName(d.target.id))
        );
    // note: using class instead of id because edges contain duplicates

    const imgWidth = 40, // helper vars
        imgHeight = imgWidth,
        imgX = (-1 * imgWidth) / 2,
        imgY = imgX;

    const node = svg
        .append("g")
        .selectAll("image")
        .data(nodes)
        .join("image")
        .attr("id", (d) => cleanUpName(d.id))
        .attr("xlink:href", (d) => d.image)
        .attr("x", imgX)
        .attr("y", imgY)
        .attr("width", imgWidth)
        .attr("height", imgHeight)
        .call(drag(simulation));

    // const node = svg
    //     .append("g")
    //     .attr("fill", "currentColor")
    //     .attr("stroke", "#fff")
    //     .attr("stroke-opacity", 1)
    //     .attr("stroke-width", 1.5)
    //     .selectAll("circle")
    //     .data(nodes)
    //     .join("circle")
    //     .attr("id", (d) => cleanUpName(d.id))
    //     .attr("r", 5)
    //     .call(drag(simulation));

    // add hover effects to nodes
    node.on("mouseover", function (event, d) {
        updateAdjacencyOutline(this, "red", "red", graph);
        d3.select(`#${cleanUpName(d.id)}`)
            .attr("width", imgWidth * 3)
            .attr("height", imgHeight * 3)
            .attr("x", imgX * 3)
            .attr("y", imgY * 3);
        // add floating label next to each node
        tooltip
            .style("opacity", 1)
            .style("left", event.pageX + 20 + "px")
            .style("top", event.pageY + "px").html(`
                <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 5px">
                    <span class="text-center">${d.id}<span>  
                </div>`);
    }).on("mouseout", function (event, d) {
        updateAdjacencyOutline(this, "none", "#ccc", graph);
        d3.select(`#${cleanUpName(d.id)}`)
            .attr("width", imgWidth)
            .attr("height", imgHeight)
            .attr("x", imgX)
            .attr("y", imgY);
        tooltip.style("opacity", 0);
    });

    // animation logic

    function ticked() {
        link.attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

        node.attr("transform", (d) => {
            // restrict node coordinates to be within container boundaries
            const newX = restrictCoordinate(d.x, width, imgWidth, yOffset);
            const newY = restrictCoordinate(d.y, height, imgHeight, yOffset);
            d.x = newX; // important: update source data so that edges (links) can be updated
            d.y = newY;
            return "translate(" + newX + "," + newY + ")";
        });
    }

    // node drag logic
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = restrictCoordinate(
                event.x,
                width,
                imgWidth,
                yOffset
            );
            event.subject.fy = restrictCoordinate(
                event.y,
                height,
                imgHeight,
                yOffset
            );

            // update tooltip position while dragging
            tooltip
                .style("left", event.sourceEvent.pageX + 20 + "px")
                .style("top", event.sourceEvent.pageY + "px");
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    return svg.node();
}

// inserts graph svg into DOM
function insertGraph(nodes, links) {
    constructGraph(nodes, links).then((graph) =>
        document.querySelector("#network-container").appendChild(graph)
    );
}
