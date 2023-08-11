const { asyncHandler } = require("../utils/apiHelper");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const ApiError = require("../utils/apiError");

const calcTotalPrice = (cart) => {
  const totalPrice = cart.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  cart.totalPrice = totalPrice;
  cart.totalPriceAfterDiscount  = undefined
};
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  // Find the product by ID
  const product = await Product.findById(productId);
  if (!product) {
    return next(
      new ApiError(`Product not found for this ID: ${productId}`, 404)
    );
  }

  // Find or create the user's cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, price: product.price, color }],
    });
  } else {
    // Check if the product with the same color is already in the cart
    const cartItem = cart.cartItems.find(
      (item) =>
        item.product.toString() === productId.toString() && item.color === color
    );
    if (cartItem) {
      // Increase the quantity if the product already exists in the cart
      cartItem.quantity += 1;
    } else {
      // Add the new product to the cart
      cart.cartItems.push({ product: productId, price: product.price, color });
    }
  }

  // Calculate the total price of the cart
  calcTotalPrice(cart);

  // Save the updated cart
  await cart.save();

  res.status(201).json({
    status: "success",
    message: "Product added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.json({});

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: itemId } } },
    { new: true }
  );

  if (!cart) return next(new ApiError(`Cart not found`), 404);

  calcTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });

  if (!cart) return res.json({});

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.updateCartQuantity = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return next(new ApiError(`Cart not found`), 404);

  const cartItem = cart.cartItems.find(
    (item) => item._id.toString() === itemId.toString()
  );

  if (!cartItem) return next(new ApiError(`Cart Item not found`), 404);

  cartItem.quantity = req.body.quantity;

  calcTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.applyCouponToCart = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  
  if (!coupon) return next(new ApiError(`Coupon is invalid or expired`));

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return next(new ApiError(`Cart not found`), 404);

  const { totalPrice } = cart;
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
