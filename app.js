/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
/* eslint-disable max-statements */
/* eslint-disable no-use-before-define */
/* eslint-disable complexity */

//////////////  IMPORTS  ////////////////////////////////////////////////////////////
import liteEngine from './src/liteEngine'
import {
  GameLoop,
  initKeys,
  keyPressed,
  collides,
  Text,
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
  activeBotSwitchGID,
  levelFiller,
  imgLoc
} from "./src/initialize";
import makePlayer from "./src/player";
import makeBot from "./src/bot";
import track from "./src/track";
import compressedLevels from "./assets/tile/parsed.allLevels.json"

/////////////////////////////////////////////////////////////////////////////////////
const levels = levelPreProcess()
//////////////  GLOBAL VARS  ////////////////////////////////////////////////////////

let player,
  bot,
  currentLevel,
  currentLevelIx,
  levelliteEngine,
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
  activatedPermSwitches,
  moves,
  movesBank,
  levelEndCountDown,
  levelFadeIn

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

//define controls


const controls = document.getElementById("c");
for(let i = 0; i <16; i++) {
  const moveBox = document.createElement('div')
  if(i<5) moveBox.id = `m${i}`
  else if(i===5)moveBox.id = moveBox.className = 'F'
  else if(i===6)moveBox.id = moveBox.className =  'L'
  else if(i===7)moveBox.id = moveBox.className =  'R'
  else if(i > 7 && i < 13)moveBox.id = `m${i-3}`
  else if(i===13)moveBox.id = moveBox.className = 'LO'
  else if(i===14)moveBox.id = moveBox.className = 'bG'
  else if(i===15)moveBox.id = moveBox.className = 'lR'
  if(moveBox.id[0]==='m')moveBox.className='m'
  else moveBox.style.background=`url('a.png') left ${imgLoc[moveBox.id][0]}px top ${imgLoc[moveBox.id][1]}px`
  controls.appendChild(moveBox)
}

//listen for control clicks and process
controls.addEventListener("click", (event) => {
  const clicked = event.target
  const clickId=clicked.id
   //reset level, restore Go
   if(clickId === 'lR') {
    makeLevel(currentLevel,art)
    clicked.previousElementSibling.className = ''
  }
  //if player is in playerstart square accept inputs, otherwise show error text
  else if(collides(player,playerStart)){

    //start bot if not already running, grey out go
      if(clickId === 'bG' && moves.length === 0) {
        moves = [...movesBank]
        clicked.className = 'bG f'
      }

  //if move bank isn't full and bot's not running, add move to movebank
  if(movesBank.length < 10 && moves.length === 0) {
    if(["L","R","F","LO"].includes(clickId)) movesBank.push(clickId)
    writeText("202");
  }
  redrawControls();
} else  writeText("503");
});

///////////this is for level testing! Remove here and from HTML for minification! //////////

const levelPick = document.getElementById("levelPick");
const buttonContainer = document.getElementById("buttonContainer");
levels.map((level,ix) => {
  const button = document.createElement('button')
  button.innerText = level.levelName
  button.value = ix
  buttonContainer.appendChild(button)
})
levelPick.addEventListener("click", (ev) => {
  if (ev.target.tagName === "BUTTON") {
    moves = []
    currentLevelIx = +ev.target.value
    currentLevel = levels[ev.target.value]
    makeLevel(levels[ev.target.value],art)
  }
});

const c =document.getElementById("g");
const canvasElement = c.getContext('2d');
canvasElement.fillStyle= '#FFFFFF'

////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////

//////////////  ASSET LOADING  //////////////////////////////////////////////////////

const art = new Image()
art.src = './a.png'
art.onload = () =>{
  player = makePlayer(art);
  bot = makeBot(art);
  makeLevel(currentLevel,art);
  loop.start()
}
/////////////////////////////////////////////////////////////////////////////////////

//////////////  GAME LOOP  //////////////////////////////////////////////////////////

