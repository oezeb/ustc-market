const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User" },
        receiver: { type: Schema.Types.ObjectId, ref: "User" },
        item: { type: Schema.Types.ObjectId, ref: "Item" },
        content: { type: String },
        blocked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = model("Message", messageSchema);
