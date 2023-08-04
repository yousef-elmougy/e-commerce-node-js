const mongoose = require("mongoose");

const bcryptjs = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    profilePic: String,
    phone: String,
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already exist"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password is Too Short"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetVerified: Boolean,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: ["user", "admin","superAdmin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.toString = () => "User";

const setImageURL = (doc) => {
  if (doc.profilePic) {
    const imageURL = `${process.env.BASE_URL}/Users/${doc.profilePic}`;
    doc.profilePic = imageURL;
  }
};

userSchema.post("init", (doc) => setImageURL(doc));
userSchema.post("save", (doc) => setImageURL(doc));

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 12);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  if (!this._update.password) return next();
  this._update.password = await bcryptjs.hash(this._update.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
