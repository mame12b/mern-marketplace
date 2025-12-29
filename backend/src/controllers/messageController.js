import { Conversation, Message } from '../models/Message.js';
import { ErrorResponse } from '../middleware/error.middleware.js';

// @desc    Get or create conversation
// @route   POST /api/messages/conversations
// @access  Private
export const getOrCreateConversation = async (req, res, next) => {
    try {
        const { participantId, productId } = req.body;

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, participantId] },
            ...(productId && { product: productId })
        }).populate('participants', 'firstName lastName avatar shopName')
          .populate('product', 'title images price')
          .populate('lastMessage');

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user.id, participantId],
                ...(productId && { product: productId }),
                unreadCount: [
                    { user: req.user.id, count: 0 },
                    { user: participantId, count: 0 }
                ]
            });

            await conversation.populate('participants', 'firstName lastName avatar shopName');
            if (productId) {
                await conversation.populate('product', 'title images price');
            }
        }

        res.status(200).json({
            success: true,
            data: conversation,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.id,
        })
        .populate('participants', 'firstName lastName avatar shopName')
        .populate('product', 'title images price')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });

        // Get unread count for current user
        const conversationsWithUnread = conversations.map(conv => {
            const unread = conv.unreadCount.find(u => u.user.toString() === req.user.id);
            return {
                ...conv.toObject(),
                myUnreadCount: unread ? unread.count : 0,
            };
        });

        res.status(200).json({
            success: true,
            count: conversations.length,
            data: conversationsWithUnread,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send message
// @route   POST /api/messages/:conversationId
// @access  Private
export const sendMessage = async (req, res, next) => {
    try {
        const { content, messageType = 'text', attachments } = req.body;
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return next(new ErrorResponse('Conversation not found', 404));
        }

        // Check if user is part of conversation
        if (!conversation.participants.includes(req.user.id)) {
            return next(new ErrorResponse('Not authorized to send messages in this conversation', 403));
        }

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user.id,
            content,
            messageType,
            attachments,
            readBy: [{ user: req.user.id }],
        });

        // Update conversation
        conversation.lastMessage = message._id;
        
        // Increment unread count for other participants
        conversation.participants.forEach(participantId => {
            if (participantId.toString() !== req.user.id) {
                const unread = conversation.unreadCount.find(u => u.user.toString() === participantId.toString());
                if (unread) {
                    unread.count += 1;
                }
            }
        });

        await conversation.save();

        await message.populate('sender', 'firstName lastName avatar');

        // Emit socket event (will be handled by socket.io)
        if (req.io) {
            conversation.participants.forEach(participantId => {
                if (participantId.toString() !== req.user.id) {
                    req.io.to(participantId.toString()).emit('newMessage', {
                        conversationId,
                        message,
                    });
                }
            });
        }

        res.status(201).json({
            success: true,
            data: message,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
export const getMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return next(new ErrorResponse('Conversation not found', 404));
        }

        // Check if user is part of conversation
        if (!conversation.participants.includes(req.user.id)) {
            return next(new ErrorResponse('Not authorized to view this conversation', 403));
        }

        const messages = await Message.find({
            conversation: conversationId,
            isDeleted: false,
        })
        .populate('sender', 'firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Message.countDocuments({
            conversation: conversationId,
            isDeleted: false,
        });

        res.status(200).json({
            success: true,
            count: messages.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: messages.reverse(), // Reverse to show oldest first
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/:conversationId/read
// @access  Private
export const markAsRead = async (req, res, next) => {
    try {
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return next(new ErrorResponse('Conversation not found', 404));
        }

        // Check if user is part of conversation
        if (!conversation.participants.includes(req.user.id)) {
            return next(new ErrorResponse('Not authorized', 403));
        }

        // Update messages
        await Message.updateMany(
            {
                conversation: conversationId,
                'readBy.user': { $ne: req.user.id },
            },
            {
                $push: {
                    readBy: {
                        user: req.user.id,
                        readAt: new Date(),
                    },
                },
            }
        );

        // Reset unread count for user
        const unread = conversation.unreadCount.find(u => u.user.toString() === req.user.id);
        if (unread) {
            unread.count = 0;
        }
        await conversation.save();

        res.status(200).json({
            success: true,
            message: 'Messages marked as read',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete message
// @route   DELETE /api/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            return next(new ErrorResponse('Message not found', 404));
        }

        if (message.sender.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to delete this message', 403));
        }

        message.isDeleted = true;
        message.content = 'This message was deleted';
        await message.save();

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
