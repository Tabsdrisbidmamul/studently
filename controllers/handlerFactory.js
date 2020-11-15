//Taken from https://github.com/jonasschmedtmann/complete-node-bootcamp/blob/master/4-natours/after-section-14/controllers/handlerFactory.js
// modified to add for filters and fix for modelName

https: const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const getModelName = (Model) => Model.modelName.toLowerCase();

// closures were returning different req obj, call fn where req obj is the same
const filterUser = (role, req) => {
  let filter = {};
  switch (role) {
    case 'user':
      filter = { user: req.user.id };
      break;
    case 'teacher':
      filter = { teacher: req.user.id };
      break;
    default:
      break;
  }
  return filter;
};

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    const modelName = getModelName(Model);

    res.status(200).json({
      status: 'success',
      message: 'Document Updated',
      data: {
        [modelName]: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    const modelName = getModelName(Model);

    res.status(201).json({
      status: 'success',
      data: {
        [modelName]: newDoc,
      },
    });
  });

exports.getOne = (Model, options) =>
  catchAsync(async (req, res, next) => {
    let opt = {};
    const query = Model.findById(req.params.id);
    if (options) opt = { ...options };

    const doc = await query.populate(opt.populate);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    const modelName = getModelName(Model);

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        [modelName]: doc,
      },
    });
  });

exports.getAll = (Model, filter) =>
  catchAsync(async (req, res, next) => {
    if (filter) req.filter = filterUser(filter, req);

    const features = new APIFeatures(Model.find(req.filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Will display statistics of the query
    // const docs = await features.query.explain();

    const docs = await features.query;
    const modelName = getModelName(Model);

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        [modelName]: docs,
      },
    });
  });
