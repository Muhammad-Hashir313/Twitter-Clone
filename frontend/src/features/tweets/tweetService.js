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
            Authorization: `Bearer ${token}`,
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

// Get Likes
const getLikes = async (tweetID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const res = await axios.get(API_URL + tweetID + '/like', config)

    return { tweet_id: tweetID, ...res.data }
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

// Get comments for a tweet
const getComments = async (token, tweetId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const res = await axios.get(`${API_URL}${tweetId}/comment`, config);
    return { tweetId, comments: res.data };
};

// Add a comment to a tweet
const addComment = async ({ token, tweetId, content }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const res = await axios.post(`${API_URL}${tweetId}/comment`, { content }, config);
    return res.data;
};

// Delete a comment
const deleteComment = async ({ token, tweetId, commentId }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    await axios.delete(`${API_URL}${tweetId}/comment/${commentId}`, config);
    return { tweetId, commentId };
};

const tweetService = {
    getAllTweets,
    getTweets,
    createTweet,
    deleteTweet,
    getLikes,
    likeTweet,
    unlikeTweet,
    getComments,
    addComment,
    deleteComment,
}

export default tweetService