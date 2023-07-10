const Brand = require("../models/brand");
const ApiError = require("../utils/apiError");
const { asyncHandler, slug } = require("../utils/apiHelper");

// @desc     create brand
// @route    POST /api/v1/brands
// @access   private
exports.createBrand = asyncHandler(async (req, res) => {
  const {name} = req.body;
  const brand = await Brand.create({ name, slug: slug(name) });
  res.status(201).json({ data: brand });
});

// @desc     get all brands
// @route    GET /api/v1/brands
// @access   public
exports.getBrands = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const brands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});

// @desc     get specific brand by id
// @route    GET /api/v1/brands
// @access   public
exports.getBrandById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand)
    return next(new ApiError(`brand not found for this id: ${id}`, 404));
  res.status(200).json({ data: brand });
});

// @desc     update specific brand by id
// @route    PUT /api/v1/brands
// @access   private
exports.updateBrandById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { $set: { name, slug: slug(name) } },
    { new: true }
  );
  if (!brand)
    return next(new ApiError(`brand not found for this id: ${id}`, 404));
  res.status(200).json({ data: brand });
});

// @desc     Delete a specific brand by ID
// @route    DELETE /api/v1/brands/:id
// @access   Private
exports.deleteBrandById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand)
    return next(new ApiError(`brand not found for this id: ${id}`, 404));
  res.status(200).json({ data: brand });
});
