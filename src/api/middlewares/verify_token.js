const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'no_fallback_mechanism_for_now';
const REFRESH_SECRET = process.env.REFRESH_TOKEN || 'no_fallback_mechanism_for_now';

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Not Authorized" });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token invalid or expired!" });
        req.user = decoded;
        next();
    });
};

const verifyRefreshJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Not Authorized" });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token expired!" });
        req.user = decoded;
        next();
    });
};

module.exports = {
    verifyJWT,
    verifyRefreshJWT
};