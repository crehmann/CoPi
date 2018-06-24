module.exports = class NotFoundError extends require("./AppError") {
  constructor(message) {
    // Providing default message and overriding status code.
    super(message || "Resource not found", 404);
  }
};
