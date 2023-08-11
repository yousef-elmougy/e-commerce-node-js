const ApiError = require("../apiError");
const Review = require("../../models/review");

const reviewExist = async (req, res, next) => {
  const { product } = req.body;
  const existingReview = await Review.findOne({ user: req.user._id, product });

  if (existingReview) {
    next(new ApiError(`You already created a review before`, 409));
  }
  next();
};

const reviewRelateToUser = async (req, res, next) => {
  const { id } = req.params;
  if (req.user.role === "user") {
    const review = await Review.findById(id);

    if (!review) {
      next(new ApiError(`There is no review for this id: ${id}`, 404));
    }

    if (review.user._id.toString() !== req.user._id.toString()) {
      next(new ApiError(`You are not allowed to perform this action`, 403));
    }

    if (
      req.body.product &&
      review.product.toString() !== req.body.product.toString()
    ) {
      next(new ApiError(`This product not relate to this review`, 403));
    }
  }

  next();
};

const reviewsFilterObj = (req, res, next) => {
  let filterObj = { product: req.params.productId };
  if (!req.params.productId) filterObj = {};
  req.filterObj = filterObj;
  next();
};

const setUserAndProductIdToReview = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

module.exports = {
  reviewExist,
  reviewRelateToUser,
  reviewsFilterObj,
  setUserAndProductIdToReview,
};
