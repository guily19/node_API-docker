var legend = require('../controllers/legend');
var config = require('../config/config')
var maptile = require('maptile'); 
var db = require('./db');

var pointsTile = {};

pointsTile.getTileFromDB = function(deliveryCode, propertyCode, coords, zoom, callback) {
	var bb = {
        north: Math.max(coords[0][1], coords[1][1], coords[2][1], coords[3][1]),
        south: Math.min(coords[0][1], coords[1][1], coords[2][1], coords[3][1]),
        east: Math.max(coords[0][0], coords[1][0], coords[2][0], coords[3][0]),
        west: Math.min(coords[0][0], coords[1][0], coords[2][0], coords[3][0])
    };

    var match = {
        '$match': {
            'geometry.coordinates.0': {
                '$lte': bb.east,
                '$gte': bb.west
            },
            'geometry.coordinates.1': {
                '$lte': bb.north,
                '$gte': bb.south
            }
        }
    };

    var basicProject = {
        '$project': {
            'coordinates': '$geometry.coordinates',
            'type': '$geometry.type',
            "ctx.form": '$geometry.ctx.form',
            "ctx.fillStyle": {}
        }
    };

    // var project = legend.getMongoProjectiondLegend(deliveryCode, propertyCode);
    legend.getLegendStyleProjection(deliveryCode, propertyCode, function(data){
        basicProject['$project']["ctx.fillStyle"] = data
        queryAggr = [match, basicProject];

        // console.log("************************************************************");
        // console.log("queryAggr = ",queryAggr);
        // console.log("************************************************************");

        var start = new Date().getTime();
        db(function(db) {
            db.collection("points", function(err, collection) {
                if (err) {
                    log.error(err);
                } else {
                    collection.aggregate(queryAggr, {
                        allowDiskUse: true,
                        cursor: {
                            batchSize: 100
                        }
                    }).toArray(function(err, points) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(points.length, "points in ", new Date().getTime() - start);
                            callback(err, points);
                        }
                    });
                }
            });
        });
    });
}

var drawTiletoMap = function(deliveryCode, propertyCode, bbox, zoom, filteredPoints, callback) {
     var coolMap = new maptile.Map({
        cache: false,
        path: config.path_tile,
        builder: function(tile, next) {
            tile.drawGeojson(filteredPoints, zoom, deliveryCode, {}, next);
        }
    });
    let begin = new Date().getTime();
    coolMap.getTile(bbox, function(err, buffer) {
        if (err) {
            console.log('Err: ',err);
        } else {
            let end = new Date().getTime();
            callback(buffer);
        }
    });
}


pointsTile.generateTile = function(deliveryCode, propertyCode, bbox, zoom, callback) {
        //custom behavior here
	this.getTileFromDB(deliveryCode, propertyCode, bbox, zoom, function(err, filteredPoints){
		drawTiletoMap(deliveryCode, propertyCode, bbox, zoom, filteredPoints, callback);
	});
}

module.exports = pointsTile;