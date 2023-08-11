const express = require("express");

const {
  validateMongoId,
  required,
} = require("../middleware/globalValidatorMiddleware");

const { allowedTo, auth } = require("../controllers/auth");
const {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
} = require("../controllers/wishlist");

const router = express.Router();
router.use(auth, allowedTo("user"));

router
  .route("/")
  .post(required("productId"), validateMongoId("productId"), addToWishlist)
  .get(getUserWishlist);

router
  .route("/:productId")
  .delete(
    required("productId"),
    validateMongoId("productId"),
    removeFromWishlist
  );

module.exports = router;
