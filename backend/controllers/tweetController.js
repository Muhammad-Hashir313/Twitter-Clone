const asyncHandler = require('express-async-handler')
const Tweet = require('../models/tweetModel')

// @desc    Get Tweets
// @route   GET /api/tweets
// @access  Private
const getTweets = asyncHandler(async (req, res) => {
    const tweets = await Tweet.find()

    res.status(200).json(tweets)
})

// @desc    Create a Tweet
// @route   POST /api/tweets
// @access  Private
const createTweet = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('Please add some text')
    }

    const newTweet = await Tweet.create({
        text: req.body.text
    })

    res.status(201).json(newTweet)
})

// @desc    Update a Tweet
// @route   UPDATE /api/tweets/:id
// @access  Private
const updateTweet = asyncHandler(async (req, res) => {
    const id = req.params.id

    const tweet = await Tweet.findById(id)
    if (!tweet) {
        res.status(400)
        throw new Error('Tweet not found!')
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(id, req.body, { new: true })

    res.status(200).json(updatedTweet)
})

// @desc    Delete a Tweet
// @route   GET /api/tweets/:id
// @access  Private
const deleteTweet = asyncHandler(async (req, res) => {
    const id = req.params.id

    const tweet = await Tweet.findById(id)
    if (!tweet) {
        res.status(400)
        throw new Error('Tweet not found!')
    }

    await Tweet.findByIdAndDelete(id)

    res.status(200).json({ id: id })
})

module.exports = {
    getTweets,
    createTweet,
    updateTweet,
    deleteTweet
}