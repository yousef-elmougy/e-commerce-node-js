const express = require("express");
const {
  createBrand,
  getBrands,
  getBrandById,
  updateBrandById,
  deleteBrandById,
  uploadBrandImage,
  resizeImage,
} = require("../controllers/brand");

const {
  validateMongoId,
  required,
  lengthRange,
} = require("../middleware/globalValidatorMiddleware");
const { allowedTo, auth } = require("../controllers/auth");

const router = express.Router();

router
  .route("/")
  .post(
    auth,
    allowedTo("admin", "superAdmin"),
    uploadBrandImage,
    resizeImage,
    required("name"),
    lengthRange("name", 3, 32),
    createBrand
  )
  .get(getBrands);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(getBrandById)
  .put(
    auth,
    allowedTo("admin", "superAdmin"),
    uploadBrandImage,
    resizeImage,
    updateBrandById
  )
  .delete(auth, allowedTo("superAdmin"), deleteBrandById);

module.exports = router;
