const User = require('../../models/users');
const { updateUser, updateUserRole, getAllUsers, resetPassword } = require('../../services/user_service');

async function updateUserController(req, res) {
    try {
        // Get userId either from params (for /:id routes) or from the token (for /profile route)
        const userId = req.user.id;
        const updateData = req.body;

        const updatedUser = await updateUser(userId, updateData);

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found or update failed',
            });
        }

        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            message: `Error updating user: ${error.message}`,
        });
    }
}

async function updateUserRoleController(req, res) {
    try {
        const userId = req.params.id;
        const newRole = req.body.role;

        const updatedUser = await updateUserRole(userId, newRole);

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found or role update failed',
            });
        }

        return res.status(200).json({
            message: 'User role updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        return res.status(500).json({
            message: `Error updating user role: ${error.message}`,
        });
    }
}

async function getAllUsersController(req, res) {
    try {
        const users = await getAllUsers();
        if(!users){
            return res.status(404).json({ message: 'No users found' });
        }
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Error fetching users' });
    }
}

async function resetPasswordController(req, res) {
    try {
        const userId = req.user.id;
        const newPassword = req.body.password;
        const updatedUser = await resetPassword(userId, newPassword);
        if(!updatedUser){
            return res.status(404).json({ message: 'User not found or password reset failed' });
        }
        return res.status(200).json({ message: 'Password reset successfully', user: updatedUser });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'User not found or new password is the same as the old password' });
    }
}

module.exports = {
    updateUserController,
    updateUserRoleController,
    getAllUsersController,
    resetPasswordController
};
