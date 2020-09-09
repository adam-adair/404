import node from './node'
import { winNodeGID } from './initialize';

const track = (lvl) => {
  const pipeArray = lvl.l.filter(layer=>layer.n==="p")[0].data
  const nodeArray = lvl.l.filter(layer=>layer.n==="n")[0].data
  let nodes = []
  for(let j = 0; j < 16; j++) {
    for(let i = 0; i < 16; i++){
      //create an array of nodes based on the JSON output from Tiled
      //give them nodeTypes for logic that limits movement options
      //or recognizes winning condition at a particular node
      if(nodeArray[j*16 + i] !== 0) {
        let pipeType = pipeArray[j*16 + i]
        let nodeType = nodeArray[j*16 + i]
        //nodeType 99 is the 'winning node' for the level
        if(nodeArray[j*16 + i] === winNodeGID) nodeType = 99
        nodes.push(node(i,j,nodeType, pipeType))
      }
    }
  }
  return nodes
}

export default track
