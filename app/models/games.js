/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Games Schema
 */

var GamesSchema = new Schema({
    name: {type: String, default: '', trim: true, unique: true},
    state: {
        round: {type: Number, default: '1'},
        phase: {type: String, default: '1'},
        nextToMove: {type: String, default: ''}
    },
    userList: {
        geoEngineers: {type: String, default: ''},
        settlers: {type: String, default: ''},
        kingdomWatchers: {type: String, default: ''},
        periplaneta: {type: String, default: ''},
        reduviidae: {type: String, default: ''},
        guardians: {type: String, default: ''}
    },
    chatLog: [{
        body: {type: String, default: ''},
        user: {type: String},
        createdAt: {type: Date, default: Date.now}
    }],
    gameLog: [{
        body: {type: String, default: ''},
        createdAt: {type: Date, default: Date.now}
    }],
    publicJoin: {type: Boolean, default: true},
    adminUser: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now}
});

GamesSchema.path('name').required(true, 'Games name cannot be blank');
GamesSchema.methods = {};
GamesSchema.statics = {
    getUsersGamesList: function (userId, callback) {
        var _listOfGameNames = [];

        var _query = this.find(
            {"adminUser": userId},
            {"name": 1},
            {
                sort: {createdAt: -1}
            });

        _query.exec(function (err, gamesOwned) {

            if (err) return next(err);
            // results to array
            gamesOwned.forEach(function (game) {
                _listOfGameNames.push(game.name.replace(/\s+/g, '-'));
            });
            // return array
            callback(_listOfGameNames);
        });
    },

    getGameByTitle: function (userId, gameTitle, callback) {
        var _query = this.find({"name": gameTitle});
        _query.exec(function (err, gameDoc) {
            if (err) return next(err);
            callback(gameDoc);
        });
    }
};

mongoose.model('Games', GamesSchema);
