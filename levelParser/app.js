var fs = require('fs');
var path = require('path')
const { parseString } = require('xml2js')

/// This program adds to the level JSON the image property needed for the TileEngine
/// The parser now runs through the JSON folder and write the parsed versions to the tile folder

let levelList= fs.readdirSync(path.join(__dirname,'..','assets','json'));
let numLevels = levelList.length
let levels = []

console.log(levelList);
levelList.forEach(fileName =>{

  let level
  fs.readFile(path.join(__dirname,'..','assets','json',fileName), 'utf8', function(err, data) {
      if (err) throw err;
      level = JSON.parse(data);
      const tilesets = level.tilesets.map(tileset=>tileset.source.replace('../tile/',''))
      console.dir(tilesets)
      tilesets.forEach((tileset,ix) => {
        fs.readFile(path.join(__dirname,'..','assets','tile',tileset), 'utf8', function(errReadXML, xml) {
          if (errReadXML) throw errReadXML;
          parseString(xml,function (xmlerr, result) {
            if (xmlerr) throw xmlerr;
            let imgString = result.tileset.image[0]['$'].source
            imgString = imgString.replace('..','./assets')
            level.tilesets[ix].image = imgString
            level.tilesets[ix].source = tileset
            level.levelName = fileName
            if(ix===tilesets.length-1) {exporter(level)}//{exporter(JSON.stringify(level, null, '\t'))}
          });
        })
      })
  });

  function exporter(parsedLevel) {
    levels.push(parsedLevel)
    if(levels.length === numLevels) {
      //for production, these stringify flags should be removed or altered.
      //they make the json more readable but take up more space
      const levelsString = JSON.stringify(levels, null, '\t')
      fs.writeFile(path.join(__dirname,'..','assets','tile','parsed.allLevels.json'), levelsString, function(err) {
        if(err) throw err
      });
    }
  }

})
