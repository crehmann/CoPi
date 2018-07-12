const { CopyJobOptions } = require('./CopyJob')
const RSyncExecutor = require('./RSyncExecutor')
const DemoExecutor = require('./DemoExecutor')
const NotFoundError = require("./../errors/NotFoundError");
const copyJobs = [];

const getAll = () => copyJobs.map(x => x.toDto());

const get = (id) => {
    const copyJob = copyJobs.find(function (x) { return x.id === id });
    if (copyJob === undefined) throw new NotFoundError();
    return copyJob;
}

const createAndExecute = (source, destination, dryRun) => {
    const options = new CopyJobOptions(source, destination, dryRun);
    const copyJob = DemoExecutor.execute(options)
    copyJobs.push(copyJob);
    return copyJob.toDto();
};

module.exports = { getAll, get, createAndExecute };