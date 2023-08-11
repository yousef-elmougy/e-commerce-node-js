const User = require("../models/user");
const Product = require("../models/product");
const { asyncHandler } = require("../utils/apiHelper");
const ApiError = require("../utils/apiError");

exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(`there is no product for this id: ${productId}`));
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist.",
    data: user.wishlist,
  });
});

exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(`there is no product for this id: ${productId}`));
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishlist.",
    data: user.wishlist,
  });
});

exports.getUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
