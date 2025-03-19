import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import tweetService from './tweetService'

const initialState = {
    tweets: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

export const getTweets = createAsyncThunk('tweets/getAll', async (_, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token
        return await tweetService.getTweets(token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Create a tweet
export const createTweet = createAsyncThunk('tweets/create', async (goalData, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await tweetService.createTweet(goalData, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Delete a tweet
export const deleteTweet = createAsyncThunk('tweets/delete', async (id, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await tweetService.deleteTweet(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Get Likes
export const getLikes = createAsyncThunk('tweets/getLikes', async (id, thunkAPI) => {
    try {
        return await tweetService.deleteTweet(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const tweetSlice = createSlice({
    name: 'tweets',
    initialState,
    reducers: {
        resetTweets: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTweets.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getTweets.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tweets = action.payload
            })
            .addCase(getTweets.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(createTweet.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createTweet.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tweets.push(action.payload)
            })
            .addCase(createTweet.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteTweet.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteTweet.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tweets = state.tweets.filter((tweet) => tweet.id !== action.payload.id)
            })
            .addCase(deleteTweet.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { resetTweets } = tweetSlice.actions
export default tweetSlice.reducer