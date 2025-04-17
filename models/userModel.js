const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getUserCollection = () => {
    const db = mongodb.getDatabase();
    return db.collection('users'); // Use the 'users' collection
};

const createUser = async (user) => {
    const collection = getUserCollection();
    const existingUser = await collection.findOne({ githubId: user.githubId });
    if (existingUser) {
        // Update the accessToken if the user already exists
        await collection.updateOne(
            { githubId: user.githubId },
            { $set: { accessToken: user.accessToken } }
        );
        return existingUser;
    }
    const result = await collection.insertOne(user);
    return { ...user, _id: result.insertedId };
};

const findUserById = async (id) => {
    const collection = getUserCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
};

module.exports = {
    createUser,
    findUserById,
};