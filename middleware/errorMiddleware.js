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

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  process.env.NODE_ENV === "development"
    ? errorInDev(err, res)
    : errorInProd(err, res);
};

module.exports = globalError;
