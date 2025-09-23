import React, { useState, useEffect } from 'react';
import newRequest from '../../../utils/newRequest';
import './SystemHealth.scss';

const SystemHealth = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await newRequest.get('/admin/system/health');
        setHealthData(response.data);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Failed to fetch system health:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();

    // Update every 30 seconds
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  const formatUptime = (connectionState) => {
    // This is a simplified example - you might want to track actual uptime
    return connectionState === 1 ? '99.9%' : '0%';
  };

  if (loading) {
    return (
      <div className="system-health loading">
        <h3>System Health</h3>
        <div className="health-skeleton">
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="system-health">
      <div className="health-header">
        <h3>System Health</h3>
        <div className="last-update">
          Updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Overall Health Status */}
      <div className="overall-health">
        <div 
          className="health-indicator"
          style={{ backgroundColor: getHealthColor(healthData?.overall) }}
        >
          <span className="health-icon">
            {getHealthIcon(healthData?.overall)}
          </span>
        </div>
        <div className="health-info">
          <div className="health-status">
            <span 
              className="status-text"
              style={{ color: getHealthColor(healthData?.overall) }}
            >
              {healthData?.overall?.toUpperCase() || 'UNKNOWN'}
            </span>
            <span className="health-score">
              {healthData?.score || 0}/100
            </span>
          </div>
          <div className="health-description">
            System is {healthData?.overall === 'healthy' ? 'operating normally' : 
                      healthData?.overall === 'warning' ? 'experiencing minor issues' :
                      'having critical problems'}
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="health-metrics">
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">🗄️</span>
            <span className="metric-label">Database</span>
          </div>
          <div className="metric-value">
            <span 
              className={`status ${healthData?.database?.status === 'connected' ? 'healthy' : 'critical'}`}
            >
              {healthData?.database?.status === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">⏱️</span>
            <span className="metric-label">Uptime</span>
          </div>
          <div className="metric-value">
            <span className="uptime">
              {formatUptime(healthData?.database?.connectionState)}
            </span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">👥</span>
            <span className="metric-label">Active Users</span>
          </div>
          <div className="metric-value">
            <span className="count">
              {healthData?.metrics?.totalUsers?.toLocaleString() || '0'}
            </span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">📦</span>
            <span className="metric-label">Active Orders</span>
          </div>
          <div className="metric-value">
            <span className="count">
              {healthData?.metrics?.activeOrders?.toLocaleString() || '0'}
            </span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">⚖️</span>
            <span className="metric-label">Pending Disputes</span>
          </div>
          <div className="metric-value">
            <span className={`count ${healthData?.metrics?.pendingDisputes > 5 ? 'warning' : ''}`}>
              {healthData?.metrics?.pendingDisputes || '0'}
            </span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">💰</span>
            <span className="metric-label">Pending Withdrawals</span>
          </div>
          <div className="metric-value">
            <span className={`count ${healthData?.metrics?.pendingWithdrawals > 10 ? 'warning' : ''}`}>
              {healthData?.metrics?.pendingWithdrawals || '0'}
            </span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">🚨</span>
            <span className="metric-label">System Errors (24h)</span>
          </div>
          <div className="metric-value">
            <span className={`count ${healthData?.metrics?.systemErrors > 0 ? 'critical' : 'healthy'}`}>
              {healthData?.metrics?.systemErrors || '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="health-actions">
        <button 
          className="action-btn"
          onClick={() => window.location.reload()}
        >
          🔄 Refresh
        </button>
        <button 
          className="action-btn"
          onClick={() => window.open('/admin/system', '_blank')}
        >
          📋 Full Report
        </button>
        {healthData?.overall !== 'healthy' && (
          <button className="action-btn critical">
            🚨 Alert Team
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div 
          className="status-fill"
          style={{ 
            width: `${healthData?.score || 0}%`,
            backgroundColor: getHealthColor(healthData?.overall)
          }}
        ></div>
      </div>
    </div>
  );
};

export default SystemHealth;
