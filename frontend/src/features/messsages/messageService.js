import axios from 'axios'

const API_URL = '/api/messages/'

const getChats = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + 'chats', config)
    return response.data
}

const getMessages = async (token, id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + id, config)
    return response.data
}

const sendMessage = async (id, message, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + id, message, config)
    return response.data
}

const messageService = {
    getChats,
    getMessages,
    sendMessage
}

export default messageService