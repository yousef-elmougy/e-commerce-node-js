const Category = require("../models/category");
const factory = require("./handlersFactory");

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
