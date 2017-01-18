
var Legend = {};

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

    var delivery = config.getDeliveryByCode(deliveryCode);
    if (delivery !== undefined) {
        var property = config.getPropertyByCode(deliveryCode, propertyCode);
        if (property !== undefined) {
            var legend = property.legend.values;
            //log.debug(legend, legend.length);
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
        }
    }
    
    return project;
}


module.exports = Legend;