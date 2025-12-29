import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    unreadCount: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        count: {
            type: Number,
            default: 0,
        }
    }],
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'Message content is required'],
        trim: true,
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'product'],
        default: 'text',
    },
    attachments: [{
        url: String,
        type: String,
        name: String,
    }],
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        readAt: {
            type: Date,
            default: Date.now,
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Indexes for better performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });
messageSchema.index({ conversation: 1, createdAt: -1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);
export const Message = mongoose.model('Message', messageSchema);
