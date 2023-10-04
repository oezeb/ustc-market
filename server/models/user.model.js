const mongoose = require('mongoose')

// User schema includes username, password, name, email, role, timestamps, and image illustration
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
    avatar: { type: String },
    role: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;