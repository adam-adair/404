
import {init} from 'kontra';

let {canvas, context}=init('game');
export {canvas, context}

export const
  offset = 16,
  gridSize = 32,
  rows = 16,
  invalidPipeTypes = {
    S: [10,16,17,21,22,24,26],
    E: [12,14,17,20,22,25,26],
    W: [13,16,17,20,21,23,25],
    N: [10,12,13,15,16,25,26]},
 initialTileHeadings = {
    16: 'E',
    17: 'N',
    25: 'S',
    26: 'W'
  },
  winNodeGID = 8,
  openGateGID = 0,
  closedGateGID = 3,
  inactivePlayerSwitchGID = 2,
  activePlayerSwitchGID = 2,
  inactiveBotSwitchGID = 27,
  activeBotSwitchGID = 18

