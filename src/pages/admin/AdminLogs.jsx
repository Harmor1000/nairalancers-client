import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminLogs.scss';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: 'all',
    targetType: 'all',
    severity: 'all',
    admin: 'all',
    dateRange: '7days',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchLogs();
    fetchLogStats();
  }, [filters, pagination.page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin logs with filters:', filters);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.action && filters.action !== 'all') queryParams.append('action', filters.action);
      if (filters.targetType && filters.targetType !== 'all') queryParams.append('targetType', filters.targetType);
      if (filters.severity && filters.severity !== 'all') queryParams.append('severity', filters.severity);
      if (filters.admin && filters.admin !== 'all') queryParams.append('adminId', filters.admin);
      // Map dateRange to backend-supported startDate/endDate
      if (filters.dateRange && filters.dateRange !== 'all') {
        const now = new Date();
        const start = new Date(now);
        switch (filters.dateRange) {
          case '1hour':
            start.setHours(now.getHours() - 1);
            break;
          case '24hours':
            start.setDate(now.getDate() - 1);
            break;
          case '7days':
            start.setDate(now.getDate() - 7);
            break;
          case '30days':
            start.setDate(now.getDate() - 30);
            break;
          case '90days':
            start.setDate(now.getDate() - 90);
            break;
          default:
            break;
        }
        queryParams.append('startDate', start.toISOString());
        queryParams.append('endDate', now.toISOString());
      }
      if (filters.search) queryParams.append('search', filters.search);
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());

      const response = await newRequest.get(`/admin/system/logs?${queryParams}`);
      const logsData = response.data?.logs || response.data || [];
      
      if (Array.isArray(logsData)) {
        setLogs(logsData);
        setPagination(prev => ({
          ...prev,
          total: response.data?.pagination?.totalLogs || logsData.length || 0,
          totalPages: response.data?.pagination?.totalPages || Math.ceil(((logsData.length || 0)) / prev.limit)
        }));
      } else {
        setLogs([]);
        setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }));
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setLogs([]);
      setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const fetchLogStats = async () => {
    try {
      // The system logs endpoint also returns statistics; reuse it here
      const response = await newRequest.get('/admin/system/logs?limit=1');
      const statistics = response.data?.statistics || [];
      const paginationInfo = response.data?.pagination || {};
      const logsBySeverity = Array.isArray(statistics)
        ? statistics.map(s => ({ severity: s._id, count: s.count }))
        : [];
      const criticalLogs = logsBySeverity.find(s => s.severity === 'critical')?.count || 0;
      const computedStats = {
        totalLogs: paginationInfo.totalLogs || 0,
        logsToday: 0,
        criticalLogs,
        failedActions: 0,
        uniqueAdmins: 0,
        mostCommonAction: 'N/A',
        averageLogsPerDay: 0,
        logsByAction: [],
        logsBySeverity
      };
      setStats(computedStats.totalLogs > 0 || logsBySeverity.length > 0 ? computedStats : null);
    } catch (err) {
      console.error('Error fetching log stats:', err);
      setStats(null);
    }
  };

  const handleExportLogs = () => {
    try {
      if (logs.length === 0) {
        alert('No logs available to export');
        return;
      }

      const headers = [
        'Log ID',
        'Date/Time',
        'Admin',
        'Action',
        'Target Type',
        'Target Name',
        'Severity',
        'Status',
        'IP Address',
        'Details',
        'Changes Made'
      ];

      const rows = logs.map(log => [
        log._id,
        new Date(log.createdAt).toLocaleString(),
        log.adminUsername || 'Unknown',
        log.action.replace(/_/g, ' ').toUpperCase(),
        log.targetType || 'N/A',
        log.targetName || 'N/A',
        log.severity || 'medium',
        log.success ? 'SUCCESS' : 'FAILED',
        log.ipAddress || 'N/A',
        JSON.stringify(log.details || {}).substring(0, 100),
        `Old: ${JSON.stringify(log.oldValues || {})} | New: ${JSON.stringify(log.newValues || {})}`.substring(0, 150)
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `admin-logs-${filters.dateRange}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`✅ Admin logs exported successfully!\n\nFile: admin-logs-${filters.dateRange}-${new Date().toISOString().split('T')[0]}.csv\nRecords: ${logs.length}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export logs. Please try again.');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      'low': { class: 'info', text: 'LOW' },
      'medium': { class: 'warning', text: 'MEDIUM' },
      'high': { class: 'danger', text: 'HIGH' },
      'critical': { class: 'critical', text: 'CRITICAL' }
    };

    const config = severityConfig[severity] || { class: 'info', text: severity };
    return <span className={`severity-badge ${config.class}`}>{config.text}</span>;
  };

  const getActionIcon = (action) => {
    const actionIcons = {
      'user_created': '👤',
      'user_updated': '✏️',
      'user_deleted': '🗑️',
      'user_suspended': '🚫',
      'user_unsuspended': '✅',
      'gig_approved': '👍',
      'gig_rejected': '👎',
      'gig_deleted': '🗑️',
      'gig_featured': '⭐',
      'order_refunded': '💰',
      'order_cancelled': '❌',
      'dispute_resolved': '⚖️',
      'withdrawal_approved': '💸',
      'withdrawal_rejected': '🚫',
      'verification_approved': '✅',
      'verification_rejected': '❌',
      'login': '🔓',
      'logout': '🔒',
      'failed_login_attempt': '⚠️',
      'system_settings_changed': '⚙️',
      'bulk_action_performed': '📋',
      'dashboard_accessed': '📊'
    };

    return actionIcons[action] || '📝';
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };

  return (
    <AdminLayout>
      <div className="admin-logs">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>📋 Admin Activity Logs</h1>
            <p>Monitor and audit all administrative actions on the platform</p>
          </div>
          <div className="header-actions">
            <button
              className="export-btn"
              onClick={handleExportLogs}
              disabled={loading || logs.length === 0}
            >
              📥 Export Logs
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="logs-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stats.totalLogs?.toLocaleString() || 0}</h3>
                <p>Total Logs</p>
                <span className="stat-change">+{stats.logsToday || 0} today</span>
              </div>
            </div>
            
            <div className="stat-card warning">
              <div className="stat-icon">🚨</div>
              <div className="stat-content">
                <h3>{stats.criticalLogs || 0}</h3>
                <p>Critical Events</p>
                <span className="stat-change">Last 7 days</span>
              </div>
            </div>
            
            <div className="stat-card danger">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <h3>{stats.failedActions || 0}</h3>
                <p>Failed Actions</p>
                <span className="stat-change">Needs attention</span>
              </div>
            </div>
            
            <div className="stat-card success">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{stats.uniqueAdmins || 0}</h3>
                <p>Active Admins</p>
                <span className="stat-change">This week</span>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <option value="all">All Actions</option>
              <option value="user_created">User Created</option>
              <option value="user_updated">User Updated</option>
              <option value="user_suspended">User Suspended</option>
              <option value="gig_approved">Gig Approved</option>
              <option value="gig_rejected">Gig Rejected</option>
              <option value="withdrawal_approved">Withdrawal Approved</option>
              <option value="dispute_resolved">Dispute Resolved</option>
              <option value="login">Login Events</option>
              <option value="failed_login_attempt">Failed Logins</option>
              <option value="system_settings_changed">Settings Changed</option>
            </select>
            
            <select
              value={filters.targetType}
              onChange={(e) => handleFilterChange('targetType', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="user">Users</option>
              <option value="gig">Gigs</option>
              <option value="order">Orders</option>
              <option value="dispute">Disputes</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="system">System</option>
              <option value="auth">Authentication</option>
            </select>
            
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
            >
              <option value="all">All Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="1hour">Last Hour</option>
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            
            <input
              type="text"
              placeholder="Search logs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="logs-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading admin logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No logs found</h3>
              <p>No administrative actions match your current filters.</p>
            </div>
          ) : (
            <div className="logs-table-container">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Admin</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Details</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className={`log-row severity-${log.severity} ${!log.success ? 'failed' : ''}`}>
                      <td className="log-date">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="log-admin">
                        <div className="admin-info">
                          <span className="admin-name">{log.adminUsername}</span>
                          <span className="admin-id">{log.adminId.substring(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="log-action">
                        <div className="action-info">
                          <span className="action-icon">{getActionIcon(log.action)}</span>
                          <span className="action-text">{log.action.replace(/_/g, ' ')}</span>
                        </div>
                      </td>
                      <td className="log-target">
                        <div className="target-info">
                          <span className="target-type">{log.targetType}</span>
                          {log.targetName && (
                            <span className="target-name">{log.targetName}</span>
                          )}
                        </div>
                      </td>
                      <td className="log-severity">
                        {getSeverityBadge(log.severity)}
                      </td>
                      <td className="log-status">
                        <span className={`status-badge ${log.success ? 'success' : 'failed'}`}>
                          {log.success ? '✅ Success' : '❌ Failed'}
                        </span>
                      </td>
                      <td className="log-details">
                        {log.details && (
                          <details className="details-expandable">
                            <summary>View Details</summary>
                            <div className="details-content">
                              <pre>{JSON.stringify(log.details, null, 2)}</pre>
                              {(log.oldValues || log.newValues) && (
                                <div className="value-changes">
                                  {log.oldValues && (
                                    <div className="old-values">
                                      <strong>Before:</strong>
                                      <pre>{JSON.stringify(log.oldValues, null, 2)}</pre>
                                    </div>
                                  )}
                                  {log.newValues && (
                                    <div className="new-values">
                                      <strong>After:</strong>
                                      <pre>{JSON.stringify(log.newValues, null, 2)}</pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </details>
                        )}
                      </td>
                      <td className="log-ip">
                        <div className="ip-info">
                          <span className="ip-address">{log.ipAddress || 'N/A'}</span>
                          {log.userAgent && (
                            <span className="user-agent" title={log.userAgent}>
                              {log.userAgent.includes('Windows') ? '🖥️' : 
                               log.userAgent.includes('Mac') ? '🖥️' : 
                               log.userAgent.includes('Mobile') ? '📱' : '🌐'}
                            </span>
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <div className="pagination-info">
              <span>
                Page {pagination.page} of {pagination.totalPages} 
                ({pagination.total} total logs)
              </span>
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLogs;
