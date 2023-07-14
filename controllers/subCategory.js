const SubCategory = require("../models/subCategory");
const factory = require("./handlersFactory");

// @desc     create SubCategory
// @route    POST /api/v1/subCategories
// @access   private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc     get all SubCategories
// @route    GET /api/v1/subCategories
// @route    GET /api/v1/categories/:categoryId/subCategories
// @access   public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc     get specific SubCategory by id
// @route    GET /api/v1/subCategories
// @access   public
exports.getSubCategoryById = factory.getOne(SubCategory);

// @desc     update specific SubCategory by id
// @route    PUT /api/v1/categories
// @access   private
exports.updateSubCategoryById = factory.updateOne(SubCategory);

// @desc     Delete a specific SubCategory by ID
// @route    DELETE /api/v1/categories/:id
// @access   Private
exports.deleteSubCategoryById = factory.deleteOne(SubCategory);
