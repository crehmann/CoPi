const { CopyJobOptions } = require('./CopyJob')
const NotFoundError = require("./../errors/NotFoundError");
const rSyncExecutor = require('./RSyncExecutor')
const demoExecutor = require('./DemoExecutor')
const drive = require("../drive/Drive");
const copyJobs = [];

const getAll = () => copyJobs.map(x => x.toDto());

const get = (id) => {
    const copyJob = copyJobs.find(function (x) { return x.id === id });
    if (copyJob === undefined) throw new NotFoundError();
    return copyJob;
}

const createAndExecute = (sourceDevice, destinationDevice, flags, options) => {
    //const sourcePath = drive.getMountedDriveByDevice(sourceDevice);
    //onst destPath = drive.getMountedDriveByDevice(destinationDevice);
    const copyJobOptions = new CopyJobOptions(sourceDevice, destinationDevice, flags, options);
    const copyJob = rSyncExecutor.execute(copyJobOptions)
    copyJobs.push(copyJob);
    return copyJob.toDto();
};

const remove = (id) => {
    const copyJob = copyJobs.find(function (x) { return x.id === id });
    var index = copyJobs.indexOf(copyJob);
    if (index > -1) {
        copyJobs.splice(index, 1);
    } else {
        throw new NotFoundError();
    }
};

const cancel = (id) => {
    rSyncExecutor.cancel(get(id));;
}


module.exports = { getAll, get, createAndExecute, remove };