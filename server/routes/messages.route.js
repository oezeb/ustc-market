const router = require("express").Router();

const { encrypt, decrypt } = require("../encryption");
const auth = require("../middleware/auth");
const User = require("../models/user.model");
const Item = require("../models/item.model");
const Message = require("../models/message.model");

router.use(auth);

const decryptMessage = (msg) => {
    if (msg.content) msg.content = decrypt(msg.content);
    return msg;
};

// GET /api/messages
// Returns current user's messages matching query
// Query parameters include: sender, receiver, item, blocked, read, otherUser,
// orderBy, order, offset, limit, fields
router.route("/").get((req, res) => {
    const query = {
        $or: [{ sender: req.userId }, { receiver: req.userId }],
    };

    if (req.query.sender) query.sender = req.query.sender;
    if (req.query.receiver) query.receiver = req.query.receiver;
    if (req.query.item) query.item = req.query.item;
    if (req.query.blocked) query.blocked = req.query.blocked;
    if (req.query.read) query.read = req.query.read;
    if (req.query.otherUser) {
        query.$or[0].receiver = req.query.otherUser;
        query.$or[1].sender = req.query.otherUser;
    }

    const orderBy = req.query.orderBy || "createdAt";
    const order = req.query.order || "desc";
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || undefined;
    const fields = req.query.fields
        ? req.query.fields.replace(/,/g, " ")
        : undefined;

    Message.find(query, fields)
        .sort({ [orderBy]: order })
        .skip(offset)
        .limit(limit)
        .then((msgs) => res.json(msgs.map((msg) => decryptMessage(msg))))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// GET /api/messages/count
// Returns number of current user's messages matching query
// Query parameters include: sender, receiver, item, blocked, read, otherUser
router.route("/count").get((req, res) => {
    const query = {
        $or: [{ sender: req.userId }, { receiver: req.userId }],
    };

    if (req.query.sender) query.sender = req.query.sender;
    if (req.query.receiver) query.receiver = req.query.receiver;
    if (req.query.item) query.item = req.query.item;
    if (req.query.blocked) query.blocked = req.query.blocked;
    if (req.query.read) query.read = req.query.read;
    if (req.query.otherUser) {
        query.$or[0].receiver = req.query.otherUser;
        query.$or[1].sender = req.query.otherUser;
    }

    Message.countDocuments(query)
        .then((count) => res.json(count))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// GET /api/messages/:id
// Returns current user's message with specified id
router.route("/:id").get((req, res) => {
    Message.findOne({
        _id: req.params.id,
        $or: [{ sender: req.userId }, { receiver: req.userId }],
    })
        .then((msg) => msg || Promise.reject(new Error("Message not found")))
        .then((msg) => res.json(decryptMessage(msg)))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// POST /api/messages
// Creates a new message for the current user
router.route("/").post(async (req, res) => {
    if (!req.body.content) return res.status(400).json({ error: "No content" });

    const receiver = await User.findById(req.body.receiver);
    if (!receiver) return res.status(400).json({ error: "Receiver not found" });

    const item = await Item.findById(req.body.item);
    if (!item) return res.status(400).json({ error: "Item not found" });

    const owner = await User.findById(item.owner);
    if (!owner) return res.status(400).json({ error: "Item Owner not found" });

    const ownerId = `${owner._id}`;
    const receiverId = `${receiver._id}`;
    if (receiverId !== ownerId && req.userId !== ownerId)
        return res.status(400).json({ error: "Not authorized" });

    // Item owner should not be the one initiating the conversation
    if (ownerId === req.userId) {
        const msg = await Message.findOne({
            sender: receiverId,
            receiver: req.userId,
            item: item._id,
        });

        if (!msg) {
            return res.status(400).json({
                error: "You cannot initiate the conversation",
            });
        }
    }

    new Message({
        sender: req.userId,
        receiver: receiverId,
        item: item._id,
        content: encrypt(req.body.content),
        blocked: receiver.blockedUsers?.includes(req.userId),
    })
        .save()
        .then((msg) => res.json(decryptMessage(msg)))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// PATCH /api/messages/:id
// Updates current user's message (read) with specified id
router.route("/:id").patch((req, res) => {
    Message.findOneAndUpdate(
        {
            _id: req.params.id,
            receiver: req.userId,
        },
        { read: req.body.read }
    )
        .then((msg) => msg || Promise.reject(new Error("Message not found")))
        .then((msg) => res.status(204).json())
        .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
