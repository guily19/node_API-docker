var legend = require('../controllers/legend'); 
var db = require('./db');

var pointsTile = {};

pointsTile.getTileFromDB = function(deliveryCode, propertyCode, coords, callback) {
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

    var project = legend.getMongoProjectiondLegend(deliveryCode, propertyCode);
    legend.getLegendStyleProjection(deliveryCode, propertyCode, function(data){
        basicProject['$project']["ctx.fillStyle"] = data
        queryAggr = [match, basicProject];

        console.log("************************************************************");
        console.log("queryAggr = ",queryAggr);
        console.log("************************************************************");

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

pointsTile.drawTiletoMap = function(deliveryCode, propertyCode, bbox) {
	 var coolMap = new maptile.Map({
        cache: false,
        path: path_tile,
        builder: function(tile, next) {
            tile.drawGeojson(filteredPoints, coords.z, deliv, {}, next);
        }
    });
    coolMap.getTile(coords, function(err, buffer) {
        if (err) {
            console.log(err)
        } else {
            //var end = new Date().getTime();
            //log.debug('TOTAL query+tileGeneration (in ms):',end-begin);
            res.send(buffer);
        }
    });
}


pointsTile.generateTile = function(deliveryCode, propertyCode, bbox) {
        //custom behavior here
	this.getTileFromDB(deliveryCode, propertyCode, bbox, function(err, filteredPoints){
		this.drawTiletoMap(deliveryCode, propertyCode, bbox);
	});
}

module.exports = pointsTile;