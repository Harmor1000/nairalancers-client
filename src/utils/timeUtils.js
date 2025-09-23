/**
 * Format a lastSeen timestamp into a human-readable relative time string
 * @param {Date|string} lastSeen - The lastSeen timestamp
 * @returns {string} Formatted relative time (e.g., "2h ago", "3d ago", "Just now")
 */
export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return 'Never';
  
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  
  // Check if the date is valid
  if (isNaN(lastSeenDate.getTime())) {
    return 'Unknown';
  }
  
  const diffMs = now - lastSeenDate;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks}w ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  } else {
    return lastSeenDate.toLocaleDateString();
  }
};

/**
 * Get user online status with lastSeen information
 * @param {Object} user - User object with isOnline and lastSeen properties
 * @returns {Object} Status object with display information
 */
export const getUserOnlineStatus = (user) => {
  if (!user) {
    return {
      status: 'unknown',
      text: 'Unknown',
      color: '#9ca3af',
      isOnline: false
    };
  }

  const { isOnline, status, lastSeen } = user;

  // If explicitly online
  if (isOnline && status === 'online') {
    return {
      status: 'online',
      text: 'Online',
      color: '#10b981',
      isOnline: true
    };
  }

  // If away or busy
  if (isOnline && status === 'away') {
    return {
      status: 'away',
      text: 'Away',
      color: '#f59e0b',
      isOnline: true
    };
  }

  if (isOnline && status === 'busy') {
    return {
      status: 'busy',
      text: 'Busy',
      color: '#ef4444',
      isOnline: true
    };
  }

  // If offline or undefined status
  const lastSeenText = formatLastSeen(lastSeen);
  return {
    status: 'offline',
    text: lastSeenText === 'Never' ? 'Offline' : `Last seen ${lastSeenText}`,
    color: '#9ca3af',
    isOnline: false
  };
};

/**
 * Check if a user was recently active (within specified minutes)
 * @param {Date|string} lastSeen - The lastSeen timestamp  
 * @param {number} minutesThreshold - Minutes threshold (default: 5)
 * @returns {boolean} True if user was recently active
 */
export const isRecentlyActive = (lastSeen, minutesThreshold = 5) => {
  if (!lastSeen) return false;
  
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diffMinutes = Math.floor((now - lastSeenDate) / 60000);
  
  return diffMinutes <= minutesThreshold;
};
