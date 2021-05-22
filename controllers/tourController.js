const Tour = require('../models/tourModel');

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
    const tours = await Tour.find();
    res.status(200).json({
      statusCode: 'success',
      length: tours.length,
      tours,
    });
  } catch (err) {
    res.status(404).json({
      statusCode: 'fail',
      message: err,
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
