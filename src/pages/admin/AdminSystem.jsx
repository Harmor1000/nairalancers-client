import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminSystem.scss';

const AdminSystem = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('health');
  const [systemData, setSystemData] = useState({
    health: null,
    logs: [],
    performance: null,
    alerts: [],
    backups: []
  });
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    fetchSystemData();
    
    // Set up auto-refresh every 30 seconds for real-time monitoring
    const interval = setInterval(fetchSystemData, 30000);
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching system data for ${activeTab} tab`);
      
      // Try to fetch real system data from API
      try {
        const responses = await Promise.all([
          newRequest.get('/admin/system/health'),
          newRequest.get('/admin/system/performance'),
          newRequest.get('/admin/system/alerts'),
          newRequest.get('/admin/system/backups')
        ]);
        
        setSystemData({
          health: responses[0].data || null,
          performance: responses[1].data || null,
          alerts: responses[2].data?.alerts || [],
          backups: responses[3].data?.backups || [],
          logs: [] // Removed logs - now handled by AdminLogs
        });
        
        console.log('System data fetched from API:', responses[0].data);
      } catch (apiErr) {
        console.error('Failed to fetch real system data:', apiErr);
        setSystemData({
          health: null,
          performance: null,
          alerts: [],
          backups: [],
          logs: [] // Removed logs functionality
        });
      }
    } catch (err) {
      console.error('Error in fetchSystemData:', err);
      
      // Set empty state only
      setSystemData({
        health: null,
        performance: null,
        alerts: [],
        backups: [],
        logs: []
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await newRequest.post(`/admin/system/alerts/${alertId}/acknowledge`);
      // Update local state
      setSystemData(prev => ({
        ...prev,
        alerts: prev.alerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'acknowledged', acknowledgedBy: 'Current Admin' }
            : alert
        )
      }));
    } catch (err) {
      alert('Failed to acknowledge alert');
    }
  };

  const triggerBackup = async (type = 'incremental') => {
    try {
      await newRequest.post('/admin/system/backup', { type });
      alert(`${type} backup initiated successfully`);
      fetchSystemData(); // Refresh data
    } catch (err) {
      alert('Failed to initiate backup');
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleExportSystemData = () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        health: systemData.health,
        performance: systemData.performance,
        alerts: systemData.alerts,
        backups: systemData.backups
      };
      
      // Create CSV for system health metrics
      const headers = [
        'Timestamp',
        'Overall Status',
        'Uptime %',
        'Response Time (ms)',
        'Error Rate %',
        'CPU Usage %',
        'Memory Usage %',
        'Disk Usage %',
        'Active Users',
        'Requests/Min',
        'DB Connections',
        'Active Alerts',
        'Recent Backups'
      ];
      
      const row = [
        new Date().toLocaleString(),
        systemData.health?.overall || 'unknown',
        systemData.health?.uptime || 0,
        systemData.health?.responseTime || 0,
        systemData.health?.errorRate || 0,
        systemData.health?.cpuUsage || 0,
        systemData.health?.memoryUsage || 0,
        systemData.health?.diskUsage || 0,
        systemData.health?.activeUsers || 0,
        systemData.health?.requestsPerMinute || 0,
        systemData.health?.dbConnections || 0,
        systemData.alerts?.filter(a => a.status === 'active').length || 0,
        systemData.backups?.length || 0
      ];
      
      const csvContent = [
        headers.join(','),
        row.map(cell => `"${cell}"`).join(',')
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `system-health-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`✅ System health data exported successfully!\n\nFile: system-health-${new Date().toISOString().split('T')[0]}.csv\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export system data. Please try again.');
    }
  };

  const formatUptime = (uptime) => {
    return `${uptime.toFixed(2)}%`;
  };

  const formatDuration = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ago`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    return `${minutes}m ago`;
  };

  return (
    <AdminLayout>
      <div className="admin-system">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>🩺 System Health Monitor</h1>
            <p>Real-time monitoring and system diagnostics</p>
          </div>
          
          <div className="header-controls">
            <div className="status-indicator">
              <div 
                className={`status-dot ${systemData.health?.overall || 'unknown'}`}
                style={{ backgroundColor: getHealthStatusColor(systemData.health?.overall) }}
              ></div>
              <span>System {systemData.health?.overall || 'Unknown'}</span>
            </div>
            
            <button className="refresh-btn" onClick={fetchSystemData}>
              🔄 Refresh
            </button>
            
            <button className="export-btn" onClick={handleExportSystemData}>
              📥 Export Data
            </button>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="system-overview">
          <div className="overview-card uptime">
            <div className="card-icon">⏱️</div>
            <div className="card-content">
              <h3>{formatUptime(systemData.health?.uptime || 0)}</h3>
              <p>Uptime</p>
              <div className="card-detail">
                Last restart: 3 days ago
              </div>
            </div>
          </div>
          
          <div className="overview-card response">
            <div className="card-icon">⚡</div>
            <div className="card-content">
              <h3>{systemData.health?.responseTime || 0}ms</h3>
              <p>Avg Response Time</p>
              <div className="card-detail">
                Target: &lt;500ms
              </div>
            </div>
          </div>
          
          <div className="overview-card users">
            <div className="card-icon">👥</div>
            <div className="card-content">
              <h3>{systemData.health?.activeUsers?.toLocaleString() || '0'}</h3>
              <p>Active Users</p>
              <div className="card-detail">
                Peak: 1,892 today
              </div>
            </div>
          </div>
          
          <div className="overview-card requests">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>{systemData.health?.requestsPerMinute?.toLocaleString() || '0'}</h3>
              <p>Requests/min</p>
              <div className="card-detail">
                Peak: 2,340/min
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => setActiveTab('health')}
          >
            🩺 Health Status
          </button>
          <button 
            className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            ⚡ Performance
          </button>

          <button 
            className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            🚨 Alerts ({systemData.alerts?.filter(a => a.status === 'active').length || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'backups' ? 'active' : ''}`}
            onClick={() => setActiveTab('backups')}
          >
            💾 Backups
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading system data...</p>
          </div>
        ) : (
          <div className="system-content">
            {/* Health Status Tab */}
            {activeTab === 'health' && (
              <div className="health-section">
                <div className="health-grid">
                  {/* Services Status */}
                  <div className="services-status">
                    <h3>🔧 Services Status</h3>
                    <div className="services-list">
                      {systemData.health?.services?.map((service, index) => (
                        <div key={index} className={`service-item ${service.status}`}>
                          <div className="service-info">
                            <div className="service-name">{service.name}</div>
                            <div className="service-metrics">
                              {service.responseTime}ms • {formatUptime(service.uptime)}
                            </div>
                          </div>
                          <div 
                            className="service-status"
                            style={{ color: getHealthStatusColor(service.status) }}
                          >
                            {service.status === 'healthy' && '✅'}
                            {service.status === 'warning' && '⚠️'}
                            {service.status === 'critical' && '🔴'}
                            {service.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resource Usage */}
                  <div className="resource-usage">
                    <h3>📊 Resource Usage</h3>
                    <div className="usage-meters">
                      <div className="usage-meter">
                        <div className="meter-header">
                          <span>CPU Usage</span>
                          <span>{systemData.health?.cpuUsage || 0}%</span>
                        </div>
                        <div className="meter-bar">
                          <div 
                            className="meter-fill cpu"
                            style={{ width: `${systemData.health?.cpuUsage || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="usage-meter">
                        <div className="meter-header">
                          <span>Memory Usage</span>
                          <span>{systemData.health?.memoryUsage || 0}%</span>
                        </div>
                        <div className="meter-bar">
                          <div 
                            className="meter-fill memory"
                            style={{ width: `${systemData.health?.memoryUsage || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="usage-meter">
                        <div className="meter-header">
                          <span>Disk Usage</span>
                          <span>{systemData.health?.diskUsage || 0}%</span>
                        </div>
                        <div className="meter-bar">
                          <div 
                            className="meter-fill disk"
                            style={{ width: `${systemData.health?.diskUsage || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="usage-meter">
                        <div className="meter-header">
                          <span>DB Connections</span>
                          <span>{systemData.health?.dbConnections || 0}/{systemData.health?.maxDbConnections || 100}</span>
                        </div>
                        <div className="meter-bar">
                          <div 
                            className="meter-fill db"
                            style={{ width: `${((systemData.health?.dbConnections || 0) / (systemData.health?.maxDbConnections || 100)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics Chart */}
                  <div className="metrics-chart">
                    <h3>📈 24-Hour Metrics</h3>
                    <div className="chart-container">
                      <div className="chart-lines">
                        <div className="chart-line response-time">
                          {systemData.health?.metrics?.last24Hours?.map((metric, index) => (
                            <div 
                              key={index}
                              className="chart-point"
                              style={{
                                left: `${(index / 23) * 100}%`,
                                bottom: `${(metric.responseTime / 400) * 100}%`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className="chart-legend">
                        <div className="legend-item">
                          <span className="legend-color response"></span>
                          <span>Response Time</span>
                        </div>
                      </div>
                      {/* Rolling-window statistics */}
                      <div className="chart-stats">
                        <div className="stats-group">
                          <h4>Last 5 minutes</h4>
                          <div className="stat-pills">
                            <span className="pill">avg: {systemData.health?.metrics?.responseStats?.last5m?.avg || 0}ms</span>
                            <span className="pill">p90: {systemData.health?.metrics?.responseStats?.last5m?.p90 || 0}ms</span>
                            <span className="pill">p95: {systemData.health?.metrics?.responseStats?.last5m?.p95 || 0}ms</span>
                            <span className="pill">p99: {systemData.health?.metrics?.responseStats?.last5m?.p99 || 0}ms</span>
                            <span className="pill">errors: {((systemData.health?.metrics?.responseStats?.last5m?.errorRate || 0) * 100).toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="stats-group">
                          <h4>Last 1 hour</h4>
                          <div className="stat-pills">
                            <span className="pill">avg: {systemData.health?.metrics?.responseStats?.last1h?.avg || 0}ms</span>
                            <span className="pill">p90: {systemData.health?.metrics?.responseStats?.last1h?.p90 || 0}ms</span>
                            <span className="pill">p95: {systemData.health?.metrics?.responseStats?.last1h?.p95 || 0}ms</span>
                            <span className="pill">p99: {systemData.health?.metrics?.responseStats?.last1h?.p99 || 0}ms</span>
                            <span className="pill">errors: {((systemData.health?.metrics?.responseStats?.last1h?.errorRate || 0) * 100).toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="performance-section">
                <div className="performance-grid">
                  <div className="api-performance">
                    <h3>🔗 API Endpoint Performance</h3>
                    <div className="endpoints-table">
                      <div className="table-header">
                        <span>Endpoint</span>
                        <span>Avg Response</span>
                        <span>Requests</span>
                        <span>Error Rate</span>
                      </div>
                      {systemData.performance?.apiEndpoints?.map((endpoint, index) => (
                        <div key={index} className="table-row">
                          <span className="endpoint-path">{endpoint.endpoint}</span>
                          <span className={`response-time ${endpoint.avgResponseTime > 200 ? 'slow' : 'fast'}`}>
                            {endpoint.avgResponseTime}ms
                          </span>
                          <span className="request-count">{endpoint.requestCount.toLocaleString()}</span>
                          <span className={`error-rate ${endpoint.errorRate > 0.1 ? 'high' : 'low'}`}>
                            {(endpoint.errorRate * 100).toFixed(2)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="slow-queries">
                    <h3>🐌 Slow Database Queries</h3>
                    <div className="queries-list">
                      {systemData.performance?.slowQueries?.map((query, index) => (
                        <div key={index} className="query-item">
                          <div className="query-text">{query.query}</div>
                          <div className="query-metrics">
                            <span className="query-time">{query.avgTime}ms avg</span>
                            <span className="query-count">{query.count} executions</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="alerts-section">
                <div className="alerts-container">
                  <div className="alerts-header">
                    <h3>🚨 System Alerts</h3>
                    <div className="alerts-summary">
                      <span className="active-alerts">
                        {systemData.alerts?.filter(a => a.status === 'active').length || 0} Active
                      </span>
                      <span className="acknowledged-alerts">
                        {systemData.alerts?.filter(a => a.status === 'acknowledged').length || 0} Acknowledged
                      </span>
                    </div>
                  </div>
                  
                  <div className="alerts-list">
                    {systemData.alerts?.map((alert) => (
                      <div key={alert.id} className={`alert-item ${alert.type} ${alert.status}`}>
                        <div className="alert-header">
                          <div className="alert-type">
                            {alert.type === 'critical' && '🔴'}
                            {alert.type === 'warning' && '🟡'}
                            {alert.type === 'info' && '🔵'}
                            <span>{alert.type.toUpperCase()}</span>
                          </div>
                          <div className="alert-service">{alert.service}</div>
                          <div className="alert-time">{formatDuration(alert.timestamp)}</div>
                        </div>
                        
                        <div className="alert-content">
                          <h4>{alert.title}</h4>
                          <p>{alert.message}</p>
                          
                          {alert.acknowledgedBy && (
                            <div className="alert-acknowledged">
                              ✅ Acknowledged by {alert.acknowledgedBy}
                            </div>
                          )}
                        </div>
                        
                        <div className="alert-actions">
                          {alert.status === 'active' && (
                            <button 
                              className="acknowledge-btn"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                            >
                              ✅ Acknowledge
                            </button>
                          )}
                          <button className="details-btn">📋 Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Backups Tab */}
            {activeTab === 'backups' && (
              <div className="backups-section">
                <div className="backups-container">
                  <div className="backups-header">
                    <h3>💾 System Backups</h3>
                    <div className="backup-controls">
                      <button 
                        className="backup-btn incremental"
                        onClick={() => triggerBackup('incremental')}
                      >
                        📦 Incremental Backup
                      </button>
                      <button 
                        className="backup-btn full"
                        onClick={() => triggerBackup('full')}
                      >
                        🗄️ Full Backup
                      </button>
                    </div>
                  </div>
                  
                  <div className="backups-list">
                    {systemData.backups?.map((backup) => (
                      <div key={backup.id} className={`backup-item ${backup.status}`}>
                        <div className="backup-info">
                          <div className="backup-name">{backup.name}</div>
                          <div className="backup-details">
                            <span className={`backup-type ${backup.type}`}>
                              {backup.type === 'full' ? '🗄️' : '📦'} {backup.type}
                            </span>
                            <span className="backup-size">{backup.size}</span>
                            <span className="backup-duration">{backup.duration}</span>
                            <span className="backup-time">{formatDuration(backup.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="backup-status">
                          {backup.status === 'completed' && '✅'}
                          {backup.status === 'running' && '⏳'}
                          {backup.status === 'failed' && '❌'}
                          <span>{backup.status}</span>
                        </div>
                        
                        <div className="backup-actions">
                          <button className="restore-btn">🔄 Restore</button>
                          <button className="download-btn">📥 Download</button>
                          <button className="delete-btn">🗑️ Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSystem;

