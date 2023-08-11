const express = require("express");
const {
  createReview,
  getReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
} = require("../controllers/review");

const {
  validateMongoId,
  required,
  isNumeric,
  lengthRange,
} = require("../middleware/globalValidatorMiddleware");
const { allowedTo, auth } = require("../controllers/auth");
const {
  reviewExist,
  reviewRelateToUser,
  reviewsFilterObj,
  setUserAndProductIdToReview,
} = require("../utils/validations/review");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    auth,
    allowedTo("user"),
    setUserAndProductIdToReview,
    required("ratings"),
    isNumeric("ratings"),
    lengthRange("ratings", 1, 5),
    reviewExist,
    createReview
  )
  .get(reviewsFilterObj, getReviews);

router.param("id", validateMongoId("id"));
router
  .route("/:id")
  .get(getReviewById)
  .put(
    auth,
    isNumeric("ratings"),
    lengthRange("ratings", 1, 5),
    allowedTo("user"),
    reviewRelateToUser,
    updateReviewById
  )
  .delete(
    auth,
    allowedTo("user", "admin", "superAdmin"),
    reviewRelateToUser,
    deleteReviewById
  );

module.exports = router;
