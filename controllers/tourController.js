const AppError = require('../utils/appError');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchError = require('../utils/catchError')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};


exports.createTour = catchError(async function (req, res, next) {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.getAllTours = catchError(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields();
  const tour = await features.query;
  res.status(200).json({
    statusCode: 'success',
    length: tour.length,
    data: { tour },
  });
});

exports.getTour = catchError(async function(req,res,next) { 
  const tour = await Tour.findById(req.params.id);
  if(!tour) {
    return next(new AppError(404, 'No tour with that Id was found'))
  }
  res.status(204).json({
    statusCode: 'success',
    data: {
      tour,
    },
  });
})

exports.updateTour = catchError(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!tour) {
      return next(new AppError(404, "No tour with that id was founds"))
    }
    res.status(204).json({
      statusCode: 'success',
      data: {
        tour,
      },
    })
  })

exports.deleteAllTours = catchError(async (req, res, next) => {
    const tour = await Tour.deleteMany({});
    if(!tour) {
      return next(new AppError(404, "No tour with that id was found"))
    }
    res.status(201).json({
      status: 'success',
      data: {
        tour: resp,
      },
    });
});
exports.deleteTour = catchError(async (req, res, next) => {
  console.log('delete tour')
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour) {
      return next(new AppError(404, "No tour with that id was found"))
    }
    res.status(204).json({
      statusCode: 'success',
      tour,
    });

});

exports.getTourStats = catchError(async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        tour: stats,
      },
    });
});
