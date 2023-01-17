const { StatusCodes } = require("http-status-codes");
const ApiErrorsInterface = require("./ApiErrorsInterface");

class NotFoundItemError extends ApiErrorsInterface {
  constructor(msg) {
    super(msg, StatusCodes.NOT_FOUND);
  }
}

module.exports = NotFoundItemError;
