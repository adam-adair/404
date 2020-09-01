const img = new Image()
img.src = 'assets/img/tiles.png'
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const liteEngine = function(lvl){
  const level = lvl
  const tileEngine = {
    render() {
      const layers = level.layers
      layers.map(layer =>{
        if(layer.name !== 'InteractiveComponents') {
          layer.data.map((tile,ix)=>{
            if(tile!==0){
              //gets source image x and y from GID in tile
              const srcx = ((tile-1)%9)*32
              const srcy = Math.floor((tile-1)/9)*32
              //gets canvas x and y where to draw from index of array
              const canvasy = Math.floor(ix/16)*32
              const canvasx = (ix%16)*32
              ctx.drawImage(img,srcx,srcy,32,32,canvasx,canvasy,32,32)
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
