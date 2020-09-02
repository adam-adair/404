/* eslint-disable complexity */
import {context} from "./initialize";
//import {imageAssets} from "kontra"
const liteEngine = function(lvl,tileImg){
  const level = lvl
  const tileEngine = {
    render() {
      const layers = level.layers
      layers.map(layer =>{
        if(layer.name !== 'InteractiveComponents') {
          layer.data.map((tile,ix)=>{
            if(tile!==0){
              let tilenum = +tile
              let rot = 0
              if(typeof tile === 'string') {
                if(tile[0]==='a')rot=90
                else if(tile[0]==='c') rot=180
                else if(tile[0]==='6') rot=270
                tilenum = +tile.slice(2)
              }
              //gets source image x and y from GID in tile
              let srcx = ((tilenum-1)%6)*32
              let srcy = Math.floor((tilenum-1)/6)*32
              //gets canvas x and y where to draw from index of array
              let canvasy = Math.floor(ix/16)*32
              let canvasx = (ix%16)*32
              const img = tileImg//imageAssets['./assets/img/tiles.png']
              //do some stuff to draw in the right place with the right image
              if(rot===90) {
                let o = canvasy
                canvasy = -(canvasx+32)
                canvasx = o
              } else if (rot===180) {
                canvasx = -(canvasx+32)
                canvasy = -(canvasy+32)
              } else if (rot===270) {
                let o = canvasx
                canvasx = -(canvasy+32)
                canvasy = o
              }
              context.save()
              if(rot!==0) context.rotate(rot*Math.PI/180)
              context.drawImage(img,srcx,srcy,32,32,canvasx,canvasy,32,32)
              context.restore()
            }
          })
        }
      })
    },
    setTileAtLayer (layerName,tile,gid) {
      //tells what layer to draw at; hardcoded
      const layerIx = layerName === 'pipes' ? 1 : 3
      //botswitches don't have row/cols but have types, so this changes ix of layer data to set
      const ix = tile.type ? tile.x/32 + 16*(tile.y/32):tile.col + tile.row*16
      level.layers[layerIx].data[ix] = gid
    },
    layerCollidesWith (_,gameObj) {
      //hardcoded for decorations, bc that's the only thing we check for collision
      let collides = false
      level.layers[3].data.forEach((gid,ix) => {
        if(gid !== 0) {
          //check collision based on ix
          const tileXa = (ix%16)*32
          const objXa = gameObj.x
          const tileYa = (Math.floor(ix/16))*32
          const objYa = gameObj.y
          const tileXb = tileXa+32
          const objXb = gameObj.x + gameObj.width
          const tileYb = tileYa+32
          const objYb = gameObj.y + gameObj.height
          if (tileXa < objXb && tileXb > objXa &&
            tileYa < objYb && tileYb > objYa) {collides = true;}
        }
      })
      return collides
    }
  }
  return tileEngine
}
export default liteEngine

