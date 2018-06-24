module.exports = class AccessForbiddenError extends require("./AppError") {
  constructor(message) {
    // Providing default message and overriding status code.
    super(message || "Access forbidden", 403);
  }
};
