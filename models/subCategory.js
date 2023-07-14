const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "subCategory name is required"],
      minLength: [2, "subCategory name is Too Short"],
      maxLength: [32, "subCategory name is Too long"],
      unique: [true, "subCategory name must be unique"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Sub Category Must be belong to Category"],
    },
  },
  { timestamps: true }
);

subCategorySchema.methods.toString = () => "SubCategory";

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
