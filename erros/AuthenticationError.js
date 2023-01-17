const { StatusCodes } = require("http-status-codes");
const ApiErrorsInterface = require("./ApiErrorsInterface");

class AuthenticationError extends ApiErrorsInterface {
  constructor(msg) {
    super(msg, StatusCodes.UNAUTHORIZED);
  }
}

module.exports = AuthenticationError;
