import express from 'express';
import {
    getOrCreateConversation,
    getConversations,
    sendMessage,
    getMessages,
    markAsRead,
    deleteMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/conversations', getOrCreateConversation);
router.get('/conversations', getConversations);
router.post('/:conversationId', sendMessage);
router.get('/:conversationId', getMessages);
router.put('/:conversationId/read', markAsRead);
router.delete('/:messageId', deleteMessage);

export default router;
