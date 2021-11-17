const review = require('../models/reviewModel'); 
const catchError = require('../utils/catchError'); 


exports.createReview = catchError(async (req,res, next) => {
const myReview = await review.create(req.body);
res.status(201).json({
    status: 'success', 
    data: {
        review: myReview
    }
}); 
next();
});

exports.getReviews = catchError(async (req, res, next) => {
    const myReview = await review.find(); 
    res.status(200).json({
        status: 'success',
        results: myReview.length,  
        data: {
            review: myReview
        }
    });
    next();
}); 

exports.getReview = catchError(async (req,res, next) => {
    const id = req.params.id; 
    const myReview = await review.findById(id); 
    res.status(200).json({
        status: 'success',
        data: {
            review: myReview
        }
    }); 
    next();
});

exports.deleteAllReviews = catchError(async (req,res, next) => {
    const myReview = await review.deleteMany({}); 
    res.status(200).json({
        status: 'success',
    }); 
    next();
});


exports.deleteReview = catchError(async (req,res, next) => {
    const id = req.params.id; 
    const myReview = await review.findByIdAndDelete(id); 
    res.status(200).json({
        status: 'success'
    }); 
    next();
});