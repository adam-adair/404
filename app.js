/* eslint-disable no-use-before-define */
/* eslint-disable complexity */

//////////////  IMPORTS  ////////////////////////////////////////////////////////////

import {
  load,
  TileEngine,
  dataAssets,
  imageAssets,
  GameLoop,
  initKeys,
  keyPressed,
  collides,
} from "kontra";
import { canvas, context, initialTileHeadings } from "./src/initialize";
import makePlayer from "./src/player";
import makeBot from "./src/bot";
import track from "./src/track";
import levels from "./assets/tile/parsed.allLevels.json"

/////////////////////////////////////////////////////////////////////////////////////

//////////////  GLOBAL VARS  ////////////////////////////////////////////////////////

let player,
  bot,
  currentLevel,
  currentLevelIx,
  levelTileEngine,
  levelTrack,
  playerStart,
  playerGoal,
  botStart,
  botGoal,
  levelSwitches,
  levelGates,
  moves,
  movesBank

  const imageAssetPaths=[
  './assets/img/boardArt.png',
  "./assets/img/rpg_sprite_walk.png",
  './assets/img/botSheet.png',
  ]

  const tilesetNames = ["boardArt.tsx"]

  const moveImage = {
    L: 'assets/img/turn.png',
    R: 'assets/img/turn.png',
    LOOP: 'assets/img/loop.png',
    F: 'assets/img/fwd.png'
  }
  currentLevelIx = 0

  currentLevel = levels[currentLevelIx]

  moves = [];

  movesBank = [];

/////////////////////////////////////////////////////////////////////////////////////

//////////////  EVENT LISTENERS  ////////////////////////////////////////////////////

//disable the brower from scrolling when pressing directional keys
// eslint-disable-next-line camelcase
const arrow_keys_handler = function (e) {
  switch (e.keyCode) {
    case 37:
    case 39:
    case 38:
    case 40: // Arrow key codes
      e.preventDefault();
      break; //prevent window scroll
    default:
      break; // do not block other keys
  }
};
window.addEventListener("keydown", arrow_keys_handler, false);

initKeys();

const controls = document.getElementById("controls");
const levelPick = document.getElementById("levelPick");

///this is for level testing///////
const buttonContainer = document.getElementById("buttonContainer");

levels.map((level,ix) => {
  const button = document.createElement('button')
  button.innerText = level.levelName
  button.value = ix
  buttonContainer.appendChild(button)
})
////////////

controls.addEventListener("click", (event) => {
  const clicked = event.target
  //start bot if not already running, grey out go
  if(clicked.id === 'botGo' && moves.length === 0) {
    moves = [...movesBank]
    clicked.className = 'faded'
  }
  //reset level, restore Go
  if(clicked.id === 'levelReset') {
    makeLevel(currentLevel)
    clicked.previousElementSibling.className = ''
  }
  //if you click a move bank box and sparky not running, splice out the move
  if(clicked.parentElement.className === 'moveBlock' && moves.length === 0) {
    movesBank.splice(+clicked.parentElement.id.slice(-1),1)
  }

  //if move bank isn't full and bot's not running, add move to movebank
  if(movesBank.length < 10 && moves.length === 0) {
    if(clicked.id === 'forward') movesBank.push('F')
    if(clicked.id === 'turnLeft') movesBank.push('L')
    if(clicked.id === 'turnRight') movesBank.push('R')
    if(clicked.id === 'loop') movesBank.push('LOOP')
  }
  redrawControls();
});

levelPick.addEventListener("click", (ev) => {
  if (ev.target.tagName === "BUTTON") {
    moves = []
    currentLevelIx = +ev.target.value
    currentLevel = levels[ev.target.value]
    makeLevel(levels[ev.target.value])
  }
});

/////////////////////////////////////////////////////////////////////////////////////

//////////////  ASSET LOADING  //////////////////////////////////////////////////////

//// all images, tiles, spritesheets, etc. must be loaded prior to starting the game loop
load(...imageAssetPaths).then(() => {
  player = makePlayer(imageAssets[imageAssetPaths[1]]);
  bot = makeBot(imageAssets[imageAssetPaths[2]]);
  makeLevel(currentLevel);
  loop.start();
});

/////////////////////////////////////////////////////////////////////////////////////

//////////////  GAME LOOP  //////////////////////////////////////////////////////////

