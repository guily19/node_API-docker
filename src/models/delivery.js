var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deliverySchema = new Schema({
    title: String,
    from: String,
    to: String,
    description: String,
    code: String,
    satelite: String,
    daliveryDate: String,
    numberScenes: Number,
    category: String,
    properties: Array,
    type: String,
    legendObj: Object
},{
    collection : 'deliveries'
});


deliveryModel = mongoose.model("deliverySchema", deliverySchema);

module.exports = deliveryModel;