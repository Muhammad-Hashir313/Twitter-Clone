const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const User = require('../models/userModel')
const conn = require('../config/db')

// @desc    Register a New User
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please enter all fields')
    }

    conn.query('SELECT * FROM USERS WHERE EMAIL = ?', [email], async (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error checking user!' })
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "User already exists!" })
        }

        try {
            // Hash Password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            conn.query('INSERT INTO USERS (NAME, EMAIL, PASSWORD) VALUES (?,?,?)', [name, email, hashedPassword], (err, results) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ message: 'Error registering user!' })
                }

                res.status(201).json({
                    id: results.insertId,
                    name: name,
                    email: email,
                })
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Error hashing password' })
        }
    })
})

// @desc    Authenticate user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error('Please enter all fields')
    }

    conn.query('SELECT * FROM USERS WHERE EMAIL = ?', [email], async (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error checking user' })
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "user not found!" })
        }

        const user = results[0]

        if (user && (await bcrypt.compare(password, user.PASSWORD))) {
            res.status(200).json({
                id: user.ID,
                name: user.NAME,
                email: email,
            })
        } else {
            res.status(400)
            return res.json({ message: 'Invalid Credentials' })
        }
    })
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getAll = asyncHandler(async (req, res) => {
    res.json(req.user)
})

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getAll
}