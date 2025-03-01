const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { getTweets, createTweet, updateTweet, deleteTweet } = require('../controllers/tweetController')

router.route('/').get(protect, getTweets).post(protect, createTweet)
router.route('/:id').put(protect, updateTweet).delete(protect, deleteTweet)

module.exports = router