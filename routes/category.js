const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/category");

const {
  validateMongoId,
  required,
  lengthRange,
} = require("../middleware/globalValidatorMiddleware");

const subCategoryRouter = require("./subCategory");

const router = express.Router();

router.use("/:categoryId/subCategories", subCategoryRouter);

router
  .route("/")
  .post([required("name"), lengthRange("name", 3, 32)], createCategory)
  .get(getCategories);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(getCategoryById)
  .put(updateCategoryById)
  .delete(deleteCategoryById);

module.exports = router;
