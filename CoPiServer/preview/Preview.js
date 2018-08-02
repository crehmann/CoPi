const sharp = require("sharp");
const drive = require("../drive/Drive");
const exiv2 = require("exiv2");

const resize = (buffer, size) => {
  return new Promise(resolve => {
    if (!size) return resolve(buffer);
    const regex = /^(\d+)x(\d+)$/;
    const [, w, h] = regex.exec(size);

    const width = Number(w);
    const heigth = Number(h);

    return sharp(buffer)
      .resize(width, heigth)
      .max()
      .toFormat("jpeg")
      .toBuffer()
      .then(resolve);
  });
};

const extractRaw = async (device, filePath) => {
  const abosluteFilePath = await drive.getAbsoluteFilePath(device, filePath);
  return new Promise((resolve, reject) => {
    exiv2.getImagePreviews(abosluteFilePath, function(err, previews) {
      if (err) {
        reject(err);
      } else {
        resolve(previews[0]);
      }
    });
  });
};

const resizeImage = async (device, filePath, size) => {
  const abosluteFilePath = await drive.getAbsoluteFilePath(device, filePath);
  return await resize(abosluteFilePath, size);
};

module.exports = {
  resize,
  resizeImage,
  extractRaw
};
