const express = require('express');
const router = express.Router();
const controller = require('../../controllers/authcontroller');
const {verifyJWT, verifyRefreshJWT} = require('../../middlewares/verify_token');
const verifyRole = require('../../middlewares/verify_role');
const rateLimiter = require('../../middlewares/ratelimit');
router.post('/login', rateLimiter, controller.login);
router.post('/signup', rateLimiter, controller.signup);
router.post('/refresh-token', verifyRefreshJWT, controller.refreshAccessToken);
router.get('/public', controller.publicRoute);
router.get('/protected', verifyJWT, controller.protectedRoute);
router.get('/moderator', verifyJWT, verifyRole(['moderator', 'admin']), controller.moderator);
router.get('/admin', verifyJWT, verifyRole(['admin']), controller.admin);

module.exports = router;
