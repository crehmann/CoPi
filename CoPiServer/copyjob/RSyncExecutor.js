const Rsync = require("rsync");
const uuid = require("uuid/v1");

const { CopyJob, CopyJobExecution } = require("./CopyJob");
const socketService = require("../utils/SocketService");

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
        console.log("error:" + error);
        console.log("code:" + code);
        console.log("cmd:" + cmd);

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
          .split(new RegExp("(?:\r\n|\r|\n)", "g"));

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          if (line === "") continue;

          const matches = /(\d{1,3})%/g.exec(line);

          if (matches && matches.length >= 2) {
            execution.progress = parseInt(matches[1]);
            console.log("Match:" + parseInt(matches[1]));
            socketService.emit("copyJobProgress", {
              id: id,
              progress: execution.progress,
              state: execution.state
            });
          } else {
            execution.appendOutput(line);
          }
        }
      },
      errorStream => {
        execution.appendError(Buffer.from(errorStream).toString("utf8"));
      }
    ),
    command
  );

  return new CopyJob(id, copyJobOptions, execution);
};

const cancel = copyJob => copyJob.copyJobExecution.process.kill();

module.exports = { execute, cancel };
