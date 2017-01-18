var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var account = require('../models/account'); 
var users = require('../controllers/users');
var tiles = require('../controllers/tiles');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');

exports = module.exports = function(app) {
    try {
    	//initialize passport
	    passport.use(account.createStrategy());
	    // use static serialize and deserialize of model for passport session support
	    passport.serializeUser(account.serializeUser());
	    passport.deserializeUser(account.deserializeUser());
	 
	    //need this according to passport guide
	    app.use(cookieParser());
	    app.use(session({
	        secret: 'the princess and the frog',
	        saveUninitialized: true,
	        resave: true
	    }));
	    app.use(passport.initialize());
	    app.use(passport.session());
	 	
	 	app.use(bodyParser.urlencoded());
		app.use(bodyParser.json());
	    //routes
	    app.post('/login', users.login);
	    app.post('/register', users.register);

	    app.get('/login', users.getLogin);
        app.get('/users', users.getAllUsers);

        app.get('/tiles/:deliveryCode/:propertyCode/:z/:x/:y', tiles.getTileZXY);

    } catch (e) {
        console.log(e);
    }

};