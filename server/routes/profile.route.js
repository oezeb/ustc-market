const router = require("express").Router();
const bcrypt = require("bcryptjs");
const sharp = require("sharp");

const config = require("../config");
const { encrypt, decrypt } = require("../encryption");
const auth = require("../middleware/auth");
const { uploadImage, resizeImage } = require("../middleware/image");
const User = require("../models/user.model");
const Item = require("../models/item.model");
const Message = require("../models/message.model");

router.use(auth);

// GET /api/profile
// Returns current user
router.route("/").get((req, res) => {
    User.findById(req.userId)
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// PATCH /api/profile
// Updates current user (name, avatar, password)
router
    .route("/")
    .patch(uploadImage.single("avatar"), resizeImage, async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (req.body.name) user.name = req.body.name;
            if (req.file) {
                const filename = `${config.avatarsDir}/${req.userId}.jpeg`;
                await sharp(req.file.buffer).toFile(filename);
                user.avatar = filename;
            }
            if (req.body.password) {
                const hash = await bcrypt.hash(req.body.password, 10);
                user.password = hash;
            }

            await user.save();
            res.status(204).json();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

const decryptMessages = (messages) => {
    for (let msg of messages) msg.content = decrypt(msg.content);
    return messages;
};

// GET request to /api/profile/messages
// Returns the user's messages
router.route("/messages").get((req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || undefined;

    const query = {
        $or: [{ sender: req.userId }, { receiver: req.userId }],
        blocked: false,
    };

    if (req.query.otherUser) {
        query.$or[0].receiver = req.query.otherUser;
        query.$or[1].sender = req.query.otherUser;
    }
    if (req.query.item) query.item = req.query.item;

    Message.find(query)
        .skip(offset)
        .limit(limit)
        .then((messages) => res.json(decryptMessages(messages)))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// GET request to /api/profile/messages/count
// Returns the user's message count
router.route("/messages/count").get((req, res) => {
    const query = {
        $or: [{ sender: req.userId }, { receiver: req.userId }],
        blocked: false,
    };

    if (req.query.otherUser) {
        query.$or[0].receiver = req.query.otherUser;
        query.$or[1].sender = req.query.otherUser;
    }
    if (req.query.item) query.item = req.query.item;

    Message.countDocuments(query)
        .then((count) => res.json(count))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// GET request to /api/profile/messages/:id
// Returns the user's message with the specified id
router.route("/messages/:id").get((req, res) => {
    Message.findOne({
        _id: req.params.id,
        blocked: false,
        $or: [{ sender: req.userId }, { receiver: req.userId }],
    })
        .then((message) => res.json(decryptMessages([message])[0]))
        .catch((err) => res.status(400).json({ error: err.message }));
});

// POST request to /api/profile/messages
// Creates a new message
router.route("/messages").post(async (req, res) => {
    const item = await Item.findById(req.body.item);
    if (!item) return res.status(400).json({ error: "Item not found" });

    const receiver = await User.findById(item.owner);
    if (!receiver) return res.status(400).json({ error: "Receiver not found" });

    const message = new Message({
        item: item._id,
        sender: req.userId,
        receiver: receiver._id,
        content: encrypt(req.body.content),
        blocked: receiver.blockedUsers.includes(req.userId),
    });

    message
        .save()
        .then(() => res.status(201).json(decryptMessages([message])[0]))
        .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
