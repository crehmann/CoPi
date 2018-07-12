const { CopyJobOptions } = require('./CopyJob')
const NotFoundError = require("./../errors/NotFoundError");
const rSyncExecutor = require('./RSyncExecutor')
const demoExecutor = require('./DemoExecutor')
const copyJobs = [];

const getAll = () => copyJobs.map(x => x.toDto());

const get = (id) => {
    const copyJob = copyJobs.find(function (x) { return x.id === id });
    if (copyJob === undefined) throw new NotFoundError();
    return copyJob;
}

const createAndExecute = (source, destination, dryRun) => {
    const options = new CopyJobOptions(source, destination, dryRun);
    const copyJob = demoExecutor.execute(options)
    copyJobs.push(copyJob);
    return copyJob.toDto();
};

const remove = (id) => {
    const copyJob = copyJobs.find(function (x) { return x.id === id });
    var index = copyJobs.indexOf(copyJob);
    if (index > -1) {
        copyJobs.splice(index, 1);
        demoExecutor.cancel(copyJob);
    } else {
        throw new NotFoundError();
    }
};


module.exports = { getAll, get, createAndExecute, remove };