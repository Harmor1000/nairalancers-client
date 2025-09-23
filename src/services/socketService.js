import { io } from 'socket.io-client'; // Uncomment when socket.io-client is installed

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentUser = null;
    this.currentConversationId = null;
    this.messageCallbacks = new Map();
    this.statusCallbacks = new Set();
    this.typingCallbacks = new Set();
  }

  // Initialize connection
  connect(user) {
    // Temporarily commented out until socket.io-client is installed
    
    if (this.socket && this.isConnected) {
      return;
    }

    this.currentUser = user;
    
    try {
      // Prefer explicit WebSocket URL, then fall back to API URL
      const host = typeof window !== 'undefined' ? window.location.hostname : '';
      const isProdHost = /(?:^|\.)nairalancers\.com$/.test(host);
      const envWs = import.meta?.env?.VITE_WS_URL;
      const envApi = import.meta?.env?.VITE_API_URL;
      const pickNonLocal = (u) => (u && !/^https?:\/\/localhost(?::\d+)?/i.test(u)) ? u : null;
      const RESOLVED_WS = (() => {
        if (isProdHost) {
          return pickNonLocal(envWs) || pickNonLocal(envApi) || 'https://api.nairalancers.com';
        }
        return envWs || envApi || 'http://localhost:8800';
      })();
      this.socket = io(RESOLVED_WS, {
        auth: {
          token: localStorage.getItem('token')
        },
        transports: ['websocket']
      });

      this.socket.on('connect', () => {
        // console.log('Connected to WebSocket server');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        // console.log('Disconnected from WebSocket server');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        // console.error('WebSocket connection error:', error);
        this.isConnected = false;
      });

      // Listen for new messages from other person in client-seller chat
      this.socket.on('new-message', (message) => {
        // console.log('New message received from', message.senderRole + ':', message);
        this.messageCallbacks.forEach(callback => {
          try {
            callback('new-message', message);
          } catch (error) {
            // console.error('Error in message callback:', error);
          }
        });
      });

      // Listen for reaction updates in client-seller chat
      this.socket.on('reaction-update', (data) => {
        // console.log('Reaction update received from', data.reactorRole + ':', data);
        this.messageCallbacks.forEach(callback => {
          try {
            callback('reaction-update', data);
          } catch (error) {
            // console.error('Error in reaction callback:', error);
          }
        });
      });

      // Listen for message updates (edit/delete) in client-seller chat
      this.socket.on('message-update', (data) => {
        // console.log('Message update received from', data.updaterRole + ':', data);
        this.messageCallbacks.forEach(callback => {
          try {
            callback('message-update', data);
          } catch (error) {
            // console.error('Error in message update callback:', error);
          }
        });
      });

      // Listen for user status updates
      this.socket.on('user-status-update', (data) => {
        // console.log('User status update:', data);
        this.statusCallbacks.forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            // console.error('Error in status callback:', error);
          }
        });
      });

      // Listen for typing indicators from other person in client-seller chat
      this.socket.on('user-typing', (data) => {
        // console.log(`${data.role} is ${data.isTyping ? 'typing' : 'stopped typing'}...`);
        this.typingCallbacks.forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            // console.error('Error in typing callback:', error);
          }
        });
      });

      // Listen for message read updates in client-seller chat
      this.socket.on('message-read-update', (data) => {
        // console.log(`Message read by ${data.readByRole}:`, data);
        this.messageCallbacks.forEach(callback => {
          try {
            callback('message-read', data);
          } catch (error) {
            // console.error('Error in read status callback:', error);
          }
        });
      });

      // Listen for other person joining conversation
      this.socket.on('user-joined-conversation', (data) => {
        // console.log(`${data.role} joined the conversation:`, data);
        this.statusCallbacks.forEach(callback => {
          try {
            callback({...data, event: 'user-joined'});
          } catch (error) {
            // console.error('Error in user joined callback:', error);
          }
        });
      });

      // Listen for other person leaving conversation
      this.socket.on('user-left-conversation', (data) => {
        // console.log(`${data.role} left the conversation:`, data);
        this.statusCallbacks.forEach(callback => {
          try {
            callback({...data, event: 'user-left'});
          } catch (error) {
            // console.error('Error in user left callback:', error);
          }
        });
      });

      // Listen for notifications
      this.socket.on('notification', (notification) => {
        // console.log('Notification received:', notification);
        this.messageCallbacks.forEach(callback => {
          try {
            callback('notification', notification);
          } catch (error) {
            // console.error('Error in notification callback:', error);
          }
        });
      });

      // Listen for queued notifications
      this.socket.on('queued-notifications', (notifications) => {
        // console.log('Queued notifications received:', notifications);
        notifications.forEach(notification => {
          this.messageCallbacks.forEach(callback => {
            try {
              callback('notification', notification);
            } catch (error) {
              // console.error('Error in queued notification callback:', error);
            }
          });
        });
      });

    } catch (error) {
      // console.error('Failed to initialize WebSocket:', error);
    }
  }

  // Join a conversation room
  joinConversation(conversationId) {
    this.currentConversationId = conversationId;
    
    
    if (this.socket && this.isConnected) {
      this.socket.emit('join-conversation', conversationId);
      // console.log(`Joined conversation: ${conversationId}`);
    } else {
      // console.log(`WebSocket not connected - cannot join conversation: ${conversationId}`);
    }
  }

  // Leave current conversation
  leaveConversation() {
    if (this.socket && this.isConnected && this.currentConversationId) {
      this.socket.emit('leave-conversation', this.currentConversationId);
      // console.log(`Left conversation: ${this.currentConversationId}`);
    } else if (this.currentConversationId) {
      // console.log(`WebSocket not connected - cannot leave conversation: ${this.currentConversationId}`);
    }
    this.currentConversationId = null;
  }

  // Start typing indicator
  startTyping() {
    
    if (this.socket && this.isConnected && this.currentConversationId) {
      this.socket.emit('typing-start', this.currentConversationId);
    }
    
  }

  // Stop typing indicator
  stopTyping() {

    if (this.socket && this.isConnected && this.currentConversationId) {
      this.socket.emit('typing-stop', this.currentConversationId);
    }
    
  }

  // Mark message as read
  markMessageAsRead(messageId) {
    
    if (this.socket && this.isConnected && this.currentConversationId) {
      this.socket.emit('message-read', {
        conversationId: this.currentConversationId,
        messageId: messageId
      });
    }
    
  }

  // Subscribe to message events
  onMessage(callback) {
    const callbackId = Date.now() + Math.random();
    this.messageCallbacks.set(callbackId, callback);
    
    // Return unsubscribe function
    return () => {
      this.messageCallbacks.delete(callbackId);
    };
  }

  // Subscribe to user status events
  onUserStatus(callback) {
    this.statusCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  // Subscribe to typing events
  onTyping(callback) {
    this.typingCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.typingCallbacks.delete(callback);
    };
  }

  // Request notification permission
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        // console.log('Notification permission:', permission);
      });
    }
  }

  // Disconnect from socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.isConnected = false;
    this.currentConversationId = null;
    this.messageCallbacks.clear();
    this.statusCallbacks.clear();
    this.typingCallbacks.clear();
    
    // console.log('WebSocket disconnected');
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }

  // Check if other person is online in current conversation
  isOtherPersonOnline() {
    // This would be updated by user-joined/user-left events
    return this.otherPersonOnline || false;
  }

  // Set other person online status (used by event handlers)
  setOtherPersonOnline(isOnline) {
    this.otherPersonOnline = isOnline;
  }

  // Get current conversation role (client or seller)
  getCurrentRole() {
    return this.currentUser?.isSeller ? 'seller' : 'client';
  }

  // Send direct message to other person in conversation
  sendDirectMessage(conversationId, messageData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-direct-message', {
        conversationId,
        ...messageData
      });
    }
  }

  // Request conversation status
  requestConversationStatus(conversationId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('get-conversation-status', conversationId);
    }
  }
}

export default new SocketService();
