const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getAll, searchUser, getUserProfile, getFollowers, getFollowing, followUser, unfollowUser, getUser } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getAll)
router.post('/anotherUser', getUser)

// Search Routes
router.post('/search', searchUser)
router.get('/profile/:name', protect, getUserProfile)

// Follow Routes
router.get('/:id/followers', getFollowers)
router.get('/:id/following', getFollowing)
router.post('/:id/follow', protect, followUser)
router.delete('/:id/unfollow', protect, unfollowUser)

module.exports = router