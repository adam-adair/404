import {Sprite, degToRad} from 'kontra';
import { offset, rows, gridSize } from './initialize';

const botSprite = (img) => {

  let bot = Sprite({
    x: 0+offset,
    y: (rows*gridSize)-offset,
    dx: 2,
    width: 32,
    height: 32,
    anchor:  {x: 0.5, y: 0.5},
    image: img,
  });

  const invalidDirs = {
    S: [[4,1],[3,1],[2,1],[0,1],[4,2],[3,2],[4,3]],
    E: [[4,0],[0,0],[4,2],[3,2],[2,2],[4,3],[3,3]],
    W: [[4,0],[3,0],[2,0],[0,0],[4,1],[3,1],[4,2]],
    N: [[4,0],[3,0],[4,1],[0,1],[4,3],[3,3],[2,3]]
  }

  bot.heading = 'E';
  bot.baseSpeed = 2;
  bot.speed = 0;
  bot.currentMoveIndex = 0;
  //bot.currentNode = 1

  bot.rotate = function(dir){
    const dirs = ['N','E','S','W']
    const curDir = dirs.indexOf(this.heading)
    if(dir==='R'){
      this.heading = dirs[(curDir+1)%4]
      this.rotation += degToRad(90)
    } else {
      this.heading = dirs[(curDir+3)%4]
      this.rotation -= degToRad(90)
    }
  }

  bot.update = function(nodes, moves){
    let nodeSet = 0
    // eslint-disable-next-line complexity
    nodes.forEach((node) => {
      //check if the absolute x and y pos of the bot is the same as a node
      if(this.x===node.x && this.y===node.y) {
        //if you're on a node, stop
        nodeSet = 1
        bot.currentNode = node
        //console.log(bot.currentNode)
        this.speed = 0

        //if you're at the end of the level, stop and wait
        if (node.nodeType === 99) {
          this.speed = 0
          moves.splice(0,moves.length)
        }

        if (moves[this.currentMoveIndex]==='F') {
          //only go forward if the node type and orientation allows
          const badNodes = invalidDirs[this.heading]
          const numBadNodes = badNodes.filter(badNode=>{
            return badNode[0]===node.nodeType && badNode[1]===node.nodeOrientation}).length
          if(numBadNodes===0) this.speed = this.baseSpeed
        }

        if (moves[this.currentMoveIndex]==='L') {
          this.rotate('L')
        }
        if (moves[this.currentMoveIndex]==='R') {
          this.rotate('R')
        }
        // after move is processed, increment move counter
        //to do this, first check if you're at the end
        if(this.currentMoveIndex >= moves.length - 1){
          //if there's a loop, go back to the start of the loop
          if(moves.includes('LOOP')) {
            this.currentMoveIndex = moves.indexOf('LOOP')
          } else {
            //otherwise, go back to the first index
            this.currentMoveIndex = 0
          }
        } else {
          //if you're not at the end of the moves, go to next
          this.currentMoveIndex++
        }
        //don't check other nodes
      } else {bot.currentNode = nodeSet === 1 ? bot.currentNode : {gridRow: -1, gridCol: -1}}
    })

    //update bot position based on heading
    if(this.heading==='E') this.x+=this.speed
    if(this.heading==='W') this.x-=this.speed
    if(this.heading==='N') this.y-=this.speed
    if(this.heading==='S') this.y+=this.speed
  }

  return bot
}

export default botSprite;
