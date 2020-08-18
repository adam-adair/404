import {init, GameLoop, initKeys,keyPressed, TileEngine} from 'kontra';
import player from './src/player'
//import level99 from './src/tileEngine'


initKeys();

const loop = GameLoop({  // create the main game loop
  update: function() {
    if(keyPressed('right')){
      player.x+=2;
      player.playAnimation('walkRight');
    } else
    if(keyPressed('left')){
      player.x+=-2;
      player.playAnimation('walkLeft');
    }else
    if(keyPressed('up')){
      player.y+=-2;
      player.playAnimation('walkUp');
    }else
    if(keyPressed('down')){
      player.y+=2;
      player.playAnimation('walkDown');
    }else
    {
      player.playAnimation('idle');
    }// update the game state
    player.update();


  },
  render: function() { // render the game state
   // level99.renderLayer('ground');
    player.render();
  }
});

loop.start();
