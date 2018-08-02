const Rsync = require("rsync");
const uuid = require("uuid/v1");

const { CopyJob, CopyJobExecution } = require("./CopyJob");
const socketService = require("../utils/SocketService");
const newLineRegExp = new RegExp("(?:\r\n|\r|\n)", "g");
const percentageRegExp = new RegExp("(d{1,3})%", "g");

const execute = copyJobOptions => {
  const id = uuid();
  const rsync = new Rsync()
    .executableShell("/bin/bash")
    .source(copyJobOptions.source)
    .destination(copyJobOptions.destination)
    .progress()
    .recursive()
    .flags(copyJobOptions.flags)
    .set("info=progress2");

  copyJobOptions.options.forEach(function(element) {
    rsync.set(element);
  }, this);

  const command = rsync.command();
  const execution = new CopyJobExecution(
    rsync.execute(
      (error, code, cmd) => {
        if (error) {
          execution.setFailed(error);
        } else {
          execution.setCompleted();
        }
        socketService.emit("copyJobProgress", {
          id: id,
          progress: execution.progress,
          state: execution.state
        });
      },
      data => {
        execution.setInProgress();

        const lines = Buffer.from(data)
          .toString("utf8")
          .split(newLineRegExp);
        for (let i = 0; i < lines.length; i++) {
          if (lines[i] === "") continue;
          const matches = percentageRegExp.exec(lines[i]);

          if (matches && matches.length >= 2) {
            execution.progress = parseInt(matches[1]);
            socketService.emit("copyJobProgress", {
              id: id,
              progress: execution.progress
            });
          } else {
            execution.appendOutput(lines[i]);
          }
        }
      }
    ),
    command
  );

  return new CopyJob(id, copyJobOptions, execution);
};

const cancel = copyJob => copyJob.copyJobExecution.process.kill();

module.exports = { execute, cancel };
