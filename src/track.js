import node from './node'

//this takes (some of) the JSON level data from Tiled and
//converts to an array that can be fed into makePipe
//there's surely a better way to do this, but I don't want to learn Tiled
const pipeKey = {
  "1":[4,0],
  "2":[3,0],
  "3":[2,0],
  "4":[1,0],
  "5":[0,0],
  "6":[4,1],
  "7":[3,1],
  "8":[2,1],
  "9":[0,1],
  "10":[4,2],
  "11":[3,2],
  "12":[2,2],
  "13":[4,3],
  "14":[3,3],
  "15":[2,3]
  }


const track = (lvl) => {
  const firstgid = lvl.tilesets.filter(tx=>tx.source==="pipes.tsx")[0].firstgid
  //console.log(firstgid)
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
        let thisNode = pipeKey[pipeArray[j*16 + i] - firstgid + 1]
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
