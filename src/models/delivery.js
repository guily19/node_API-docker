var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Delivery = new Schema({
    title: String,
    from: String,
    to: String,
    description: String,
    code: String,
    satelite: String,
    daliveryDate: String,
    numberScenes: number,
    category: String,
    properties: Array,
    type: String
},{
    collection : 'deliveries'
});



module.exports = mongoose.model("Delivery", delivery);