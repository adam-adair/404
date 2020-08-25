
import {init} from 'kontra';

let {canvas, context}=init('game');
export {canvas, context}

export const
  offset = 16,
  gridSize = 32,
  rows = 16,
  invalidPipeTypes = {
    S: [37,43,44,48,49,51,53],
    E: [39,41,44,47,49,52,53],
    W: [40,43,44,47,48,50,52],
    N: [37,39,40,42,43,52,53]},
 initialTileHeadings = {
    43: 'E',
    44: 'N',
    52: 'S',
    53: 'W'
  },
  winNodeGID = 35

