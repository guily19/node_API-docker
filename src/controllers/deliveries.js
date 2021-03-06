var Deliveries = {};
var Delivery = require('../models/delivery');


Deliveries.getDeliveryLegendObjectByCode = function(deliveryCode, propertyCode,  callback){
	var legend = undefined;
	var delivery = Delivery.findOne({ 'code': deliveryCode }, function(err,data){
		if(err){
			console.log("Err:",err);
			callback(undefined)
		} else {
			properties = data.properties;
			for(var i = 0; i < properties.length; ++i){
				if(properties[i].code === propertyCode){
					callback(properties[i].legendObj);
				}
			}
		}
	})
}

Deliveries.getAllDeliveries= function(callback){
	var delivery = Delivery.find({}, function(err,deliveries){
		if(err){
			console.log("Err:",err);
			callback(undefined)
		} else {
			callback(deliveries);
		}
	})
}


Deliveries.getScaleByCode = function(deliveryCode){
	var scale = undefined;
	delivery.getScaleByCode(deliveryCode, function(err,data){
		if(err){
			console.log(err);
			return(undefined)
		} else {
			scale = data;
			return(data);
		}
	})
}

Deliveries.setLegendObjtoDB = function(deliveryCode, propertyCode, legendObj){
	var delivery = Delivery.update({'code' : deliveryCode, 'properties.code' : propertyCode},{$set:{ 'properties.$.legendObj' : legendObj}},function(err, message){
		if(err){
			console.log(err)
		} else {
			console.log(message)
		}
	});
}


module.exports = Deliveries;