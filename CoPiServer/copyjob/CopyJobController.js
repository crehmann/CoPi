const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const asyncHandler = require("express-async-handler");
const copyJobService = require("./CopyJobService");

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => res.send(copyJobService.getAll()));

router.get('/:copyJob', (req, res) => res.send(copyJobService.get(req.params.copyJob)));

router.post("/", (req, res) => res.send(copyJobService
    .createAndExecute("/mnt/c/temp/BottomSheet/", "/mnt/c/temp/dest", ["r"], ["ignore-existing"])));

router.delete('/:copyJob', (req, res) => res.send(copyJobService.remove(req.params.copyJob)));

module.exports = router;

