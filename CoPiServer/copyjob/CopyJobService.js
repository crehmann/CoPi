const { CopyJobOptions } = require("./CopyJob");
const NotFoundError = require("./../errors/NotFoundError");
const rSyncExecutor = require("./RSyncExecutor");
const demoExecutor = require("./DemoExecutor");
const drive = require("../drive/Drive");
const copyJobs = [];

const getAll = () => copyJobs.map(x => x.toDto());

const get = id => find(id).toDto();

const createAndExecute = async (
  sourceDevicePath,
  destinationDevicePath,
  flags,
  options
) => {
  const sourcePath = await drive.getFirstMountpointOfDevicePath(
    sourceDevicePath
  );
  const destPath = await drive.getFirstMountpointOfDevicePath(
    destinationDevicePath
  );
  const copyJobOptions = new CopyJobOptions(
    sourcePath,
    destPath,
    flags,
    options
  );
  const copyJob = rSyncExecutor.execute(copyJobOptions);
  copyJobs.push(copyJob);
  return Promise.resolve(copyJob.toDto());
};

const remove = id => {
  const copyJob = find(id);
  copyJobs.splice(copyJobs.indexOf(copyJob), 1);
};

const cancel = id => {
  rSyncExecutor.cancel(find(id));
};

const find = id => {
  const copyJob = copyJobs.find(function(x) {
    return x.id === id;
  });
  if (copyJob === undefined) throw new NotFoundError();
  return copyJob;
};

module.exports = { getAll, get, createAndExecute, remove, cancel };
