import { Sprite, degToRad} from 'kontra';
import { offset, gridSize } from './initialize';

let p1 = new Image();
let p2 = new Image();
let p3 = new Image();
let p4 = new Image();
let p5 = new Image();

p1.src = '../assets/img/p1.png';
p2.src = '../assets/img/p2.png';
p3.src = '../assets/img/p3.png';
p4.src = '../assets/img/p4.png';
p5.src = '../assets/img/p5.png';
let pipeTypes = [p1,p2,p3,p4,p5]

const makePipe = function(xpos, ypos, pipeType, orientation) {
  const pipe = Sprite({
    x: offset + gridSize*xpos,
    y: offset + gridSize*ypos,
    width: 32,
    height: 32,
    anchor: {x: 0.5, y: 0.5},
    image: pipeTypes[pipeType],
    rotation: degToRad(orientation)
  });
  pipe.pipeType = pipeType
  return pipe
}

export default makePipe;
