const Category = require("../../models/category");
const ApiError = require("../apiError");

const subCategoriesFilter = (req, res, next) => {
  let filterObj = { category: req.params.categoryId };
  if (!req.params.categoryId) filterObj = {};
  req.filterObj = filterObj;
  next();
};

const createSubCategoryValidator = async (req, res, next) => {
  const category = req.body.category || req.params.categoryId;
  const categoryExist = await Category.findById(category);
  if (!categoryExist) {
    next(new ApiError(`Category not found for this id: ${category}`, 404));
  }
  next();
};

module.exports = { subCategoriesFilter, createSubCategoryValidator };
