import axios from 'axios'

const API_URL = '/api/tweets/'

// Get tweets
const getTweets = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data
}

// Create a tweet
const createTweet = async (goalData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, goalData, config)

    return response.data
}

// Delete a tweet
const deleteTweet = async (tweetID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + tweetID, config)

    return response.data
}

const tweetService = {
    getTweets,
    createTweet,
    deleteTweet
}

export default tweetService