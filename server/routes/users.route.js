const router = require("express").Router();

const auth = require("../middlewares/auth.middleware");
const User = require("../models/user.model");

router.use(auth);

// GET /api/users/:id
// Returns user (_id, name, avatar) with specified id
router.route("/:id").get((req, res) => {
    User.findById(req.params.id, "name avatar")
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
