const express = require('express');
const router = express.Router(); 
const reviewController = require('../controllers/reviewController'); 
const authController = require('../controllers/authController');

router.route('/').get(reviewController.getReviews).delete(reviewController.deleteAllReviews); 
router.route('/:id').get(reviewController.getReview).delete(reviewController.deleteReview);
router.post('/create-review', authController.protect, reviewController.createReview); 


module.exports = router; 