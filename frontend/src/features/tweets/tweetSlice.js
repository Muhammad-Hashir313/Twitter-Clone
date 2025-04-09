import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import tweetService from './tweetService'

const initialState = {
    tweets: [],
    tweetLikes: {}, // new: { [tweetId]: { likes: number, liked: boolean } }
    comments: {},
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

// Get Tweets
export const getAllTweets = createAsyncThunk('tweets/getAll', async (_, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await tweetService.getAllTweets(token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Get user tweets
export const getTweets = createAsyncThunk('tweets/get', async (_, thunkAPI) => {
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
        const token = await thunkAPI.getState().auth.user.token
        return await tweetService.getLikes(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Create Like on tweet
export const likeTweet = createAsyncThunk('tweets/like', async (id, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await tweetService.likeTweet(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Unlike a tweet
export const unlikeTweet = createAsyncThunk('tweets/unlike', async (id, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await tweetService.unlikeTweet(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Get comments for a tweet
export const getComments = createAsyncThunk('tweets/getComments', async (tweetId, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await tweetService.getComments(token, tweetId);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Add a comment
export const addComment = createAsyncThunk('tweets/addComment', async ({ tweetId, content }, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await tweetService.addComment({ token, tweetId, content });
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete a comment
export const deleteComment = createAsyncThunk('tweets/deleteComment', async ({ tweetId, commentId }, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await tweetService.deleteComment({ token, tweetId, commentId });
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const tweetSlice = createSlice({
    name: 'tweets',
    initialState,
    reducers: {
        resetTweets: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllTweets.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllTweets.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tweets = action.payload
            })
            .addCase(getAllTweets.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
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
            .addCase(likeTweet.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getLikes.fulfilled, (state, action) => {
                const { tweet_id, likes, liked } = action.payload;
                state.tweetLikes[tweet_id] = { likes, liked };
            })
            .addCase(getComments.fulfilled, (state, action) => {
                const { tweetId, comments } = action.payload;
                state.comments[tweetId] = comments;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const { tweet_id, ...rest } = action.payload;
                if (!state.comments[tweet_id]) {
                    state.comments[tweet_id] = [];
                }
                state.comments[tweet_id].unshift({ tweet_id, ...rest });
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const { tweetId, commentId } = action.payload;
                if (state.comments[tweetId]) {
                    state.comments[tweetId] = state.comments[tweetId].filter(c => c.COMMENT_ID !== commentId);
                }
            })
    }
})

export const { resetTweets } = tweetSlice.actions
export default tweetSlice.reducer