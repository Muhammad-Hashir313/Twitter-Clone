import axios from 'axios'

const API_URL = '/api/tweets/'

// Get All Tweets
const getAllTweets = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + 'all', config)

    return response.data
}

// Get user tweets
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

//Get Likes
const getLikes = async (tweetID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + tweetID + '/like', config)

    return response.data
}

// Like a tweet
const likeTweet = async (tweetID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + tweetID + '/like', {}, config)

    return response.data
}

// Unlike a tweet
const unlikeTweet = async (tweetID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + tweetID + '/unlike', config)

    return response.data
}

const tweetService = {
    getAllTweets,
    getTweets,
    createTweet,
    deleteTweet,
    getLikes,
    likeTweet,
    unlikeTweet
}

export default tweetService