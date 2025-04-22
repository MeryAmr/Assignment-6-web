const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/jwt';

console.log('Attempting to connect to MongoDB with URI:', mongoURI);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

const db = mongoose.connection;
module.exports = db;