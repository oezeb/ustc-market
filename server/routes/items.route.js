const router = require('express').Router();
const Item = require('../models/item.model');
const auth = require('../middleware/auth');

router.use(auth);

// GET request to /api/items
// Returns items
router.route('/').get((req, res) => {
    const query = {}
    if (req.query.owner) query.owner = req.query.owner
    if (req.query.price) query.price = req.query.price
    if (req.query.priceMin) query.price = { $gte: req.query.priceMin }
    if (req.query.priceMax) query.price = { $lte: req.query.priceMax }
    if (req.query.tags) query.tags = { $in: req.query.tags.split(',') }
    if (req.query.text) query.$text = { $search: req.query.text }

    const orderBy = req.query.orderBy || 'updatedAt'
    const order = req.query.order || 'desc'
    const offset = parseInt(req.query.offset) || 0
    const limit = parseInt(req.query.limit) || undefined
    const fields = req.query.fields ? req.query.fields.replace(/,/g, ' ') : undefined

    Item.find(query, fields)
        .sort({ [orderBy]: order })
        .skip(offset)
        .limit(limit)
        .then(items => res.json(items))
        .catch(err => res.status(400).json({ error: err.message }))
});

// GET request to /api/items/:id
// Returns an item
router.route('/:id').get((req, res) => {
    Item.findById(req.params.id)
        .then(item => res.json(item))
        .catch(err => res.status(400).json({ error: err.message }))
});

module.exports = router;