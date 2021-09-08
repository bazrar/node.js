const express = require('express'); 
const authController = require('../controllers/authController'); 
const viewController = require('../controllers/viewController'); 

const router = express.Router(); 

router.get('/', viewController.getOverview); 
router.get('/tour/:slug', authController.protect, viewController.getTour);
router.get('/login', viewController.getLoginForm); 
router.get('/signup', viewController.getSignupForm); 

module.exports = router; 
