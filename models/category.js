const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      minLength: [3, "category name is Too Short"],
      maxLength: [32, "category name is Too long"],
      unique: [true, "category name must be unique"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

categorySchema.methods.toString = () => "Category";

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
