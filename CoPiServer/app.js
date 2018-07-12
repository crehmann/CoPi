var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var DriveController = require("./drive/DriveController");
var CopyJobController = require("./copyjob/CopyJobController");

app.use("/drives", DriveController);
app.use("/copyjobs", CopyJobController);

module.exports = app;
