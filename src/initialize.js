
import {init} from 'kontra';

let {canvas, context}=init('game');
export const offset = 16
export const gridSize = 32
export const rows = 16
export const invalidPipeTypes = {
  S: [37,43,44,48,49,51,53],
  E: [39,41,44,47,48,52,53],
  W: [40,43,44,47,48,50,52],
  N: [37,39,40,42,43,52,53]
}

export const winNodeGID = 35

export {context,canvas};
