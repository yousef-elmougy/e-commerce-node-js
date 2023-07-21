const { Types } = require("mongoose");
const ApiError = require("../utils/apiError");

const validateMongoId = (paramName) => (req, res, next) => {
  const id = req.params[paramName] || req.body[paramName];

  if (id && Array.isArray(id)) {
    // If the parameter is an array, validate each element
    for (let i = 0; i < id.length; i++) {
      if (!Types.ObjectId.isValid(id[i])) {
        next(new ApiError(`Invalid ${paramName} ID format: ${id[i]}`, 404));
      }
    }
  } else if (id && !Types.ObjectId.isValid(id)) {
    next(new ApiError(`Invalid ${paramName} ID format: ${id}`, 404));
  }

  next();
};

const required = (paramName) => (req, res, next) => {
  const paramValue = req.params[paramName] || req.body[paramName];
  if (!paramValue || paramValue === "") {
    next(new ApiError(`${paramName} is required`, 404));
  }
  next();
};

const lengthRange = (paramName, minLength, maxLength) => (req, res, next) => {
  const paramValue = req.params[paramName] || req.body[paramName];
  if (typeof paramValue === "string") {
    if (paramValue.length < minLength) {
      next(new ApiError(`${paramName} is too short`, 404));
    }
    if (paramValue.length > maxLength) {
      next(new ApiError(`${paramName} is too long`, 404));
    }
  } else {
    if (paramValue < minLength) {
      next(
        new ApiError(`${paramName} must be above or equal ${minLength}`, 404)
      );
    }
    if (paramValue > maxLength) {
      next(
        new ApiError(`${paramName} must be below or equal ${maxLength}`, 404)
      );
    }
  }
  next();
};

const isNumeric = (paramName) => (req, res, next) => {
  const paramValue = req.params[paramName] || req.body[paramName];
  if (paramValue) {
    const floatValue = parseFloat(paramValue);
    if (Number.isNaN(floatValue) || paramValue === "") {
      next(new ApiError(`${paramName} must be Numeric`, 404));
    }
    req.params[paramName] = floatValue;
    req.body[paramName] = floatValue;
  }
  next();
};

const isArray = (paramName) => (req, res, next) => {
  const paramValue = req.params[paramName] || req.body[paramName];
  if (paramValue && !Array.isArray(paramValue)) {
    next(new ApiError(`${paramName} must be an array`, 404));
  }
  next();
};

const duplicateIds = (paramName) => (req, res, next) => {
  const paramValue = req.params[paramName] || req.body[paramName];
  if (paramValue) {
    const duplicateId = paramValue.filter(
      (subCategoryId, index) => paramValue.indexOf(subCategoryId) !== index
    );

    if (duplicateId.length > 0) {
      return next(
        new ApiError(`Duplicate ${paramName} ID: ${duplicateId}`, 404)
      );
    }
  }
  next();
};
module.exports = {
  validateMongoId,
  required,
  lengthRange,
  isNumeric,
  isArray,
  duplicateIds,
};
