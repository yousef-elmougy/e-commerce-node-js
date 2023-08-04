const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  uploadUserImage,
  resizeImage,
  changePassword,
  getLoggedUser,
  changeLoggedUserPassword,
  updateLoggedUser,
  deleteLoggedUser,
} = require("../controllers/user");

const {
  validateMongoId,
  required,
  lengthRange,
} = require("../middleware/globalValidatorMiddleware");
const {
  validateEmail,
  emailExist,
  deletePasswordObj,
  filterChangePasswordBodyKeys,
  validateChangePassword,
  passwordConfirm,
} = require("../utils/validations/user");
const { auth, allowedTo } = require("../controllers/auth");

const router = express.Router();

router.get("/getMe", auth, getLoggedUser, getUserById);
router.put("/changeMyPassword", auth, changeLoggedUserPassword);
router.put(
  "/updateMe",
  auth,
  uploadUserImage,
  resizeImage,
  validateEmail,
  updateLoggedUser
);

router.delete("/deleteMe", auth, deleteLoggedUser);

router
  .route("/:id/changePassword")
  .put(
    auth,
    allowedTo("admin", "superAdmin"),
    filterChangePasswordBodyKeys,
    required("currentPassword"),
    required("password"),
    required("passwordConfirm"),
    validateChangePassword,
    changePassword
  );

router
  .route("/")
  .post(
    auth,
    allowedTo("superAdmin"),
    uploadUserImage,
    resizeImage,
    required("name"),
    required("email"),
    emailExist,
    validateEmail,
    required("password"),
    lengthRange("password", 6),
    required("passwordConfirm"),
    passwordConfirm,
    createUser
  )
  .get(auth, allowedTo("admin", "superAdmin"), getUsers);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(auth, allowedTo("superAdmin"), getUserById)
  .put(
    auth,
    allowedTo("superAdmin"),
    uploadUserImage,
    resizeImage,
    deletePasswordObj,
    emailExist,
    validateEmail,
    updateUserById
  )
  .delete(auth, allowedTo("superAdmin"), deleteUserById);

module.exports = router;
