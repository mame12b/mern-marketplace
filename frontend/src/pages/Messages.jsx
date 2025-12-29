import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import messageService from '../services/messageService';
import Loading from '../components/common/Loading';
import { io } from 'socket.io-client';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchConversations();
        initializeSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation._id);
            markAsRead(selectedConversation._id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initializeSocket = () => {
        const token = localStorage.getItem('token');
        socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            auth: { token }
        });

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join', currentUser.id);
        });

        socketRef.current.on('newMessage', ({ conversationId, message }) => {
            if (selectedConversation?._id === conversationId) {
                setMessages(prev => [...prev, message]);
                markAsRead(conversationId);
            }
            fetchConversations(); // Update conversation list
        });
    };

    const fetchConversations = async () => {
        try {
            const response = await messageService.getConversations();
            setConversations(response.data);
        } catch {
            toast.error('Failed to fetch conversations');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await messageService.getMessages(conversationId);
            setMessages(response.data);
        } catch {
            toast.error('Failed to fetch messages');
        }
    };

    const markAsRead = async (conversationId) => {
        try {
            await messageService.markAsRead(conversationId);
        } catch {
            console.error('Failed to mark as read');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);
        try {
            const response = await messageService.sendMessage(
                selectedConversation._id,
                newMessage.trim()
            );
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getOtherParticipant = (conversation) => {
        return conversation.participants.find(p => p._id !== currentUser.id);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
                <div className="flex h-full">
                    {/* Conversations List */}
                    <div className={`w-full md:w-1/3 border-r border-gray-200 ${selectedConversation ? 'hidden md:block' : ''}`}>
                        <div className="h-full overflow-y-auto">
                            {conversations.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <p>No conversations yet</p>
                                </div>
                            ) : (
                                conversations.map((conversation) => {
                                    const otherUser = getOtherParticipant(conversation);
                                    return (
                                        <div
                                            key={conversation._id}
                                            onClick={() => setSelectedConversation(conversation)}
                                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                                                selectedConversation?._id === conversation._id ? 'bg-indigo-50' : ''
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                    {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {otherUser?.shopName || `${otherUser?.firstName} ${otherUser?.lastName}`}
                                                        </h3>
                                                        {conversation.myUnreadCount > 0 && (
                                                            <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                                                                {conversation.myUnreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {conversation.product && (
                                                        <p className="text-xs text-gray-500 truncate">
                                                            Re: {conversation.product.title}
                                                        </p>
                                                    )}
                                                    {conversation.lastMessage && (
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {conversation.lastMessage.content}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : ''}`}>
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedConversation(null)}
                                        className="md:hidden text-gray-600 hover:text-gray-900"
                                    >
                                        <FaArrowLeft />
                                    </button>
                                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {getOtherParticipant(selectedConversation)?.firstName?.[0]}
                                        {getOtherParticipant(selectedConversation)?.lastName?.[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {getOtherParticipant(selectedConversation)?.shopName ||
                                                `${getOtherParticipant(selectedConversation)?.firstName} ${getOtherParticipant(selectedConversation)?.lastName}`}
                                        </h3>
                                        {selectedConversation.product && (
                                            <p className="text-sm text-gray-500">
                                                {selectedConversation.product.title}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((message) => {
                                        const isMine = message.sender._id === currentUser.id;
                                        return (
                                            <div
                                                key={message._id}
                                                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                        isMine
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-gray-200 text-gray-900'
                                                    }`}
                                                >
                                                    <p className="text-sm">{message.content}</p>
                                                    <p className={`text-xs mt-1 ${isMine ? 'text-indigo-200' : 'text-gray-500'}`}>
                                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || !newMessage.trim()}
                                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <FaPaperPlane />
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                <p>Select a conversation to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
