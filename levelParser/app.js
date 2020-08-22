var fs = require('fs');
var path = require('path')
const { parseString } = require('xml2js')

/// This program adds to the level JSON the image property needed for the TileEngine
/// Right now this is hardcoded for pipe2.json, but that can be easily updated ///

/// We should place all level JSON in a single folder with standardized naming
/// and then have this parser process all the files and output a single JSON file
/// with all the levels that the game engine will import

let fileName = 'pipe2.json'
let level
fs.readFile(path.join(__dirname,'..','assets','tile',fileName), 'utf8', function(err, data) {
    if (err) throw err;
    level = JSON.parse(data);
    const tilesets = level.tilesets.map(tileset=>tileset.source)
    tilesets.forEach((tileset,ix) => {
      fs.readFile(path.join(__dirname,'..','assets','tile',tileset), 'utf8', function(errReadXML, xml) {
        if (errReadXML) throw errReadXML;
        parseString(xml,function (xmlerr, result) {
          if (xmlerr) throw xmlerr;
          let imgString = result.tileset.image[0]['$'].source
          imgString = imgString.replace('..','./assets')
          level.tilesets[ix].image = imgString
          if(ix===tilesets.length-1) {exporter(JSON.stringify(level, null, '\t'),fileName)}
        });
      })
    })
});

function exporter(objString, writeName) {
  fs.writeFile(path.join(__dirname,'..','assets','tile','parsed.'+writeName), objString, function(err) {
    if(err) throw err
  });
}
