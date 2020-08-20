import { load, TileEngine, dataAssets } from "kontra";
import context from "../../src/initialize";

function levelBuilder() {
  return load(
    "../assets/img/test.png",
    "../assets/img/pipes.png",
    "../assets/img/node.png",
    "../assets/img/nodeHome.png",
    "../assets/tile/test.tsx",
    "../assets/tile/node.tsx",
    "../assets/tile/nodeHome.tsx",
    "../assets/tile/pipes.tsx",
    "../assets/tile/test.json"
  ).then((assets) => TileEngine(dataAssets["../assets/tile/test.json"]));
}
export default levelBuilder;
