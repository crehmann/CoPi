class CopyJob {
  constructor(id, copyJobOptions, copyJobExecution) {
    this._id = id;
    this._copyJobOptions = copyJobOptions;
    this._copyJobExecution = copyJobExecution;
  }

  get id() {
    return this._id;
  }
  get copyJobOptions() {
    return this._copyJobOptions;
  }
  get copyJobExecution() {
    return this._copyJobExecution;
  }

  toDto() {
    return {
      id: this._id,
      source: this._copyJobOptions.source,
      destination: this._copyJobOptions.destination,
      flags: this._copyJobOptions.flags,
      options: this._copyJobOptions.options,
      command: this._copyJobExecution.command,
      progress: this._copyJobExecution.progress,
      state: this._copyJobExecution.state,
      output: this._copyJobExecution.output,
      error: this._copyJobExecution.error
    };
  }
}

class CopyJobOptions {
  constructor(source, destination, flags, options) {
    this._source = source;
    this._destination = destination;
    this._flags = flags;
    this._options = options;
  }

  get source() {
    return this._source;
  }
  get destination() {
    return this._destination;
  }
  get flags() {
    return this._flags;
  }
  get options() {
    return this._options;
  }
}

class CopyJobExecution {
  constructor(process, command) {
    this._process = process;
    this._command = command;
    this._progress = 0;
    this._output = [];
    this._state = "inProgress";
    this._error = [];
  }

  get process() {
    return this._process;
  }
  get command() {
    return this._command;
  }
  get progress() {
    return this._progress;
  }
  get output() {
    return this._output;
  }
  get state() {
    return this._state;
  }
  get error() {
    return this._error;
  }

  set progress(progress) {
    this._progress = progress;
  }

  setInProgress() {
    this._state = "inProgress";
  }

  setCompleted() {
    this._state = "completed";
    this._progress = 100;
  }

  setCanceled() {
    this._state = "canceled";
  }

  setFailed(error) {
    this._error.push(error);
    this._state = "failed";
  }

  appendOutput(line) {
    this._output.push(line);
  }

  appendError(error) {
    this._error.push(error);
  }
}

module.exports = {
  CopyJob: CopyJob,
  CopyJobOptions: CopyJobOptions,
  CopyJobExecution: CopyJobExecution
};
