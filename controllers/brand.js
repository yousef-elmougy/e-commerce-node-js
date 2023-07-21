const fs = require("fs");

// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");

const { uploadSingleImage } =
  require("../middleware/uploadImageMiddleware");

const factory = require("./handlersFactory");
const { asyncHandler } = require("../utils/apiHelper");
const Brand = require("../models/brand");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const uploadPath = "uploads/brands";
  const filename = `brand-${uuidv4()}-${Date.now()}.png`;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("png")
      .png({ quality: 90 })
      .toFile(`${uploadPath}/${filename}`);
    req.body.image = filename;
  }
  next();
});

exports.uploadBrandImage = uploadSingleImage("image");

// @desc     create brand
// @route    POST /api/v1/brands
// @access   private
exports.createBrand = factory.createOne(Brand);

// @desc     get all brands
// @route    GET /api/v1/brands
// @access   public
exports.getBrands = factory.getAll(Brand);

// @desc     get specific brand by id
// @route    GET /api/v1/brands
// @access   public
exports.getBrandById = factory.getOne(Brand);

// @desc     update specific brand by id
// @route    PUT /api/v1/brands
// @access   private
exports.updateBrandById = factory.updateOne(Brand);

// @desc     Delete a specific brand by ID
// @route    DELETE /api/v1/brands/:id
// @access   Private
exports.deleteBrandById = factory.deleteOne(Brand);
