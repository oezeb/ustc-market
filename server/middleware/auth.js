const jwt = require('jsonwebtoken')
let User = require('../models/user.model')

module.exports = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' })
        }

        req.userId = decoded._id
        next()
    })
}
