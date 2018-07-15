const { lstat, readdir, realpath } = require("fs");
const { join } = require("path");
var pathIsInside = require("path-is-inside");
const drivelist = require("drivelist");
const AccessForbiddenError = require("./../errors/AccessForbiddenError");
const NotFoundError = require("./../errors/NotFoundError");

const readDirectory = source =>
  new Promise(function (fulfilled, rejected) {
    readdir(source, function (err, files) {
      if (err) {
        rejected(err);
      } else {
        fulfilled(files);
      }
    });
  });

const getFileInfo = path =>
  new Promise(function (fulfilled, rejected) {
    lstat(path, function (err, stats) {
      if (err) {
        rejected(err);
      } else {
        fulfilled(stats);
      }
    });
  });

const getDrives = () =>
  new Promise(function (fulfilled, rejected) {
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

const getDriveContent = async (device, directory) => {
  var drive = await getMountedDriveByDevice(device);
  var mountpoint = await getFirstMountpointOfDevice(drive);
  var resolvedPath = await resolvePath(join(mountpoint, directory));

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

const getFirstMountpointOfDevice = async device => {
  var drives = await getDrives();
  return new Promise(function (fulfilled, reject) {
    var drive = drives.find(drive => drive.device === device && drive.mountpoints.length > 0);
    if (drive) {
      fulfilled(drive.mountpoints[0]);
    } else {
      reject(new NotFoundError())
    }

  })
}

const resolvePath = path =>
  new Promise(function (fulfilled, rejected) {
    realpath(path, function (err, resolvedPath) {
      if (err) {
        rejected(err);
      } else {
        fulfilled(resolvedPath);
      }
    });
  });

module.exports = { getDrives, getDriveContent, getFirstMountpointOfDevice };
