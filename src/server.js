'use strict';
var mongoose = require('mongoose')
var config = require('./config/config')
var users = require('./controllers/users')
var legend = require('./controllers/legend')
const express = require('express')


var db = require('./models/db')

// Constants
const PORT = 8080;


// DB conection
mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name);
require('./models/account');
require('./models/delivery');


// App
const app = express();

require('./routes/routes')(app);


legend.init();

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
