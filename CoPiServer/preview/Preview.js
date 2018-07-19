const sharp = require("sharp");
const drive = require("../drive/Drive");
const spawn = require("cross-spawn");

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
    const exif = spawn("exiftool", ["-b", "-previewimage", abosluteFilePath], {
      stdio: "pipe"
    });
    const buffers = [];

    exif.stdout.on("data", data => buffers.push(data));
    exif.stderr.on("data", err => reject(err.toString()));

    exif.on("close", code => {
      if (code !== 0) {
        const error = new Error(`exiftool ended with code ${code}`);
        return reject(error);
      }

      const buffer = Buffer.concat(buffers);
      return resolve(buffer);
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
