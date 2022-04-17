const User = require('../models/User');

const userController = {
    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete user
    deleteUser: async(req, res) => {
        try {
            // fake delete
            const user = await User.findById(req.params.id);  // findByIdAndDelete
            
            if (user) {
                res.status(200).json('Delete successfully');
            } else {
                res.status(404).json('User doesn\'t exist');
            }
        } catch(err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;