import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RecentActivity.scss';

const RecentActivity = ({ recentOrders, recentUsers }) => {
  const [activeTab, setActiveTab] = useState('orders');

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in progress': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      case 'disputed': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getOrderIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in progress': return '🔄';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      case 'disputed': return '⚖️';
      default: return '📦';
    }
  };

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        <div className="activity-tabs">
          <button 
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Recent Orders
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 New Users
          </button>
        </div>
      </div>

      <div className="activity-content">
        {activeTab === 'orders' && (
          <div className="orders-activity">
            {recentOrders && recentOrders.length > 0 ? (
              <div className="activity-list">
                {recentOrders.map((order) => (
                  <div key={order._id} className="activity-item order-item">
                    <div className="activity-icon">
                      <span>{getOrderIcon(order.status)}</span>
                    </div>
                    
                    <div className="activity-details">
                      <div className="activity-main">
                        <Link 
                          to={`/admin/orders/${order._id}`}
                          className="activity-title"
                        >
                          Order #{order._id.slice(-8)}
                        </Link>
                        <span 
                          className="activity-status"
                          style={{ color: getOrderStatusColor(order.status) }}
                        >
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="activity-description">
                        <span className="buyer">
                          👤 {order.buyerId?.firstname} {order.buyerId?.lastname}
                        </span>
                        <span className="seller">
                          → 💼 {order.sellerId?.firstname} {order.sellerId?.lastname}
                        </span>
                      </div>
                      
                      <div className="activity-meta">
                        <span className="amount">₦{order.price?.toLocaleString()}</span>
                        <span className="escrow-status">{order.escrowStatus}</span>
                      </div>
                    </div>
                    
                    <div className="activity-time">
                      <span>{formatTimeAgo(order.createdAt)}</span>
                      {order.disputeStatus && order.disputeStatus !== 'none' && (
                        <span className="dispute-flag">🚨 Disputed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📦</span>
                <p>No recent orders</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-activity">
            {recentUsers && recentUsers.length > 0 ? (
              <div className="activity-list">
                {recentUsers.map((user) => (
                  <div key={user._id} className="activity-item user-item">
                    <div className="activity-icon">
                      <img 
                        src={user.img || '/img/noavatar.jpg'} 
                        alt={user.username}
                        className="user-avatar"
                      />
                    </div>
                    
                    <div className="activity-details">
                      <div className="activity-main">
                        <Link 
                          to={`/admin/users/${user._id}`}
                          className="activity-title"
                        >
                          {user.firstname} {user.lastname}
                        </Link>
                        <span className="username">@{user.username}</span>
                      </div>
                      
                      <div className="activity-description">
                        <span className="email">📧 {user.email}</span>
                      </div>
                      
                      <div className="activity-meta">
                        <span className={`user-type ${user.isSeller ? 'seller' : 'buyer'}`}>
                          {user.isSeller ? '💼 Seller' : '🛒 Buyer'}
                        </span>
                        {user.emailVerified && (
                          <span className="verified">✅ Verified</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="activity-time">
                      <span>{formatTimeAgo(user.createdAt)}</span>
                      <div className="quick-actions">
                        <Link 
                          to={`/admin/users/${user._id}`}
                          className="quick-action view"
                          title="View User"
                        >
                          👁️
                        </Link>
                        <button 
                          className="quick-action message"
                          title="Send Message"
                        >
                          💬
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">👥</span>
                <p>No new users</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="activity-footer">
        <Link 
          to={activeTab === 'orders' ? '/admin/orders' : '/admin/users'}
          className="view-all-btn"
        >
          View All {activeTab === 'orders' ? 'Orders' : 'Users'} →
        </Link>
      </div>
    </div>
  );
};

export default RecentActivity;
