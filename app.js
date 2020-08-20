/* eslint-disable complexity */
import { load, TileEngine, dataAssets,GameLoop, initKeys,keyPressed} from 'kontra';


import player from './src/player'

import context from './src/initialize';
import bot from './src/bot'
import makeTrack from './src/makeTrack'


initKeys();

let moves = []
const goButton = document.getElementById('go')
const userInput = document.getElementById('userMoves')
const levelPick = document.getElementById('levelPick')

goButton.addEventListener('click',()=>{
  moves = userInput.value.split(',')
})

levelPick.addEventListener('click',(ev)=>{
  if(ev.target.tagName==="BUTTON"){
    console.log(ev.target.value)
  }
})
///Level Testing Code//////////////////////

///these levels and robot moves will be loaded/created dynamically later

let selectedLevel = 1
const levelNames = ['test','pipe2']
const levelObstacles = [
  // test.json obstacle locations in decorations layer
  [ //array; potentially other obstacles
    [ //array of obstacle locations
      {row: 4, column: 12},
      {row: 4, column: 13},
      {row: 4, column: 14},
      {row: 4, column: 15},
      {row: 5, column: 12},
      {row: 5, column: 13},
      {row: 5, column: 14},
      {row: 5, column: 15},
    ],
  ],
  // pipe2.json obstacle locations
  [
    [
      {row: 11, column: 5},
      {row: 11, column: 6},
      {row: 11, column: 7},
      {row: 11, column: 8},
      {row: 11, column: 9},
      {row: 11, column: 10},
      {row: 12, column: 5},
      {row: 12, column: 6},
      {row: 12, column: 7},
      {row: 12, column: 8},
      {row: 12, column: 9},
      {row: 12, column: 10},
    ]
  ]
]

const levelSwitches = [
  //test.json switch locations
  [
    {row: 7, column: 8}, //potentially others
    //{row: 1, column: 1}
  ],
  //pipe2.json switch locations
  [
    {row: 2, column: 13}, //potentially others
  ]
]

//import level1 from './assets/levels/pipe1' //Test Lvl 1
//import level2 from './assets/levels/pipe2' //Test Lvl 1

//declares the level to be built by the tile engine globally so that the game loop can access it

//let levelTest=null;
let levelTest, pipes, nodes
//const level = level1
//const {pipes,nodes} = makeTrack(level)

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

    //check each switch
    const switches = levelSwitches[selectedLevel]
    let swIx = -1
    switches.forEach( (sw,ix) => {
      const matchRow = bot.currentNode.gridRow === sw.row
      const matchCol = bot.currentNode.gridCol === sw.column
      if(matchRow && matchCol) {swIx = ix}
    })
    if(swIx !== -1) {
      const obsTilesToClear = levelObstacles[selectedLevel][swIx]
      obsTilesToClear.forEach(tile=>{
        levelTest.setTileAtLayer('decorations',{row:tile.row, col: tile.column}, 0)
      })
    }
    // if(bot.currentNode===99) {
    //   for(let r = 11; r <= 12; r++) {
    //     for(let c = 5; c <= 10; c++) {
    //       levelTest.setTileAtLayer('decorations',{row:r, col: c}, 0)
    //     }
    //   }
    // }
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
  "../assets/tile/test.json",
  "../assets/tile/pipe2.json",
).then(assets=>{load()}).then((assets) => {

/* the tile engine is looking for an image property within the tilesets that doesn't exist.
  You MUST add it to the JSON, the value is the path for the original tileset png.
  Right now it is hardcoded but we can probably update it programatically as the levels change
  */

  levelTest=TileEngine(dataAssets[`../assets/tile/${levelNames[selectedLevel]}.json`]);
  ({ pipes, nodes } = makeTrack({
    pipes: levelTest.layers.filter(layer=>layer.name==="pipes")[0].data,
    nodes: levelTest.layers.filter(layer=>layer.name==="nodes")[0].data
  }))

  loop.start();
});
