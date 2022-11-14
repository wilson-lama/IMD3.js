"use strict";

/**
 * a helper function that cleans up card name
 */
function cleanUpName(originalName) {
    let cleanName = originalName.replaceAll(" ", "_");
    cleanName = cleanName.replaceAll("-", "_");
    cleanName = cleanName.replaceAll(".", "_");
    return cleanName;
}

/**
 * a helper function that return an adjusted cooridinate
 * to restrict nodes within the container's boundaries
 *
 * coord: x | y
 * bound: width | height (container's)
 * padding: usually the width/height of the node
 */
function restrictCoordinate(coord, bound, padding, yOffset = 0) {
    return Math.max(
        (-1 * bound) / 2 + padding + yOffset,
        Math.min(bound / 2 - padding, coord)
    );
}

/**
 * a helper function that creates an id for an edge between two vertices
 */
function makeEdgeId(v1, v2) {
    return [v1, v2].sort().join("-");
}

/**
 * a helper function that changes outline color of current node and its adjacent nodes
 */
function updateAdjacencyOutline(element, nodeColor, edgeColor, graph) {
    const outlineVal =
        nodeColor !== "none" ? `medium solid ${nodeColor}` : "none";

    // modify current element's outline
    d3.select(element).attr("style", `outline: ${outlineVal};`);

    // get a list of adjacent vertex id's and modify their outlines
    const adjList = graph[element.id];

    adjList.forEach((id) => {
        d3.select(document.querySelector(`#${id}`)).attr(
            "style",
            `outline: ${outlineVal};`
        );
    });

    // make a list of edge class names and modify their color
    const edges = adjList.map((id) => makeEdgeId(element.id, id));
    edges.forEach((cls) => {
        document.querySelectorAll(`.${cls}`).forEach((element) => {
            d3.select(element).attr("stroke", edgeColor);
        });
    });
}

function getViewportWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function getViewportHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}
