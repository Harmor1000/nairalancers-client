import newRequest from '../utils/newRequest';
import getCurrentUser from '../utils/getCurrentUser';

class ActivityTracker {
  constructor() {
    this.heartbeatInterval = null;
    this.isActive = true;
    this.lastActivity = Date.now();
    this.heartbeatFrequency = 60000; // 1 minute
    this.inactivityThreshold = 5 * 60000; // 5 minutes
  }

  // Initialize activity tracking
  init() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    this.startHeartbeat();
    this.attachActivityListeners();
    
    console.log('Activity tracker initialized for user:', currentUser.username);
  }

  // Start periodic heartbeat to update lastSeen
  startHeartbeat() {
    if (this.heartbeatInterval) return; // Already running
    
    this.heartbeatInterval = setInterval(async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        this.stop();
        return;
      }

      // Only send heartbeat if user has been active recently
      const timeSinceLastActivity = Date.now() - this.lastActivity;
      if (timeSinceLastActivity > this.inactivityThreshold) {
        return; // User is inactive, skip heartbeat
      }

      try {
        await newRequest.post('/user-status/heartbeat');
        console.log('Heartbeat sent successfully');
      } catch (error) {
        console.warn('Failed to send heartbeat:', error.response?.data?.message || error.message);
        // Don't stop the tracker for temporary network issues
      }
    }, this.heartbeatFrequency);
  }

  // Stop activity tracking
  stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.removeActivityListeners();
    console.log('Activity tracker stopped');
  }

  // Attach event listeners to track user activity
  attachActivityListeners() {
    // Track various user interactions
    const activityEvents = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    this.activityHandler = this.throttle(() => {
      this.lastActivity = Date.now();
      this.isActive = true;
    }, 1000); // Throttle to once per second

    activityEvents.forEach(event => {
      document.addEventListener(event, this.activityHandler, { passive: true });
    });

    // Track page visibility changes
    this.visibilityHandler = () => {
      if (document.hidden) {
        this.isActive = false;
      } else {
        this.lastActivity = Date.now();
        this.isActive = true;
      }
    };

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  // Remove event listeners
  removeActivityListeners() {
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress', 
      'scroll',
      'touchstart',
      'click'
    ];

    if (this.activityHandler) {
      activityEvents.forEach(event => {
        document.removeEventListener(event, this.activityHandler);
      });
    }

    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  // Throttle utility to limit function calls
  throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  // Force update lastSeen (useful for important actions)
  async forceUpdate() {
    try {
      await newRequest.post('/user-status/heartbeat');
      this.lastActivity = Date.now();
      console.log('Forced lastSeen update successful');
    } catch (error) {
      console.warn('Failed to force update lastSeen:', error.response?.data?.message || error.message);
    }
  }

  // Get current activity status
  getActivityStatus() {
    const timeSinceLastActivity = Date.now() - this.lastActivity;
    return {
      isActive: this.isActive,
      timeSinceLastActivity,
      isRecentlyActive: timeSinceLastActivity <= this.inactivityThreshold
    };
  }
}

// Create singleton instance
const activityTracker = new ActivityTracker();

export default activityTracker;
