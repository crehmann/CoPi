const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const asyncHandler = require("express-async-handler");
const copyJobService = require("./CopyJobService");

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => res.send(copyJobService.getAll()));

router.get('/:copyJob', (req, res) => res.send(copyJobService.get(req.params.copyJob)));

router.post("/", asyncHandler(async (req, res, next) => {
    const source = req.body.source;
    const destination = req.body.destination;
    const flags = req.body.flags;
    const options = req.body.options;
    const copyJob = await copyJobService.createAndExecute(source, destination, flags, options);
    res.send(copyJob);
}));

router.post("/:copyJob/cancel", (req, res) => res.send(copyJobService.cancel(req.params.copyJob)));

router.delete('/:copyJob', (req, res) => res.send(copyJobService.remove(req.params.copyJob)));

module.exports = router;

