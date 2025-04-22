const User = require('../models/users');
const bcrypt = require('bcrypt');
async function updateUser(userId, updateData) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (updateData.password) {
            const hashedPassword = await bcrypt.hash(updateData.password, 10);
            updateData.password = hashedPassword;
        }
        Object.assign(user, updateData);
        await user.save();
        return user;
    }
    catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}
async function updateUserRole(userId, newRole) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.role = newRole;
        await user.save();
        return user;
    } catch (error) {
        throw new Error(`Error updating user role: ${error.message}`);
    }
}
async function getAllUsers() {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
}
async function resetPassword(userId, newPassword) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if(isSamePassword){
            throw new Error('New password cannot be the same as the old password');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        return user;
    } catch (error) {
        throw new Error(`Error resetting password, Either user not found or new password is the same as the old password: ${error.message}`);
    }
}


module.exports = {
    updateUser,
    updateUserRole,
    getAllUsers,
    resetPassword,
};