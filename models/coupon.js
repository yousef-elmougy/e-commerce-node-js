const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "coupon name is required"],
      unique: [true, "coupon name must be unique"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon Discount is required"],
    },
    expire: {
      type:Date,
      required: [true, "Expire Coupon Date is required"],
    },
  },
  { timestamps: true }
);

couponSchema.methods.toString = () => "Coupon";

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
