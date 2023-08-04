const fs = require("fs");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Category = require("../models/category");
const factory = require("./handlersFactory");
const { asyncHandler } = require("../utils/apiHelper");
const { uploadSingleImage } =
  require("../middleware/uploadImageMiddleware");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const uploadPath = "uploads/categories";
  const filename = `category-${uuidv4()}-${Date.now()}.png`;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("png")
      .png({ quality: 90 })
      .toFile(`${uploadPath}/${filename}`);
    req.body.image = filename;
  }
  next();
});

exports.uploadCategoryImage = uploadSingleImage("image");
// @desc     create category
// @route    POST /api/v1/categories
// @access   private
exports.createCategory = factory.createOne(Category);

// @desc     get all categories
// @route    GET /api/v1/categories
// @access   public
exports.getCategories = factory.getAll(Category);

// @desc     get specific category by id
// @route    GET /api/v1/categories
// @access   public
exports.getCategoryById = factory.getOne(Category);

// @desc     update specific category by id
// @route    PUT /api/v1/categories
// @access   private
exports.updateCategoryById = factory.updateOne(Category);

// @desc     Delete a specific category by ID
// @route    DELETE /api/v1/categories/:id
// @access   Private
exports.deleteCategoryById = factory.deleteOne(Category);
