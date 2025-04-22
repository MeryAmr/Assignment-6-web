const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5, 
    message: 'Slow down man',
});
module.exports = limiter;