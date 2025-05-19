import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import tweetReducer from '../features/tweets/tweetSlice'
import messageReducer from '../features/messsages/messageSlice'

export const Store = configureStore({
    reducer: {
        auth: authReducer,
        tweets: tweetReducer,
        message: messageReducer
    }
})