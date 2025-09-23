import React, { useState, useEffect } from 'react';
import socketService from '../services/socketService';
// Import the test function - it auto-attaches to window
import '../utils/testWebSocket.js';

const WebSocketDebugger = ({ currentUser }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    // Check connection status periodically
    const checkConnection = () => {
      setIsConnected(socketService.getConnectionStatus());
    };

    const interval = setInterval(checkConnection, 1000);
    checkConnection(); // Initial check

    return () => clearInterval(interval);
  }, []);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), { message, type, timestamp }]);
  };

  const connectWebSocket = () => {
    if (currentUser) {
      addLog('Attempting to connect WebSocket...', 'info');
      try {
        socketService.connect(currentUser);
        setTimeout(() => {
          if (socketService.getConnectionStatus()) {
            addLog('✅ WebSocket connected successfully!', 'success');
          } else {
            addLog('❌ WebSocket connection failed', 'error');
            addLog('💡 Check console for detailed error info', 'info');
          }
        }, 2000);
      } catch (error) {
        addLog(`❌ Connection error: ${error.message}`, 'error');
      }
    } else {
      addLog('❌ No user logged in', 'error');
      addLog('💡 Please login first at /login', 'info');
      addLog('🔍 After login, refresh and try again', 'info');
    }
  };

  const runConnectionTest = () => {
    addLog('🧪 Running connection test...', 'info');
    if (window.testWebSocket) {
      window.testWebSocket();
      addLog('Check browser console for detailed test results', 'info');
    } else {
      addLog('❌ Test function not available', 'error');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  if (!showDebugger) {
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 9999 
      }}>
        <button
          onClick={() => setShowDebugger(true)}
          style={{
            background: isConnected ? '#22c55e' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
          title={`WebSocket: ${isConnected ? 'Connected' : 'Disconnected'}`}
        >
          🔗
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '350px',
      maxHeight: '400px',
      background: '#1e293b',
      color: '#f8fafc',
      borderRadius: '12px',
      padding: '16px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      border: `2px solid ${isConnected ? '#22c55e' : '#ef4444'}`
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: '14px' }}>
          WebSocket Debugger {isConnected ? '🟢' : '🔴'}
        </h3>
        <button
          onClick={() => setShowDebugger(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '4px'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div>Status: <strong>{isConnected ? 'Connected ✅' : 'Disconnected ❌'}</strong></div>
        <div>User: <strong>{currentUser?.username || 'Not logged in'}</strong></div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        {currentUser ? (
          <>
            <button
              onClick={connectWebSocket}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                marginRight: '8px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Connect
            </button>
            <button
              onClick={runConnectionTest}
              style={{
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                marginRight: '8px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Test
            </button>
          </>
        ) : (
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              marginRight: '8px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        )}
        <button
          onClick={clearLogs}
          style={{
            background: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>

      <div style={{
        background: '#0f172a',
        borderRadius: '6px',
        padding: '8px',
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid #374151'
      }}>
        {logs.length === 0 ? (
          <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
            No logs yet. Click "Connect" or "Test" to start debugging.
          </div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '4px',
                color: log.type === 'error' ? '#f87171' : 
                      log.type === 'success' ? '#34d399' : '#d1d5db'
              }}
            >
              <span style={{ color: '#9ca3af' }}>[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>

      <div style={{ 
        marginTop: '8px', 
        fontSize: '10px', 
        color: '#6b7280',
        fontStyle: 'italic'
      }}>
        💡 Open browser console for detailed logs
      </div>
    </div>
  );
};

export default WebSocketDebugger;
