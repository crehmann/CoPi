var app = require("express")();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var socketService = require('./utils/SocketService');
var driveController = require("./drive/DriveController");
var copyJobController = require("./copyjob/CopyJobController");

socketService.setIo(io)

app.use("/drives", driveController);
app.use("/copyjobs", copyJobController);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

module.exports = server;
