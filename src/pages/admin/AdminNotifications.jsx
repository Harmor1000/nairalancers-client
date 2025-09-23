import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminNotifications.scss';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('send');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'system_announcement',
    priority: 'medium',
    targetType: 'all',
    targetUsers: [],
    deliveryMethods: {
      inApp: true,
      email: false,
      sms: false,
      push: false
    },
    scheduledFor: '',
    expiresAt: '',
    actionButton: {
      text: '',
      url: '',
      style: 'primary'
    }
  });

  useEffect(() => {
    if (activeTab === 'history') {
      fetchNotifications();
    }
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      console.log('Fetching notifications history...');
      
      const response = await newRequest.get('/admin/notifications');
      const notificationsData = response.data?.notifications || response.data || [];
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.title.trim() || !formData.message.trim()) {
      alert('Title and message are required fields');
      return;
    }

    if (formData.title.length > 100) {
      alert('Title must be less than 100 characters');
      return;
    }

    if (formData.message.length > 1000) {
      alert('Message must be less than 1000 characters');
      return;
    }

    try {
      console.log('Sending notification:', formData);
      
      const response = await newRequest.post('/admin/notifications', {
        ...formData,
        // Ensure delivery methods is properly formatted
        deliveryMethods: Object.keys(formData.deliveryMethods).filter(key => formData.deliveryMethods[key])
      });
      
      alert(response.data?.message || 'Notification sent successfully!');
      setShowCreateModal(false);
      resetForm();
      
      if (activeTab === 'history') {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error sending notification:', err);
      alert(err.response?.data?.message || 'Failed to send notification. Please try again.');
    }
  };

  const handleTestNotification = async () => {
    try {
      await newRequest.post('/admin/notifications/test', {
        title: formData.title || 'Test Notification',
        message: formData.message || 'This is a test notification.',
        type: 'custom'
      });
      alert('Test notification sent to you!');
    } catch (err) {
      alert('Failed to send test notification');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'system_announcement',
      priority: 'medium',
      targetType: 'all',
      targetUsers: [],
      deliveryMethods: {
        inApp: true,
        email: false,
        sms: false,
        push: false
      },
      scheduledFor: '',
      expiresAt: '',
      actionButton: {
        text: '',
        url: '',
        style: 'primary'
      }
    });
  };

  const handleExportNotifications = () => {
    try {
      if (notifications.length === 0) {
        alert('No notifications available to export');
        return;
      }

      const headers = [
        'Notification ID',
        'Title',
        'Message',
        'Type',
        'Priority',
        'Target Type',
        'Status',
        'Recipients',
        'Delivered',
        'Read Count',
        'Click Count',
        'Delivery Methods',
        'Created Date',
        'Sent Date',
        'Created By'
      ];

      const rows = notifications.map(notification => [
        notification._id,
        notification.title || 'N/A',
        (notification.message || '').substring(0, 100) + (notification.message?.length > 100 ? '...' : ''),
        notification.type || 'N/A',
        notification.priority || 'medium',
        notification.targetType || 'all',
        notification.status || 'draft',
        notification.recipientCount || 0,
        notification.deliveredCount || 0,
        notification.readCount || 0,
        notification.clickCount || 0,
        Object.entries(notification.deliveryMethods || {})
          .filter(([key, value]) => value)
          .map(([key]) => key)
          .join(', ') || 'None',
        new Date(notification.createdAt).toLocaleDateString(),
        notification.sentAt ? new Date(notification.sentAt).toLocaleDateString() : 'Not sent',
        `${notification.createdBy?.firstname || ''} ${notification.createdBy?.lastname || ''}`.trim() || 'Unknown'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `notifications-history-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`✅ Notifications exported successfully!\n\nFile: notifications-history-${new Date().toISOString().split('T')[0]}.csv\nRecords: ${notifications.length}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export notifications data. Please try again.');
    }
  };

  const notificationTypes = [
    { value: 'system_announcement', label: '📢 System Announcement' },
    { value: 'maintenance_notice', label: '🔧 Maintenance Notice' },
    { value: 'policy_update', label: '📋 Policy Update' },
    { value: 'security_alert', label: '🔒 Security Alert' },
    { value: 'feature_update', label: '✨ Feature Update' },
    { value: 'warning', label: '⚠️ Warning' },
    { value: 'suspension_notice', label: '🚫 Suspension Notice' },
    { value: 'welcome', label: '👋 Welcome' },
    { value: 'promotional', label: '🎉 Promotional' },
    { value: 'custom', label: '📝 Custom' }
  ];

  const templates = {
    system_announcement: {
      title: "Important System Update",
      message: "We've made important updates to improve your experience on Nairalancers. Please review the changes and let us know if you have any questions."
    },
    maintenance_notice: {
      title: "Scheduled Maintenance",
      message: "Nairalancers will be undergoing scheduled maintenance on [DATE] from [START_TIME] to [END_TIME]. During this time, the platform may be temporarily unavailable."
    },
    security_alert: {
      title: "Security Notice",
      message: "We've detected unusual activity and have implemented additional security measures to protect your account. Please review your recent activity."
    },
    welcome: {
      title: "Welcome to Nairalancers!",
      message: "Thank you for joining Nigeria's premier freelancing platform. Complete your profile to start connecting with clients and freelancers."
    }
  };

  const loadTemplate = (type) => {
    if (templates[type]) {
      setFormData({
        ...formData,
        title: templates[type].title,
        message: templates[type].message,
        type
      });
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: '#ef4444',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#10b981'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { class: 'secondary', text: 'Draft' },
      scheduled: { class: 'warning', text: 'Scheduled' },
      sending: { class: 'info', text: 'Sending' },
      sent: { class: 'success', text: 'Sent' },
      failed: { class: 'danger', text: 'Failed' },
      cancelled: { class: 'secondary', text: 'Cancelled' }
    };

    const config = statusConfig[status] || { class: 'secondary', text: status };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  return (
    <AdminLayout>
      <div className="admin-notifications">
        {/* Header */}
        <div className="page-header">
          <h1>Notification System</h1>
          <p>Send announcements, alerts, and messages to users</p>
        </div>

        {/* Quick Stats */}
        <div className="notification-stats">
          <div className="stat-card">
            <div className="stat-icon">📨</div>
            <div className="stat-content">
              <h3>1,247</h3>
              <p>Total Sent</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👀</div>
            <div className="stat-content">
              <h3>89.3%</h3>
              <p>Read Rate</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>3</h3>
              <p>Scheduled</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>12.5%</h3>
              <p>Click Rate</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'send' ? 'active' : ''}`}
            onClick={() => setActiveTab('send')}
          >
            📤 Send Notification
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📜 History
          </button>
          <button 
            className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            📋 Templates
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </div>

        {/* Send Notification Tab */}
        {activeTab === 'send' && (
          <div className="send-notification-section">
            <div className="form-container">
              <form onSubmit={handleSendNotification} className="notification-form">
                {/* Basic Info */}
                <div className="form-section">
                  <h3>📝 Notification Details</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Notification Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                        {notificationTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🟠 High</option>
                        <option value="urgent">🔴 Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter notification title..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Enter your message..."
                      rows="5"
                      required
                    />
                    <div className="character-count">
                      {formData.message.length}/1000 characters
                    </div>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="form-section">
                  <h3>🎯 Target Audience</h3>
                  
                  <div className="form-group">
                    <label>Send To</label>
                    <select
                      value={formData.targetType}
                      onChange={(e) => setFormData({...formData, targetType: e.target.value})}
                    >
                      <option value="all">👥 All Users</option>
                      <option value="sellers">💼 All Sellers</option>
                      <option value="buyers">🛒 All Buyers</option>
                      <option value="admins">👑 All Admins</option>
                      <option value="specific_users">🎯 Specific Users</option>
                      <option value="user_segment">📊 User Segment</option>
                    </select>
                  </div>

                  {formData.targetType === 'specific_users' && (
                    <div className="form-group">
                      <label>User Emails (comma separated)</label>
                      <textarea
                        placeholder="user1@email.com, user2@email.com..."
                        rows="3"
                      />
                    </div>
                  )}
                </div>

                {/* Delivery Settings */}
                <div className="form-section">
                  <h3>📲 Delivery Settings</h3>
                  
                  <div className="delivery-methods">
                    <label className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={formData.deliveryMethods.inApp}
                        onChange={(e) => setFormData({
                          ...formData,
                          deliveryMethods: {
                            ...formData.deliveryMethods,
                            inApp: e.target.checked
                          }
                        })}
                      />
                      <span>📱 In-App Notification</span>
                    </label>
                    
                    <label className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={formData.deliveryMethods.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          deliveryMethods: {
                            ...formData.deliveryMethods,
                            email: e.target.checked
                          }
                        })}
                      />
                      <span>📧 Email</span>
                    </label>
                    
                    <label className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={formData.deliveryMethods.sms}
                        onChange={(e) => setFormData({
                          ...formData,
                          deliveryMethods: {
                            ...formData.deliveryMethods,
                            sms: e.target.checked
                          }
                        })}
                      />
                      <span>📱 SMS</span>
                    </label>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="form-section">
                  <h3>⏰ Scheduling (Optional)</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Schedule For</label>
                      <input
                        type="datetime-local"
                        value={formData.scheduledFor}
                        onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Expires At</label>
                      <input
                        type="datetime-local"
                        value={formData.expiresAt}
                        onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn secondary"
                    onClick={handleTestNotification}
                  >
                    🧪 Send Test
                  </button>
                  <button 
                    type="button" 
                    className="btn secondary"
                    onClick={() => loadTemplate(formData.type)}
                  >
                    📋 Load Template
                  </button>
                  <button 
                    type="submit" 
                    className="btn primary"
                  >
                    {formData.scheduledFor ? '⏰ Schedule' : '📤 Send Now'}
                  </button>
                </div>
              </form>
            </div>

            {/* Preview */}
            <div className="notification-preview">
              <h3>📱 Preview</h3>
              <div className="preview-container">
                <div className="notification-card">
                  <div className="notification-header">
                    <div className="notification-type">{formData.type.replace('_', ' ')}</div>
                    <div 
                      className="priority-indicator"
                      style={{ backgroundColor: getPriorityColor(formData.priority) }}
                    ></div>
                  </div>
                  <div className="notification-content">
                    <h4>{formData.title || 'Notification Title'}</h4>
                    <p>{formData.message || 'Your notification message will appear here...'}</p>
                  </div>
                  <div className="notification-footer">
                    <span className="timestamp">Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="history-section">
            <div className="history-header">
              <div className="history-title">
                <h3>Notification History</h3>
                <p>View and manage all sent notifications</p>
              </div>
              <div className="history-actions">
                <button
                  className="export-btn"
                  onClick={handleExportNotifications}
                  disabled={loading || notifications.length === 0}
                >
                  📥 Export History
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading notifications...</p>
              </div>
            ) : (
              <div className="notifications-table-container">
                <table className="notifications-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Target</th>
                      <th>Status</th>
                      <th>Sent/Scheduled</th>
                      <th>Delivery Stats</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notification) => (
                      <tr key={notification._id}>
                        <td>
                          <div className="notification-title">
                            <span className="title">{notification.title}</span>
                            <span 
                              className="priority-dot"
                              style={{ backgroundColor: getPriorityColor(notification.priority) }}
                            ></span>
                          </div>
                        </td>
                        <td>
                          <span className="type-badge">{notification.type.replace('_', ' ')}</span>
                        </td>
                        <td>{notification.targetType}</td>
                        <td>{getStatusBadge(notification.status)}</td>
                        <td>{new Date(notification.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="delivery-stats">
                            <span>📤 {notification.stats?.delivered || 0}</span>
                            <span>👀 {notification.stats?.read || 0}</span>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-btn view">👁️</button>
                            <button className="action-btn analytics">📊</button>
                            {notification.status === 'scheduled' && (
                              <button className="action-btn cancel">❌</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="templates-section">
            <div className="templates-grid">
              {Object.entries(templates).map(([key, template]) => (
                <div key={key} className="template-card">
                  <div className="template-header">
                    <h4>{template.title}</h4>
                    <span className="template-type">{key.replace('_', ' ')}</span>
                  </div>
                  <div className="template-content">
                    <p>{template.message.substring(0, 150)}...</p>
                  </div>
                  <div className="template-actions">
                    <button 
                      className="btn secondary"
                      onClick={() => {
                        loadTemplate(key);
                        setActiveTab('send');
                      }}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="analytics-grid">
              <div className="chart-container">
                <h3>📊 Delivery Performance</h3>
                <div className="chart-placeholder">
                  <p>Notification analytics charts will be displayed here</p>
                </div>
              </div>
              
              <div className="analytics-summary">
                <h3>📈 Summary</h3>
                <div className="summary-stats">
                  <div className="summary-item">
                    <span className="label">Average Delivery Rate</span>
                    <span className="value">94.2%</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Average Read Rate</span>
                    <span className="value">67.8%</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Best Performing Type</span>
                    <span className="value">Security Alerts</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Peak Engagement Time</span>
                    <span className="value">2:00 PM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;

