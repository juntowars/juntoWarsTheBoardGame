/**
 * Created by ciaranwhyte on 26/04/15.
 */
//var io = require('socket.io').listen(app.listen(port));

module.exports = function (io) {
    io.sockets.on('connection', function (socket) {

        socket.emit('message', { message: 'welcome to the chat' });

        socket.on('send', function (room,data) {
            io.sockets.in(room).emit('message', data);
        });

        socket.on('create', function( room, user) {
            console.log( user + " is in room "+room);
            socket.join(room);
            socket.emit('userJoined', { user: user });
        });
    });
}
