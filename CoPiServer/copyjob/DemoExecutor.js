const uuid = require('uuid/v1');

const { CopyJob, CopyJobExecution } = require('./CopyJob')
const socketService = require('../utils/SocketService');

const execute = (copyJobOptions) => {
    var counter = 0;
    const execution = new CopyJobExecution(undefined, "DummyCommand");
    const copyJob = new CopyJob(uuid(), copyJobOptions, execution)
    const interval = setInterval(() => {
        counter++;

        if (counter > 10) {
            clearInterval(interval);
            execution.completed = true;
            return;
        }

        execution.progress = counter * 10;
        execution.appendFile("SomeFile_" + counter + ".png");
        socketService.emit("copyJobProgress", { id: copyJob.id, progress: execution.progress });

    }, 1000);
    return copyJob;
}

const cancel = (copyJob) => { };

module.exports = { execute, cancel };