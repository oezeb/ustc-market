const fs = require("fs");
const router = require("express").Router();
const bcrypt = require("bcryptjs");

const auth = require("../middlewares/auth.middleware");
const User = require("../models/user.model");

router.use(auth);

// GET /api/profile
// Returns current user
router.route("/").get((req, res) => {
    User.findById(req.user._id)
        .then((user) =>
            user ? res.json(user) : Promise.reject(new Error("User not found"))
        )
        .catch((err) => res.status(400).json({ error: err.message }));
});

// PATCH /api/profile
// Updates current user (name, avatar, password, blockedUsers)
// avatar should be first uploaded to the server using /api/upload/images
router.route("/").patch(async (req, res) => {
    const data = {};
    if (req.body.name) data.name = req.body.name;
    if (req.body.avatar) data.avatar = req.body.avatar;
    if (req.body.password)
        data.password = await bcrypt.hash(req.body.password, 10);
    if (req.body.blockedUsers) data.blockedUsers = req.body.blockedUsers;

    User.findByIdAndUpdate(req.user._id, data)
        .then((user) => {
            if (!user) return Promise.reject(new Error("User not found"));
            if (user.avatar && fs.existsSync(user.avatar))
                fs.unlinkSync(user.avatar);

            return res.status(204).json();
        })
        .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
