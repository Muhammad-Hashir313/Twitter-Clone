const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const conn = require('./config/db') // Starts the database
const { errorHandler } = require('./middleware/errorMiddleware')
const http = require('http')
const { Server } = require('socket.io')

const PORT = process.env.PORT || 5000

const app = express()

const server = http.createServer(app)           // ✅ Create HTTP server from Express app

// ✅ Setup socket.io with the server
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],      // ✅ Use HTTP, not HTTPS
        methods: ['GET', 'POST']
    }
})

// ✅ Socket event listener
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
    })
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/tweets', require('./routes/tweetRoute'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/messages', require('./routes/messageRoutes'))

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server starting at port: ${PORT}`))