const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// @desc    Register a New User
// @route   GET /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, password2 } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please enter all fields')
    }

    let existsUser = await User.findOne({ email })
    if (existsUser) {
        res.status(400)
        throw new Error('User with the email already exists')
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate user
// @route   GET /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error('Please enter all fields')
    }

    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }
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