const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const catchError = require('../utils/catchError')
const AppError = require('../utils/appError')

const signToken = id => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
exports.signup = catchError(async(req,res,next) => {
    const {username, email, password, passwordConfirm} = req.body 
    const newUser = await User.create({username, email, password, passwordConfirm})
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

