const Brand = require("../models/brand");
const factory = require("./handlersFactory");

// @desc     create brand
// @route    POST /api/v1/brands
// @access   private
exports.createBrand = factory.createOne(Brand);

// @desc     get all brands
// @route    GET /api/v1/brands
// @access   public
exports.getBrands = factory.getAll(Brand)

// @desc     get specific brand by id
// @route    GET /api/v1/brands
// @access   public
exports.getBrandById = factory.getOne(Brand)

// @desc     update specific brand by id
// @route    PUT /api/v1/brands
// @access   private
exports.updateBrandById = factory.updateOne(Brand);

// @desc     Delete a specific brand by ID
// @route    DELETE /api/v1/brands/:id
// @access   Private
exports.deleteBrandById = factory.deleteOne(Brand);
