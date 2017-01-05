var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var config = require('../config/config');

//the MongoDB connection
var connectionInstance;

module.exports = function(callback) {
    //if already we have a connection, don't connect to database again
    if (connectionInstance) {
        callback(connectionInstance);
        return;
    }

    var db = new Db(config.db.name, new Server(config.db.host, config.db.port, {
        auto_reconnect: true
    }));
    db.open(function(error, databaseConnection) {
      if (error) {
        console.log(error)
        throw new Error(error);
      } else {
        console.log("Database connection init");
        connectionInstance = databaseConnection;
        callback(databaseConnection);
      }
    });
};