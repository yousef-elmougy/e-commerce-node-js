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
const router = express.Router();

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
