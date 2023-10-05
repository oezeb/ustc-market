const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User' 
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    price: { type: Number },
    images: { type: Array },
    tags: { type: Array },    
}, { timestamps: true });

itemSchema.index({ description: 'text', tags: 'text' });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;