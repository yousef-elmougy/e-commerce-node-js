const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const bcryptjs = require("bcryptjs");

const { asyncHandler } = require("../utils/apiHelper");
const User = require("../models/user");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// @desc     signup
// @route    POST /api/v1/auth/signup
// @access   public
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`Incorrect Email or Password`, 401));
  }
  const passwordMatching = await bcryptjs.compare(
    req.body.password,
    user.password
  );

  if (!passwordMatching) {
    return next(new ApiError(`Incorrect Email or Password`, 401));
  }

  const token = generateToken(user._id);

  res.status(200).json({ data: user, token });
});

exports.auth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(`token: ${token}`);
  }
  console.log(`token: ${token}`);
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }
  const verifiedToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
  if (!verifiedToken) {
    return next(
      new ApiError("Token verification failed, authorization denied.", 401)
    );
  }
  console.log(`verifiedToken: ${verifiedToken.iat}`);
  console.log(`verifiedToken: ${verifiedToken.userId}`);
  const user = await User.findById(verifiedToken.userId);
  if (!user) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }
  if (!user.active) {
    return next(new ApiError("This user is Blocked (not active)", 401));
  }
  if (user.passwordChangedAt) {
    const passwordChangedAtTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedAtTimeStamp > verifiedToken.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }
  req.user = user;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(`There is no user with that email ${email}`, 404));
  }

  const resetCode = crypto.randomInt(100000, 999999).toString();
  const hashedCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashedCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  const message = `Hi ${user.name}, \n\nWe received a request to reset the password on your E-shop Account. \n\n${resetCode} \n\nEnter this code to complete the reset. \n\nThanks for helping us keep your account secure. \n\nThe E-shop Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(
      new ApiError(`There is an error in sending email ${error}`, 500)
    );
  }
  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  const { resetCode } = req.body;

  const hashedCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  user.passwordResetVerified = true;

  await user.save();

  res.status(200).json({ status: "Success" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(`There is no user with that email ${email}`, 404));
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  const token = generateToken(user._id);
  res.status(200).json({ token });
});
