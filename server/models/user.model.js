const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: { type: String },
    name: { type: String, default: 'anonymous' },
    role: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;