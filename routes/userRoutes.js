const express = require('express');
const userController = require('../controllers/userController');
const { getAllUsers, getUser, createUser, updateUser, deleteUser } =
  userController;

const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log(`userId: ${val}`);
  next();
});

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
