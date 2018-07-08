var express = require("express");
var app = express();

var AppError = require("./errors/AppError");

var DriveController = require("./drive/DriveController");
var CopyJobController = require("./copyjob/CopyJobController");

app.use("/drives", DriveController);
app.use("/copyjobs", CopyJobController);

module.exports = app;
