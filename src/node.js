import { offset, gridSize } from './initialize';

//each node has a nodeType and orientation that provides possible moves to Bot
const node = function(xpos, ypos, nodeType, nodeOrientation) {
  return {
    x: offset + gridSize*xpos,
    y: offset + gridSize*ypos,
    gridCol: xpos,
    gridRow: ypos,
    nodeType: nodeType,
    nodeOrientation: nodeOrientation
  }
}

export default node;
