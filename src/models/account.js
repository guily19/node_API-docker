var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    time: {type: Date, default: Date.now},
    status: String,
    deliveries: Array
},{
    collection : 'accounts'
});

var options = ({missingPasswordError: "Wrong password"});
Account.plugin(passportLocalMongoose,options);

module.exports = mongoose.model("Account", Account);