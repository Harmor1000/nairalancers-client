// Simple WebSocket connection test
import { io } from 'socket.io-client';

export const testWebSocketConnection = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ No token found in localStorage');
    console.error('💡 Please login first, then try again');
    console.error('🔍 Check: localStorage should contain "token"');
    
    // Check what's actually in localStorage
    console.log('📦 Current localStorage contents:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`  ${key}: ${value?.substring(0, 50)}${value?.length > 50 ? '...' : ''}`);
    }
    return;
  }
  
  const WS_URL = (import.meta?.env?.VITE_WS_URL) || (import.meta?.env?.VITE_API_URL) || 'http://localhost:8800';
  console.log('🔗 Testing WebSocket connection...');
  console.log('📝 Token exists:', token ? 'YES' : 'NO');
  console.log('🏠 Connecting to:', WS_URL);
  
  const socket = io(WS_URL, {
    auth: {
      token: token
    },
    timeout: 10000,
    forceNew: true,
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected successfully!');
    console.log('🆔 Socket ID:', socket.id);
    
    // Test joining a conversation
    socket.emit('join-conversation', 'test-conversation');
    console.log('📨 Sent join-conversation event');
    
    // Disconnect after test
    setTimeout(() => {
      socket.disconnect();
      console.log('👋 Test connection closed');
    }, 2000);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 WebSocket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ WebSocket connection error:');
    console.error('Error type:', error.type);
    console.error('Error message:', error.message);
    console.error('Error description:', error.description);
    console.error('Full error:', error);
  });

  socket.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });

  // Timeout test
  setTimeout(() => {
    if (!socket.connected) {
      console.error('⏰ Connection test timed out');
      socket.close();
    }
  }, 15000);
};

// Auto-run test when imported
if (typeof window !== 'undefined') {
  // Add to window for easy testing in browser console
  window.testWebSocket = testWebSocketConnection;
  console.log('🧪 WebSocket test available as window.testWebSocket()');
}
