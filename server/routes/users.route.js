const router = require("express").Router();
const User = require("../models/user.model");
const auth = require("../middleware/auth");

router.use(auth);

// GET request to /api/users/:id
// Returns a user (name, avatar)
router.route("/:id").get((req, res) => {
    User.findById(req.params.id, "name avatar")
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
