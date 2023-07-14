const Product = require("../models/product");
const factory = require("./handlersFactory");

// @desc     create product
// @route    POST /api/v1/products
// @access   private
exports.createProduct = factory.createOne(Product);

// @desc     get all products
// @route    GET /api/v1/products
// @access   public
exports.getProducts = factory.getAll(Product)

// @desc     get specific product by id
// @route    GET /api/v1/products
// @access   public
exports.getProductById = factory.getOne(Product)

// @desc     update specific product by id
// @route    PUT /api/v1/products
// @access   private
exports.updateProductById = factory.updateOne(Product);

// @desc     Delete a specific product by ID
// @route    DELETE /api/v1/products/:id
// @access   Private
exports.deleteProductById = factory.deleteOne(Product);
