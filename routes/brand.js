const express = require("express");
const {
  createBrand,
  getBrands,
  getBrandById,
  updateBrandById,
  deleteBrandById,
} = require("../controllers/brand");

const {
  validateMongoId,
  required,
  lengthRange,
} = require("../middleware/globalValidatorMiddleware");

const router = express.Router();

router
  .route("/")
  .post(required("name"), lengthRange("name", 3, 32), createBrand)
  .get(getBrands);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(getBrandById)
  .put(updateBrandById)
  .delete(deleteBrandById);

module.exports = router;
