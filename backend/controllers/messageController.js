const asyncHandler = require('express-async-handler')

// @desc    Get Chats
// @route   GET /api/messages/chats
// @access  Private
const getChats = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Get chats' })
})

// @desc    Get Messages
// @route   GET /api/messages/:id
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Get messages with ${req.params.id}` })
})

// @desc    Send message
// @route   POST /api/messages/:id
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Send message to ${req.params.id}` })
})

module.exports = {
    getChats,
    getMessages,
    sendMessage
}