// @desc    Get Tweets
// @route   GET /api/tweets
// @access  Private
const getTweets = (req, res) => {
    res.status(200).json({ message: 'Get Tweets' })
}

// @desc    Create a Tweet
// @route   POST /api/tweets
// @access  Private
const createTweet = (req, res) => {
    res.status(201).json({ message: 'Create Tweet' })
}

// @desc    Update a Tweet
// @route   UPDATE /api/tweets/:id
// @access  Private
const updateTweet = (req, res) => {
    const id = req.params.id
    res.status(200).json({ message: `Updated Tweet ${id}` })
}

// @desc    Delete a Tweet
// @route   GET /api/tweets/:id
// @access  Private
const deleteTweet = (req, res) => {
    const id = req.params.id
    res.status(200).json({ message: `Deleted Tweet ${id}` })
}

module.exports = {
    getTweets,
    createTweet,
    updateTweet,
    deleteTweet
}