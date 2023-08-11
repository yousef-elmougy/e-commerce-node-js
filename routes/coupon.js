const express = require("express");
const {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCouponById,
  deleteCouponById,
} = require("../controllers/coupon");

const {
  validateMongoId,
  required,
} = require("../middleware/globalValidatorMiddleware");
const { allowedTo, auth } = require("../controllers/auth");

const router = express.Router();
router.use(auth, allowedTo("admin", "superAdmin"));
router
  .route("/")
  .post(
    required("name"),
    required("discount"),
    required("expire"),
    createCoupon
  )
  .get(getCoupons);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(getCouponById)
  .put(updateCouponById)
  .delete(deleteCouponById);

module.exports = router;
