const { StatusCodes } = require("http-status-codes");
const ApiErrorsInterface = require("./ApiErrorsInterface");

class BadRequestError extends ApiErrorsInterface {
  constructor(msg) {
    super(msg, StatusCodes.BAD_REQUEST);
  }
}

module.exports = BadRequestError;
