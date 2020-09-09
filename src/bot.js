import {Sprite, SpriteSheet} from 'kontra';
import { offset, invalidPipeTypes, context } from './initialize';

const dirs = ['N','E','S','W']

export  default function makeBot(botImage){

  const botSpriteSheet= SpriteSheet({
    image:botImage,
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      E: {
        frames: '6..7',
        frameRate: 5
      },
      W: {
        frames: '8..9',
        frameRate: 5
      },
      N: {
        frames: '10..11',
        frameRate: 5
      },
      S: {
        frames: '12..13',
        frameRate: 5
      },
      C: {
        frames: [6,12,8,10],
        frameRate: 10
      }
    }
  });


  let bot = Sprite({
  x: 0,
  y: 0,
  anchor:  {x: 0.5, y: 0.5},
  animations:botSpriteSheet.animations,
  context: context,
  baseSpeed: 2,
  speed: 0,
  currentMoveIndex: 0,
  baseTimer:30, //change this to change how long the bot pauses at nodes
  timer:30,
  // offset start position to look better on the track; must adjust for this in node checking below
  placeAtStart(startObject){
    this.x=startObject.x + offset;
    this.y=startObject.y + offset/4
    this.heading = startObject.heading
    this.playAnimation(dirs[dirs.indexOf(this.heading)])
    this.currentMoveIndex=0;
    this.timer=30
  },
  rotate(dir) {
    const curDir = dirs.indexOf(this.heading)
    if(dir==='R'){
      this.heading = dirs[(curDir+1)%4]
      //this.rotation += degToRad(90)
      this.playAnimation(dirs[(curDir+1)%4])
    } else {
      this.heading = dirs[(curDir+3)%4]
      //this.rotation -= degToRad(90)
      this.playAnimation(dirs[(curDir+3)%4])
    }
  },
  updateMove(moves){
// after move is processed, increment move counter
          //to do this, first check if you're at the end

          if(this.currentMoveIndex >= moves.length - 1){
            //if there's a loop, go back to the start of the loop
            if(moves.includes('LO')) {

              document.getElementById(`m${this.currentMoveIndex}`).classList.remove("h")
              this.currentMoveIndex = moves.indexOf('LO')
              document.getElementById(`m${this.currentMoveIndex}`).classList.add("h")
            } else {

              //otherwise, go back to the first index
              this.highlightNext();
              this.currentMoveIndex = 0;

            }
          } else {

            //if you're not at the end of the moves, go to next
            if(this.currentMoveIndex>0){
              this.highlightNext()
            }
            this.currentMoveIndex++;

          }
  },
  highlightNext(){
    document.getElementById(`m${this.currentMoveIndex-1}`).classList.remove("h")
    document.getElementById(`m${this.currentMoveIndex}`).classList.add("h")
  },
  pauseCheck(moves,direction){

    ///// highlight the move, start a timer. at end of timer rotate(if move is rotate), then go to next move
    ///// this makes the bot pause on Loop for the same time that it pauses to rotate. if we want separate durations we'll need create a different function.
    if (moves[this.currentMoveIndex]===direction) {
      if(this.timer===this.baseTimer-1){ //timer ticks for the first time when bot is at the node BEFORE, so highlighting logic needs to trigger at 1 less
        this.highlightNext();
      }
      if(this.timer===0){
        if(direction!=="LO") this.rotate(direction)
        this.updateMove(moves)
        this.timer=this.baseTimer
      } else this.timer--
    }

  },
  process(nodes, moves){
    let nodeSet = 0


    // eslint-disable-next-line complexity
    nodes.forEach((node) => {
      //check if the absolute x and y pos of the bot is the same as a node

      ///adjust for offset in original placement
      if(this.x === node.x && this.y + 3*offset/4 === node.y) {

        //this needs to be here in order to highlight the starting move, otherwise the highlight will skip to the second move, all the other highlighter changes happen in this.updateMove and this.pauseCheck
        if(this.currentMoveIndex===0){
          document.getElementById(`m0`).classList.add("h")
          document.getElementById(`m${moves.length-1}`).classList.remove("h")
        }

        //if you're on a node, stop
        nodeSet = 1
        this.currentNode = node

        this.speed = 0

          //if you're at the end of the level, stop and wait
          if (node.nodeType === 99) {
            this.speed = 0
            moves.splice(0,moves.length)
          }

          if (moves[this.currentMoveIndex]==='F') {
            //only go forward if the node type and orientation allows

            const badPipes = invalidPipeTypes[this.heading]
            const numBadPipes = badPipes.filter(badPipe=>badPipe===node.pipeType).length
            if(numBadPipes===0) this.speed = this.baseSpeed
            this.updateMove(moves);
          }

         this.pauseCheck(moves,'L');
         this.pauseCheck(moves,'R');
         this.pauseCheck(moves,'LO');

          //don't check other nodes
        } else {this.currentNode = nodeSet === 1 ? this.currentNode : {gridRow: -1, gridCol: -1}}
      })

      //update bot position based on heading
      if(this.heading==='E') this.x+=this.speed;
      if(this.heading==='W') this.x-=this.speed;
      if(this.heading==='N') this.y-=this.speed;
      if(this.heading==='S') this.y+=this.speed;
    }
  });

  return bot

}
