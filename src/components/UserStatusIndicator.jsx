import React, { useState, useEffect } from 'react';
import socketService from '../services/socketService';
import newRequest from '../utils/newRequest';
import { formatLastSeen } from '../utils/timeUtils';
import './UserStatusIndicator.scss';

const UserStatusIndicator = ({ userId, username, showText = false, size = 'small' }) => {
  const [userStatus, setUserStatus] = useState({
    isOnline: false,
    status: 'offline',
    lastSeen: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial status
    fetchUserStatus();

    // Subscribe to real-time status updates
    const unsubscribe = socketService.onUserStatus((statusUpdate) => {
      if (statusUpdate.userId === userId) {
        setUserStatus({
          isOnline: statusUpdate.isOnline,
          status: statusUpdate.isOnline ? 'online' : 'offline',
          lastSeen: statusUpdate.lastSeen
        });
      }
    });

    return unsubscribe;
  }, [userId]);

  const fetchUserStatus = async () => {
    try {
      setLoading(true);
      const response = await newRequest.get(`/user-status/status/${userId}`);
      setUserStatus({
        isOnline: response.data.isOnline,
        status: response.data.status,
        lastSeen: response.data.lastSeen
      });
    } catch (error) {
      console.error('Failed to fetch user status:', error);
      // Default to offline if fetch fails
      setUserStatus({
        isOnline: false,
        status: 'offline',
        lastSeen: null
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (loading) return '#cbd5e1';
    
    switch (userStatus.status) {
      case 'online':
        return '#22c55e';
      case 'away':
        return '#f59e0b';
      case 'busy':
        return '#ef4444';
      case 'offline':
      default:
        return '#94a3b8';
    }
  };

  const getStatusText = () => {
    if (loading) return 'Loading...';
    
    switch (userStatus.status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      case 'offline':
      default:
        return userStatus.lastSeen ? formatLastSeen(userStatus.lastSeen) : 'Offline';
    }
  };

  const sizeClasses = {
    small: 'status-small',
    medium: 'status-medium',
    large: 'status-large'
  };

  if (loading) {
    return (
      <div className={`user-status-indicator ${sizeClasses[size]} loading`}>
        <div className="status-dot" style={{ backgroundColor: getStatusColor() }}></div>
        {showText && <span className="status-text">Loading...</span>}
      </div>
    );
  }

  return (
    <div className={`user-status-indicator ${sizeClasses[size]} ${userStatus.status}`}>
      <div 
        className={`status-dot ${userStatus.isOnline ? 'online' : 'offline'}`}
        style={{ backgroundColor: getStatusColor() }}
        title={`${username || 'User'} is ${getStatusText().toLowerCase()}`}
      >
        {userStatus.isOnline && (
          <div className="pulse-ring" style={{ borderColor: getStatusColor() }}></div>
        )}
      </div>
      {showText && (
        <span className="status-text" title={getStatusText()}>
          {getStatusText()}
        </span>
      )}
    </div>
  );
};

export default UserStatusIndicator;
