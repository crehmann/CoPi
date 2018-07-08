const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const asyncHandler = require("express-async-handler");

router.use(bodyParser.urlencoded({ extended: true }));

const CopyJob = require("./CopyJob");

router.get('/', (req, res) => res.send(CopyJob.getAll()));


router.post("/", (req, res) => res.send(CopyJob.createAndExecute("/boot", "/media/usb0", true)));

module.exports = router;

