const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getAll } = require('../controllers/userController')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', getAll)

module.exports = router