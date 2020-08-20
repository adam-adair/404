import { load, TileEngine, dataAssets,GameLoop, initKeys,keyPressed} from 'kontra';


import player from './src/player'

import context from './src/initialize';
import bot from './src/bot'
import makeTrack from './src/makeTrack'


initKeys();

///Level Testing Code//////////////////////

///these levels and robot moves will be loaded/created dynamically later



import level1 from './assets/levels/pipe1' //Test Lvl 1
import level2 from './assets/levels/pipe2' //Test Lvl 1

//declares the level to be built by the tile engine globally so that the game loop can access it

let levelTest=null;

const moves1 = [
  'F','L','F','L','F',
  'F','R','F','R','F'] //test moves for level 1
const moves2 = [
  'F','L','F','L','F',
  'LOOP','F','R'
]
const level = level1
const moves = moves1

const {pipes,nodes} = makeTrack(level)
///////////////////////////////////////

const loop = GameLoop({
  context: context, // create the main game loop
  update: function() {

    ///// player keyboard controls. collision test prevents player from moving into obstacle tiles

    if(keyPressed('right')){
      player.x+=2;
      if(levelTest.layerCollidesWith('decorations',player))player.x-=2;

      player.playAnimation('walkRight');
    } else
    if(keyPressed('left')){
      player.x+=-2;
      if(levelTest.layerCollidesWith('decorations',player))player.x-=-2;
      player.playAnimation('walkLeft');
    }else
    if(keyPressed('up')){
      player.y-=2;
      if(levelTest.layerCollidesWith('decorations',player))player.y+=2;
      player.playAnimation('walkUp');
    }else
    if(keyPressed('down')){
      player.y+=2;
      if(levelTest.layerCollidesWith('decorations',player))player.y-=2;
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
    levelTest.render();
    player.render();

    //render each pipe and node
    /* the tile engine can render the pipes and nodes on its own so we don't need to render them separately anymore.
    except it looks like the horizontal pipes don't come from the tileset, so it doesn' know how to render them*/

   pipes.forEach(pipe=>pipe.render())
   nodes.forEach(node=>node.render())

    bot.render();

  }
});

//// all images, tiles, spritesheets, etc. must be loaded prior to starting the game loop
load("../assets/img/rpg_sprite_walk.png",
  "../assets/img/pipes.png",
  "../assets/img/test.png",
  "../assets/img/node.png",
  "../assets/img/nodeHome.png",
  "../assets/tile/test.tsx",
  "../assets/tile/node.tsx",
  "../assets/tile/nodeHome.tsx",
  "../assets/tile/pipes.tsx",
  "../assets/tile/test.json"
).then(assets=>{load()}).then((assets) => {

/* the tile engine is looking for an image property within the tilesets that doesn't exist.
  You MUST add it to the JSON, the value is the path for the original tileset png.
  Right now it is hardcoded but we can probably update it programatically as the levels change
  */

  levelTest=TileEngine(dataAssets["../assets/tile/test.json"]);
loop.start();
});
