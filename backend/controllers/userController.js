const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const User = require('../models/userModel')
const conn = require('../config/db')
const { response } = require('express')

// @desc    Register a New User
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please enter all fields')
    }

    conn.query('SELECT * FROM USERS WHERE EMAIL = ?', [email], async (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error checking user!' })
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "User already exists!" })
        }

        try {
            // Hash Password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            conn.query('INSERT INTO USERS (NAME, EMAIL, PASSWORD) VALUES (?,?,?)', [name, email, hashedPassword], (err, results) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ message: 'Error registering user!' })
                }

                conn.query('SELECT ID, NAME, EMAIL, PROFILE_PIC, CREATED_AT FROM USERS WHERE ID = ?', [results.insertId], (err, results) => {
                    if (err) {
                        console.error(err)
                        return res.status(500).json({ message: 'Error getting user!' })
                    }

                    const newUser = {
                        id: results[0].ID,
                        name: results[0].NAME,
                        email: results[0].EMAIL,
                        profilePic: results[0].PROFILE_PIC,
                        token: generateToken(results[0].ID),
                        createdAt: results[0].CREATED_AT
                    }

                    res.status(201).json(newUser)
                })

            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Error hashing password' })
        }
    })
})

// @desc    Authenticate user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error('Please enter all fields')
    }

    conn.query('SELECT * FROM USERS WHERE EMAIL = ?', [email], async (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error checking user' })
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "user not found!" })
        }

        const user = results[0]

        if (user && (await bcrypt.compare(password, user.PASSWORD))) {
            res.status(200).json({
                id: user.ID,
                name: user.NAME,
                email: email,
                profilePic: user.PROFILE_PIC,
                token: generateToken(user.ID),
                createdAt: user.CREATED_AT
            })
        } else {
            res.status(400)
            return res.json({ message: 'Invalid Credentials' })
        }
    })
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getAll = asyncHandler(async (req, res) => {
    res.json(req.user)
})

// @desc    Search user
// @route   GET /api/users/search
// @access  Private
const searchUser = asyncHandler(async (req, res) => {
    const { name } = req.body

    if (!name) {
        res.status(400)
        throw new Error('Please enter field')
    }

    conn.query('SELECT ID, NAME, EMAIL, PROFILE_PIC FROM USERS WHERE NAME LIKE ?', [`${name}%`], (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).json({ message: 'Error searching user' })
        }

        res.status(200).json(results)
    })
})

// @desc    Get another user
// @route   GET /api/users/profile/:name
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const name = req.params.name
    const follower_id = req.user.ID

    conn.query('SELECT * FROM USERS WHERE NAME = ?', [name], (err, results) => {
        if (err) {
            console.error(err)
            throw new Error('Error getting user')
        }

        const following_id = results[0].ID
        const userData = results[0]

        conn.query('SELECT COUNT(*) as isFollowing FROM FOLLOW WHERE FOLLOWER_ID = ? AND FOLLOWING_ID = ?', [follower_id, following_id], (err, results) => {
            if (err) {
                console.error(err)
                throw new Error('Database Error')
            }

            const isFollowing = results[0].isFollowing

            conn.query('SELECT *, T.CREATED_AT as TWEET_CREATED_AT FROM TWEETS T JOIN USERS U ON T.USER_ID = U.ID WHERE U.NAME = ?', [name], (err, results) => {
                if (err) {
                    console.error(err)
                    throw new Error('Error getting user')
                }

                if (results) {

                }

                const totalResult = {
                    isFollowing: isFollowing,
                    userData,
                    totalResult: results.length > 0 ? results : null
                }

                res.json(totalResult)
            })
        })
    })
})

// @desc    Get Followers
// @route   GET /api/users/:id/followers
// @access  Public
const getFollowers = asyncHandler(async (req, res) => {
    const id = req.params.id

    conn.query('SELECT COUNT(*) AS followers FROM FOLLOW WHERE FOLLOWING_ID = ?', [id], (err, results) => {
        if (err) {
            console.error(err)
            throw new Error('Error getting Followers')
        }

        res.status(200).json(results[0])
    })
})

// @desc    Get Following
// @route   GET /api/users/:id/following
// @access  Public
const getFollowing = asyncHandler(async (req, res) => {
    const id = req.params.id

    conn.query('SELECT COUNT(*) AS following FROM FOLLOW WHERE FOLLOWER_ID = ?', [id], (err, results) => {
        if (err) {
            console.error(err)
            throw new Error('Error getting Following')
        }

        res.status(200).json(results[0])
    })
})

// @desc    Follow User
// @route   POST /api/users/:id/follow
// @access  Private
const followUser = asyncHandler(async (req, res) => {
    const follower_id = req.user.ID
    const following_id = parseInt(req.params.id)

    if (follower_id === parseInt(following_id)) {
        return res.status(400).json({ message: 'Cannot follow yourself' })
    }

    conn.query('INSERT INTO FOLLOW (FOLLOWER_ID, FOLLOWING_ID) VALUES (?,?)', [follower_id, following_id], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Already followed' });
            }
            console.error('Follow error:', err);
            return res.status(500).json({ message: 'Error in following user' });
        }

        req.io.emit('followNotification', {
            from: follower_id,
            to: following_id,
            message: `User ${follower_id} followed User ${following_id}`
        })

        res.status(200).json({
            follower: follower_id,
            following: following_id
        })
    })
})

// @desc    Get another user
// @route   GET /api/users/:id/unfollow
// @access  Private
const unfollowUser = asyncHandler(async (req, res) => {
    const follower_id = req.user.ID
    const following_id = parseInt(req.params.id)

    if (follower_id === parseInt(following_id)) {
        return res.status(400).json({ message: 'Cannot unfollow yourself' })
    }

    conn.query('DELETE FROM FOLLOW WHERE FOLLOWER_ID = ? AND FOLLOWING_ID = ?', [follower_id, following_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error in unfollowing user' })
        }

        if (results.affectedRows === 0) {
            return res.status(400).json({ message: 'You are not following this user' })
        }

        res.status(200).json({
            follower: follower_id,
            following: following_id
        })
    })
})

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    conn.query('SELECT NAME FROM USERS WHERE ID = ?', [id], (err, result) => {
        if (err) throw err;
        res.status(200).json(result[0])
    })
})

// @desc    Upload Profile Picture
// @route   POST /api/users/profile-pic
// @access  Private
const uploadProfilePic = asyncHandler(async (req, res) => {
    const { profilePic } = req.body
    const userId = req.user.ID

    if (!profilePic) {
        res.status(400)
        throw new Error('Please provide profile picture URL')
    }

    conn.query('UPDATE USERS SET PROFILE_PIC = ? WHERE ID = ?', [profilePic, userId], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error updating profile picture' })
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({
            message: 'Profile picture updated successfully',
            profilePic: profilePic
        })
    })
})

// @desc    Remove Profile Picture
// @route   DELETE /api/users/profile-pic
// @access  Private
const removeProfilePic = asyncHandler(async (req, res) => {
    const userId = req.user.ID

    conn.query('UPDATE USERS SET PROFILE_PIC = NULL WHERE ID = ?', [userId], (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Error removing profile picture' })
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({
            message: 'Profile picture removed successfully'
        })
    })
})

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getAll,
    searchUser,
    getUserProfile,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    getUser
}