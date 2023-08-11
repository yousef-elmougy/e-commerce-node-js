const express = require("express");

const {
  validateMongoId,
  required,
} = require("../middleware/globalValidatorMiddleware");

const { allowedTo, auth } = require("../controllers/auth");

const {
  createAddress,
  getUserAddress,
  deleteAddress,
  updateAddress,
} = require("../controllers/address");

const router = express.Router();
router.use(auth, allowedTo("user"));

router.route("/").post(createAddress).get(getUserAddress);

router.param("addressId", required("addressId"), validateMongoId("addressId"));

router.route("/:addressId").delete(deleteAddress).put(updateAddress);

module.exports = router;
