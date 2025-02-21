const asyncHandler = require('express-async-handler')

// @desc    Register a New User
// @route   GET /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    res.json({ message: "Register user" })
})

// @desc    Authenticate user
// @route   GET /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    res.json({ message: "Login user" })
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getAll = asyncHandler(async (req, res) => {
    res.json({ message: "User Data" })
})

module.exports = {
    registerUser,
    loginUser,
    getAll
}