var usersModel = require('../models/users');
var db = require('../models/db');

var usersController = {};


usersController.getAllUsers = function(req, res){
	usersModel.getUsersFromDB( function(err ,result){
		if(err) {
			console.log(err);
		} else {
			res.status(200).send(result)
		} 
	})
}

module.exports = usersController;