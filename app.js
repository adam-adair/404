/* eslint-disable max-statements */
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
  Text
} from "kontra";
import {
  canvas,
  context,
  initialTileHeadings,
  openGateGID,
  closedGateGID,
  inactivePlayerSwitchGID,
  activePlayerSwitchGID,
  inactiveBotSwitchGID,
  activeBotSwitchGID
} from "./src/initialize";
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
  botMessage,
  inputTimer,
  inputMessageBot,
  inputMessagePlayer,
  levelSwitches,
  levelGates,
  activatedTempSwitches,

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

window.addEventListener("keydown",  (e)=> {
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
}, false);

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
  const clickId=clicked.id
   //reset level, restore Go
   if(clickId === 'levelReset') {
    makeLevel(currentLevel)
    clicked.previousElementSibling.class = ''
  }
  //if player is in playerstart square accept inputs, otherwise show error text
  if(collides(player,playerStart)){

    //start bot if not already running, grey out go
  if(clickId === 'botGo' && moves.length === 0) {
    moves = [...movesBank]
    clicked.class = 'faded'
    }

    /////////////commented out the below code because it doesn't appear to affect gameplay.
    ////////////can we remove it?
  //if you click a move bank box and sparky not running, splice out the move
  // if(clicked.parentElement.class === 'moveBlock' && moves.length === 0) {
  //   movesBank.splice(+clicked.parentElement.id.slice(-1),1)
  // }

  //if move bank isn't full and bot's not running, add move to movebank
  if(movesBank.length < 10 && moves.length === 0) {
    movesBank.push(clickId)
    writeText("202");
  }
  redrawControls();
} else  writeText("503");
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

    //grey out all controls if player isn't at start
    if(!collides(player, playerStart)) controls.classList ='faded'
    else controls.classList = ''

    ///// player key board controls. collision test prevents player from moving into obstacle tiles
    ////  position test prevents player from walking off screen

    if (keyPressed("right")) {
      if (player.x < canvas.width - player.width * player.scaleX) player.x += 2;
      if (levelTileEngine.layerCollidesWith("decorations", player)) {
        let blocked = true
        levelGates.filter(gate => gate.open)
        .forEach(gate => {
          //annoyingly, kontra layer collision detection is <= and kontra object collision
          //is strictly < so this temporary scaling is a hack to determine object collision
          player.scaleX *= 1.1;
          if(collides(gate, player)) blocked = false
          player.scaleX /= 1.1;
        })
        if(blocked)player.x -= 2;
      }
      player.playAnimation("walkRight");
    } else if (keyPressed("left")) {
      if (player.x <= 0) player.x += 2;
      player.x += -2;
      if (levelTileEngine.layerCollidesWith("decorations", player)) {
        let blocked = true
        levelGates.filter(gate => gate.open)
        .forEach(gate => {
          player.scaleX *= 1.1;
          if(collides(gate, player)) blocked = false
          player.scaleX /= 1.1;
        })
        if(blocked) player.x -= -2;
      }
      player.playAnimation("walkLeft");
    } else if (keyPressed("up")) {
      if (player.y > 0) player.y -= 2;
      if (levelTileEngine.layerCollidesWith("decorations", player)) {
        let blocked = true
        levelGates.filter(gate => gate.open)
        .forEach(gate => {
          player.scaleY *= 1.1;
          if(collides(gate, player)) blocked = false
          player.scaleY /= 1.1;
        })
        if(blocked) player.y += 2;
      }
      player.playAnimation("walkUp");
    } else if (keyPressed("down")) {
      if (player.y < canvas.height - player.height * player.scaleY)
        player.y += 2;
      if (levelTileEngine.layerCollidesWith("decorations", player)) {
        let blocked = true
        levelGates.filter(gate => gate.open)
        .forEach(gate => {
          player.scaleY *= 1.1;
          if(collides(gate, player)) blocked = false
          player.scaleY /= 1.1;
        })
        if(blocked) player.y -= 2;
      }
      player.playAnimation("walkDown");
    } else {
      player.playAnimation("idle");
    }

    player.update();


    //update the bot based on level track and move list
    levelGates.filter(gate => !gate.open)
    .forEach(gate => {
      if(collides(gate, bot)) {
        bot.speed = 0;
        bot.playAnimation("crash")
       writeText("401")
      }
    })
    bot.update();
    bot.process(levelTrack, moves);


    //////////// Switch Triggering ///////////////

    ////loop through activated temp switches, if neither player or bot are on them, deactivate
    if(activatedTempSwitches.length>0){
      activatedTempSwitches.forEach( tempSwitch =>{
        if(!collides(tempSwitch,{x:bot.x,y:bot.y-16,height:bot.height,width:bot.width}) && !collides(tempSwitch,player)) {
          activateSwitch(tempSwitch,false)
        }
      })
    }
        //run through collision detection for each switch
    levelSwitches.forEach(levelSwitch =>{

      //something about the bot's y offset is messing with the collision detection so I had to create a custom object
      if(collides(levelSwitch,{x:bot.x,y:bot.y-16,height:bot.height,width:bot.width})) {
        activateSwitch(levelSwitch)
        levelTileEngine.setTileAtLayer("decorations",levelSwitch,activeBotSwitchGID)
      }

      if(collides(levelSwitch,player)){
        activateSwitch(levelSwitch)
        levelTileEngine.setTileAtLayer("ground",levelSwitch,activePlayerSwitchGID)
      } else levelTileEngine.setTileAtLayer("ground",levelSwitch, inactivePlayerSwitchGID,
      )

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
    if(inputTimer>0){
      inputTimer--;
      if(inputMessageBot) inputMessageBot.render();
      if(inputMessagePlayer) inputMessagePlayer.render();

    }
    //Bot gives status messages. If crashing, give message set at time of crash, if not check for end goal
      if(bot.currentAnimation.frames.length===4){
        botMessage.render()

      } else if (collides(bot,botGoal)){
               botMessage.render()
      if(collides(player,playerGoal))
      {
    //  If not the last level, reset the bot, player, and tile engine for the  next level and rerender
    //  Otherwise end game message
      // eslint-disable-next-line no-alert
      //alert("YOU WIN!!!");
      console.log('win')
      if(currentLevelIx === levels.length - 1) {
        alert("HTTP STATUS 200! GAME OVER!");
        loop.stop();
      } else {
        currentLevelIx++;
        currentLevel = levels[currentLevelIx]
        makeLevel(currentLevel)
      }
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

function activateSwitch(levelSwitch, activate=true){
  //get array of gates linked to the switch
  const linkedGateNames=  levelSwitch.properties.filter(prop => prop.name==='Gates')[0].value.split(",")

  //use the gate names to create an array of gate objects.
  const associatedGameObjects=[];

  linkedGateNames.forEach(gateName=>{
      associatedGameObjects.push(levelGates.filter(gate=> gate.name===gateName)[0])
  })

  if (activate){
  // clear the decorations at each tiles
  associatedGameObjects.forEach(gate=>{
    gate.open = true
    gate.tiles.forEach(tile=> {
      levelTileEngine.setTileAtLayer("decorations", tile, openGateGID)
    })
  })


  //if switch is temporary, add it to the array of activated switches
    if(levelSwitch.properties.filter(prop=>prop.name==="SwitchType")[0].value ==="Temporary"

    && !activatedTempSwitches.includes(levelSwitch)) {
      activatedTempSwitches.push(levelSwitch)
    }

  } else {
    associatedGameObjects.forEach(gate=>{
      gate.open = false;
      gate.tiles.forEach(tile=> {
        levelTileEngine.setTileAtLayer("decorations", tile, closedGateGID)
      })
    })

    //remove switch from array of activated switches
  const index = activatedTempSwitches.indexOf(levelSwitch)
  activatedTempSwitches.splice(index,1)

  }
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
  let levelObjects=lvl.layers.filter(layer=>layer.name==='InteractiveComponents')[0].objects;
  playerStart =levelObjects.filter(object=>object.name==='playerStart')[0];
  playerGoal = levelObjects.filter(object => object.name==='playerGoal')[0];
  botStart = levelObjects.filter(object => object.name==='botStart')[0];
  botGoal = levelObjects.filter(object => object.name==='botGoal')[0];
  levelSwitches= levelObjects.filter(object => object.type==='Switch');
  console.log(levelSwitches)

  //reset bot switches and redraw
  levelSwitches.filter(sw=>sw.properties[1].value==='Permanent').forEach(sw=>{
    assignTilesToObject(sw);
    sw.tiles.forEach(tile=> {
      levelTileEngine.setTileAtLayer("decorations", tile, inactiveBotSwitchGID)
    })
  })
  activatedTempSwitches=[]

  levelGates= levelObjects.filter(object => object.type==='Gate');
  levelGates.forEach(gate=>{
    //reclose any open gates and redraw closed gate images if level is reset
    gate.open = false;
    assignTilesToObject(gate);
    gate.tiles.forEach(tile=> {
      levelTileEngine.setTileAtLayer("decorations", tile, closedGateGID)
    })
  })


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
    if(move === 'L') img.class = 'mirror'
    divApp.appendChild(img)
  })
  //unfade go button
  if(moves.length === 0) document.getElementById('botGo').class = ''
}

function setXY(textObject,sprite){
  const halfWidth=(.5*textObject.width)
  const theight =textObject.height
  textObject.x=sprite.x>(512-halfWidth)? (512-halfWidth): sprite.x<halfWidth ? halfWidth :sprite.x;
  textObject.y= sprite.y>(sprite.height+theight)? (sprite.y-theight) : (sprite.y+sprite.height);

}

function writeText(code){

  if(code==="401"||code ==="200"){
    botMessage= Text({
      text: code==="401" ? '401\nUnauthorized':"200\nOK",
      font: 'bold 20px Arial',
      color: 'white',
      x: 0,
      y: 0,
      anchor: {x: 0.5, y: 0.5},
      textAlign: 'center'
    });
    setXY(botMessage,bot);
  } else   {
    inputTimer=30;
      inputMessageBot= Text({
      text: code==="202" ? '202\nAccepted': code==="503"? '503\nService Unavailable' : null,
      font: 'bold 12px Arial',
      color: 'white',
      x: 0,
      y: 0,
      anchor: {x: 0.5, y: 0.5},
      textAlign: 'center'
    });
    setXY(inputMessageBot,bot);
    inputMessagePlayer=null;
  }
    if(code==="503"){
      inputMessagePlayer= Text({
        text: 'I need the\nterminal for that',
        font: 'bold 14px Arial',
        color: 'white',
        x: 0,
        y: 0 ,
        anchor: {x: 0.5, y: 0.5},
        textAlign: 'center'
      });

      setXY(inputMessagePlayer,player);}
}
