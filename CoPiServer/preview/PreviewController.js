const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const preview = require("./Preview");

router.get(
  "/raw",
  asyncHandler(async (req, res, next) => {
    const previewImage = await preview.extractRaw(
      req.query.device,
      req.query.path
    );
    const resizedImage = await preview.resize(previewImage, "400x400");
    res.set("Content-Type", "media/jpg");
    res.write(resizedImage, "binary");
    res.end(null, "binary");
  })
);

router.get(
  "/image",
  asyncHandler(async (req, res, next) => {
    const previewImage = await preview.resizeImage(
      req.query.device,
      req.query.path,
      "400x400"
    );
    res.set("Content-Type", "media/jpg");
    res.write(previewImage, "binary");
    res.end(null, "binary");
  })
);

module.exports = router;
