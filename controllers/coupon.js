
const factory = require("./handlersFactory");
const Coupon = require("../models/coupon");

// @desc     create coupon
// @route    POST /api/v1/coupons
// @access   Private
exports.createCoupon = factory.createOne(Coupon);

// @desc     get all coupons
// @route    GET /api/v1/coupons
// @access   Private
exports.getCoupons = factory.getAll(Coupon);

// @desc     get specific coupon by id
// @route    GET /api/v1/coupons
// @access   Private
exports.getCouponById = factory.getOne(Coupon);

// @desc     update specific coupon by id
// @route    PUT /api/v1/coupons
// @access   private
exports.updateCouponById = factory.updateOne(Coupon);

// @desc     Delete a specific coupon by ID
// @route    DELETE /api/v1/coupons/:id
// @access   Private
exports.deleteCouponById = factory.deleteOne(Coupon);
