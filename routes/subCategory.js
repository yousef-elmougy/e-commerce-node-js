const express = require("express");

const {
  validateMongoId,
  notEmpty,
  lengthRange,
} = require("../middleware/validatorMiddleware");
const {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
  getSubCategoriesByCategoryId,
  createSubCategoryValidator,
  subCategoriesFilter,
} = require("../controllers/subCategory");

const router = express.Router({ mergeParams: true });


router
  .route("/")
  .post(
    createSubCategoryValidator,
    notEmpty("name"),
    lengthRange("name", 2, 32),
    notEmpty("category"),
    validateMongoId("category"),
    createSubCategory
  )
  .get(subCategoriesFilter,getSubCategories);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(getSubCategoryById)
  .put(updateSubCategoryById)
  .delete(deleteSubCategoryById);

module.exports = router;
