
const factory = require("./handlersFactory");
const Review = require("../models/review");

// @desc     create review
// @route    POST /api/v1/reviews
// @access   private
exports.createReview = factory.createOne(Review);

// @desc     get all reviews
// @route    GET /api/v1/reviews
// @access   public
exports.getReviews = factory.getAll(Review);

// @desc     get specific review by id
// @route    GET /api/v1/reviews
// @access   public
exports.getReviewById = factory.getOne(Review);

// @desc     update specific review by id
// @route    PUT /api/v1/reviews
// @access   private
exports.updateReviewById = factory.updateOne(Review);

// @desc     Delete a specific review by ID
// @route    DELETE /api/v1/reviews/:id
// @access   Private
exports.deleteReviewById = factory.deleteOne(Review);
