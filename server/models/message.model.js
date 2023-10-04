const mongoose = require('mongoose')
const User = require('./user.model');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    content: { type: String },
    blocked: { type: Boolean, default: false }
}, { timestamps: true });

messageSchema.pre('save', async function(next) {
    const receiver = await User.findById(this.receiver);
    
    if (!receiver) throw new Error('Receiver not found');
    if (receiver.blockedUsers.includes(this.sender)) {
        this.blocked = true;
    }

    next();
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;