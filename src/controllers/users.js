var account = require('../models/account');
var mongoose = require('mongoose');

var usersController = {};


usersController.getAllUsers = function(req, res){
	account.getUsersFromDB( function(err ,result){
		if(err) {
			console.log(err);
		} else {
			res.status(200).send(result)
		} 
	})
}

usersController.register = function (req, res){
    account.register(new account({
        username: req.body.username,
	    time: new Date(),
	    status: "pending",
	    deliveries: []
    }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            res.send({
                success: true,
                user: user
            });
        }
    });
}

usersController.login = function (req, res, next) {
    account.authenticate()(req.body.username, req.body.password, function (err, user, options) {
        if (err) return next(err);
        if (user === false) {
            res.send({
                message: options.message,
                success: false
            });
        } else {
            req.login(user, function (err) {
                res.send({
                    success: true,
                    user: user
                });
            });
        }
    });
 
};

usersController.getLogin = function (req, res) {
    console.log(req.user);
    if (req.user) {
        return res.send({
            success: true,
            user: req.user
        });
    }
    res.send({
        success: false,
        message: 'not authorized'
    });
};

module.exports = usersController;