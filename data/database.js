const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
let database;

const initDb = (callback) => {
    if (database) {
        console.log('Database is already initialized');
        return callback(null, database);
    }
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((client) => {
            console.log('Connected to MongoDB');
            database = client.db();
            callback(null, database);
        })
        .catch((err) => {
            console.error('Failed to connect to MongoDB', err);
            callback(err);
        });
};

const getDatabase = () => {
    if (!database) {
        throw new Error('Database not initialized');
    }
    return database;
};

module.exports = { initDb, getDatabase };