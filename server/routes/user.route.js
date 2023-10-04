const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const auth = require('../middleware/auth');

router.use(auth);

// GET request to /api/user
// Returns the user
router.route('/').get((req, res) => {
    User.findById(req.userId)
        .then(user => res.json(user))
        .catch(err => res.status(400).json({ error: err.message }))
})

// PATCH request to /api/user
// Updates the user (password)
router.route('/').patch((req, res) => {
    User.findById(req.userId)
        .then(async user =>  {
            if (req.body.password) {
                try {
                    const hash = await bcrypt.hash(req.body.password, 10)
                    user.password = hash
                } catch (err) {
                    return res.status(400).json({ error: err.message })
                }
            }

            user.save()
                .then(() => res.status(204).json())
                .catch(err => res.status(400).json({ error: err.message }))
        })
        .catch(err => res.status(400).json({ error: err.message }))
})

module.exports = router;