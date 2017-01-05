var users = require('./controllers/users');

exports = module.exports = function(app, passport) {
    try {

        app.get('/users', users.getAllUsers);

    } catch (e) {
        log.error(e);
    }

};