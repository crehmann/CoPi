var express = require("express");
var app = express();

var AppError = require("./errors/AppError");

var DriveController = require("./drive/DriveController");

app.use("/drives", DriveController);

module.exports = app;
