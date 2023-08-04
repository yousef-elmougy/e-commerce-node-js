const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  uploadCategoryImage,
  resizeImage,
} = require("../controllers/category");

const {
  validateMongoId,
  required,
  lengthRange,
} = require("../middleware/globalValidatorMiddleware");

const subCategoryRouter = require("./subCategory");
const { auth, allowedTo } = require("../controllers/auth");

const router = express.Router();

router.use("/:categoryId/subCategories", subCategoryRouter);

router
  .route("/")
  .post(
    auth,
    allowedTo("admin", "superAdmin"),
    uploadCategoryImage,
    resizeImage,
    required("name"),
    lengthRange("name", 3, 32),
    createCategory
  )
  .get(getCategories);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(getCategoryById)
  .put(
    auth,
    allowedTo("admin", "superAdmin"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryById
  )
  .delete(auth, allowedTo("superAdmin"), deleteCategoryById);

module.exports = router;
