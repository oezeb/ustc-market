const fs = require("fs");
const router = require("express").Router();
const bcrypt = require("bcryptjs");

const auth = require("../middleware/auth");
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
// avatar should be first uploaded to the server using /api/upload/images
router.route("/").patch(async (req, res) => {
    User.findByIdAndUpdate(req.userId, {
        name: req.body.name,
        avatar: req.body.avatar,
        password: await bcrypt.hash(req.body.password || "", 10),
    })
        .then((user) => {
            if (!user) return Promise.reject(new Error("User not found"));
            if (user.avatar) fs.unlinkSync(user.avatar);

            return res.status(204).json();
        })
        .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
