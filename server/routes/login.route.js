const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

// POST request to /api/login
// Uses Basic Auth to authenticate user
// If successful, returns cookie with JWT
router.route('/login').post((req, res) => {
    const authHeader = req.headers['authorization']
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    const username = auth[0]
    const password = auth[1]

    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(401).json({ error: 'Password does not match' })
                    }

                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
                    res.cookie('token', token, { httpOnly: true })
                    res.json({ message: 'Login successful' })
                })
                .catch(err => res.status(400).json({ error: err.message }))
        })
        .catch(err => res.status(400).json({ error: err.message }))
})

module.exports = router