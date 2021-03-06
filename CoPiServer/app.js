const app = require("express")();
const bodyParser = require("body-parser");
const server = require("http").Server(app);
const socketService = require("./utils/SocketService");
const driveController = require("./drive/DriveController");
const copyJobController = require("./copyjob/CopyJobController");
const downloadController = require("./download/DownloadController");
const previewController = require("./preview/PreviewController");

socketService.init(server);

app.use(bodyParser.json());
app.use("/drives", driveController);
app.use("/copyjobs", copyJobController);
app.use("/download", downloadController);
app.use("/preview", previewController);
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

module.exports = server;
