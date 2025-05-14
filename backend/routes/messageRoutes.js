const express = require('express')
const router = express.Router()
const { getChats, getMessages, sendMessage } = require('../controllers/messageController')
const protect = require('../middleware/authMiddleware')

router.get('/chats', protect, getChats)
router.get('/:id', protect, getMessages)
router.post('/:id', protect, sendMessage)