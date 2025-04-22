const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'moderator' ,'admin'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;