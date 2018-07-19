const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const drive = require("../drive/Drive");

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    res.download(
      await drive.getAbsolutFilePath(req.query.device, req.query.path)
    );
  })
);

module.exports = router;
