const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand name is required"],
      minLength: [3, "brand name is Too Short"],
      maxLength: [32, "brand name is Too long"],
      unique: [true, "brand name must be unique"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

brandSchema.methods.toString = () => "Brand";

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
