const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchError = require('../utils/catchError')
const AppError = require('../utils/appError')

const signToken = id => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
exports.signup = catchError(async(req,res,next) => {
    const {username, email, password, passwordConfirm, passwordChangedAt} = req.body 
    const newUser = await User.create({username, email, password, passwordConfirm, passwordChangedAt})
    res.status(201).json({
        status: 'success', 
        data: {
            user: newUser
        }
    })
})

exports.login = catchError(async(req, res, next) => {
    const {email, password} = req.body; 
    if(!email || !password) {
        next(new AppError(400, 'Please provide email and password'))
    }
    const user = await User.findOne({email}).select('+password')

    if(!user || !(await user.verifyPassword(password, user.password))) {
        return next(new AppError('401', 'Incorrect email or password'))
    } 
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success', 
        token, 
        data: {
            user
        }
    })
})

exports.protect = catchError(async (req, res, next) => {
    // 1) Getting the token and check if it exists
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token) {
        return next(new AppError(401, 'You are not logged in. Please login to get access!'))
    }

    // 2 verification token
   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
//    console.log(decoded)

   // 3 Check if the user still exists
//    const freshUser = await User.findById({_id: decoded.id})
//    if(!freshUser) {
//        return next(new AppError(401, 'The User belonging to the token no longer exists'))
//    }
   // Check if user changed the password after the token was issued 
//    if(freshUser.changedPasswordAfter(decoded.iat)) {
//        return (new AppError(401, 'User recently changed the password. Please login again!'))
//    }

   // Grant access to the protected route
    next()
})

