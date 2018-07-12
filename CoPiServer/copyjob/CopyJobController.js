const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const asyncHandler = require("express-async-handler");
const CopyJobService = require("./CopyJobService");

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => res.send(CopyJobService.getAll()));


router.get('/:copyJob', (req, res) => res.send(CopyJobService.get(req.params.copyJob)));

router.post("/", (req, res) => res.send(CopyJobService.createAndExecute("/boot", "/media/usb0", true)));

module.exports = router;

