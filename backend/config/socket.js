// config/socket.js
const { Server } = require('socket.io')

let io
const connectedUsers = new Map()

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173'],
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id)

        socket.on('registerUser', (userId) => {
            if (!userId) return
            connectedUsers.set(userId, socket.id)
            console.log(`User ${userId} registered with socket ${socket.id}`)
            console.log('Current connected users:', connectedUsers)
        })

        socket.on('disconnect', () => {
            for (const [userId, sId] of connectedUsers.entries()) {
                if (sId === socket.id) {
                    connectedUsers.delete(userId)
                    console.log(`User ${userId} disconnected`)
                    break
                }
            }
            console.log('Current connected users:', connectedUsers)
        })
    })
}

const getIO = () => io
const getConnectedUsers = () => connectedUsers

module.exports = { initializeSocket, getIO, getConnectedUsers }