const loop = GameLoop({
  context: context, // create the main game loop
  update: function () {

    //grey out all controls if player isn't at start
    if(!collides(player, playerStart)) controls.classList ='f'
    else controls.classList = ''

    ///// player key board controls. collision test prevents player from moving into obstacle tiles
    ////  position test prevents player from walking off screen

    if (keyPressed("right")) {
      if (player.x < canvas.width - player.width * player.scaleX) player.x += 2;
      if (levelliteEngine.layerCollidesWith("d", player)) {
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
      player.playAnimation("R");
    } else if (keyPressed("left")) {
      if (player.x <= 0) player.x += 2;
      player.x += -2;
      if (levelliteEngine.layerCollidesWith("d", player)) {
        let blocked = true
        levelGates.filter(gate => gate.open)
        .forEach(gate => {
          player.scaleX *= 1.1;
          if(collides(gate, player)) blocked = false
          player.scaleX /= 1.1;
        })
        if(blocked) player.x -= -2;
      }
      player.playAnimation("L");
    } else if (keyPressed("up")) {
      if (player.y > 0) player.y -= 2;
      if (levelliteEngine.layerCollidesWith("d", player)) {
        let blocked = true
        levelGates.filter(gate => gate.open)
        .forEach(gate => {
          player.scaleY *= 1.1;
          if(collides(gate, player)) blocked = false
          player.scaleY /= 1.1;
        })
        if(blocked) player.y += 2;
      }
      player.playAnimation("U");
    } else if (keyPressed("down")) {
      if (player.y < canvas.height - player.height * player.scaleY)
        player.y += 2;
      if (levelliteEngine.layerCollidesWith("d", player)) {
        let blocked = true
        levelGates.filter(gate => gate.open)
        .forEach(gate => {
          player.scaleY *= 1.1;
          if(collides(gate, player)) blocked = false
          player.scaleY /= 1.1;
        })
        if(blocked) player.y -= 2;
      }
      player.playAnimation("D");
    } else {
      player.playAnimation("I");
    }

    player.update();


    //update the bot based on level track and move list
    levelGates.filter(gate => !gate.open)
    .forEach(gate => {
      if(collides(gate, bot)) {
        bot.speed = 0;
        bot.playAnimation("C")
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

    ///loop  through activated permanent switches, reactivate them to undo any gate closures that the temporary switch logic might have caused
    if(activatedPermSwitches.length>0){
      activatedPermSwitches.forEach( permSwitch =>{

          activateSwitch(permSwitch)
      })
    }

        //run through collision detection for each switch
    levelSwitches.forEach(levelSwitch =>{

      //something about the bot's y offset is messing with the collision detection so I had to create a custom object

      if(collides(levelSwitch,{x:bot.x,y:bot.y-16,height:bot.height,width:bot.width})) {
        activateSwitch(levelSwitch)
        levelliteEngine.setTileAtLayer("d",levelSwitch,activeBotSwitchGID)
      }

      if(collides(levelSwitch,player)){
        activateSwitch(levelSwitch)
        levelliteEngine.setTileAtLayer("p",levelSwitch,activePlayerSwitchGID)
      } else levelliteEngine.setTileAtLayer("p",levelSwitch, inactivePlayerSwitchGID,
      )

    })
  },
  render: function () {
    // render the game state
    levelliteEngine.render();
    player.render();
    bot.render();

    ///////Fade in
    if(levelFadeIn<30){
      levelFadeIn++
        canvasElement.globalAlpha = (30-levelFadeIn)/30
        canvasElement.fillRect(0,0,512,512)
        canvasElement.globalAlpha = 1
    }

       /* checks for end game if player is colliding with an the player goal object AND
      if the bot is at the end node coordinates.
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

        writeText("200");
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
        // if(levelEndCountDown>0){
        //   console.log(levelEndCountDown)
        //   if(levelEndCountDown>60){

        //     player._opa=player._opa-(1/61)
        //     bot._opa=bot._opa-(1/61)
        //     console.log(player._opa)

        //   } else if(levelEndCountDown%5==0){
        //     console.log(player._opa)
        //     canvasElement.fillRect(0,0,512,512)
        //     } else canvasElement.fillRect(0,0,0,0)
        //   levelEndCountDown--;
        // } else{
        // currentLevelIx++;
        // currentLevel = levels[currentLevelIx]
        // makeLevel(currentLevel,art)

        //////////////////// how about a fade instead of a flash?? /////////////
        console.log(levelEndCountDown)
        levelEndCountDown--
        canvasElement.globalAlpha = (60-levelEndCountDown)/60
        canvasElement.fillRect(0,0,512,512)
        canvasElement.globalAlpha = 1
        if(levelEndCountDown===0){
          currentLevelIx++;
          currentLevel = levels[currentLevelIx]
          makeLevel(currentLevel,art)
        }
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
  const linkedGateNames=  levelSwitch.p[0].v.split(",")

  //use the gate names to create an array of gate objects.
  const associatedGameObjects=[];

  linkedGateNames.forEach(gateName=>{
      associatedGameObjects.push(levelGates.filter(gate=> gate.n===gateName)[0])
  })

  if (activate){
  // clear the decorations at each tiles
  associatedGameObjects.forEach(gate=>{
    gate.open = true
    gate.tiles.forEach(tile=> {
      levelliteEngine.setTileAtLayer("d", tile, openGateGID)
      })
    })


  //add switches to their appropriate arrays
    if(levelSwitch.t ==="T"

    && !activatedTempSwitches.includes(levelSwitch)) {
      activatedTempSwitches.push(levelSwitch)
    } else if (levelSwitch.t==="P"
        && !activatedPermSwitches.includes(levelSwitch)){
      activatedPermSwitches.push(levelSwitch)
      console.log(activatedPermSwitches)
    }

  } else {
    associatedGameObjects.forEach(gate=>{
      gate.open = false;
      gate.tiles.forEach(tile=> {
        levelliteEngine.setTileAtLayer("d", tile, closedGateGID)
      })
    })

    //remove switch from array of activated switches
  const index = activatedTempSwitches.indexOf(levelSwitch)
  activatedTempSwitches.splice(index,1)

  }
}

const makeLevel = (lvl,tileset) => {
  //create tiles using liteEngine and bot track data
  levelliteEngine = liteEngine(lvl,tileset)
  levelTrack = track(lvl);
  levelEndCountDown =60;
  levelFadeIn=0;
  player._opa=1;
  bot._opa=1

  //assign interactive components from JSON to objects
  let levelObjects=lvl.layers.filter(layer=>layer.n==='I')[0].o;
  playerStart =levelObjects.filter(object=>object.n==='pS')[0];
  playerGoal = levelObjects.filter(object => object.n==='pG')[0];
  botStart = levelObjects.filter(object => object.n==='bS')[0];
  botGoal = levelObjects.filter(object => object.n==='bG')[0];
  levelSwitches= levelObjects.filter(object => object.t==='P'||object.t==='T');

  //reset permanent switches and redraw
  levelSwitches.filter(sw=>sw.t==='P').forEach(sw=>{
    assignTilesToObject(sw);
    sw.tiles.forEach(tile=> {
      levelliteEngine.setTileAtLayer("d", tile, inactiveBotSwitchGID)
    })

  })


  activatedTempSwitches=[]
  activatedPermSwitches=[]

  levelGates= levelObjects.filter(object => object.t==='G');
  levelGates.forEach(gate=>{
    //reclose any open gates and redraw closed gate images if level is reset
    gate.open = false;
    assignTilesToObject(gate);
    gate.tiles.forEach(tile=> {
      levelliteEngine.setTileAtLayer("d", tile, closedGateGID)
    })
  })


  //get type of pipe for bot start to determine initial bot heading
  let initialPipeIx = (botStart.y/32 * 16) + botStart.x/32
  let initialPipeType = lvl.layers.filter((layer) => layer.n === "p")[0].data[initialPipeIx]
  botStart.heading = initialTileHeadings[initialPipeType] || 'N' //this is a hack to make level 5 work
  moves = []
  movesBank = []
  redrawControls();
  player.placeAtStart(playerStart)
  bot.placeAtStart(botStart)

}

const redrawControls = () => {
  //empty out move boxes
  for(let i = 0; i < 10; i++) {
    const divApp = document.getElementById(`m${i}`)
    divApp.style.background = ''
    divApp.className = 'm'
  }
  //redraw all banked moves
   movesBank.map((move,ix)=>{
    const divApp = document.getElementById(`m${ix}`)
    divApp.style.background=`url('a.png') left ${imgLoc[move][0]}px top ${imgLoc[move][1]}px`
    if(move==='L')divApp.className = 'm L'
  })
  //unfade go button
  if(moves.length === 0) document.getElementById('bG').className = ''
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

function levelPreProcess() {
  compressedLevels.forEach(clvl => {
    clvl.layers = [{n:'p'},{n:'n'},{n:'d'}]
    clvl.o.o.forEach(object=>{
      object.width= object.width||32
      object.height=object.height||32
    })
    clvl.cLayers.forEach((cLayer,ix)=>{
      const data = new Array(256)
      data.fill(0)
      Object.keys(cLayer).forEach(key=>{
        cLayer[key].forEach(value=> {data[value] = key})
      })
      clvl.layers[ix].data = data
    })
      //this adds a background layer full of mostly green with random circuitry
    const bgData = new Array(256)
    for(let i = 0; i < 256; i++) {
      let randIx = Math.floor(Math.random()*20)
      randIx = randIx > 16 ? 20 - randIx : 0
      bgData[i] = levelFiller[randIx]
    }
    //bgData.fill(1)
    clvl.layers.unshift({"data":bgData})
    clvl.layers.push(clvl.o)
  })
  return compressedLevels
}
