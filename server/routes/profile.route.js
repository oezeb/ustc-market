const router = require("express").Router();
const bcrypt = require("bcryptjs");

const auth = require("../middleware/auth");
const { resizeAvatar } = require("../middleware/profile");
const User = require("../models/user.model");

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
router.route("/").patch(resizeAvatar, async (req, res) => {
    User.findByIdAndUpdate(req.userId, {
        name: req.body.name,
        avatar: req.body.avatar,
        password: await bcrypt.hash(req.body.password || "", 10),
    })
        .then(() => res.status(204).json())
        .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
