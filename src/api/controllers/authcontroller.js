const { authenticateUser, registerUser, refreshUserToken } = require('../../services/auth_service');
const User = require('../../models/users');

async function login(req, res) {
    try {
        const credentials = {
            email: req.body.email,
            password: req.body.password
        };
        
        const result = await authenticateUser(credentials);
        if(!result){
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error authenticating user:', error);
        if (error.message === 'User does not exist') {
            return res.status(401).json({ message: 'User does not exist' });
        } else if (error.message === 'Invalid password') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        return res.status(401).json({ message: error.message || 'Authentication failed' });
    }
}

async function signup(req, res) {
    try {
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        };
        
        const result = await registerUser(userData);
        if(!result){
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        return res.status(201).json(result);
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.message === 'User already exists') {
            return res.status(400).json({ message: error.message });
        } else if (error.name === 'ValidationError') {
            if (error.errors && error.errors.role) {
                return res.status(400).json({ 
                    message: 'Invalid role value', 
                    validRoles: ['user', 'moderator', 'admin']
                });
            }
            return res.status(400).json({ message: error.message });
        } else {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

function publicRoute(req, res) {
    return res.status(200).json({ message: 'This is a public route. No token needed.' });
}

async function protectedRoute(req, res) {
    try {
        const user = await User.findById(req.user.id).select('name role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            message: `Hello ${user.name}`,
            name: user.name,
            role: user.role,
        });
    } catch (err) {
        console.error('Error in protected route:', err);
        return res.status(500).json({ message: 'Error fetching user' });
    }
}

async function moderator(req, res) {
    try {
        const user = await User.findById(req.user.id).select('name role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            message: `Hello ${user.name}, you are authorized as ${user.role} on /moderator`,
            name: user.name,
            role: user.role,
        });
    } catch (err) {
        console.error('Error in moderator route:', err);
        return res.status(500).json({ message: 'Error fetching user' });
    }
}

async function admin(req, res) {
    try {
        const user = await User.findById(req.user.id).select('name role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            message: `Hello Admin ${user.name}`,
            name: user.name,
            role: user.role,
        });
    } catch (err) {
        console.error('Error in admin route:', err);
        return res.status(500).json({ message: 'Error fetching user' });
    }
}

async function refreshAccessToken(req, res) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }
        
        const token = authHeader.split(' ')[1];
        const result = await refreshUserToken(token);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error refreshing token:', error);
        return res.status(403).json({ message: error.message || 'Token refresh failed' });
    }
}

module.exports = {
    login,
    signup,
    publicRoute,
    protectedRoute,
    moderator,
    admin,
    refreshAccessToken
};
