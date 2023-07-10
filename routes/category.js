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
  notEmpty,
  lengthRange,
} = require("../middleware/validatorMiddleware");

const subCategoryRouter =require("./subCategory");

const router = express.Router();

router.use("/:categoryId/subCategories",subCategoryRouter);

router
  .route("/")
  .post([notEmpty("name"), lengthRange("name", 3, 32)], createCategory)
  .get(getCategories);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(getCategoryById)
  .put(updateCategoryById)
  .delete(deleteCategoryById);

module.exports = router;
