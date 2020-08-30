
import {Sprite, SpriteSheet} from 'kontra';
import {context} from './initialize';

export default function makePlayer(playerImage){


  const playerSpriteSheet= SpriteSheet({
  image:playerImage,
  frameWidth: 24,
  frameHeight: 32,
  animations: {
    // create a named animation: walk
    walkDown: {
      frames: '0..3',  // frames 0 through 9
      frameRate: 9
    },
    walkUp: {
      frames: '4..7',  // frames 0 through 9
      frameRate: 9
    },
    walkLeft: {
      frames: '8..11',  // frames 0 through 9
      frameRate: 9
    },
    walkRight: {
      frames: '12..15',  // frames 0 through 9
      frameRate: 9
    },
    idle: {
      frames: 0,  // frames 0 through 9
      loop:false
    }
  }
});

return Sprite({
  x: 5,        // starting x,y position of the sprite
  y: 5,
  // scaleX:1.25,
  // scaleY:1.25,
  animations:playerSpriteSheet.animations,
  context: context,
  placeAtStart(startObject){
    this.x=startObject.x;
    this.y=startObject.y
  }
})


}
