"use strict";

window.addEventListener("load", async () => {
    // import data
    const dataRes = await fetch("data/leo.json");
    const data = await dataRes.json();

    const nodes = data["nodes"];
    const links = data["links"];

    // filter first - raw data too big
    const links1 = links.filter(
        (d) =>
            d.source === "Leonardo DiCaprio" || d.target === "Leonardo DiCaprio"
    );

    const nodesSet = new Set();
    links1.forEach((d) => {
        nodesSet.add(d.source);
        nodesSet.add(d.target);
    });
    const nodes1 = nodes.filter((d) => nodesSet.has(d.id));

    // graph
    await insertGraph(nodes1, links1);
});
