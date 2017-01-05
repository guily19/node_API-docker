var db = require('../models/db');

var userModel = {}

userModel.getUsersFromDB = function (callback) {
	var collection = "accounts";
    db(function(db) {
        db.collection(collection, function(err, collection) {
        	// log.debug(collection)
            collection.find().toArray(function(err, result) {
                callback(err, result);
            });
        });
    });
}

module.exports = userModel;