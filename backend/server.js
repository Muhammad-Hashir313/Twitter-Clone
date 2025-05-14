const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const conn = require('./config/db') // Starts the database
const { errorHandler } = require('./middleware/errorMiddleware')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/tweets', require('./routes/tweetRoute'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/messages', require('./routes/messageRoutes'))

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server starting at port: ${PORT}`))