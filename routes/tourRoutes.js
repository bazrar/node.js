const express = require('express');
const tourController = require('../controllers/tourController');
const { route } = require('./userRoutes');

const { getAllTours, getTour, createTour, updateTour, checkId } =
  tourController;

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.param('id', checkId);
router.route('/:id').get(getTour).patch(updateTour);

module.exports = router;
