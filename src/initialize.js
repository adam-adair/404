// 49,50,51,52,53,54,0,0,0,0,0,0,0,0,0,0,
// 6R49,6R51,cR51,aR51,6R53,0,0,0,0,0,0,0,0,0,0,0,
// cR53,aR53,6R52,cR52,aR52,0,0,0,0,0,0,0,0,0,0,0,
import {init} from 'kontra';

let {canvas, context}=init('game');
export {canvas, context}

export const
  offset = 16,
  gridSize = 32,
  rows = 16,
  invalidPipeTypes = {
    S: ['49','52','aR51','cR53','aR53','6R52','cR52'],
    E: ['51','53','6R49','aR53','6R52','cR52','aR52'],
    W: ['52','6R49','cR51','6R53','cR53','6R52','aR52'],
    N: ['49','52','53','6R51','6R53','cR52','aR52']},
 initialTileHeadings = {
    '52': 'E',
    '6R52': 'N',
    'aR52': 'S',
    'cR52': 'W'
  },
  winNodeGID = 48,
  openGateGID = 0,
  closedGateGID = 38,
  inactivePlayerSwitchGID = 37,
  activePlayerSwitchGID = 37,
  inactiveBotSwitchGID = 42,
  activeBotSwitchGID = 41,
  levelFiller = [45,44,46]


