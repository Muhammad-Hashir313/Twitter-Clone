import axios from 'axios'

const API_URL = '/api/users/'

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL, userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

// Logout user
const logout = () => {
    localStorage.removeItem('user')
}

// Search user
const searchUser = async (userData) => {
    const response = await axios.post(API_URL + 'search', userData)

    return response.data
}

// Get another user profile
const getUserProfile = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + 'profile/' + userData, config)
    return response.data
}

// Get Followers
const getFollowers = async (userID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + userID + '/followers', config)

    return response.data
}

// Get Following
const getFollowing = async (userID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + userID + '/following', config)

    return response.data
}

// Follow user
const followUser = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(`${API_URL}${userData}/follow`, {}, config)

    return response.data
}

// Unfollow User
const unfollowUser = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(`${API_URL}${userData}/unfollow`, config)

    return response.data
}

const authService = {
    register,
    login,
    logout,
    searchUser,
    getUserProfile,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser
}

export default authService