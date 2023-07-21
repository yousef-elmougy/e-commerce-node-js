const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  resizeImage,
  uploadMixOfProductImages,
} = require("../controllers/product");

const {
  validateMongoId,
  required,
  lengthRange,
  isNumeric,
  isArray,
  duplicateIds,
} = require("../middleware/globalValidatorMiddleware");

const {
  validatePriceAfterDiscount,
  categoryExist,
  subCategoryExist,
  subCategoryBelongToCategory,
} = require("../utils/validations/product");

const router = express.Router();

const createProductValidation = [
  // name
  required("name"),
  lengthRange("name", 3, 100),

  // description
  required("description"),
  lengthRange("description", 20, 2000),

  // quantity
  required("quantity"),
  isNumeric("quantity"),

  // sold
  isNumeric("sold"),

  // price
  required("price"),
  isNumeric("price"),
  lengthRange("price", 0, 200000),

  // priceAfterDiscount
  isNumeric("priceAfterDiscount"),
  validatePriceAfterDiscount,

  // colors
  isArray("colors"),

  // images
  isArray("images"),

  //imageCover
  required("imageCover"),

  //category
  required("category"),
  validateMongoId("category"),
  categoryExist,

  // subcategories
  isArray("subcategories"),
  validateMongoId("subcategories"),
  duplicateIds("subcategories"),
  subCategoryExist,
  subCategoryBelongToCategory,

  // brand
  validateMongoId("brand"),

  // ratingsAverage
  isNumeric("ratingsAverage"),
  lengthRange("ratingsAverage", 1, 5),

  // ratingsQuantity
  isNumeric("ratingsQuantity"),
];

router
  .route("/")
  .post(
    uploadMixOfProductImages,
    resizeImage,
    createProductValidation,
    createProduct
  )
  .get(getProducts);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(getProductById)
  .put(uploadMixOfProductImages, resizeImage, updateProductById)
  .delete(deleteProductById);

module.exports = router;
