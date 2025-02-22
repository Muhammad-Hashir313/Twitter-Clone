const mongoose = require('mongoose')
const User = require('./userModel')

const tweetSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: [true, 'Please add text']
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Tweet", tweetSchema)