import makePipe from './makePipe'
import makeNode from './makeNode'

//this takes (some of) the JSON level data from Tiled and
//converts to an array that can be fed into makePipe
//there's surely a better way to do this, but I don't want to learn Tiled
const pipeKey = {
  "1":[4,0],
  "2":[3,0],
  "3":[2,0],
  "4":[1,0],
  "5":[0,0],
  "1610612737":[4,1],
  "1610612738":[3,1],
  "1610612739":[2,1],
  "1610612741":[0,1],
  "3221225473":[4,2],
  "3221225474":[3,2],
  "3221225475":[2,2],
  "2684354561":[4,3],
  "2684354562":[3,3],
  "2684354563":[2,3]
  }


const makeTrack = (lvl) => {
  const pipeArray = lvl.pipes
  const nodeArray = lvl.nodes
  let pipes = []
  let nodes = []
  for(let j = 0; j < 16; j++) {
    for(let i = 0; i < 16; i++){
      //create an array of pipes based on the JSON output from Tiled
      if(pipeArray[j*16 + i] !== 0) {
        const thisPipe = pipeKey[pipeArray[j*16 + i]]
        const pipe = makePipe(i,j,thisPipe[0],thisPipe[1]*-90);
        pipes.push(pipe)
      }
      //create an array of nodes based on the JSON output from Tiled
      //give them nodeTypes for logic that limits movement options
      //or recognizes winning condition at a particular node
      if(nodeArray[j*16 + i] !== 0) {
        let thisNode = pipeKey[pipeArray[j*16 + i]]
        let nt = thisNode[0]
        //nodeType 99 is the 'winning node' for the level
        if(nodeArray[j*16 + i] === 7) nt = 99
        nodes.push(makeNode(i,j,nt, thisNode[1]))
      }
    }
  }
  return {pipes, nodes}
}

export default makeTrack
