const { CopyJob, CopyJobExecution } = require('./CopyJob')

const execute = (copyJobOptions) => {
    const execution = new CopyJobExecution(undefined, "DummyCommand");

    var counter = 0;
    const interval = setInterval(() => {
        counter++;

        if (counter > 10) {
            clearInterval(interval);
            execution.completed = true;
            return;
        }

        execution.progress = counter * 10;
        execution.appendFile("SomeFile_" + counter + ".png");

    }, 1000);
    return new CopyJob(copyJobOptions, execution)
}

module.exports = { execute };