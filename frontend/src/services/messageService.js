import axios from '../utils/axios';

export const messageService = {
    // Get or create conversation
    getOrCreateConversation: async (participantId, productId = null) => {
        const response = await axios.post('/messages/conversations', {
            participantId,
            productId,
        });
        return response.data;
    },

    // Get all conversations
    getConversations: async () => {
        const response = await axios.get('/messages/conversations');
        return response.data;
    },

    // Send message
    sendMessage: async (conversationId, content, messageType = 'text', attachments = []) => {
        const response = await axios.post(`/messages/${conversationId}`, {
            content,
            messageType,
            attachments,
        });
        return response.data;
    },

    // Get messages in conversation
    getMessages: async (conversationId, page = 1, limit = 50) => {
        const response = await axios.get(`/messages/${conversationId}`, {
            params: { page, limit },
        });
        return response.data;
    },

    // Mark messages as read
    markAsRead: async (conversationId) => {
        const response = await axios.put(`/messages/${conversationId}/read`);
        return response.data;
    },

    // Delete message
    deleteMessage: async (messageId) => {
        const response = await axios.delete(`/messages/${messageId}`);
        return response.data;
    },
};

export default messageService;
