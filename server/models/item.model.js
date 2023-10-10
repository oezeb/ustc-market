const { Schema, model } = require("mongoose");

const itemSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
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

module.exports = model("Item", itemSchema);
