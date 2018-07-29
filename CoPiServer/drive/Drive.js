const { lstat, readdir, realpath } = require("fs");
const { join } = require("path");
var pathIsInside = require("path-is-inside");
const drivelist = require("drivelist");
const AccessForbiddenError = require("./../errors/AccessForbiddenError");
const NotFoundError = require("./../errors/NotFoundError");

const getDriveContent = async (devicePath, directory) => {
  var mountpoint = await getFirstMountpointOfDevicePath(devicePath);
  var resolvedPath = await resolvePath(join(mountpoint, directory));

  if (!pathIsInside(resolvedPath, mountpoint)) {
    throw new AccessForbiddenError();
  }

  var files = await readDirectory(resolvedPath);
  return await Promise.all(
    files.map(async file => {
      const info = await getFileInfo(join(resolvedPath, file));
      if (info.isDirectory()) {
        return {
          name: file,
          isDirectory: true,
          birthtime: info.birthtimeMs,
          mtimeMs: info.mtimeMs
        };
      } else {
        return {
          name: file,
          isDirectory: false,
          size: info.size,
          birthtime: info.birthtimeMs,
          mtimeMs: info.mtimeMs
        };
      }
    })
  );
};

const getAbsoluteFilePath = async (devicePath, filePath) => {
  var mountpoint = await getFirstMountpointOfDevicePath(devicePath);
  var resolvedPath = await resolvePath(join(mountpoint, filePath));

  if (!pathIsInside(resolvedPath, mountpoint)) {
    throw new AccessForbiddenError();
  }

  return Promise.resolve(resolvedPath);
};

const getFirstMountpointOfDevicePath = async devicePath => {
  var drives = await getDrives();
  return new Promise(function(fulfilled, reject) {
    var drive = drives.find(
      drive => drive.devicePath === devicePath && drive.mountpoints.length > 0
    );
    if (drive) {
      fulfilled(drive.mountpoints[0]);
    } else {
      reject(new NotFoundError());
    }
  });
};

const getDrives = () =>
  new Promise(function(fulfilled, rejected) {
    drivelist.list((error, drives) => {
      if (error) {
        rejected(error);
      } else {
        fulfilled(
          drives
            .map(d => ({
              device: d.device,
              devicePath: d.devicePath,
              description: d.description,
              size: d.size,
              mountpoints: d.mountpoints,
              isReadOnly: d.isReadOnly,
              isSystem: d.isSystem
            }))
            .filter(d => !d.isSystem)
        );
      }
    });
  });

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

module.exports = {
  getDrives,
  getDriveContent,
  getFirstMountpointOfDevicePath,
  getAbsoluteFilePath
};
