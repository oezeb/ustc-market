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
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: /^[a-zA-Z0-9_\-\.]+@(mail\.)?ustc\.edu\.cn$/,
        },
        password: { type: String },
        name: { type: String, default: "Anonymous" },
        avatar: { type: String },

        emailVerified: { type: Boolean, default: false },
        blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

module.exports = model("User", userSchema);
