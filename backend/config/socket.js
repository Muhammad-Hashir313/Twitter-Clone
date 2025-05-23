const { Server } = require('socket.io')
const redis = require('./redis')

let io
let connectedUsers = new Map()    // socket.id -> user_id
let userSockets = new Map()       // user_id -> socket.id
let userRooms = new Map()         // socket.id -> Set of room names
let recentMessages = new Set()    // Set of recently processed message IDs to prevent duplicates
let onlineUsers = new Set()       // Set of currently online user IDs

// Keep track of recently sent messages to avoid duplicates (clears after 5 seconds)
const addToRecentMessages = (msgId) => {
    recentMessages.add(msgId);
    setTimeout(() => {
        recentMessages.delete(msgId);
    }, 5000);  // Remove from cache after 5 seconds
};

// Broadcast online status update to all connected clients
const broadcastUserStatus = (userId, isOnline) => {
    io.emit('userStatus', { userId, status: isOnline ? 'online' : 'offline' });
};

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173'],
            methods: ['GET', 'POST'],
        },
        // Add socket.io settings for better performance/reliability
        pingTimeout: 60000,
        pingInterval: 25000,
    })

    console.log('Socket.io server initialized');

    io.on('connection', (socket) => {
        console.log(`New socket connection: ${socket.id}`);

        // Register user on connection
        socket.on('registerUser', async (user_id) => {
            if (!user_id) {
                console.log("No user ID provided for registration");
                return;
            }

            console.log(`User ${user_id} registered with socket ${socket.id}`);

            // Store mappings both ways for easy lookup
            connectedUsers.set(socket.id, user_id);
            userSockets.set(user_id, socket.id);

            // Track user as online
            onlineUsers.add(Number(user_id));

            // Store in Redis
            await redis.set(`user:${user_id}`, socket.id, 'EX', 60 * 60 * 24);

            // Notify client of successful connection
            socket.emit('connectionEstablished', { userId: user_id });

            // Broadcast user's online status to all clients
            broadcastUserStatus(Number(user_id), true);

            // Send the current list of online users to this client
            socket.emit('onlineUsers', Array.from(onlineUsers));
        });

        // Handle client requesting online users
        socket.on('getOnlineUsers', () => {
            socket.emit('onlineUsers', Array.from(onlineUsers));
        });

        // Handle joining a chat room
        socket.on('joinRoom', async ({ userId, receiverId }) => {
            if (!userId || !receiverId) {
                console.log("Invalid room join request - missing IDs");
                return;
            }

            // Create a consistent room name by sorting the user IDs
            const roomId = [userId, receiverId].sort().join('-');

            // Join the room
            socket.join(roomId);
            console.log(`User ${userId} (socket ${socket.id}) joined room: ${roomId}`);

            // Track which rooms this user is in
            if (!userRooms.has(socket.id)) {
                userRooms.set(socket.id, new Set());
            }
            userRooms.get(socket.id).add(roomId);

            // Acknowledge room join to client
            socket.emit('roomJoined', { roomId, userId, receiverId });
        });

        // Handle leaving a chat room
        socket.on('leaveRoom', ({ userId, receiverId }) => {
            if (!userId || !receiverId) {
                return;
            }

            const roomId = [userId, receiverId].sort().join('-');
            socket.leave(roomId);
            console.log(`User ${userId} left room: ${roomId}`);

            // Remove room from tracking
            if (userRooms.has(socket.id)) {
                userRooms.get(socket.id).delete(roomId);
            }
        });

        // Handle sending a message
        socket.on('sendMessage', async (data) => {
            try {
                const { id, senderId, receiverId, message, createdAt } = data;

                if (!senderId || !receiverId || !message) {
                    console.log("Invalid message data", data);
                    return;
                }

                // Check for duplicate messages using the provided ID or a generated one
                const messageId = id || `msg-${senderId}-${Date.now()}`;

                // Skip if we've seen this message already in the last 5 seconds
                if (recentMessages.has(messageId)) {
                    console.log(`Duplicate message detected, ignoring: ${messageId}`);
                    return;
                }

                // Add to recent messages set to prevent duplicates
                addToRecentMessages(messageId);

                console.log(`Message from ${senderId} to ${receiverId}: ${message.substring(0, 20)}${message.length > 20 ? '...' : ''}`);

                // Create a room ID for this conversation
                const roomId = [senderId, receiverId].sort().join('-');

                const messageData = {
                    id: messageId,
                    senderId,
                    receiverId,
                    message,
                    createdAt: createdAt || new Date().toISOString()
                };

                // Broadcast the message to everyone in the room
                console.log(`Broadcasting message to room ${roomId}`);
                io.to(roomId).emit('receiveMessage', messageData);

                // Also send directly to both users in case room joining failed
                const senderSocketId = userSockets.get(senderId);
                const receiverSocketId = userSockets.get(receiverId);

                if (senderSocketId) {
                    console.log(`Direct sending to sender socket ${senderSocketId}`);
                    io.to(senderSocketId).emit('receiveMessage', messageData);
                }

                if (receiverSocketId) {
                    console.log(`Direct sending to receiver socket ${receiverSocketId}`);
                    io.to(receiverSocketId).emit('receiveMessage', messageData);
                }

                // Notify all clients of new chat (for chat list updates)
                io.emit('newChat', { users: [senderId, receiverId] });

            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // Handle user disconnection
        socket.on('disconnect', async () => {
            const user_id = connectedUsers.get(socket.id);

            if (user_id) {
                console.log(`User ${user_id} disconnected from socket ${socket.id}`);

                // Clean up Redis
                await redis.del(`user:${user_id}`);

                // Clean up our maps
                userSockets.delete(user_id);
                connectedUsers.delete(socket.id);

                // Remove from online users
                onlineUsers.delete(Number(user_id));

                // Broadcast user's offline status
                broadcastUserStatus(Number(user_id), false);

                // Leave all rooms this user was in
                if (userRooms.has(socket.id)) {
                    // No need to explicitly leave rooms as socket.io handles this on disconnect
                    userRooms.delete(socket.id);
                }
            } else {
                console.log(`Unregistered socket disconnected: ${socket.id}`);
            }
        });

        // Ping/pong to check connection
        socket.on('ping', (callback) => {
            if (typeof callback === 'function') {
                callback({ status: 'pong', timestamp: new Date().toISOString() });
            } else {
                socket.emit('pong', { timestamp: new Date().toISOString() });
            }
        });
    });
}

const getIO = () => io

const getConnectedUsers = async () => {
    const keys = await redis.keys('user:*');
    const users = {};

    for (const key of keys) {
        const user_id = key.split(':')[1];
        const socket_id = await redis.get(key);
        users[user_id] = socket_id;
    }

    return users;
}

// Get online status for a specific user
const isUserOnline = (userId) => {
    return onlineUsers.has(Number(userId));
}

// Get list of all online users
const getOnlineUsers = () => {
    return Array.from(onlineUsers);
}

// Helper function to emit to a specific user if they're connected
const emitToUser = (userId, event, data) => {
    const socketId = userSockets.get(userId);
    if (socketId) {
        io.to(socketId).emit(event, data);
        return true;
    }
    return false;
}

module.exports = {
    initializeSocket,
    getIO,
    getConnectedUsers,
    emitToUser,
    isUserOnline,
    getOnlineUsers
}
