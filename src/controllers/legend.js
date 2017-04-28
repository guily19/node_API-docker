var deliveries = require('./deliveries');


var Legend = {};


function Color(r, g, b) {
    this.Red = r;
    this.Green = g;
    this.Blue = b;

    this.getRed = function() {
        return this.Red;
    }

    this.getGreen = function() {
        return this.Green;
    }

    this.getBlue = function() {
        return this.Blue;
    }
}


var calculateLevelsText = function(levArray, colorArray, propertyCode) {
    var num = levArray;
    var numLevels = num.length + 1;
    var middleLevel = parseInt(numLevels / 2);
    var levelsText = new Array();
    for (var i = 0; i < numLevels; i++) {
        if (i === 0) {
            levelsText[i] = {
                color: 'rgba(' + colorArray[i].getRed().toFixed(0) + ',' + colorArray[i].getGreen().toFixed(0) + ',' + colorArray[i].getBlue().toFixed(0) + ',1)',
                text: "More than " + num[i],
                from: parseFloat(num[i]),
            }
        } else if (i === middleLevel) {
            levelsText[i] = {
                color: 'rgba(' + colorArray[i].getRed().toFixed(0) + ',' + colorArray[i].getGreen().toFixed(0) + ',' + colorArray[i].getBlue().toFixed(0) + ',1)',
                text: "Stability",
                from: parseFloat(num[i - 1]),
                to: parseFloat(num[i]),
            }
        } else if (i === numLevels - 1) {
            levelsText[i] = {
                color: 'rgba(' + colorArray[i].getRed().toFixed(0) + ',' + colorArray[i].getGreen().toFixed(0) + ',' + colorArray[i].getBlue().toFixed(0) + ',1)',
                text: 'Less than ' + num[i - 1],
                to: parseFloat(num[i - 1]),
            }
        } else if (i < middleLevel) {
            levelsText[i] = {
                color: 'rgba(' + colorArray[i].getRed().toFixed(0) + ',' + colorArray[i].getGreen().toFixed(0) + ',' + colorArray[i].getBlue().toFixed(0) + ',1)',
                text: "From " + num[i] + " to " + num[i - 1],
                from: parseFloat(num[i - 1]),
                to: parseFloat(num[i]),
            }
        } else {
            levelsText[i] = {
                color: 'rgba(' + colorArray[i].getRed().toFixed(0) + ',' + colorArray[i].getGreen().toFixed(0) + ',' + colorArray[i].getBlue().toFixed(0) + ',1)',
                text: "From -" + - num[i] + " to -" + -num[i - 1],
                from: parseFloat(num[i - 1]),
                to: parseFloat(num[i]),
            }
        }
    }
    return levelsText;
}


var getDefaultlLegendColors = function(legend) {
    var legendColors = [];
    var levels = legend;
    var numLevelsDisp = levels.length + 1;
    var middleLevel = parseInt(numLevelsDisp / 2);
    var step = 255 / (middleLevel - 1);

    for (var i = 0; i < numLevelsDisp; ++i) {
        if (i < middleLevel) {
            legendColors.push(new Color(0, i * step, 255));
        } else if (i === middleLevel) {
            legendColors.push(new Color(0, 255, 0));
        } else {
            legendColors.push(new Color(255, (numLevelsDisp - 1 - i) * step, 0));
        }
    }
    return legendColors;
}


var calculateColors = function(legend) {
    var legendColors = [];
    legendColors = getDefaultlLegendColors(legend);
    return legendColors;
}



Legend.getMongoProjectiondLegend = function(deliveryCode, propertyCode) {
    var project = {
        '$project': {
            'coordinates': '$_id.geometry.coordinates',
            'type': '$_id.geometry.type',
            "ctx.form": '$_id.geometry.ctx.form',
            "ctx.fillStyle": {
                $concat: []
            },
            '_id': 0
        }
    };

    var delivery = deliveries.getDeliveryLegendObjectByCode(deliveryCode, propertyCode, function(legend){
        for (var i = 0; i < legend.length; i++) {
            if (i === 0) {
                project['$project']["ctx.fillStyle"]['$concat'].push({
                    $cond: [{
                        $and: [{
                            $gte: ["$_id.properties." + propertyCode, legend[i].from]
                        }]
                    }, legend[i].color, ""]
                });
            } else if (i === legend.length - 1) {
                project['$project']["ctx.fillStyle"]['$concat'].push({
                    $cond: [{
                        $and: [{
                            $lt: ["$_id.properties." + propertyCode, legend[i].to]
                        }]
                    }, legend[i].color, ""]
                });
            } else {
                project['$project']["ctx.fillStyle"]['$concat'].push({
                    $cond: [{
                        $and: [{
                            $gte: ["$_id.properties." + propertyCode, legend[i].to]
                        }, {
                            $lt: ["$_id.properties." + propertyCode, legend[i].from]
                        }]
                    }, legend[i].color, ""]
                });

            }
        }
        return project;
     });
}


Legend.getLegendStyleProjection = function(deliveryCode, propertyCode, callback) {
    var project = {
        '$project': {
            'coordinates': '$_id.geometry.coordinates',
            'type': '$_id.geometry.type',
            "ctx.form": '$_id.geometry.ctx.form',
            "ctx.fillStyle": {
                $concat: []
            },
            '_id': 0
        }
    };
    var delivery = deliveries.getDeliveryLegendObjectByCode(deliveryCode, propertyCode, function(legend){
        for (let i = 0; i < legend.length; i++) {
            if (i === 0) {
                project['$project']["ctx.fillStyle"]['$concat'].push({
                    $cond: [{
                        $and: [{
                            $gte: ["$properties." + propertyCode, legend[i].from]
                        }]
                    }, legend[i].color, ""]
                });
            } else if (i === legend.length - 1) {
                project['$project']["ctx.fillStyle"]['$concat'].push({
                    $cond: [{
                        $and: [{
                            $lt: ["$properties." + propertyCode, legend[i].to]
                        }]
                    }, legend[i].color, ""]
                });


            } else {
                project['$project']["ctx.fillStyle"]['$concat'].push({
                    $cond: [{
                        $and: [{
                            $gte: ["$properties." + propertyCode, legend[i].to]
                        }, {
                            $lt: ["$properties." + propertyCode, legend[i].from]
                        }]
                    }, legend[i].color, ""]
                });

            }
        }
        callback(project['$project']["ctx.fillStyle"]);
    });
}


var createLegendObject = function(legend, propertyCode) {
    var colors = calculateColors(legend);
    var levels = calculateLevelsText(legend, colors, propertyCode);
    return levels;
}


Legend.init = function() {
    deliveries.getAllDeliveries(function(deliveriesArray){
        for (var i = 0; i < deliveriesArray.length; i++) {
            for (var j = 0; j < deliveriesArray[i].properties.length; j++) {
                if (deliveriesArray[i].properties[j].legend === undefined ) {
                    deliveriesArray[i].properties[j].legend = { type : "dots" };
                }
                var legendObj = createLegendObject(deliveriesArray[i].properties[j].legend, deliveriesArray[i].properties[j].code);
                deliveries.setLegendObjtoDB(deliveriesArray[i].code, deliveriesArray[i].properties[j].code, legendObj);
            }
        }
    })
}


module.exports = Legend;