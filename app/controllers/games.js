/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Games = mongoose.model('Games');
var utils = require('../../lib/utils');
var extend = require('util')._extend;

/**
 * Load
 */

exports.load = function (req, res, next, id) {
    var User = mongoose.model('User');

    Games.load(id, function (err, Games) {
        if (err) return next(err);
        if (!Games) return next(new Error('not found'));
        req.Games = Games;
        next();
    });
};

/**
 * Home
 */

exports.index = function (req, res) {
    res.render('games/index');
};

/**
 * Dashboard
 */

exports.dashboard = function (req, res) {
    Games.getUsersGamesList(req.user.id,doRender);
    function doRender(gameList){
        res.render('games/dashboard', {gameList: gameList });
    }
};


/**
 * New Games
 */

exports.new = function (req, res) {
    res.render('games/new', {
        title: 'New Games',
        Games: new Games({})
    });
};

exports.create = function (req, res) {
    var game = new Games();
    game.name = req.body.gameTitle;
    game.adminUser = req.user.id;
    game.userList.geoEngineers = req.user.id;
    game.save(function (err) {
        if (err) {
            return res.render('games/dashboard', {
                error: utils.errors(err.errors),
                title: 'Error Creating Game'
            });
        }

        Games.getUsersGamesList(req.user.id,doRender);
        function doRender(gameList){
            res.render('games/dashboard', {gameList: gameList });
        }
    });
};

exports.viewGame = function (req, res) {
    var gameTitle =  req.url.replace("/games/view/","");
    console.log("Viewing gameTitle: "+gameTitle);
    Games.getGameByTitle(req.user.id,gameTitle,doRender);
    function doRender(gameDoc){
        res.render('games/viewGame', {gameList: gameDoc });
    }
};

/**
 * Edit an Games
 */

exports.edit = function (req, res) {
    res.render('games/edit', {
        title: 'Edit ' + req.Games.title,
        Games: req.Games
    });
};

/**
 * Update Games
 */

exports.update = function (req, res) {
    var Games = req.Games;
    var images = req.files.image
        ? [req.files.image]
        : undefined;

    // make sure no one changes the user
    delete req.body.user;
    Games = extend(Games, req.body);

    Games.uploadAndSave(images, function (err) {
        if (!err) {
            return res.redirect('/games/' + Games._id);
        }

        res.render('games/edit', {
            title: 'Edit Games',
            Games: Games,
            errors: utils.errors(err.errors || err)
        });
    });
};

/**
 * Show
 */

exports.show = function (req, res) {
    res.render('games/show', {
        title: req.Games.title,
        Games: req.Games
    });
};

/**
 * Delete an Games
 */

exports.destroy = function (req, res) {
    var Games = req.Games;
    Games.remove(function (err) {
        req.flash('info', 'Deleted successfully');
        res.redirect('/games');
    });
};
