const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  const errorObject = {
    status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong, try again later",
  };
  if (err.name === "ValidationError") {
    errorObject.status = StatusCodes.BAD_REQUEST;
    errorObject.message = err.message;
  }
  if (err.name === "CastError") {
    errorObject.status = StatusCodes.BAD_GATEWAY;
    errorObject.message = "Invalid id";
  }
  if (err.code === 11000) {
    errorObject.status = StatusCodes.CONFLICT;
    errorObject.message = `${Object.keys(err.keyValue)} is duplicated`;
  }
  res
    .status(errorObject.status)
    .json({ success: false, err: errorObject.message });
};

module.exports = errorHandler;
