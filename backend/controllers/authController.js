const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

const authController = {

    // Register
    registerUser: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed
            });

            // Save to DB
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // Generate access token
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id, admin: user.admin
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '20s'
        });
    },

    // Generate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id, admin: user.admin
        }, process.env.JWT_REFRESH_TOKEN, {
            expiresIn: '1d'
        });
    },

    // Login
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({username: req.body.username});
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Username is wrong"
                });
            };

            const validPassword = await bcrypt.compare(
                req.body.password, user.password
            );

            if (!validPassword) {
                return res.status(404).json({
                    success: false,
                    message: "Password is wrong"
                });
            };

            // Valid user & password
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);

                // Save in cookies
                res.cookie('refreshToken', refreshToken, {
                    // maxAge: 60*60*24*1000, //24h in milliseconds
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict'
                });

                const { password, ...others } = user._doc;

                res.status(200).json({
                    success: true,
                    user: {...others, accessToken},
                    // refreshToken 
                });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Logout
    logoutUser: async(req, res) => {
        res.clearCookie('refreshToken');
        // Clear accessToken in client
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json('Logged out successfully');
    },

    // Request refresh token
    requestRefreshToken: async(req, res) => {
        // Take refresh token from user
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json('You\'re not authenticated');
        };

        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json('Refresh token is not valid');
        };

        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
            if (err) {
                console.log(err);
                return;
            }

            // Filter old token
            refreshTokens = refreshTokens.filter(token => token !== refreshToken);

            // Create new accessToken, refreshToken
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);

            // Set new refreshToken to cookie
            res.cookie('refreshToken', newRefreshToken, {
                // maxAge: 60*60*24*1000, //24h in milliseconds
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict'
            });

            res.status(200).json({ 
                accessToken: newAccessToken, 
                refreshToken: newRefreshToken 
            });
            // Refresh token thường lưu trong db (redis) để ko bị trùng lặp
        });
    }
}

module.exports = authController;

// localStorage
// htttponly cookies
// csrf -> samesite
// redux store -> accessToken
// httponly cookies -> refreshToken

// bff pattern (backend for frontend)