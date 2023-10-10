const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        password: { type: String },
        name: { type: String, default: "Anonymous" },
        avatar: { type: String },

        blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

module.exports = model("User", userSchema);
