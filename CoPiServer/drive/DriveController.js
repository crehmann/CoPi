const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Drive = require("./Drive");

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    var drives = await Drive.getDrives();
    res.status(200).send(drives);
  })
);
router.get(
  "/:drive",
  asyncHandler(async (req, res, next) => {
    res
      .status(200)
      .send(await Drive.getDriveContent(req.params.drive, req.query.path));
  })
);

module.exports = router;
