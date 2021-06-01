const User = require('../models/userModel')
const catchError = require('../utils/catchError')

exports.getUsers = catchError(async(req,res,next) => {
  const users= await User.find()
  res.status(200).json({
      status: 'success',
      length: users.length, 
      data: {
          user: users
      }
  })
})

exports.getUser = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if(!user) {
   return next(new AppError(404, 'A user with the userId does not exist'))
  }
  res.status(200).json({
    status: 'success', 
    data: {
      user: user
    }
  })
})

exports.removeUsers = catchError(async(req,res,next) => {
  const users = await User.deleteMany()
  if(!users) {
      next(new AppError(404, 'A User with the userId does not exist'))
  }
  res.status(201).json({
      status: 'success', 
      data: {
          users: null
      }
  })
})

exports.removeUser = catchError(async(req,res,next) => {
  const user = await User.findByIdAndRemove(req.params.id)
  if(!user) {
      next(new AppError(404, 'A User with the userId does not exist'))
  }
  res.status(201).json({
      status: 'success', 
      data: {
          user: null
      }
  })
})
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'route is not implemented',
  });
};