const loop = GameLoop({
  context: context, // create the main game loop
  update: function () {
    ///// player key board controls. collision test prevents player from moving into obstacle tiles
    ////  position test prevents player from walking off screen

    if (keyPressed("right")) {
      if (player.x < canvas.width - player.width * player.scaleX) player.x += 2;
      if (levelTileEngine.layerCollidesWith("decorations", player)) player.x -= 2;
      player.playAnimation("walkRight");
    } else if (keyPressed("left")) {
      if (player.x <= 0) player.x += 2;
      player.x += -2;
      if (levelTileEngine.layerCollidesWith("decorations", player)) player.x -= -2;
      player.playAnimation("walkLeft");
    } else if (keyPressed("up")) {
      if (player.y > 0) player.y -= 2;
      if (levelTileEngine.layerCollidesWith("decorations", player)) player.y += 2;
      player.playAnimation("walkUp");
    } else if (keyPressed("down")) {
      if (player.y < canvas.height - player.height * player.scaleY)
        player.y += 2;
      if (levelTileEngine.layerCollidesWith("decorations", player)) player.y -= 2;
      player.playAnimation("walkDown");
    } else {
      player.playAnimation("idle");
    }

    player.update();


    //update the bot based on level track and move list
    bot.update();
    bot.process(levelTrack, moves);


    //if(collides(player,bot)) console.log("COLLIDING")
    //run through collision detection for each switch
    levelSwitches.forEach(levelSwitch =>{


      //something about the bot's y offset is messing with the collision detection so I had to create a custom object
      if(collides(levelSwitch,{x:bot.x,y:bot.y-16,height:bot.height,width:bot.width})) {
        activateSwitch(levelSwitch)

  } if(collides(levelSwitch,player)){

    activateSwitch(levelSwitch)
  }
})
  },
  render: function () {
    // render the game state
    levelTileEngine.render();
    player.render();
    bot.render();

       /* checks for end game if player is colliding with an invisible goal tile layer AND
      if the bot is at the end node coordinates. Right now the end node tile is hard coded.
      I'm not sure the tile id will stay the same across levels, in the future we will either
      need to create a bot end node tile layer for each level or dynamically check for the
      tile id of the end node
      */

      if (
      collides(player,playerGoal) &&
      collides(bot, botGoal)
    ) {
    //  If not the last level, reset the bot, player, and tile engine for the  next level and rerender
    //  Otherwise end game message
      // eslint-disable-next-line no-alert
      //alert("YOU WIN!!!");
      if(currentLevelIx === levels.length - 1) {
        alert("HTTP STATUS 200! GAME OVER!");
        loop.stop();
      } else {
        currentLevelIx++;
        currentLevel = levels[currentLevelIx]
        makeLevel(currentLevel)
      }
    }
  },
});

/////////////////////////////////////////////////////////////////////////////////////

//////////////  OTHER FUNCTIONS  ////////////////////////////////////////////////////


function assignTilesToObject(gameObject){
  gameObject.tiles=[]
  for(let x =gameObject.x/32; x<((gameObject.x+gameObject.width)/32);x++){
    for(let y = gameObject.y/32; y<((gameObject.y+gameObject.height)/32);y++)
    {
      gameObject.tiles.push({row:y,col:x})
    }
  }
}

function activateSwitch(levelSwitch){
  //get array of gates linked to the switch
  const linkedGateNames=  levelSwitch.properties.filter(prop => prop.name==='Gates')

  //use the gate names to create an array of gate objects. This would be where we would check
  // if a switch affects multiple gates but right now it is only coded for single gate
  const associatedGameObjects=[];

  linkedGateNames.forEach(gateName=>{
      associatedGameObjects.push(levelGates.filter(gate=> gate.name===gateName.value)[0])
  })

  // clear the decorations at each tiles
  associatedGameObjects.forEach(gate=>{
    //console.log(gate)
    gate.tiles.forEach(tile=> {
      levelTileEngine.setTileAtLayer("decorations",
    tile,
    0)
    })
  })
}

const makeLevel = lvl => {
    //this skips the dataAsset loading in Kontra (which requires fetch) and sticks everything directly on the window object
  //it also fakes the required mapping for the TileEngine
  //later, we should make something that cleans this up and creates the necessary JSON for a level and also deal w multiple levels
  dataAssets[lvl.levelName] = lvl

  tilesetNames.map(tileset=> {
    const tilesetURL = new URL(tileset, window.location.href).href
    window.__k.d[tilesetURL] = 'x'
    window.__k.dm.set(dataAssets[lvl.levelName],tilesetURL)
  })
  levelTileEngine = TileEngine(dataAssets[lvl.levelName]);
  levelTrack = track(lvl);

  //assign interactive components from JSON to objects
  const levelObjects=lvl.layers.filter(layer=>layer.name==='InteractiveComponents')[0].objects;
  playerStart =levelObjects.filter(object=>object.name==='playerStart')[0];
  playerGoal = levelObjects.filter(object => object.name==='playerGoal')[0];
  botStart = levelObjects.filter(object => object.name==='botStart')[0];
  botGoal = levelObjects.filter(object => object.name==='botGoal')[0];
  levelSwitches= levelObjects.filter(object => object.type==='Switch');
  //console.log(levelSwitches)
  levelGates= levelObjects.filter(object => object.type==='Gate');
  levelGates.forEach(gate=>{assignTilesToObject(gate)})
  //console.log(levelGates)

  //get type of pipe for bot start to determine initial bot heading
  let initialPipeIx = (botStart.y/32 * 16) + botStart.x/32
  let initialPipeType = lvl.layers.filter((layer) => layer.name === "pipes")[0].data[initialPipeIx]
  botStart.heading = initialTileHeadings[initialPipeType]
  moves = []
  movesBank = []
  redrawControls();
  player.placeAtStart(playerStart)
  bot.placeAtStart(botStart)
}

const redrawControls = () => {
  //empty out move boxes
  for(let i = 0; i < 10; i++) document.getElementById(`move${i}`).textContent = ''
  //redraw all banked moves
  movesBank.map((move,ix)=>{
    const divApp = document.getElementById(`move${ix}`)
    divApp.textContent = '';
    const img = document.createElement('img')
    img.src = moveImage[move]
    if(move === 'L') img.className = 'mirror'
    divApp.appendChild(img)
  })
  //unfade go button
  if(moves.length === 0) document.getElementById('botGo').className = ''
}
