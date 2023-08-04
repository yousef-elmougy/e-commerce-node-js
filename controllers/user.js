const fs = require("fs");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

const factory = require("./handlersFactory");
const { asyncHandler, slugify } = require("../utils/apiHelper");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const uploadPath = "uploads/users";
  const filename = `user-${uuidv4()}-${Date.now()}.png`;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("png")
      .png({ quality: 90 })
      .toFile(`${uploadPath}/${filename}`);
    req.body.profilePic = filename;
  }
  next();
});

exports.uploadUserImage = uploadSingleImage("profilePic");

// @desc     create user
// @route    POST /api/v1/users
// @access   private
exports.createUser = factory.createOne(User);

// @desc     get all users
// @route    GET /api/v1/users
// @access   private
exports.getUsers = factory.getAll(User);

// @desc     get specific user by id
// @route    GET /api/v1/users
// @access   private
exports.getUserById = factory.getOne(User);

// @desc     update specific user by id
// @route    PUT /api/v1/users
// @access   private
exports.updateUserById = factory.updateOne(User);

// @desc     update current user password by id
// @route    PUT /api/v1/users/:id/changePassword
// @access   private
exports.changePassword = factory.updateOne(User);

// @desc     Delete a specific user by ID
// @route    DELETE /api/v1/users/:id
// @access   Private
exports.deleteUserById = factory.deleteOne(User);

///

exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: req.body.password,
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.updateLoggedUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, profilePic } = req.body;
  if (name) req.body.slug = slugify(name);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      phone,
      profilePic,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: user });
});

exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user._id);
  res.status(200).json({ data: user });
});
