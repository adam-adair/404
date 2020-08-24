import {Sprite, SpriteSheet, degToRad} from 'kontra';
import { offset, rows, gridSize, invalidPipeTypes, context } from './initialize';

const dirs = ['N','E','S','W']
const anims = ["moveNorth","moveEast","moveSouth","moveWest"]

export  default function makeBot(botImage){

  const botSpriteSheet= SpriteSheet({
    image:botImage,
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      moveEast: {
        frames: '0..1',
        frameRate: 5
      },
      moveWest: {
        frames: '2..3',
        frameRate: 5
      },
      moveNorth: {
        frames: '4..5',
        frameRate: 5
      },
      moveSouth: {
        frames: '6..7',
        frameRate: 5
      }
    }
  });


  let bot = Sprite({
  x: 0,
  y: 0,
 // dx: 2,
 // width: 32,
 // height: 32,
  anchor:  {x: 0.5, y: 0.5},
 // image: botImage,
  animations:botSpriteSheet.animations,
  context: context,

  // offset start position to look better on the track; must adjust for this in node checking below
  placeAtStart(startObject){
    this.x=startObject.x + offset;
    this.y=startObject.y + offset/4
    this.heading = startObject.heading
    this.playAnimation(anims[dirs.indexOf(this.heading)])
  }
});

  //bot.heading = 'E';
  bot.baseSpeed = 2;
  bot.speed = 0;
  bot.currentMoveIndex = 0;
  //bot.currentNode = 1

  bot.rotate = function(dir){

    const curDir = dirs.indexOf(this.heading)
    if(dir==='R'){
      this.heading = dirs[(curDir+1)%4]
      //this.rotation += degToRad(90)
      this.playAnimation(anims[(curDir+1)%4])
    } else {
      this.heading = dirs[(curDir+3)%4]
      //this.rotation -= degToRad(90)
      this.playAnimation(anims[(curDir+3)%4])
    }
  }


bot.process = function(nodes, moves){
  let nodeSet = 0
   // eslint-disable-next-line complexity
  nodes.forEach((node) => {
    //check if the absolute x and y pos of the bot is the same as a node

    ///adjust for offset in original placement
    if(this.x === node.x && this.y + 3*offset/4 === node.y) {
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
          const badPipes = invalidPipeTypes[this.heading]
          const numBadPipes = badPipes.filter(badPipe=>badPipe===+node.pipeType).length
          if(numBadPipes===0) this.speed = this.baseSpeed
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
    if(this.heading==='E') this.x+=this.speed;
    if(this.heading==='W') this.x-=this.speed;
    if(this.heading==='N') this.y-=this.speed;
    if(this.heading==='S') this.y+=this.speed;
  }
  return bot
}
