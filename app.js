import {GameLoop, initKeys,keyPressed, TileEngine} from 'kontra';
import player from './src/player'
import context from './src/initalize';
//import level99 from './src/tileEngine'

initKeys();

const loop = GameLoop({
  context:context, // create the main game loop
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
    //level99.render();
    player.render();
  }
});

loop.start();
