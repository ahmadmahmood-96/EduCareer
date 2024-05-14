const router = require('express').Router();
const {User} = require("../models/user");
const CoursesModel = require('../models/course');
const EnrollmentModel = require('../models/enrollment');

//get all users
router.get('/allUsers', async (req, res) => {
    try {
        const allUsers = await User.find();
        res.json(
            allUsers
        );
    } catch (error) {
        res.json({
            error: 'Internal Server Error'
        });
    }
});

//delete a user
router.delete( '/deleteUser/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        
        const user = await User.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                error: 'User not found'
            });
        }
        // Perform deletion in the database
        await User.findByIdAndDelete(userId);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

router.put( '/blockUser/:userId', async (req, res) => {
    try {
        const {
            userId
        } = req.params;
        const user = await User.findByIdAndUpdate(userId, {
            isBlocked: true
        }, {
            new: true
        });

        if (user) {
            return res.json({
                success: true,
                message: 'User blocked successfully'
            });
        } else {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

router.put( '/unblockUser/:userId', async (req, res) => {
    try {
        const {
            userId
        } = req.params;
        const user = await User.findByIdAndUpdate(userId, {
            isBlocked: false
        }, {
            new: true
        });

        if (user) {
            return res.json({
                success: true,
                message: 'User unblocked successfully'
            });
        } else {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;