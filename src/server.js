'use strict';
var mongoose = require('mongoose')
var config = require('./config/config')
var users = require('./controllers/users')
const express = require('express')
var db = require('./models/db')

// Constants
const PORT = 8080;


// DB conection
mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name);

// App
const app = express();
app.get('/', function (req, res) {
  res.send('Hello world\n');
});

app.get('/users', users.getAllUsers);

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);