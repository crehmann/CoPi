const uuid = require('uuid/v1');

class CopyJob {
    constructor(copyJobOptions, copyJobExecution) {
        this._id = uuid();
        this._copyJobOptions = copyJobOptions;
        this._copyJobExecution = copyJobExecution;
    }

    get id() { return this._id; }
    get copyJobOptions() { return this._copyJobOptions; }
    get copyJobExecution() { return this._copyJobExecution; }

    toDto() {
        return {
            id: this._id,
            source: this._copyJobOptions.source,
            destination: this._copyJobOptions.destination,
            dryRun: this._copyJobOptions.dryRun,
            command: this._copyJobExecution.command,
            progress: this._copyJobExecution.progress,
            files: this._copyJobExecution.files,
            completed: this._copyJobExecution.completed,
            error: this._copyJobExecution.error
        };
    }
}

class CopyJobOptions {
    constructor(source, destination, dryRun) {
        this._source = source;
        this._destination = destination;
        this._dryRun = dryRun;
    }

    get source() { return this._source; }
    get destination() { return this._destination; }
    get dryRun() { return this._dryRun; }
}

class CopyJobExecution {
    constructor(process, command) {
        this._process = process;
        this._command = "";
        this._progress = 0;
        this._files = [];
        this._completed = false;
        this._error = null;
    }

    get process() { return this._process; }
    get command() { return this._command; }
    get progress() { return this._progress; }
    get files() { return this._files; }
    get completed() { return this._completed; }
    get error() { return this._error; }

    set progress(progress) { this._progress = progress; }
    set completed(completed) { this._completed = completed; }
    set error(error) {
        this._error = error;
    }

    appendFile(file) {
        this._files.push(file);
    }
}

module.exports = {
    CopyJob: CopyJob,
    CopyJobOptions: CopyJobOptions,
    CopyJobExecution: CopyJobExecution
}