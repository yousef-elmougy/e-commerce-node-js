const sharp = require("sharp");

const Category = require("../models/category");
const factory = require("./handlersFactory");
const { asyncHandler } = require("../utils/apiHelper");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const Product = require("../models/product");
const ApiError = require("../utils/apiError");
const uploadImage = require("../middleware/cloudinaryMiddleware");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  // Resize the image using sharp
  const resizedBuffer = await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("png")
    .png({ quality: 90 })
    .toBuffer();

  const upload = uploadImage(req, res, next);
  upload("categories", resizedBuffer);
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
exports.deleteCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const doc = await Category.findByIdAndDelete(id);
  await Product.findOneAndDelete({ category: id });
  if (!doc)
    return next(new ApiError(`Category not found for this id: ${id}`, 404));
  res.status(200).json({ data: doc });
});
