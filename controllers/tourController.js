const { response } = require('express');
const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIFeatures {
  constructor(query, queryString) {

    this.query = query
    this.queryString = queryString
  }

  filter() {
    // console.log('filter method')
    const queryObj = {...this.queryString}
    const excludeFields = ['sort', 'page', 'fields', 'limit']
    excludeFields.forEach(el => delete queryObj[el])
    const queryStr = JSON.stringify(queryObj).replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
    // console.log(queryStr)
    this.query = this.query.find(JSON.parse(queryStr))
    // console.log(this.query)
    return this;
  }

  sort() {
    if(this.queryString.sort) {
      this.query = this.query.sort(JSON.stringify(this.queryString.sort).split(',').join(' '))
    }else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }

  limitFields() {
    // console.log('fields')
    if(this.queryString.fields) {
     const temp = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(temp)
    }
    else {
      this.query = this.query.select('-__v')
    }
    return this
  }
  // pagination() {
  //   console.log(this.queryString)
  //   const {page, limit}  = req.queryString
  //   const skip = (page - 1) * limit
  //   console.log(skip)
  //   this.query= this.query.skip(skip).limit(limit * 1)
  //   console.log(this.query)
  //   return this
  // }
}
exports.createTour = async (req, res) => {
  const { name, rating, price } = req.body;
  // console.log(name, rating, price);

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
    // let queryObj = { ...req.query };
    // //          #############BUILDING QUERY###################
    // // 1. FILTERING
    // const excludedFields = ['sort', 'page', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // let queryString = JSON.stringify(queryObj);
    // queryString = queryString.replace(
    //   /\b(gt|gte|lt|lte)\b/g,
    //   (match) => `$${match}`
    // );

    // // console.log(JSON.parse(queryString));
    // let query = Tour.find(JSON.parse(queryString));

    // // 2. SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // // 3. FIELDS LIMITING
    // if (req.query.fields) {
    //   let fields = req.query.fields.split(',').join(' ');
    //   // console.log(fields);
    //   queyr = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // //4. PAGINATION
    // const { page, limit } = req.query;
    // let skip = (page - 1) * limit;

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   // console.log(numTours);
    //   if (skip > numTours) throw new Error('This page does not exist');
    // }
    // query = query.skip(skip).limit(limit * 1);

    // console.log(req.query)
    // console.log(req.query)
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields()
    // console.log(features.query)
    // console.log('hello world')
    const tour = await features.query;
    res.status(200).json({
      statusCode: 'success',
      length: tour.length,
      data: {tour},
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

exports.deleteAllTours = async(req,res) => {  
  try {
    const res = await Tour.deleteMany({});
    res.status(201).json({
      status: 'success', 
      data: {
        tour: res
      }

  })
} catch(err) {
  res.status(400).json({
    status: 'fail', 
    msg: err
  })
}
}
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

exports.getTourStats = async (req,res) => {
  try{
     const stats = await Tour.aggregate([
       {
         $match: {ratingsAverage: {$gte: 4.5}}
       },
       {
         $group: {_id: '$difficulty', numTours: {$sum: 1} ,numRatings: {$sum: '$ratingsQuantity'}, avgRating: {$avg: '$ratingsAverage', }, avgPrice: {$avg: '$price'}, minPrice: {$min: '$price'}, maxPrice: {$max: '$price'}}
       }
     ])
     res.status(200).json({
       status: 'success', 
       data: {
         tour: stats
       }
     })

  } catch(err) {
    res.status(400).json({
      status: 'fail', 
      msg:err
    })
  }
}
