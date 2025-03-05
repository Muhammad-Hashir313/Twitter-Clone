import axios from 'axios'

const API_URL = '/api/users/'

// Register user
const register = async (userData) => {
    try {
        const response = await axios.post(API_URL, userData)

        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data))
        }

        return response.data

    } catch (error) {
        console.error(error)

        throw error.response ? error.response.data : { message: 'Registeration Failed' }
    }
}

// Login user
const login = async (userData) => {
    try {
        const response = await axios.post(API_URL + 'login', userData)

        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data))
        }

        return response.data
    } catch (error) {
        console.error(error)

        throw error.response ? error.response.data : { message: 'Login Failed' }
    }
}

// Logout user
const logout = () => {
    localStorage.removeItem('user')
}

const authService = {
    register,
    login,
    logout
}

export default authService