const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getAll, searchUser, getUserProfile } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getAll)
router.post('/search', searchUser)
router.get('/profile/:name', getUserProfile)

module.exports = router