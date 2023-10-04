const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Item = require('../models/item.model');
const auth = require('../middleware/auth');

router.use(auth);

// GET request to /api/profile
// Returns the user
router.route('/').get((req, res) => {
    User.findById(req.userId)
        .then(user => res.json(user))
        .catch(err => res.status(400).json({ error: err.message }))
})

// PATCH request to /api/profile
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

// GET request to /api/profile/items
// Returns the user's items
router.route('/items').get((req, res) => {
    const offset = parseInt(req.query.offset) || 0
    const limit = parseInt(req.query.limit) || undefined

    Item.find({ owner: req.userId })
        .sort({ updatedAt: 'desc' })
        .skip(offset)
        .limit(limit)
        .then(items => res.json(items))
        .catch(err => res.status(400).json({ error: err.message }))
})

// GET request to /api/profile/items/:id
// Returns the user's item with the specified id
router.route('/items/:id').get((req, res) => {
    Item.findOne({ _id: req.params.id, owner: req.userId })
        .then(item => res.json(item))
        .catch(err => res.status(400).json({ error: err.message }))
})

// POST request to /api/profile/items
// Creates a new item
router.route('/items').post((req, res) => {
    let item = new Item({
        owner: req.userId,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        images: req.body.images,
        tags: req.body.tags
    })
    
    item.save()
        .then(() => res.status(201).json(item))
        .catch(err => res.status(400).json({ error: err.message }))
})

// PATCH request to /api/profile/items/:id
// Updates the user's item with the specified id
router.route('/items/:id').patch((req, res) => {
    Item.findOne({ _id: req.params.id, owner: req.userId })
        .then(item => {
            if (req.body.name) item.name = req.body.name
            if (req.body.price) item.price = req.body.price
            if (req.body.description) item.description = req.body.description
            if (req.body.images) item.images = req.body.images
            if (req.body.tags) item.tags = req.body.tags

            item.save()
                .then(() => res.status(204).json())
                .catch(err => res.status(400).json({ error: err.message }))
        })
        .catch(err => res.status(400).json({ error: err.message }))
})

// DELETE request to /api/profile/items/:id
// Deletes the user's item with the specified id
router.route('/items/:id').delete((req, res) => {
    Item.findOneAndDelete({ _id: req.params.id, owner: req.userId })
        .then(() => res.status(204).json())
        .catch(err => res.status(400).json({ error: err.message }))
})

module.exports = router;