const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { getAllTweets, getTweets, createTweet, updateTweet, deleteTweet, getLikes, likeTweet, unlikeTweet, getComments, addComment, deleteComment } = require('../controllers/tweetController')

router.route('/all').get(getAllTweets)
router.route('/').get(protect, getTweets).post(protect, createTweet)
router.route('/:id').put(protect, updateTweet).delete(protect, deleteTweet)
router.route('/:id/like').post(protect, likeTweet).get(protect, getLikes)
router.route('/:id/unlike').delete(protect, unlikeTweet)
router.route('/:id/comment').get(getComments).post(protect, addComment)
router.route('/:id/comment/:comment_id').delete(protect, deleteComment)

module.exports = router