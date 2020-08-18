import {Sprite, degToRad} from 'kontra';
import { offset, rows, gridSize } from './initialize';

let image = new Image();
image.src = '../assets/img/bot.png';

let bot = Sprite({
  x: 0+offset,
  y: (rows*gridSize)-offset,
  dx: 2,
  width: 32,
  height: 32,
  anchor:  {x: 0.5, y: 0.5},
  image: image,
});


bot.heading = 'E';
bot.speed = 2;
bot.currentMoveIndex = -1;

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
  if(this.currentMoveIndex > moves.length - 1 ) {
    this.currentMoveIndex = 0
  }
  // eslint-disable-next-line complexity
  nodes.forEach((node) => {
    //check if the absolute x and y pos of the bot is the same as a node
    if(this.x===node.x && this.y===node.y)
    {
      //freeze if on the winning node
      if (node.nodeType === 99) {
        this.speed = 0
        moves.splice(0,moves.length)
      }
      //start a move loop
      if (moves[this.currentMoveIndex]==='LOOP') {
        moves.splice(0,this.currentMoveIndex+1)
        this.currentMoveIndex = 0
      }
      //go to the next/first move
      this.currentMoveIndex++;
      if (moves[this.currentMoveIndex]==='L') {
        this.rotate('L')
        this.currentMoveIndex++
      }
      if (moves[this.currentMoveIndex]==='R') {
        this.rotate('R')
        this.currentMoveIndex++
      }
      if (moves[this.currentMoveIndex]==='B') {
        //move against direction of heading
        this.speed = -1*(Math.abs(this.speed))
      }
      if (moves[this.currentMoveIndex]==='F') {
        //move with direction of heading
        this.speed = (Math.abs(this.speed))
      }
    }
  })

  //update bot position based on heading
  if(this.heading==='E') this.x+=this.speed
  if(this.heading==='W') this.x-=this.speed
  if(this.heading==='N') this.y-=this.speed
  if(this.heading==='S') this.y+=this.speed
}

export default bot;
