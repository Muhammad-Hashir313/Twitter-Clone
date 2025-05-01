const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getAll, searchUser } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getAll)
router.post('/search', searchUser)

module.exports = router