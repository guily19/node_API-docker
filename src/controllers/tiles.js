var tileBehaviour = require('../models/tileBehaviour');
var path = require('path');
var fs = require('fs');
var tilesDir = appDir + '/tiles';
var appDir = path.dirname(require.main.filename);

var tilesController = {};



tilesController.getTileZXY = function(req, res){
    var deliveryType = "pointTile";
    var deliveryCode = req.param('deliveryCode');
    var propertyCode = req.param('propertyCode');
    var z = req.param('z');
    var x = req.param('x');
    var y = req.param('y');
    var bbox = [];

    var generator = tileBehaviour.getGenerator(deliveryType);

    var pathTile = tilesDir + '/' + deliveryCode + '/' + z + '/' + x + '/' + y + '.png';

    // the tile we are looking for exist?
    fs.access(pathTile, fs.constants.R_OK, function(err){
        if(err){
            var margin = 0.01;
            var tileBbox = tile2Bbox(x, y, z);
            var tileBboxwithMargin = addMarginsToBbox(tileBbox, margin);
            generator.generateTile(deliveryCode, propertyCode, tileBboxwithMargin);
        } else {
            log.debug("exist and isn't filtered THEN SEND path_tile");
            res.sendfile(path_tile);
        }
    })
}

var addMarginsToBbox = function(bbox, margin) {
    return [
        [ bbox.lonEast + margin, bbox.latSouth - margin ],
        [ bbox.lonWest - margin, bbox.latSouth - margin ],
        [ bbox.lonWest - margin, bbox.latNorth + margin ],
        [ bbox.lonEast + margin, bbox.latNorth + margin ],
        [ bbox.lonEast + margin, bbox.latSouth - margin ]
    ]
}


var tile2Bbox = function(x, y, zoom) {
    var bb = {
        latNorth: tile2lat(y, zoom),
        latSouth: tile2lat(y + 1, zoom),
        lonWest: tile2long(x, zoom),
        lonEast: tile2long(x + 1, zoom)
    }
    return bb;
}


var tile2long = function(x, z) {
    return (x / Math.pow(2, z) * 360 - 180);
}

var tile2lat = function(y, z) {
    var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}


module.exports = tilesController;

