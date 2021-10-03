// Please run your solution from this file

import { prepareData, renderData } from "./solution";

fetch("https://api.spacexdata.com/v3/launches/past")
  .then((res) => res.json())
  .then((res) => {
    const parsedResponse = prepareData(res);
    renderData(parsedResponse);
  })
  .catch((err) => console.error(err));

console.log("Hello from %csrc/index.js", "font-weight:bold");
