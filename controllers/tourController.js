const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.createTour = async (req, res) => {
  const { name, rating, price } = req.body;
  console.log(name, rating, price);

  // 1.
  // const newTour = new Tour({
  //   name,
  //   rating,
  //   price,
  // });
  // newTour.save().then().catch()

  //2 . easy hack to save data to db

  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      statusCode: 'success',
      tour: newTour,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 'fail',
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    let queryObj = { ...req.query };
    //          #############BUILDING QUERY###################
    // 1. FILTERING
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    // console.log(JSON.parse(queryString));
    let query = Tour.find(JSON.parse(queryString));

    // 2. SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3. FIELDS LIMITING
    if (req.query.fields) {
      let fields = req.query.fields.split(',').join(' ');
      // console.log(fields);
      queyr = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //4. PAGINATION
    const { page, limit } = req.query;
    let skip = (page - 1) * limit;

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      // console.log(numTours);
      if (skip > numTours) throw new Error('This page does not exist');
    }
    query = query.skip(skip).limit(limit * 1);

    const tour = await query;
    res.status(200).json({
      statusCode: 'success',
      length: tour.length,
      tour,
    });
  } catch (err) {
    // console.log(err);
    res.status(404).json({
      statusCode: 'fail',
      msg: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      statusCode: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      statusCode: 'fail',
      msg: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(204).json({
      statusCode: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      statusCode: 'fail',
      msg: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      statusCode: 'success',
      tour,
    });
  } catch (err) {
    res.status(404).json({
      statusCode: 'fail',
      msg: err,
    });
  }
};
