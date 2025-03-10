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
    }
})

export const { resetTweets } = tweetSlice.actions
export default tweetSlice.reducer