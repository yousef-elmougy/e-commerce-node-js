const cloudinary = require("../config/cloudinary");

const uploadImage = (req, res, next) => (folderName, resizedBuffer) =>
  cloudinary.uploader
    .upload_stream({ folder: folderName }, (err, result) => {
      if (err) {
        console.error("Cloudinary upload error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Upload error" });
      }

      // Save the Cloudinary image URL to req.body for further use
      req.body.image = result.secure_url;

      next(); // Proceed to the next middleware
    })
    .end(resizedBuffer); // Pass the resized buffer to Cloudinary upload stream

module.exports = uploadImage;
