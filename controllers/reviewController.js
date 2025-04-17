const reviewModel = require('../models/reviewModel');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing product reviews
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product being reviewed
 *                 example: Food
 *               email:
 *                 type: string
 *                 description: The email of the user submitting the review
 *                 example: john@gmail.com
 *               rating:
 *                 type: integer
 *                 description: The rating given to the product
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: The review comment
 *                 example: This is an awesome item
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time the review was created
 *                 example: 2025-04-13T10:00:00Z
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the created review
 *                 name:
 *                   type: string
 *                   description: The name of the product
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                 rating:
 *                   type: integer
 *                   description: The rating given
 *                 comment:
 *                   type: string
 *                   description: The review comment
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to add review
 */

// Add a new review
const addReview = async (req, res) => {
    try {
        const { name, email, rating, comment } = req.body;

        // Validate input
        if (!name || !email || !rating || !comment) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const review = {
            name, // Product name
            email, // User email
            rating,
            comment,
            createdAt: new Date(),
        };

        const result = await reviewModel.addReview(review);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add review.', error });
    }
};

/**
 * @swagger
 * /reviews/{name}:
 *   get:
 *     summary: Retrieve reviews for a specific product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the product
 *         example: Food
 *     responses:
 *       200:
 *         description: A list of reviews for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the review
 *                   name:
 *                     type: string
 *                     description: The name of the product
 *                   email:
 *                     type: string
 *                     description: The email of the user
 *                   rating:
 *                     type: integer
 *                     description: The rating given
 *                   comment:
 *                     type: string
 *                     description: The review comment
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid product name
 *       500:
 *         description: Failed to fetch reviews
 */

// Get reviews for a specific product by name
const getReviewsByProductName = async (req, res) => {
    try {
        const { name } = req.params;

        if (!name) {
            return res.status(400).json({ message: 'Product name is required.' });
        }

        console.log('Fetching reviews for product name:', name);

        const reviews = await reviewModel.getReviewsByProductName(name);
        console.log('Query result:', reviews);

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews.', error });
    }
};

module.exports = {
    addReview,
    getReviewsByProductName,
};