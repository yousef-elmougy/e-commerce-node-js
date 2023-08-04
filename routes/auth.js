const express = require("express");
const {
  required,
  lengthRange,
} = require("../middleware/globalValidatorMiddleware");
const {
  validateEmail,
  emailExist,
  passwordConfirm,
} = require("../utils/validations/user");
const { signup, login, forgetPassword, verifyPasswordResetCode, resetPassword } = require("../controllers/auth");

const router = express.Router();

router.route("/signup").post(
  // uploadUserImage,
  // resizeImage,
  required("name"),
  required("email"),
  emailExist,
  validateEmail,
  required("password"),
  lengthRange("password", 6),
  required("passwordConfirm"),
  passwordConfirm,
  signup
);

router
  .route("/login")
  .post(
    required("email"),
    validateEmail,
    required("password"),
    lengthRange("password", 6),
    login
  );

router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyPasswordResetCode").post(verifyPasswordResetCode);
router.route("/resetPassword").put(resetPassword);


module.exports = router;
