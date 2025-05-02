const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getAll, searchUser, getUserProfile, getFollowers, getFollowing, followUser, unfollowUser } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getAll)

// Search Routes
router.post('/search', searchUser)
router.get('/profile/:name', getUserProfile)

// Follow Routes
router.get('/followers', protect, getFollowers)
router.get('/following', protect, getFollowing)
router.post('/:id/follow', protect, followUser)
router.delete('/:id/unfollow', protect, unfollowUser)

module.exports = router