const express = require('express');
const reviewController = require('../controllers/reviewController');
const ensureAuthenticated = require('../middleware/authMiddleware');

const router = express.Router();

// Route to add a review (restricted to authenticated users)
router.post('/', ensureAuthenticated, reviewController.addReview);

// Route to get reviews for a product (restricted to authenticated users)
router.get('/:name', ensureAuthenticated, reviewController.getReviewsByProductName);

module.exports = router;