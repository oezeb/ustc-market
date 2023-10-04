const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    price: { type: Number },
    description: { type: String },
    images: { type: Array },
    tags: { type: Array },    
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;