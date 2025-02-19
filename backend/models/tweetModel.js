const mongoose = require('mongoose')

const tweetSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add text']
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Tweet", tweetSchema)