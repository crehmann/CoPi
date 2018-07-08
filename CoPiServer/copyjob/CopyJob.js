const Rsync = require('rsync');
const uuid = require('uuid/v1');
const copyJobs = [];

class CopyJob {
    constructor(source, destination, command) {
        this._id = uuid();
        this._source = source;
        this._destination = destination;
        this._command = command;
        this._progress = 0;
        this._files = [];
        this._completed = false;
        this._error = null;
    }

    get id() { return this._id; }
    get pid() { return this._pid; }
    get source() { return this._source; }
    get destination() { return this._destination; }
    get progress() { return this._progress; }
    get files() { return this._files; }
    get completed() { return this._completed; }
    get error() { return this._error; }

    set pid(pid) { this._pid = pid; }
    set progress(progress) { this._progress = progress; }
    set completed(completed) { this._completed = completed; }
    set error(error) {
        this._error = error;
    }

    appendFile(file) {
        this._files.push(file);
    }
}

const getAll = () => { return copyJobs; }

const createAndExecute = (source, destination, dryRun) => {
    let copyJob = new CopyJob(source, destination);
    let rsync = new Rsync()
        .source(source)
        .destination(destination)
        .progress()
        .recursive()
        .set('info=progress2');

    if (dryRun) {
        rsync.dry();
    }

    copyJob.command = rsync.command();
    copyJob.pid = rsync.execute(function (error, code, cmd) {
        copyJob.completed = true;
        copyJob.error = error;
    }, function (data) {
        let lines = Buffer.from(data).toString('utf8').split(/(?:\r\n|\r|\n)/g);
        for (let line = 0; line < lines.length; line++) {
            var matches = lines[line].match(/\d{1,3}\%/sg);
            if (matches && matches.length == 1) {
                copyJob.progress = parseInt(matches[0].substr(0, matches[0].length));
            }else{
                copyJob.appendFile(lines[line]);
            }
        }

    });


    copyJobs.push(copyJob);
    return copyJob;
};

module.exports = { getAll, createAndExecute };
