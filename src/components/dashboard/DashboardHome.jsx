import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DashboardHome.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import newRequest from "../../utils/newRequest";
import Slide from "../Slide/Slide";
import GigCard from "../gigCard/GigCard";
import Skeleton from "../skeleton/Skeleton";

const DashboardHome = () => {
  const currentUser = getCurrentUser();
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [trendingGigs, setTrendingGigs] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    activities: true,
    messages: true,
    notifications: true,
    gigs: true
  });
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [statsRes, activitiesRes, messagesRes, notificationsRes, gigsRes] = await Promise.all([
        newRequest.get("/dashboard/stats"),
        newRequest.get("/dashboard/activities?limit=4"),
        newRequest.get("/dashboard/messages?limit=3"),
        newRequest.get("/dashboard/notifications?limit=3"),
        newRequest.get("/dashboard/trending-gigs?limit=8")
      ]);

      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data);
      setRecentMessages(messagesRes.data);
      setNotifications(notificationsRes.data);
      setTrendingGigs(gigsRes.data);
      
      setLoading({
        stats: false,
        activities: false,
        messages: false,
        notifications: false,
        gigs: false
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please refresh the page.");
      setLoading({
        stats: false,
        activities: false,
        messages: false,
        notifications: false,
        gigs: false
      });
    }
  };

  const quickActions = currentUser?.isSeller ? [
    { title: "Create New Gig", icon: "📝", link: "/add", color: "#1dbf73" },
    { title: "View My Gigs", icon: "📋", link: "/mygigs", color: "#ff7f57" },
    { title: "Settings", icon: "⚙️", link: "/settings", color: "#6c5ce7" },
    { title: "Manage Orders", icon: "📦", link: "/orders", color: "#fd79a8" }
  ] : [
    { title: "Browse Services", icon: "🔍", link: "/gigs", color: "#1dbf73" },
    { title: "Find Freelancers", icon: "👥", link: "/profiles", color: "#ff7f57" },
    { title: "My Orders", icon: "📦", link: "/orders", color: "#6c5ce7" },
    { title: "Saved Services", icon: "❤️", link: "/saved", color: "#fd79a8" }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "order": return "📦";
      case "message": return "💬";
      case "review": return "⭐";
      default: return "📋";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read if not already read
      if (!notification.isRead) {
        await newRequest.put(`/dashboard/notifications/${notification.id}/read`);
        
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id 
              ? { ...n, isRead: true, readAt: new Date() }
              : n
          )
        );
      }

      // Navigate to action URL if available
      if (notification.actionButton && notification.actionButton.url) {
        window.location.href = notification.actionButton.url;
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  // Handle clear all notifications
  const handleClearAllNotifications = async () => {
    try {
      await newRequest.put('/dashboard/notifications/clear-all');
      
      // Update local state to mark all as read
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
      );
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <div className="dashboard-home">
      {/* Hero/Welcome Section */}
      <div className="welcome-section">
        <div className="container">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1>{getGreeting()}, {currentUser?.username}! 👋</h1>
              <p>Ready to {currentUser?.isSeller ? 'grow your business' : 'find great services'} today?</p>
            </div>
            <div className="user-avatar">
              <img src={currentUser?.img || "/img/noavatar.jpg"} alt="User" />
              <div className="online-status"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="container">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <Link to={action.link} key={index} className="action-card">
                <div className="action-icon" style={{ backgroundColor: action.color }}>
                  <span>{action.icon}</span>
                </div>
                <h3>{action.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="stats-section">
        <div className="container">
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchDashboardData}>Retry</button>
            </div>
          )}
          <h2>{currentUser?.isSeller ? 'Your Performance' : 'Your Activity'}</h2>
          <div className="stats-grid">
            {loading.stats ? (
              // Loading skeletons for stats
              Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="stat-card loading">
                  <Skeleton height="60px" borderRadius="12px" />
                </div>
              ))
            ) : stats ? (
              currentUser?.isSeller ? (
                <>
                  <div className="stat-card earnings">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                      <h3>{formatCurrency(stats.totalEarnings || 0)}</h3>
                      <p>Total Earnings</p>
                    </div>
                  </div>
                  <div className="stat-card orders">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                      <h3>{stats.activeOrders || 0}</h3>
                      <p>Active Orders</p>
                    </div>
                  </div>
                  <div className="stat-card gigs">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                      <h3>{stats.activeGigs || 0}</h3>
                      <p>Active Gigs</p>
                    </div>
                  </div>
                  <div className="stat-card views">
                    <div className="stat-icon">👁️</div>
                    <div className="stat-content">
                      <h3>{stats.profileViews || 0}</h3>
                      <p>Profile Views</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="stat-card orders">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                      <h3>{stats.activeOrders || 0}</h3>
                      <p>Active Orders</p>
                    </div>
                  </div>
                  <div className="stat-card completed">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                      <h3>{stats.completedOrders || 0}</h3>
                      <p>Completed Orders</p>
                    </div>
                  </div>
                  <div className="stat-card messages">
                    <div className="stat-icon">💬</div>
                    <div className="stat-content">
                      <h3>{stats.unreadMessages || 0}</h3>
                      <p>Unread Messages</p>
                    </div>
                  </div>
                  <div className="stat-card saved">
                    <div className="stat-icon">❤️</div>
                    <div className="stat-content">
                      <h3>{stats.savedServices || 0}</h3>
                      <p>Saved Services</p>
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="no-data">Failed to load statistics</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="container">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link to="/activity" className="view-all">View All</Link>
          </div>
          <div className="activity-list">
            {loading.activities ? (
              Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="activity-item loading">
                  <Skeleton height="80px" borderRadius="8px" />
                </div>
              ))
            ) : recentActivities.length > 0 ? (
              recentActivities.map(activity => (
                <div key={activity.id} className={`activity-item ${activity.status}`}>
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-main">
                      <h4>{activity.title}</h4>
                      <p>{activity.description}</p>
                    </div>
                    <div className="activity-meta">
                      <span className="time">{activity.time}</span>
                      {activity.amount && (
                        <span className="amount">{formatCurrency(activity.amount)}</span>
                      )}
                      {activity.rating && (
                        <span className="rating">
                          {'⭐'.repeat(activity.rating)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <p>No recent activity found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <div className="container">
          <h2>{currentUser?.isSeller ? 'Trending in Your Categories' : 'Recommended for You'}</h2>
          {loading.gigs ? (
            <div className="gigs-loading">
              <div className="gigs-skeleton-grid">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="gig-skeleton">
                    <Skeleton height="200px" borderRadius="12px" />
                  </div>
                ))}
              </div>
            </div>
          ) : trendingGigs.length > 0 ? (
            <Slide 
              slidesToShow={4} 
              arrowsScroll={2} 
              title=""
              showDots={false}
              autoplay={false}
            >
              {trendingGigs.map(gig => (
                <GigCard item={gig} key={gig._id} />
              ))}
            </Slide>
          ) : (
            <div className="no-gigs">
              <p>No recommendations available at the moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Today's Insights */}
      <div className="insights-section">
        <div className="container">
          <h2>Today's Insights</h2>
          <div className="insights-grid">
            <div className="insight-card tip">
              <div className="insight-icon">💡</div>
              <div className="insight-content">
                <h3>Pro Tip</h3>
                <p>{currentUser?.isSeller ? 'Respond to messages within 2 hours to improve your response rate and ranking!' : 'Be specific in your project requirements to get better proposals from freelancers.'}</p>
              </div>
            </div>
            <div className="insight-card trending">
              <div className="insight-icon">📱</div>
              <div className="insight-content">
                <h3>Download Nairalancers App (Coming Soon)</h3>
                <p>Download the Nairalancers App to get the best of the platform. {currentUser?.isSeller ? 'Consider adding related skills!' : 'Great time to explore AI solutions!'}</p>
              </div>
            </div>
            <div className="insight-card celebration">
              <div className="insight-icon">🎉</div>
              <div className="insight-content">
                <h3>Platform Update</h3>
                <p>New feature: Enhanced messaging system with file sharing up to 100MB is now live!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages & Notifications */}
      <div className="messages-section">
        <div className="container">
          <div className="messages-notifications">
            <div className="messages-card">
              <div className="card-header">
                <h3>Recent Messages</h3>
                <Link to="/messages" className="view-all">View All</Link>
              </div>
              <div className="messages-list">
                {loading.messages ? (
                  Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="message-item loading">
                      <Skeleton height="60px" borderRadius="8px" />
                    </div>
                  ))
                ) : recentMessages.length > 0 ? (
                  recentMessages.map(message => (
                    <div key={message.conversationId} className={`message-item ${message.unreadCount > 0 ? 'unread' : ''}`}>
                      <img src={message.otherUser.img || "/img/noavatar.jpg"} alt="User" />
                      <div className="message-content">
                        <h4>{message.otherUser.username}</h4>
                        <p>{stripHtml(message.latestMessage?.content || 'No messages yet')}</p>
                        <span className="time">{message.latestMessage?.time || ''}</span>
                      </div>
                      {message.unreadCount > 0 && <div className="unread-indicator"></div>}
                    </div>
                  ))
                ) : (
                  <div className="no-messages">
                    <p>No recent messages</p>
                  </div>
                )}
              </div>
            </div>

            <div className="notifications-card">
              <div className="card-header">
                <h3>Notifications</h3>
                <button 
                  className="clear-all"
                  onClick={handleClearAllNotifications}
                  disabled={loading.notifications || notifications.length === 0}
                >
                  Clear All
                </button>
              </div>
              <div className="notifications-list">
                {loading.notifications ? (
                  Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="notification-item loading">
                      <Skeleton height="60px" borderRadius="8px" />
                    </div>
                  ))
                ) : notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.isRead ? 'new' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="notification-icon">{notification.icon}</div>
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{stripHtml(notification.message)}</p>
                        <span className="time">{notification.time}</span>
                      </div>
                      {!notification.isRead && <div className="unread-indicator"></div>}
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
