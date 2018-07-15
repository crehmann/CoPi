const app = require("express")();
const bodyParser = require("body-parser");
const server = require('http').Server(app);
const io = require('socket.io')(server);
const socketService = require('./utils/SocketService');
const driveController = require("./drive/DriveController");
const copyJobController = require("./copyjob/CopyJobController");

socketService.setIo(io)

app.use(bodyParser.json());
app.use("/drives", driveController);
app.use("/copyjobs", copyJobController);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

module.exports = server;
