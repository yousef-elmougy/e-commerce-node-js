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

// const setImageURL = (doc) => {
//   if (doc.image) {
//     const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
//     doc.image = imageURL;
//   }
// };

// categorySchema.post("init", (doc) => setImageURL(doc));
// categorySchema.post("save", (doc) => setImageURL(doc));

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
