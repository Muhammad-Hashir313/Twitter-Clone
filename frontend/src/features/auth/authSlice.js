import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    name: "",
    followers: [],
    following: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    searchResults: [],
    anotherUser: []
}

// Register User
export const getUser = createAsyncThunk('auth/getUserById', async (user, thunkAPI) => {
    try {
        return await authService.getUser(user)
    } catch (error) {
        console.error(error)
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Register User
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (error) {
        console.error(error)
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Login User
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        return await authService.login(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Logout user
export const logout = createAsyncThunk('auth/logout', () => {
    authService.logout()
})

// Search user
export const searchUser = createAsyncThunk('auth/search', async (user, thunkAPI) => {
    try {
        return await authService.searchUser(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Get another user profile
export const getUserProfile = createAsyncThunk('auth/user', async (user, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await authService.getUserProfile(user, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Get Followers
export const getFollowers = createAsyncThunk('auth/followers', async (userID, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await authService.getFollowers(userID, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Get Following
export const getFollowing = createAsyncThunk('auth/following', async (userID, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await authService.getFollowing(userID, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Follow user
export const followUser = createAsyncThunk('auth/follow', async (user, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await authService.followUser(user, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Unfollow user
export const unfollowUser = createAsyncThunk('auth/unfollow', async (user, thunkAPI) => {
    try {
        const token = await thunkAPI.getState().auth.user.token

        return await authService.unfollowUser(user, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.data || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUser.fulfilled, (state, action) => {
                state.name = action.payload
            })
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
            .addCase(searchUser.fulfilled, (state, action) => {
                state.isSuccess = true
                state.searchResults = action.payload
            })
            .addCase(searchUser.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
            })
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.anotherUser = action.payload
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getFollowers.fulfilled, (state, action) => {
                state.followers = action.payload
            })
            .addCase(getFollowing.fulfilled, (state, action) => {
                state.following = action.payload
            })
    }
})

export const { reset } = authSlice.actions
export default authSlice.reducer