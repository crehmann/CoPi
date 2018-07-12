const Rsync = require('rsync');
const { CopyJob, CopyJobExecution } = require('./CopyJob')

const execute = (copyJobOptions) => {
    const rsync = new Rsync()
        .source(source)
        .destination(destination)
        .progress()
        .recursive()
        .set('info=progress2');

    if (copyJobOptions.dryRun) {
        rsync.dry();
    }
    const execution = new CopyJobExecution(
        rsync.execute((error, code, cmd) => {
            execution.completed = true;
            execution.error = error;
        }, (data) => {
            const lines = Buffer.from(data).toString('utf8').split(/(?:\r\n|\r|\n)/g);
            for (let line = 0; line < lines.length; line++) {
                const regex = /(\d{1,3})\%/sg;
                const matches = regex.exec(line)

                if (matches && matches.length >= 2) {
                    execution.progress = parseInt(matches[1]);
                } else {
                    execution.appendFile(lines[line]);
                }
            }

        }),
        rsync.command())

    return new CopyJob(copyJobOptions, execution)
}

module.exports = { execute };