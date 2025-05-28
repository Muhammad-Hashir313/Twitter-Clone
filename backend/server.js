// backend/server.js
const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const conn = require('./config/db') // Starts the database
const { errorHandler } = require('./middleware/errorMiddleware')
const http = require('http')
const { initializeSocket, getIO } = require('./config/socket')

const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)

initializeSocket(server)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    req.io = getIO()
    next()
})

app.use('/api/tweets', require('./routes/tweetRoute'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/messages', require('./routes/messageRoutes'))
app.use("/api", require("./routes/chatbotRoute"));

app.use(errorHandler)

server.listen(PORT, () => console.log(`Server starting at port: ${PORT}`))
