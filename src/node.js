import { offset, gridSize } from './initialize';

//each node has a nodeType and orientation that provides possible moves to Bot
const node = function(xpos, ypos, nodeType, pipeType) {
  return {
    x: offset + gridSize*xpos,
    y: offset + gridSize*ypos,
    gridCol: xpos,
    gridRow: ypos,
    nodeType: nodeType,
    pipeType: pipeType
  }
}

export default node;
