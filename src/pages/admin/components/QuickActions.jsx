import React from 'react';
import { Link } from 'react-router-dom';
import './QuickActions.scss';

const QuickActions = () => {
  const actions = [
    {
      title: 'Manage Users',
      description: 'View, edit, and manage all users',
      icon: '👥',
      path: '/admin/users',
      color: 'blue',
      count: '1,234'
    },
    {
      title: 'Review Disputes',
      description: 'Handle pending disputes',
      icon: '⚖️',
      path: '/admin/disputes',
      color: 'red',
      urgent: true,
      count: '5'
    },
    {
      title: 'Process Withdrawals',
      description: 'Approve pending withdrawals',
      icon: '💰',
      path: '/admin/withdrawals',
      color: 'green',
      count: '23'
    },
    {
      title: 'Verify Users',
      description: 'Review ID verifications',
      icon: '✅',
      path: '/admin/verification',
      color: 'purple',
      count: '12'
    },
    {
      title: 'Fraud Detection',
      description: 'Monitor suspicious activities',
      icon: '🔍',
      path: '/admin/fraud',
      color: 'orange',
      count: '3'
    },
    {
      title: 'System Health',
      description: 'Monitor platform status',
      icon: '🩺',
      path: '/admin/system',
      color: 'teal',
      status: 'healthy'
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: '📊',
      path: '/admin/analytics',
      color: 'indigo',
      trend: 'up'
    },
    {
      title: 'Settings',
      description: 'Configure platform settings',
      icon: '⚙️',
      path: '/admin/settings',
      color: 'gray'
    }
  ];

  const getActionClass = (action) => {
    let classes = ['quick-action'];
    if (action.color) classes.push(action.color);
    if (action.urgent) classes.push('urgent');
    return classes.join(' ');
  };

  const renderActionBadge = (action) => {
    if (action.urgent) {
      return <span className="action-badge urgent">URGENT</span>;
    }
    if (action.count) {
      return <span className="action-badge count">{action.count}</span>;
    }
    if (action.status) {
      return <span className={`action-badge status ${action.status}`}>{action.status}</span>;
    }
    if (action.trend) {
      return <span className={`action-badge trend ${action.trend}`}>
        {action.trend === 'up' ? '📈' : '📉'}
      </span>;
    }
    return null;
  };

  return (
    <div className="quick-actions">
      <div className="actions-header">
        <h3>Quick Actions</h3>
        <p>Manage your platform efficiently</p>
      </div>

      <div className="actions-grid">
        {actions.map((action, index) => (
          <Link 
            key={index}
            to={action.path}
            className={getActionClass(action)}
          >
            <div className="action-header">
              <div className="action-icon">
                <span>{action.icon}</span>
              </div>
              {renderActionBadge(action)}
            </div>
            
            <div className="action-content">
              <h4 className="action-title">{action.title}</h4>
              <p className="action-description">{action.description}</p>
            </div>

            <div className="action-arrow">
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Priority Actions */}
      <div className="priority-actions">
        <h4>Priority Actions</h4>
        <div className="priority-list">
          <div className="priority-item critical">
            <span className="priority-icon">🚨</span>
            <div className="priority-content">
              <strong>5 Disputes Pending</strong>
              <span>Require immediate attention</span>
            </div>
            <Link to="/admin/disputes" className="priority-action">
              Resolve
            </Link>
          </div>
          
          <div className="priority-item warning">
            <span className="priority-icon">⚠️</span>
            <div className="priority-content">
              <strong>23 Withdrawals Queued</strong>
              <span>Awaiting approval</span>
            </div>
            <Link to="/admin/withdrawals" className="priority-action">
              Process
            </Link>
          </div>
          
          <div className="priority-item info">
            <span className="priority-icon">📋</span>
            <div className="priority-content">
              <strong>12 ID Verifications</strong>
              <span>Pending review</span>
            </div>
            <Link to="/admin/verification" className="priority-action">
              Review
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-value">98.5%</span>
          <span className="stat-label">Uptime</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">1.2s</span>
          <span className="stat-label">Avg Response</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">99.9%</span>
          <span className="stat-label">Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
