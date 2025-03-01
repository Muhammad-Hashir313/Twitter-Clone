const express = require('express')
const router = express.Router()
// const protect = require('../middleware/authMiddleware')
const { getTweets, createTweet, updateTweet, deleteTweet } = require('../controllers/tweetController')

router.route('/').get(getTweets).post(createTweet)
router.route('/:id').put(updateTweet).delete(deleteTweet)

module.exports = router