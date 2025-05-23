import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import messageService from './messageService'

const initialState = {
    messages: [],
    chats: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    currentReceiverId: null
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
        console.log('Getting messages for receiverId:', id)
        const token = thunkAPI.getState().auth.user.token
        const result = await messageService.getMessages(token, id)
        return { messages: result, receiverId: id }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const sendMessage = createAsyncThunk('message/sendMessage', async ({ id, message }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const result = await messageService.sendMessage(id, message, token)
        return { messages: result, receiverId: id }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        resetMessages: (state) => {
            state.messages = []
        },
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
            .addCase(getMessages.pending, (state, action) => {
                state.isLoading = true
                // Clear messages when starting to fetch for a different receiver
                if (state.currentReceiverId !== action.meta.arg) {
                    state.messages = []
                    state.currentReceiverId = action.meta.arg
                }
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.currentReceiverId = action.payload.receiverId
                state.messages = action.payload.messages
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(sendMessage.pending, (state) => {
                state.isLoading = false // Don't show loading when sending (we handle this locally)
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                // Only update messages if it's for the current conversation
                if (state.currentReceiverId === action.payload.receiverId) {
                    state.messages = action.payload.messages
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { reset, resetMessages } = messageSlice.actions
export default messageSlice.reducer