import { mainGraph } from "./graphs/main/mainGraph.ts";

console.log("generating graph image");

const drawableGraph = mainGraph.getGraph();
const image = await drawableGraph.drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();
const png = new Uint8Array(arrayBuffer);

const savePath = "static/graph.png";

await Deno.writeFile(savePath, png);

console.log(`graph image generated and saved to ${savePath}`);
