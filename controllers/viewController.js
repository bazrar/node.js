const Tour = require('../models/tourModel');
const catchError = require('../utils/catchError'); 

exports.getOverview = catchError(async (req,res) => {

    //1 get tour data from the collection
    const tours = await Tour.find();

    //2 build template  

    //3 render that template using tour data from 1; 
    res.status(200).render('overview', {
      title: 'All tours', 
      tours
    });
});

exports.getTour = (req,res) => {
    res.status(200).render('tour', {
      title: 'The Forest Hiker Tour'
    });
};

exports.getLoginForm = (req,res) => {
    res.status(200).render('login', {
        title: 'Login'
    }); 
};

exports.getSignupForm = (req,res) => {
    res.status(200).render('signup', {
        title: 'Signup'
    }); 
};