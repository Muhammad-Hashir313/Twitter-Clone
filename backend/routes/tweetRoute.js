const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { getTweets, createTweet, updateTweet, deleteTweet, likeTweet } = require('../controllers/tweetController')

router.route('/').get(protect, getTweets).post(protect, createTweet)
router.route('/:id').put(protect, updateTweet).delete(protect, deleteTweet)
router.route('/like/:id').post(protect, likeTweet)

module.exports = router