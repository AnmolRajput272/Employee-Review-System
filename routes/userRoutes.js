const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authentication");

router.get('/login', userController.renderLoginPage);

router.get('/pending-reviews',authenticateUser, userController.renderPendingReviewsPage);

router.get('/reviews',authenticateUser, userController.renderAllReviewsPage);

router.get('/dashboard', userController.renderUserDashboard);

// login functionality for user
router.post('/login', userController.login);

// Submit Feedback for a Review
router.post('/reviews/submit/:id' ,userController.submitReview);

module.exports = router;
