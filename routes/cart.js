const express = require("express");

const {
  validateMongoId,
  required,
} = require("../middleware/globalValidatorMiddleware");
const { allowedTo, auth } = require("../controllers/auth");
const {
  addProductToCart,
  getCart,
  removeCartItem,
  clearCart,
  updateCartQuantity,
  applyCouponToCart,
} = require("../controllers/cart");

const router = express.Router();
router.use(auth, allowedTo("user"));

router
  .route("/")
  .post(required("productId"), validateMongoId("productId"), addProductToCart)
  .get(getCart)
  .delete(clearCart);

router.route("/applyCoupon").put(applyCouponToCart);

router.param("itemId", validateMongoId("itemId"));

router.route("/:itemId").put(updateCartQuantity).delete(removeCartItem);

module.exports = router;
