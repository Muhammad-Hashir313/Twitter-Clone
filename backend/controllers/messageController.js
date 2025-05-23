const asyncHandler = require('express-async-handler')
const conn = require('../config/db')

// @desc    Get Chats
// @route   GET /api/messages/chats
// @access  Private
const getChats = asyncHandler(async (req, res) => {
    const query = "SELECT DISTINCT CASE WHEN SENDER_ID = ? THEN RECEIVER_ID ELSE SENDER_ID END AS user_id FROM CHATS WHERE SENDER_ID = ? OR RECEIVER_ID = ?"

    conn.query(query, [req.user.ID, req.user.ID, req.user.ID], (err, result) => {
        if (err) throw err
        res.status(200).json(result)
    })
})

// @desc    Get Messages
// @route   GET /api/messages/:id
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const receiver_id = parseInt(req.params.id)
    const sender_id = req.user.ID

    conn.query('SELECT * FROM MESSAGES WHERE (SENDER_ID = ? AND RECEIVER_ID = ?) OR (RECEIVER_ID = ? AND SENDER_ID = ?)', [sender_id, receiver_id, sender_id, receiver_id], (err, result) => {
        if (err) throw err
        res.status(200).json(result)
    })
})

// @desc    Send message
// @route   POST /api/messages/:id
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const receiver_id = parseInt(req.params.id)
    const message = req.body.message
    const sender_id = req.user.ID

    // Step 1: Insert message
    conn.query('INSERT INTO MESSAGES (SENDER_ID, RECEIVER_ID, MESSAGE) VALUES (?, ?, ?)', [sender_id, receiver_id, message], (err, result) => {
        if (err) throw err

        // Step 2: Insert chat entry if not exists
        const checkQuery = 'SELECT * FROM CHATS WHERE SENDER_ID = ? AND RECEIVER_ID = ?'
        conn.query(checkQuery, [sender_id, receiver_id], (err, chatResult) => {
            if (err) throw err

            if (chatResult.length === 0) {
                const insertChat = 'INSERT INTO CHATS (SENDER_ID, RECEIVER_ID) VALUES (?, ?)'
                conn.query(insertChat, [sender_id, receiver_id], (err) => {
                    if (err) throw err
                })
            }

            res.status(200).json({
                id: result.insertId,
                senderId: sender_id,
                receiverId: receiver_id,
                message: message
            })
        })
    })
})


module.exports = {
    getChats,
    getMessages,
    sendMessage
}