//required roles is an array of roles
const verifyRole = (requiredRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role;
            if (!userRole) {
                return res.status(403).json({ message: 'User role not found' });
            }

            if (!requiredRoles.includes(userRole)) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    };
};

module.exports = verifyRole;