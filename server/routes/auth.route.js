const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../config");
const authController = require("../controllers/auth.controller");
const User = require("../models/user.model");
const auth = require("../middlewares/auth.middleware");

const { sendVerificationEmail, sendResetPasswordEmail } = authController;

// POST /api/auth/register
router.route("/register").post(async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
        });

        await sendVerificationEmail(req.body.email);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/auth/login
// Login using HTTP Basic Authentication
router.route("/login").post(async (req, res) => {
    const authHeader = req.headers["authorization"];
    const auth = Buffer.from(authHeader.split(" ")[1], "base64")
        .toString()
        .split(":");
    const username = auth[0];
    const password = auth[1];

    try {
        const user = await User.findOne({
            $or: [{ username }, { email: username }],
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        if (!user.emailVerified)
            return res.status(403).json({ error: "Email not verified" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ error: "Password does not match" });

        const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
            expiresIn: config.JWT_LIFETIME,
        });

        res.cookie("token", token, {
            maxAge: config.JWT_LIFETIME * 1000,
            httpOnly: true,
        }).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/auth/logout
router.route("/logout").post((req, res) => {
    res.clearCookie("token");
    res.status(204).json();
});

// PATCH /api/auth/send-verification-email/:email
router.route("/send-verification-email/:email").patch((req, res) =>
    sendVerificationEmail(req.params.email)
        .then(() => res.status(204).json())
        .catch((err) => res.status(400).json({ error: err.message }))
);

// PATCH /api/auth/verify-email
router.route("/verify-email").patch(auth, (req, res) => {
    User.findOneAndUpdate({ email: req.user.email }, { emailVerified: true })
        .then((user) => user || Promise.reject(new Error("User not found")))
        .then((user) => res.status(204).json())
        .catch((err) => res.status(400).json({ error: err.message }));
});

// PATCH /api/auth/send-reset-password-email/:email
router.route("/send-reset-password-email/:email").patch((req, res) =>
    sendResetPasswordEmail(email)
        .then(() => res.status(204).json())
        .catch((err) => res.status(400).json({ error: err.message }))
);

// PATCH /api/auth/reset-password
router.route("/reset-password").patch(auth, async (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        password: await bcrypt.hash(req.body.password, 10),
    })
        .then((user) => user || Promise.reject(new Error("User not found")))
        .then((user) => res.status(204).json())
        .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
