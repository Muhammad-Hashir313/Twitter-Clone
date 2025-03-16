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

// @desc    Like a Tweet
// @route   POST /api/tweets/like/:id
// @access  Private
const likeTweet = asyncHandler(async (req, res) => {
    const id = req.params.id

    res.json({ message: `Like ${id}` })
})


module.exports = {
    getTweets,
    createTweet,
    updateTweet,
    deleteTweet,
    likeTweet
}