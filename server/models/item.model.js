const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            index: { text: true },
        },
        price: { type: Number },
        images: { type: [String] },
        tags: { type: [String], index: { text: true } },
        sold: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
