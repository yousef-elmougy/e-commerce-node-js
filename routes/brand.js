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

const router = express.Router();

router
  .route("/")
  .post(
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
  .put(uploadBrandImage, resizeImage, updateBrandById)
  .delete(deleteBrandById);

module.exports = router;
