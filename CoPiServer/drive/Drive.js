const { lstat, readdir, realpath } = require("fs");
const { join } = require("path");
var pathIsInside = require("path-is-inside");
const AccessForbiddenError = require("./../errors/AccessForbiddenError");
const NotFoundError = require("./../errors/NotFoundError");

const readDirectory = source =>
  new Promise(function(fulfilled, rejected) {
    readdir(source, function(err, files) {
      if (err) {
        rejected(err);
      } else {
        fulfilled(files);
      }
    });
  });

const getFileInfo = path =>
  new Promise(function(fulfilled, rejected) {
    lstat(path, function(err, stats) {
      if (err) {
        rejected(err);
      } else {
        fulfilled(stats);
      }
    });
  });

const getDrives = () =>
  new Promise(function(fulfilled, rejected) {
    fulfilled([
      {
        device: "sda",
        raw: "/dev/sda",
        description: "Storage Device",
        size: 31914983424,
        mountpoints: [
          {
            path: "C:\\Temp"
          }
        ],
        isReadOnly: false
      }
    ]);
  });

const getMountedDriveByDevice = async device => {
  var drives = await getDrives();
  return (
    drives.find(
      drive => drive.device === device && drive.mountpoints.length > 0
    ) || Promise.reject(new NotFoundError())
  );
};

const getDriveContent = async (device, directory) => {
  var drive = await getMountedDriveByDevice(device);
  var resolvedPath = await resolvePath(
    join(drive.mountpoints[0].path, directory)
  );

  if (!pathIsInside(resolvedPath, drive.mountpoints[0].path)) {
    throw new AccessForbiddenError();
  }

  var files = await readDirectory(resolvedPath);
  return await Promise.all(
    files.map(async file => {
      const info = await getFileInfo(join(resolvedPath, file));
      if (info.isDirectory()) {
        return { name: file, isDirectory: true };
      } else {
        return {
          name: file,
          isDirectory: false,
          size: info.size
        };
      }
    })
  );
};

const resolvePath = path =>
  new Promise(function(fulfilled, rejected) {
    realpath(path, function(err, resolvedPath) {
      if (err) {
        rejected(err);
      } else {
        fulfilled(resolvedPath);
      }
    });
  });

module.exports = { getDrives, getDriveContent };
