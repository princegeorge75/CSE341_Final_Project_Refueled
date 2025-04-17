const mongodb = require('../data/database');
const mongoose = require('mongoose');

const getReviewCollection = () => {
    const db = mongodb.getDatabase();
    return db.collection('reviews');
};

// Add a review for a product
const addReview = async (review) => {
    const collection = getReviewCollection();
    review.name = review.name.toLowerCase(); // Normalize the name to lowercase
    const result = await collection.insertOne(review);
    return { ...review, _id: result.insertedId };
};

// Retrieve reviews for a specific product by name
const getReviewsByProductName = async (name) => {
    const collection = getReviewCollection();
    return await collection.find({ name: name.toLowerCase() }).toArray();
};


const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Product name
    email: { type: String, required: true }, // User's email
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);

module.exports = {
    addReview,
    getReviewsByProductName,
};