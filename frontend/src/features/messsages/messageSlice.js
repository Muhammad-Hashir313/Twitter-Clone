import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import messageService from './messageService'

const initialState = {
    messages: [],
    chats: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
}

export const getChats = createAsyncThunk('message/getChats', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await messageService.getChats(token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getMessages = createAsyncThunk('message/getMessages', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await messageService.getMessages(token, id)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const sendMessage = createAsyncThunk('message/sendMessage', async ({ id, message }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token

        return await messageService.sendMessage(id, message, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChats.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getChats.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.chats = action.payload
            })
            .addCase(getChats.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getMessages.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.messages = action.payload
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(sendMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.messages = action.payload
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { reset } = messageSlice.actions
export default messageSlice.reducer