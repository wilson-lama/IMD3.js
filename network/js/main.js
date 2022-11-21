"use strict";

let nodesAll, linksAll;

window.addEventListener("load", async () => {
    // import data
    const dataRes = await fetch("data/leo1.json");
    const data = await dataRes.json();

    nodesAll = data["nodes"];
    linksAll = data["links"];

    // filter first - raw data too big
    const output = filterLinksNodes(
        nodesAll,
        linksAll,
        (d) =>
            d.source === "Leonardo DiCaprio" || d.target === "Leonardo DiCaprio"
    );

    // assume this is the complete dataset
    nodesAll = output[0];
    linksAll = output[1];

    // filter
    makeFilter(linksAll);

    // graph
    await insertGraph(nodesAll, linksAll);
});

function makeFilter(links) {
    // get distinct link values (edge weights)
    const valueSet = new Set();
    links.forEach((d) => {
        valueSet.add(d.value);
    });
    const valueList = [...valueSet].sort((a, b) => b - a);

    // make options for select
    const selectFilter = document.querySelector("#select-filter");

    valueList.forEach((d) => {
        const option = document.createElement("option");
        option.innerHTML = d;
        // insert option into DOM
        selectFilter.append(option);
    });

    // on change - re-render graph
    selectFilter.addEventListener("change", async () => {
        let predicate, nodes, links;
        if (selectFilter.value === "All") {
            predicate = (d) => true;
        } else {
            predicate = (d) => d.value == selectFilter.value;
        }
        // filter data based on select filter value
        const output = filterLinksNodes(nodesAll, linksAll, predicate);

        nodes = output[0];
        links = output[1];

        // re-render graph
        document.querySelector("#network-container").innerHTML = "";

        await insertGraph(nodes, links);
    });
}
