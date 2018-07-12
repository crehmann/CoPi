let socketIo;

const setIo = (io) => socketIo = io;

const emit = (suject, message) => socketIo.emit(suject, message);

module.exports = { setIo, emit };