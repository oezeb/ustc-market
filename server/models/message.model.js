const mongoose = require("mongoose");
const User = require("./user.model");
const { encrypt, decrypt } = require("../middleware/encryption");

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

messageSchema.pre("save", async function (next) {
    const receiver = await User.findById(this.receiver);

    if (!receiver) throw new Error("Receiver not found");
    if (receiver.blockedUsers.includes(this.sender)) {
        this.blocked = true;
    }
    this.content = encrypt(this.content);

    next();
});

messageSchema.post("find", async function (messages) {
    for (let message of messages) message.content = decrypt(message.content);
});

messageSchema.post("findOne", async function (message) {
    if (message) message.content = decrypt(message.content);
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
