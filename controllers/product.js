// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require("fs");

// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const Product = require("../models/product");
const factory = require("./handlersFactory");
const { asyncHandler } = require("../utils/apiHelper");
const { uploadMixOfImages } = require("../middleware/uploadImageMiddleware");

exports.uploadMixOfProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const uploadPath = "uploads/products";

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.png`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1300)
      .toFormat("png")
      .png({ quality: 95 })
      .toFile(`${uploadPath}/${imageCoverFilename}`);
    req.body.imageCover = imageCoverFilename;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imagesFilename = `product-${uuidv4()}-${Date.now()}-${
          index + 1
        }.png`;
        await sharp(img.buffer)
          .resize(2000, 1300)
          .toFormat("png")
          .png({ quality: 95 })
          .toFile(`${uploadPath}/${imagesFilename}`);
        req.body.images.push(imagesFilename);
      })
    );
  }
  next();
});
// @desc     create product
// @route    POST /api/v1/products
// @access   private
exports.createProduct = factory.createOne(Product);

// @desc     get all products
// @route    GET /api/v1/products
// @access   public
exports.getProducts = factory.getAll(Product);

// @desc     get specific product by id
// @route    GET /api/v1/products
// @access   public
exports.getProductById = factory.getOne(Product);

// @desc     update specific product by id
// @route    PUT /api/v1/products
// @access   private
exports.updateProductById = factory.updateOne(Product);

// @desc     Delete a specific product by ID
// @route    DELETE /api/v1/products/:id
// @access   Private
exports.deleteProductById = factory.deleteOne(Product);
