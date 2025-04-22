const express = require('express');
const router = express.Router();
const controller = require('../../controllers/usercontroller');
const { verifyJWT, verifyRefreshJWT } = require('../../middlewares/verify_token');
const verifyRole = require('../../middlewares/verify_role');

router.get('/', verifyJWT, controller.getAllUsersController);
router.patch('/profile', verifyJWT, controller.updateUserController);
router.patch('/:id/role', verifyJWT, verifyRole(['admin']), controller.updateUserRoleController);
router.patch('/reset-password', verifyJWT, controller.resetPasswordController);
module.exports = router;
