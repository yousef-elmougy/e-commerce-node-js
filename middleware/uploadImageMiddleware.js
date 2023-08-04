const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  // Create the directory if it does not exist
  // if (!fs.existsSync(uploadPath)) {
  //   fs.mkdirSync(uploadPath, { recursive: true });
  // } else {
  //   cb(null, uploadPath);
  // }
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split("/")[1];
  //     cb(null, `category-${uuidv4()}-${Date.now()}.${ext}`);
  //   },
  // });

  const storage = multer.memoryStorage();

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError(`file must be image`), false);
    }
  }

  const upload = multer({ storage: storage, fileFilter: fileFilter });
  return upload;
};

const uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
// const uploadArrayOfImages = (fieldName, maxCount) =>
//   multerOptions().array(fieldName, maxCount);
const uploadMixOfImages = (arrFields) => multerOptions().fields(arrFields);

module.exports = { uploadSingleImage, uploadMixOfImages };
