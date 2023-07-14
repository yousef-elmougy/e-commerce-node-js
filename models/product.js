const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minLength: [3, "Product name is Too Short"],
      maxLength: [100, "Product name is Too long"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minLength: [20, "Product description is Too Short"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    quantity: {
      type: Number,
      trim: true,
      required: [true, "Product quantity is required"],
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "Product price is required"],
      max: [200000, "Too long Product price"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    priceAfterDiscount: Number,
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image Cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function () {
  this.populate({ path: "category", select: "name -_id" });
});

productSchema.methods.toString = () => "Product";

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
