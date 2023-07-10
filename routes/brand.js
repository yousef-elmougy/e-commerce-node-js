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
  notEmpty,
  lengthRange,
} = require("../middleware/validatorMiddleware");


const router = express.Router();


router
  .route("/")
  .post(notEmpty("name"), lengthRange("name", 3, 32), createBrand)
  .get(getBrands);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(getBrandById)
  .put(updateBrandById)
  .delete(deleteBrandById);

module.exports = router;
