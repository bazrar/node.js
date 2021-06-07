const router = require('express').Router()
const auth = require('../controllers/authController')
const user = require('../controllers/userController')

router.post('/signup', auth.signup)

router.post('/login', auth.login)

router.post('/forgotPassword', auth.forgotPassword)

router.patch('/resetPassword/:token', auth.resetPassword)

router.route('/').get(user.getUsers).delete(user.removeUsers)

router.route('/:id').get(user.getUser).delete(user.removeUser)

module.exports = router