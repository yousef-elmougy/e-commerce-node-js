const Category = require("../../models/category");
const SubCategory = require("../../models/subCategory");
const ApiError = require("../apiError");

const validatePriceAfterDiscount = (req, res, next) => {
  const { price, priceAfterDiscount } = req.body;
  if (priceAfterDiscount && priceAfterDiscount >= price) {
    next(new ApiError(`Price after discount must be Less than price`, 404));
  }
  next();
};

const categoryExist = async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    next(new ApiError(`Category not found for this ID: ${req.body.category}`,404))
  }
  next();
};

/*  
 1- get only subCategories that _id === { req.body.subCategories }

 2- get existing subCategories ids

 3- get not found subCategories ids 
 by filter { req.body.subCategories } 
 that not include existing subCategories ids
 */
const subCategoryExist = async (req, res, next) => {
  const { subcategories } = req.body;
  const subCategory = await SubCategory.find({
    _id: { $exists: true, $in: subcategories },
  });

  const existingIds = subCategory.map((subCat) => subCat._id.toString());
  const notFoundIds = subcategories.filter(
    (subCategoryIds) => !existingIds.includes(subCategoryIds)
  );
  if (notFoundIds.length !== 0) {
    next(new ApiError(`Subcategory not found for this ID: ${notFoundIds}`,404))
  }
  next();
};

/*  
 1- get only subCategories that 
 _id === { req.body.subCategories } 
 && category === { req.body.category }

 2- get existing subCategories ids

 3- get not found subCategories ids 
 by filter { req.body.subCategories } 
 that not include existing subCategories ids
 */
const subCategoryBelongToCategory = async (req, res, next) => {
  const { subcategories, category } = req.body;
  const subCategory = await SubCategory.find({
    _id: { $in: subcategories },
    category: { $in: category },
  });

  const existingIds = subCategory.map((subCat) => subCat._id.toString());
  const notFoundIds = subcategories.filter(
    (subCategoryIds) => !existingIds.includes(subCategoryIds)
  );
  if (notFoundIds.length !== 0) {
    next(new ApiError(`Subcategory: ${notFoundIds} not belong to this Category: ${category}`,404))
  }
  next();
};

module.exports = {
  validatePriceAfterDiscount,
  categoryExist,
  subCategoryExist,
  subCategoryBelongToCategory,
};
