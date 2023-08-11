const User = require("../models/user");
const { asyncHandler } = require("../utils/apiHelper");
const ApiError = require("../utils/apiError");

exports.createAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { address: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Address added successfully.",
    data: user.address,
  });
});

exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { address: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully.",
    data: user.address,
  });
});

exports.updateAddress = asyncHandler(async (req, res, next) => {
  const {addressId} = req.params;
  const user = await User.findById(req.user._id);
  const addressIndex = user.address.findIndex((address) => {
    console.log(address._id.toString());
    console.log(addressId);
    return address._id.toString() === addressId;
  });
  console.log(addressIndex);
  if (addressIndex === -1) {
    return next(new ApiError(`address not found for this id: ${addressId}`));
  }

  user.address[addressIndex] = req.body;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Address updated successfully.",
    data: user.address,
  });
});

exports.getUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("address");

  res.status(200).json({
    status: "success",
    results: user.address.length,
    data: user.address,
  });
});
