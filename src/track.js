import node from './node'

//this takes (some of) the JSON level data from Tiled and
//converts to an array that can be fed into makePipe
//there's surely a better way to do this, but I don't want to learn Tiled
const pipeKey = {
  "37":[4,0],
  "38":[3,0],
  "39":[2,0],
  "40":[1,0],
  "41":[0,0],
  "42":[4,1],
  "43":[3,1],
  "44":[2,1],
  "53":[0,1],
  "47":[4,2],
  "48":[3,2],
  "49":[2,2],
  "50":[4,3],
  "51":[3,3],
  "52":[2,3]
  }


const track = (lvl) => {
  const pipeArray = lvl.layers.filter(layer=>layer.name==="pipes")[0].data
  const nodeArray = lvl.layers.filter(layer=>layer.name==="nodes")[0].data
  console.log(pipeArray)
  let nodes = []
  for(let j = 0; j < 16; j++) {
    for(let i = 0; i < 16; i++){
      //create an array of nodes based on the JSON output from Tiled
      //give them nodeTypes for logic that limits movement options
      //or recognizes winning condition at a particular node
      if(nodeArray[j*16 + i] !== 0) {
        console.log(pipeArray[j*16 + i],nodeArray[j*16 + i],j,i)
        let thisNode = pipeKey[pipeArray[j*16 + i]]
        let nt = thisNode[0]
        //nodeType 99 is the 'winning node' for the level
        if(nodeArray[j*16 + i] === 2) nt = 99
        nodes.push(node(i,j,nt, thisNode[1]))
      }
    }
  }
  return nodes
}

export default track
