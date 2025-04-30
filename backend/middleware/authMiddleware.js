const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const conn = require('../config/db');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            conn.query('SELECT ID, NAME, EMAIL FROM USERS WHERE ID = ?', [decoded.id], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Error fetching user from database" });
                }

                if (results.length === 0) {
                    return res.status(401).json({ message: "User not found" });
                }

                req.user = results[0];
                next();
            });
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

module.exports = protect;
