var pointsTile = require('./pointsTile');
var _ = require('underscore');

var tileBehavior = {};


var serviceDescriptions = [
    {
        deliveryType: 'pointTile',
        service: pointsTile
    }
];

tileBehavior.getGenerator = function (deliveryType) {
    //asuming you have underscore, otherwise, just iterate the array to look for the proper service
    return _.find(serviceDescriptions, {deliveryType: deliveryType}).service; 
 };



module.exports = tileBehavior;