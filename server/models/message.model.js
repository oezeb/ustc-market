const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
        item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
        content: { type: String, required: true },
        blocked: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = model("Message", messageSchema);
