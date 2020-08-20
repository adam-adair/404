
import {Sprite, SpriteSheet} from 'kontra';
import context from './initialize';

let image = new Image();
image.src = '../assets/img/rpg_sprite_walk.png';


  let spriteSheet = SpriteSheet({
    image: image,
    frameWidth: 24,
    frameHeight: 32,
    animations: {
      // create a named animation: walk
      walkDown: {
        frames: '0..7',  // frames 0 through 9
        frameRate: 30
      },
      walkUp: {
        frames: '8..15',  // frames 0 through 9
        frameRate: 30
      },
      walkLeft: {
        frames: '16..23',  // frames 0 through 9
        frameRate: 30
      },
      walkRight: {
        frames: '24..31',  // frames 0 through 9
        frameRate: 30
      },
      idle: {
        frames: 0,  // frames 0 through 9
        loop:false
      }
    }
  });


  let player = Sprite({
    x: 100,        // starting x,y position of the sprite
    y: 450,
    animations:spriteSheet.animations,
    context: context
  });


  export default player;
