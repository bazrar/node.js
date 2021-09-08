const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/userModel')
const sendEmail = require('../utils/email')
const catchError = require('../utils/catchError')
const AppError = require('../utils/appError')

const signToken = id => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
exports.signup = catchError(async(req,res,next) => {
    const {username, email, password, passwordConfirm, passwordChangedAt, role} = req.body 
    const newUser = await User.create({username, email, password, passwordConfirm, passwordChangedAt, role})
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
    res.cookie('jwt', token);
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
    } else if(req.cookies.jwt) {
        token = req.cookies.jwt; 
    }

    if(!token) {
        return next(new AppError(401, 'You are not logged in. Please login to get access!'))
    }

    // 2 verification token
   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
//    console.log(decoded)

   // 3 Check if the user still exists
   const freshUser = await User.findById(decoded.id)
   if(!freshUser) {
       return next(new AppError(401, 'The User belonging to the token no longer exists'))
   }
   // Check if user changed the password after the token was issued 
//    if(freshUser.changedPasswordAfter(decoded.iat)) {
//        return (new AppError(401, 'User recently changed the password. Please login again!'))
//    }

   req.user = freshUser
   // Grant access to the protected route
    next()
})



exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError(403, 'You do not have permission to perform this action'))
        }
        next()
    }
}

exports.forgotPassword = catchError(async(req,res,next) => {
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return next(new AppError(404, 'The user with the email does not exist'))
    }
    
    const token = user.passwordResetToken()
    user.save({ validateBeforeSave: false })

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${token}`
    const message = `Forgot your password? Please visit the link ${resetURL} `

    try {
        await sendEmail({
            email: user.email, 
            subject: 'Your password reset token(valid for 10 min)', 
            message
        })
        return res.status(200).json({
            status: 'success', 
            msg: 'Token sent to email!'
        })
    } catch (err) {
        user.resetToken = undefined
        user.resetExpires = undefined 
        user.save({validateBeforeSave: false})
        next(new AppError(500, 'There was an error sending the email'))
    } 
})
 


exports.resetPassword = (req,res,next) => {

}
