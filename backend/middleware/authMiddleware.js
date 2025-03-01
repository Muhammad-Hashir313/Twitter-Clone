const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
// const User = require('../models/userModel')
const conn = require('../config/db')

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = await req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from token
            conn.query('SELECT ID, NAME, EMAIL FROM USERS WHERE ID = ?', [decoded.id], (err, results) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ message: "Error getting user!" })
                }

                req.user = results[0]

                next()
            })
        } catch (error) {
            console.log(error)
            res.statusCode(401)
            throw new Error('Not Authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not Authorized, No Token')
    }
})

module.exports = protect