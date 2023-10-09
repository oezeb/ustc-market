const router = require("express").Router();
const Item = require("../models/item.model");
const auth = require("../middleware/auth");

router.use(auth);

// GET request to /api/items
// Returns items
router.route("/").get((req, res) => {
    const query = {};
    if (req.query.owner) query.owner = req.query.owner;
    if (req.query.price) query.price = req.query.price;
    if (req.query.priceMin) query.price = { $gte: req.query.priceMin };
    if (req.query.priceMax) query.price = { $lte: req.query.priceMax };
    if (req.query.tags) query.tags = { $in: req.query.tags.split(",") };
    if (req.query.sold) query.sold = req.query.sold;
    if (req.query.text) query.$text = { $search: req.query.text };

    const orderBy = req.query.orderBy || "updatedAt";
    const order = req.query.order || "desc";
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || undefined;
    const fields = req.query.fields
        ? req.query.fields.replace(/,/g, " ")
        : undefined;

    Item.find(query, fields)
        .sort({ [orderBy]: order })
        .skip(offset)
        .limit(limit)
        .then((items) => res.json(items))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// GET request to /api/items/count
// Returns item count
router.route("/count").get((req, res) => {
    const query = {};
    if (req.query.owner) query.owner = req.query.owner;
    if (req.query.price) query.price = req.query.price;
    if (req.query.priceMin) query.price = { $gte: req.query.priceMin };
    if (req.query.priceMax) query.price = { $lte: req.query.priceMax };
    if (req.query.tags) query.tags = { $in: req.query.tags.split(",") };
    if (req.query.sold) query.sold = req.query.sold;
    if (req.query.text) query.$text = { $search: req.query.text };

    Item.countDocuments(query)
        .then((count) => res.json(count))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// GET request to /api/items/tags
// Returns item tags with counts
router.route("/tags").get((req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || undefined;

    const pipeline = [
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $skip: offset },
    ];
    if (limit) pipeline.push({ $limit: limit });

    Item.aggregate(pipeline)
        .then((tags) => tags.map((tag) => ({ tag: tag._id, count: tag.count })))
        .then((tags) => res.json(tags))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// GET request to /api/items/:id
// Returns an item
router.route("/:id").get((req, res) => {
    Item.findById(req.params.id)
        .then((item) => res.json(item))
        .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
