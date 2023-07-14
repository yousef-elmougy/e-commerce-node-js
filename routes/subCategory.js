const express = require("express");

const {
  validateMongoId,
  required,
  lengthRange,
} = require("../middleware/globalValidatorMiddleware");
const {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
} = require("../controllers/subCategory");
const {
  createSubCategoryValidator,
  subCategoriesFilter,
} = require("../utils/validations/subCategory");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    createSubCategoryValidator,
    required("name"),
    lengthRange("name", 2, 32),
    required("category"),
    validateMongoId("category"),
    createSubCategory
  )
  .get(subCategoriesFilter, getSubCategories);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(getSubCategoryById)
  .put(updateSubCategoryById)
  .delete(deleteSubCategoryById);

module.exports = router;
