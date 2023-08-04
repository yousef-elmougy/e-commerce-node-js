const ApiError = require("../utils/apiError");

const errorInDev = (err, res) =>
  res.status(400).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const errorInProd = (err, res) =>
  res.status(400).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
  });
const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again..", 401);

const handleJwtExpired = () =>
  new ApiError("Expired token, please login again..", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    errorInDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    errorInProd(err, res);
  }
};

module.exports = globalError;
