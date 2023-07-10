const validateMongoId = (paramName) => (req, res, next) => {
  const id = req.params[paramName]||req.body[paramName];
  
  if (!id.match(/^[0-9a-fA-F]{24}$/i)) {
    const message = `Invalid ${paramName} ID formate`;
    return res.status(400).json({ error: { value: id, message } });
  }

  next();
};

const notEmpty = (paramName) => (req, res, next) => {
  const paramValue = req.params[paramName] || req.body[paramName];
  if (!paramValue || paramValue.trim().length === 0) {
    return res
      .status(400)
      .json({ error: { message: `${paramName} is required` } });
  }
  next();
};

const lengthRange = (paramName, minLength, maxLength) => (req, res, next) => {
  const paramValue = req.params[paramName] || req.body[paramName];
  if (paramValue && paramValue.length < minLength) {
    return res
      .status(400)
      .json({ error: { message: `${paramName} is too short` } });
  }
  if (paramValue && paramValue.length > maxLength) {
    return res
      .status(400)
      .json({ error: { message: `${paramName} is too long` } });
  }
  next();
};

module.exports = { validateMongoId, notEmpty, lengthRange };
