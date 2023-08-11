const categoryRouter = require("./category");
const subCategoryRouter = require("./subCategory");
const brandRouter = require("./brand");
const productRouter = require("./product");
const userRouter = require("./user");
const authRouter = require("./auth");
const reviewRouter = require("./review");
const wishlistRouter = require("./wishlist");
const addressRouter = require("./address");
const couponsRouter = require("./coupon");
const cartRouter = require("./cart");

const mountedRoutes = (app) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subCategories", subCategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/address", addressRouter);
  app.use("/api/v1/coupons", couponsRouter);
  app.use("/api/v1/cart", cartRouter);
};

module.exports = mountedRoutes;
