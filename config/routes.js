/*!
 * Module dependencies.
 */

// Note: We can require users, games and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

var users = require('users');
var games = require('games');
var base = require('base');
var auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

var gamesAuth = [auth.requiresLogin, auth.games.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

    // user routes
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);
    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }), users.session);
    app.get('/users/:userId', users.show);
    app.param('userId', users.load);

    app.get('/getBaseBoard', base.getMap);
    app.get('/games', games.index);
    app.get('/games/user/:userId', auth.requiresLogin, games.dashboard);
    app.post('/games/user/:userId', auth.requiresLogin, games.create);
    app.get('/games/view/:gameName', auth.requiresLogin, games.viewGame);
    app.get('/games/lobby/:gameName', auth.requiresLogin, games.viewGameLobby);
    app.get('/games/:id', games.show);
    app.get('/games/:id/edit', gamesAuth, games.edit);
    app.put('/games/:id', gamesAuth, games.update);
    app.delete('/games/:id', gamesAuth, games.destroy);

    // home route
    app.get('/', games.index);

    /**
     * Error handling
     */

    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page
        res.status(500).render('500', {error: err.stack});
    });

    // assume 404 since no middleware responded
    app.use(function (req, res, next) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });
}
