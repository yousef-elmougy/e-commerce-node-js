const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [3, "name is Too Short"],
      maxLength: [32, "name is Too long"],
      unique: [true, "name must be unique"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
