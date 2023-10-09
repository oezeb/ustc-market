const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        content: { type: String },
        blocked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
