const ApiError = require("../utils/apiError");
const { asyncHandler, slugify } = require("../utils/apiHelper");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await model.findByIdAndDelete(id);
    if (!doc)
      return next(
        new ApiError(`${model().toString()} not found for this id: ${id}`, 404)
      );
    res.status(200).json({ data: doc });
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    if (name) req.body.slug = slugify(name);

    const doc = await model.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!doc) {
      return next(
        new ApiError(`${model().toString()} not found for this id: ${id}`, 404)
      );
    }

    res.status(200).json({ data: doc });
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.name);
    const newDoc = await model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

exports.getOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await model.findById(id);
    if (!doc)
      return next(
        new ApiError(`${model().toString()} not found for this id: ${id}`, 404)
      );
    res.status(200).json({ data: doc });
  });

exports.getAll = (model) =>
  asyncHandler(async (req, res) => {
    const docsCount = await model.countDocuments();
    const apiFeatures = new ApiFeatures(model.find(req.filterObj), req.query)
      .sort()
      .search()
      .filter()
      .limitFields()
      .paginate(docsCount);

    const { mongooseQuery, paginationResult } = apiFeatures;

    const docs = await mongooseQuery;
    res
      .status(200)
      .json({ results: docs.length, paginationResult, data: docs });
  });
