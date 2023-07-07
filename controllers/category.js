const Category = require("../models/category");
const ApiError = require("../utils/apiError");
const { asyncHandler, slug } = require("../utils/apiHelper");

// @desc     create category
// @route    POST /api/v1/categories
// @access   private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await Category.create({ name, slug: slug(name) });
  res.status(201).json({ data: category });
});

// @desc     get all categories
// @route    GET /api/v1/categories
// @access   public
exports.getCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc     get specific category by id
// @route    GET /api/v1/categories
// @access   public
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category)
    return next(new ApiError(`category not found for this id: ${id}`, 404));
  res.status(200).json({ data: category });
});

// @desc     update specific category by id
// @route    PUT /api/v1/categories
// @access   private
exports.updateCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { $set: { name, slug: slug(name) } },
    { new: true }
  );
  if (!category)
    return next(new ApiError(`category not found for this id: ${id}`, 404));
  res.status(200).json({ data: category });
});

// @desc     Delete a specific category by ID
// @route    DELETE /api/v1/categories/:id
// @access   Private
exports.deleteCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category)
    return next(new ApiError(`category not found for this id: ${id}`, 404));
  res.status(200).json({ data: category });
});
