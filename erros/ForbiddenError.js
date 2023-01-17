const ApiErrorsInterface = require("./ApiErrorsInterface");
const { StatusCodes } = require("http-status-codes");

class ForbiddenError extends ApiErrorsInterface {
  constructor(msg) {
    super(msg, StatusCodes.FORBIDDEN);
  }
}

module.exports = ForbiddenError;
