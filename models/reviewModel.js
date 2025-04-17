const mongodb = require('../data/database');

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

module.exports = {
    addReview,
    getReviewsByProductName,
};