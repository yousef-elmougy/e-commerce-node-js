const bcryptjs = require("bcryptjs");
const User = require("../../models/user");
const ApiError = require("../apiError");

const validateEmail = (req, res, next) => {
  const { email } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    next(new ApiError(`Invalid Email: ${email}`, 404));
  }
  next();
};

const emailExist = async (req, res, next) => {
  const { email } = req.body;
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    next(new ApiError(`Email Already Exist: ${email}`, 409));
  }
  next();
};

const deletePasswordObj = (req, res, next) => {
  const keys = [
    "password",
    "passwordChangedAt",
    "passwordResetCode",
    "passwordResetExpires",
    "passwordResetVerified",
  ];
  keys.forEach((key) => delete req.body[key]);
  next();
};

const filterChangePasswordBodyKeys = (req, res, next) => {
  const allowedKeys = ["currentPassword", "password", "passwordConfirm"];

  Object.keys(req.body).forEach((key) => {
    if (!allowedKeys.includes(key)) {
      delete req.body[key];
    }
  });
  next();
};

const passwordConfirm = (req, res, next) => {
  if (req.body.password !== req.body.passwordConfirm) {
    next(new ApiError(`Password Confirmation incorrect`, 404));
  }
  next();
};

const validateChangePassword = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    next(new ApiError(`User not Found for this Id: ${req.params.id}`, 404));
  }
  const isMatch = await bcryptjs.compare(
    req.body.currentPassword,
    user.password
  );
  if (!isMatch) {
    next(new ApiError(`current password incorrect`, 404));
  }

  if (req.body.password !== req.body.passwordConfirm) {
    next(new ApiError(`Password Confirmation incorrect`, 404));
  }
  req.body.passwordChangedAt = Date.now();
  next();
};

module.exports = {
  validateEmail,
  emailExist,
  deletePasswordObj,
  passwordConfirm,
  filterChangePasswordBodyKeys,
  validateChangePassword,
};
