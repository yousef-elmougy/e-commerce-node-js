require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const dbConnection = require("./config/dbConnection");
const categoryRouter = require("./routes/category");
const subCategoryRouter = require("./routes/subCategory");
const brandRouter = require("./routes/brand");
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");

const app = express();

console.log(`environment --->> ${process.env.NODE_ENV}`);

/// MiddleWares
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subCategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);

app.all("*", (req, res, next) =>
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400))
);

// handle error for express
app.use(globalError);

/// Server Connection
const port = process.env.DB_PORT || 8000;
const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);

/// DB Connection
dbConnection();

/// handle errors outside express

process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => process.exit(1));
});
