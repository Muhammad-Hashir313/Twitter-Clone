const { Server } = require('socket.io')
const redis = require('./redis')

let io
let connectedUsers = new Map()

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173'],
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket) => {
        socket.on('registerUser', async (user_id) => {
            connectedUsers.set(socket.id, user_id)

            await redis.set(`user:${user_id}`, socket.id, 'EX', 60 * 60 * 24)
        });

        socket.on('disconnect', async () => {
            const user_id = connectedUsers.get(socket.id)
            if (user_id) {
                await redis.del(`user:${user_id}`)
                connectedUsers.delete(socket.id)
            } else {
                console.log("User not found")
            }
        });
    });
}

const getIO = () => io

const getConnectedUsers = async () => {
    const keys = await redis.keys('user:*')
    const users = {}

    for (const key of keys) {
        const user_id = key.split(':')[1]
        const socket_id = await redis.get(key)
        users[user_id] = socket_id
    }

    return users
}

module.exports = { initializeSocket, getIO, getConnectedUsers }
