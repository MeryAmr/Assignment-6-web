const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const SECRET = process.env.JWT_SECRET || 'no_fallback_mechanism_for_now';
const REFRESH_SECRET = process.env.REFRESH_TOKEN || 'no_fallback_mechanism_for_now';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '1d';

async function authenticateUser(credentials) {
    const { email, password } = credentials;
    
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User does not exist');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid password');
    }
    
    const userData = {
        id: user._id,
        role: user.role,
    };
    
    const accesstoken = jwt.sign(userData, SECRET, {
        expiresIn: JWT_EXPIRATION,
    });
    
    const refreshToken = jwt.sign(userData, REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRATION,
    });
    
    return {
        accesstoken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}

async function registerUser(userData) {
    const { name, email, password, role } = userData;
    
    // Validate the role before attempting to create a user
    const validRoles = ['user', 'moderator', 'admin'];
    if (role && !validRoles.includes(role)) {
        const error = new Error(`Invalid role: ${role}. Valid roles are: ${validRoles.join(', ')}`);
        error.name = 'ValidationError';
        error.errors = { role: { message: `Invalid role: ${role}` } };
        throw error;
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
    });
    
    try {
        await newUser.save();
        return { message: 'User registered successfully' };
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new Error('Invalid user data');
        }
        throw new Error('Error registering user');
    }
}

async function refreshUserToken(refreshTokenString) {
    if (!refreshTokenString) {
        throw new Error('Refresh token is required');
    }
    
    try {
        // Use the synchronous version of jwt.verify
        const user = jwt.verify(refreshTokenString, REFRESH_SECRET);
        
        const newAccessToken = jwt.sign(
            { id: user.id, role: user.role },
            SECRET,
            { expiresIn: JWT_EXPIRATION }
        );
        
        return { accesstoken: newAccessToken };
    } catch (err) {
        throw new Error('Invalid refresh token');
    }
}

module.exports = {
    authenticateUser,
    registerUser,
    refreshUserToken,
};