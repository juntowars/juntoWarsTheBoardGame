/**
 * Module dependencies
 */

var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('config');

var app = express();
var port = process.env.PORT || 3000;


// Connect to mongodb
var connect = function () {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
    if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

// Bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap application settings
require('./config/express')(app, passport);

// Bootstrap routes
require('./config/routes')(app, passport);

//app.listen(port);
var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection', function (socket) {

    socket.emit('message', { message: 'welcome to the chat' });

    socket.on('send', function (room,data) {
        io.sockets.in(room).emit('message', data);
    });

    socket.on('create', function(room) {
        console.log("someones in room: "+room);
        socket.join(room);
    });
});

console.log('Express app started on port ' + port);

/**
 * Expose
 */

module.exports = app;
