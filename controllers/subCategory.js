const SubCategory = require("../models/subCategory");
const ApiError = require("../utils/apiError");
const { asyncHandler, slug } = require("../utils/apiHelper");

exports.subCategoriesFilter = (req, res, next) => {
  let filter = { category: req.params.categoryId };
  if (!req.params.categoryId) filter = {};
  req.filter = filter;
  next();
};

exports.createSubCategoryValidator = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc     create SubCategory
// @route    POST /api/v1/subCategories
// @access   private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slug(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

// @desc     get all SubCategories
// @route    GET /api/v1/subCategories
// @route    GET /api/v1/categories/:categoryId/subCategories
// @access   public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategory.find(req.filter)
    .skip(skip)
    .limit(limit);
  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

// @desc     get specific SubCategory by id
// @route    GET /api/v1/subCategories
// @access   public
exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory)
    return next(new ApiError(`SubCategory not found for this id: ${id}`, 404));
  res.status(200).json({ data: subCategory });
});

// @desc     update specific SubCategory by id
// @route    PUT /api/v1/categories
// @access   private
exports.updateSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { $set: { name, slug: slug(name), category } },
    { new: true }
  );
  if (!subCategory)
    return next(new ApiError(`SubCategory not found for this id: ${id}`, 404));
  res.status(200).json({ data: subCategory });
});

// @desc     Delete a specific SubCategory by ID
// @route    DELETE /api/v1/categories/:id
// @access   Private
exports.deleteSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory)
    return next(new ApiError(`SubCategory not found for this id: ${id}`, 404));
  res.status(200).json({ data: subCategory });
});
