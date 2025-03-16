const asyncHandler = require('express-async-handler')
// const Tweet = require('../models/tweetModel')
const conn = require('../config/db')

// @desc    Get Tweets
// @route   GET /api/tweets
// @access  Private
const getTweets = asyncHandler(async (req, res) => {

    conn.query('SELECT * FROM TWEETS WHERE USER_ID = ?', [req.user.ID], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error getting tweets' })
        }

        res.status(200).json(results)
    })
})

// @desc    Create a Tweet
// @route   POST /api/tweets
// @access  Private
const createTweet = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('Please add some text')
    }

    const userID = req.user.ID
    const text = req.body.text

    conn.query('INSERT INTO TWEETS (TEXT, USER_ID) VALUES (?,?)', [text, userID], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error creating tweet!' })
        }

        res.status(201).json({
            id: results.insertId,
            tweet: text,
            user_id: userID
        })
    })
})

// @desc    Update a Tweet
// @route   PUT /api/tweets/:id
// @access  Private
const updateTweet = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('Please add some text')
    }

    const userID = req.user.ID
    const id = req.params.id
    const text = req.body.text

    conn.query('SELECT * FROM TWEETS WHERE ID = ? AND USER_ID = ?', [id, userID], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error checking tweet!' })
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Tweet not found!' })
        }

        conn.query('UPDATE TWEETS SET TEXT = ? WHERE ID = ? AND USER_ID = ?', [text, id, userID], (err) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ message: 'Error updating tweets' })
            }

            res.status(200).json({
                id: id,
                user_id: userID,
                text: text,
            })
        })
    })
})

// @desc    Delete a Tweet
// @route   DELETE /api/tweets/:id
// @access  Private
const deleteTweet = asyncHandler(async (req, res) => {
    const id = req.params.id
    const userID = req.user.ID

    // If tweet exists
    conn.query('SELECT * FROM TWEETS WHERE ID = ? AND USER_ID = ?', [id, userID], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error checking tweet!' })
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Tweet not found!' })
        }


        conn.query('DELETE FROM TWEETS WHERE ID = ? AND USER_ID = ?', [id, userID], (err) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ message: 'Error deleting tweet!' })
            }

            res.status(200).json({ id: id })
        })
    })
})

// @desc    Get Likes on a tweet
// @route   GET /api/tweets/:id/like
// @access  PUBLIC
const getLikes = asyncHandler(async (req, res) => {
    conn.query("SELECT COUNT(*) AS like_count FROM LIKES WHERE TWEET_ID = ?", [req.params.id], (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).json({ message: 'Error getting likes' })
        }

        res.json({ likes: results[0].like_count })
    })
})

// @desc    Like a Tweet
// @route   POST /api/tweets/:id/like
// @access  Private
const likeTweet = asyncHandler(async (req, res) => {
    const tweet_id = req.params.id
    const user_id = req.user.ID

    conn.query('SELECT * FROM TWEETS WHERE ID = ? AND USER_ID = ?', [tweet_id, user_id], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error finding tweet' })
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'You cannot like your own tweet' })
        }

        conn.query('SELECT * FROM LIKES WHERE USER_ID = ? AND TWEET_ID = ?', [user_id, tweet_id], (err, results) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ message: 'Error Checking Like' })
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'Like already exists' })
            }

            conn.query('INSERT INTO LIKES (USER_ID, TWEET_ID) VALUES (?,?)', [user_id, tweet_id], (err) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ message: 'Error in Liking a Tweet' })
                }

                res.json({
                    message: 'Like added',
                    user_id: user_id,
                    tweet_id: tweet_id
                })
            })
        })
    })
})

// @desc    Unlike a Tweet
// @route   DELETE /api/tweets/:id/unlike
// @access  Private
const unlikeTweet = asyncHandler(async (req, res) => {
    const tweet_id = req.params.id
    const user_id = req.user.ID

    conn.query('SELECT * FROM LIKES WHERE USER_ID = ? AND TWEET_ID = ?', [user_id, tweet_id], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error Checking Like' })
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Like doesn't exist" })
        }

        conn.query('DELETE FROM LIKES WHERE USER_ID = ? AND TWEET_ID = ?', [user_id, tweet_id], (err) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ message: 'Error in unliking a Tweet' })
            }

            res.json({
                message: 'unliked',
                user_id: user_id,
                tweet_id: tweet_id
            })
        })
    })
})

// @desc    Get Comments on Tweets
// @route   GET /api/tweets/:id/comment
// @access  Private
const getComments = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Get Tweets" })
})

// @desc    Comment on a Tweet
// @route   POST /api/tweets/:id/comment
// @access  Private
const addComment = asyncHandler(async (req, res) => {
    const data = {
        content: req.body.content,
        tweet_id: req.params.id,
        user_id: req.user.ID
    }

    res.status(200).json(data)
})

// @desc    Delete a comment
// @route   DELETE /api/tweets/:id/comment/:comment_id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
    res.status(200).json({ id: req.params.comment_id })
})


module.exports = {
    getTweets,
    createTweet,
    updateTweet,
    deleteTweet,
    getLikes,
    likeTweet,
    unlikeTweet,
    getComments,
    addComment,
    deleteComment
}