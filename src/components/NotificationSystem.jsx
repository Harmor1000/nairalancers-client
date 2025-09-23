import React, { useState, useEffect } from 'react';
import socketService from '../services/socketService';
import './NotificationSystem.scss';

const NotificationSystem = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('default'); // 'default' | 'granted' | 'denied' | 'unsupported'
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    // Initialize permission and banner dismissal state
    try {
      const storedDismiss = typeof window !== 'undefined' ? localStorage.getItem('nl_notify_dismissed') : null;
      if (storedDismiss === '1') setBannerDismissed(true);
    } catch (_) {}

    // Check notification permission
    if ('Notification' in window) {
      const status = Notification.permission;
      setPermissionStatus(status);
      setPermissionGranted(status === 'granted');
    } else {
      setPermissionStatus('unsupported');
    }

    // Subscribe to notifications from socket
    const unsubscribe = socketService.onMessage((eventType, data) => {
      if (eventType === 'notification') {
        handleNewNotification(data);
      }
    });

    return unsubscribe;
  }, []);

  const handleNewNotification = (notification) => {
    const stripHtml = (html) => {
      if (!html) return '';
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    };
    // Add to in-app notifications
    const newNotification = {
      ...notification,
      id: Date.now() + Math.random(),
      read: false,
      createdAt: new Date(),
      // Normalize possible HTML content
      body: stripHtml(notification.body || notification.message)
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep last 10

    // Show browser notification if permission granted
    if (permissionGranted && document.hidden) {
      showBrowserNotification(notification);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const showBrowserNotification = (notification) => {
    try {
      const browserNotification = new Notification(notification.title || 'New Notification', {
        body: notification.body || '',
        icon: notification.icon || '/favicon.ico',
        badge: notification.badge || '/favicon.ico',
        tag: notification.type || 'general',
        silent: notification.silent || false
      });

      browserNotification.onclick = () => {
        window.focus();
        handleNotificationClick(notification);
        browserNotification.close();
      };

      // Auto-close after 4 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 4000);
    } catch (error) {
      console.error('Failed to show browser notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.data && notification.data.action === 'open_conversation') {
      // Navigate to conversation
      window.location.href = `/message/${notification.data.conversationId}`;
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const requestNotificationPermission = async () => {
    try {
      if (typeof window === 'undefined') return;

      // Notifications require HTTPS on most browsers
      if (window.location.protocol !== 'https:') {
        // Guide user and allow dismiss so the banner doesn't stick
        alert('Browser notifications require HTTPS. Please use https://nairalancers.com');
        setBannerDismissed(true);
        try { localStorage.setItem('nl_notify_dismissed', '1'); } catch (_) {}
        return;
      }

      if (!('Notification' in window)) {
        // Not supported
        setPermissionStatus('unsupported');
        setBannerDismissed(true);
        try { localStorage.setItem('nl_notify_dismissed', '1'); } catch (_) {}
        return;
      }

      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      const granted = permission === 'granted';
      setPermissionGranted(granted);
      if (!granted) {
        // Keep banner visible so the user can try again or dismiss
      }
    } catch (e) {
      // On any error, let user dismiss
      setBannerDismissed(true);
      try { localStorage.setItem('nl_notify_dismissed', '1'); } catch (_) {}
    }
  };

  return (
    <div className="notification-system">
      {/* Notification Permission Banner */}
      {!permissionGranted && !bannerDismissed && (
        <div className="notification-permission-banner">
          <p>Enable notifications to stay updated with new messages</p>
          <button onClick={requestNotificationPermission}>Enable Notifications</button>
          <button
            className="dismiss-btn"
            onClick={() => {
              setBannerDismissed(true);
              try { localStorage.setItem('nl_notify_dismissed', '1'); } catch (_) {}
            }}
          >
            Not now
          </button>
          {permissionStatus === 'denied' && (
            <p className="note">Notifications are blocked in your browser. You can enable them from site settings.</p>
          )}
        </div>
      )}

      {/* In-app Notifications */}
      <div className="notification-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
            onClick={() => {
              markAsRead(notification.id);
              handleNotificationClick(notification);
            }}
          >
            <div className="notification-header">
              <span className="notification-title">{notification.title}</span>
              <button
                className="close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
              >
                ×
              </button>
            </div>
            {notification.body && (
              <div className="notification-body">{notification.body}</div>
            )}
            <div className="notification-time">
              {new Date(notification.createdAt).toLocaleTimeString()}
            </div>
            {!notification.read && <div className="unread-indicator"></div>}
          </div>
        ))}
      </div>

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <div className="notification-actions">
          <button onClick={clearAllNotifications} className="clear-all-btn">
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
