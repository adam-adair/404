import {Sprite} from 'kontra';
import { offset, gridSize } from './initialize';

let img = new Image();
let imgH = new Image();
img.src = '../assets/img/node.png';
imgH.src = '../assets/img/nodeHome.png';

//each node has a nodeType and orientation that provides possible moves to Bot
const makeNode = function(xpos, ypos, nodeType, nodeOrientation) {
  let nodeImg = img
  if(nodeType === 99) nodeImg = imgH
  const node = Sprite({
    x: offset + gridSize*xpos,
    y: offset + gridSize*ypos,
    width: 32,
    height: 32,
    anchor: {x: 0.5, y: 0.5},
    image: nodeImg
  });
  node.nodeType = nodeType
  node.nodeOrientation = nodeOrientation
  return node
}

export default makeNode;
