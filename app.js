import { GameLoop, initKeys,keyPressed, TileEngine} from 'kontra';
import player from './src/player'
import context from './src/initialize';
import bot from './src/bot'
import makeTrack from './src/makeTrack'
//import level99 from './src/tileEngine'

initKeys();

///Level Testing Code//////////////////////

///these levels and robot moves will be loaded/created dynamically later

import level1 from './assets/levels/pipe1' //Test Lvl 1
import level2 from './assets/levels/pipe2' //Test Lvl 1
const moves1 = [
  'F','L','F','L','F',
  'F','R','F','R','F'] //test moves for level 1
const moves2 = [
  'F','L','F','L','F',
  'LOOP','F','R'
]
const level = level2
const moves = moves2

const {pipes,nodes} = makeTrack(level)
///////////////////////////////////////

const loop = GameLoop({
  context: context, // create the main game loop
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

    //update the bot based on level nodes and move list
    bot.update(nodes,moves);
  },
  render: function() { // render the game state
   // level99.renderLayer('ground');
    player.render();

    //render each pipe and node
    pipes.forEach(pipe=>pipe.render())
    nodes.forEach(node=>node.render())

    bot.render();

  }
});

loop.start();
