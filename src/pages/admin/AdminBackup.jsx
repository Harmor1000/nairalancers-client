import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminBackup.scss';

const AdminBackup = () => {
  const [loading, setLoading] = useState(true);
  const [backups, setBackups] = useState([]);
  const [backupStats, setBackupStats] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);

  useEffect(() => {
    fetchBackups();
    fetchBackupStats();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      console.log('Fetching backup data...');
      
      const response = await newRequest.get('/admin/backups');
      const backupsData = response.data?.backups || response.data || [];
      
      if (Array.isArray(backupsData)) {
        setBackups(backupsData);
      } else {
        setBackups([]);
      }
    } catch (err) {
      console.error('Error fetching backups:', err);
      setBackups([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackupStats = async () => {
    try {
      const response = await newRequest.get('/admin/backups/statistics');
      setBackupStats(response.data || null);
    } catch (err) {
      console.error('Error fetching backup stats:', err);
      setBackupStats(null);
    }
  };
  

  const handleCreateBackup = async (backupData) => {
    try {
      setBackupInProgress(true);
      console.log('Creating backup:', backupData);
      
      const response = await newRequest.post('/admin/backups/create', backupData);
      
      setShowCreateModal(false);
      fetchBackups();
      fetchBackupStats();
      alert(`✅ Backup creation started successfully!\n\nBackup ID: ${response.data?.backupId || 'N/A'}\nType: ${backupData.type}\nEstimated Duration: ${getEstimatedDuration(backupData.type)} minutes`);
    } catch (err) {
      console.error('Error creating backup:', err);
      alert('❌ Failed to create backup. Please try again.');
    } finally {
      setBackupInProgress(false);
    }
  };

  const handleRestoreBackup = async (backupId, restoreOptions = {}) => {
    try {
      setRestoreInProgress(true);
      console.log('Restoring backup:', backupId, restoreOptions);
      
      const response = await newRequest.post(`/admin/backups/${backupId}/restore`, restoreOptions);
      
      setShowRestoreModal(false);
      setSelectedBackup(null);
      alert(`✅ Backup restore initiated successfully!\n\nRestore ID: ${response.data?.restoreId || 'N/A'}\nYou will be notified when the restore is complete.\n\n⚠️ Note: Some services may be temporarily unavailable during restore.`);
    } catch (err) {
      console.error('Error restoring backup:', err);
      alert('❌ Failed to restore backup. Please try again.');
    } finally {
      setRestoreInProgress(false);
    }
  };

  const handleDeleteBackup = async (backupId) => {
    if (!window.confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      return;
    }

    try {
      await newRequest.delete(`/admin/backups/${backupId}`);
      fetchBackups();
      fetchBackupStats();
      alert('✅ Backup deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete backup');
    }
  };

  const handleDownloadBackup = async (backupId, backupName) => {
    try {
      // This would typically trigger a download or provide a signed URL
      const response = await newRequest.get(`/admin/backups/${backupId}/download`);
      
      if (response.data?.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
      } else {
        alert('✅ Download link will be sent to your email shortly');
      }
    } catch (err) {
      alert('❌ Failed to generate download link. Please try again.');
    }
  };

  const getEstimatedDuration = (type) => {
    const durations = {
      'full': 60,
      'database': 15,
      'files': 45,
      'system': 20
    };
    return durations[type] || 30;
  };

  const formatSize = (sizeInMB) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(2)} GB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  const getStatusBadge = (status, progress = null) => {
    const statusConfig = {
      'completed': { class: 'success', text: '✅ Completed', icon: '✅' },
      'failed': { class: 'danger', text: '❌ Failed', icon: '❌' },
      'in_progress': { class: 'info', text: `⏳ In Progress ${progress ? `(${progress}%)` : ''}`, icon: '⏳' },
      'pending': { class: 'warning', text: '⏳ Pending', icon: '⏳' }
    };

    const config = statusConfig[status] || { class: 'secondary', text: status, icon: '❓' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getBackupTypeIcon = (type) => {
    const typeIcons = {
      'full': '🗃️',
      'database': '🗄️',
      'files': '📁',
      'system': '⚙️'
    };
    return typeIcons[type] || '📦';
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

  return (
    <AdminLayout>
      <div className="admin-backup">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>🗃️ Backup & Recovery Management</h1>
            <p>Manage system backups, data protection, and disaster recovery</p>
          </div>
          <div className="header-actions">
            <button
              className="create-backup-btn"
              onClick={() => setShowCreateModal(true)}
              disabled={backupInProgress}
            >
              {backupInProgress ? '⏳ Creating...' : '📦 Create Backup'}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {backupStats && (
          <div className="backup-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{backupStats.totalBackups}</h3>
                <p>Total Backups</p>
                <span className="stat-change">{formatSize(backupStats.totalSize * 1024)} total</span>
              </div>
            </div>
            
            <div className="stat-card success">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{backupStats.successfulBackups}</h3>
                <p>Successful</p>
                <span className="stat-change">{((backupStats.successfulBackups / backupStats.totalBackups) * 100).toFixed(1)}% success rate</span>
              </div>
            </div>
            
            <div className="stat-card warning">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>{formatDate(backupStats.lastBackup).split(',')[0]}</h3>
                <p>Last Backup</p>
                <span className="stat-change">{formatDate(backupStats.nextScheduled).split(',')[0]} next</span>
              </div>
            </div>
            
            <div className="stat-card info">
              <div className="stat-icon">💾</div>
              <div className="stat-content">
                <h3>{backupStats.storageUsed.toFixed(1)}%</h3>
                <p>Storage Used</p>
                <span className="stat-change">{backupStats.retentionDays} days retention</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="action-card auto-backup">
            <div className="action-icon">🔄</div>
            <div className="action-content">
              <h4>Auto Backup</h4>
              <p>Status: {backupStats?.autoBackupEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
              <p>Frequency: {backupStats?.backupFrequency || 'daily'}</p>
            </div>
            <div className="action-toggle">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={backupStats?.autoBackupEnabled || false}
                  onChange={(e) => {
                    // Handle auto backup toggle
                    console.log('Toggle auto backup:', e.target.checked);
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="action-card storage">
            <div className="action-icon">💾</div>
            <div className="action-content">
              <h4>Storage Management</h4>
              <p>Used: {backupStats?.storageUsed.toFixed(1)}%</p>
              <div className="storage-bar">
                <div 
                  className="storage-fill" 
                  style={{ width: `${backupStats?.storageUsed || 0}%` }}
                ></div>
              </div>
            </div>
            <button className="action-btn secondary">
              ⚙️ Manage
            </button>
          </div>

          <div className="action-card retention">
            <div className="action-icon">📅</div>
            <div className="action-content">
              <h4>Retention Policy</h4>
              <p>Keep backups for {backupStats?.retentionDays || 30} days</p>
              <p>Auto-cleanup: Enabled</p>
            </div>
            <button className="action-btn secondary">
              ⚙️ Configure
            </button>
          </div>
        </div>

        {/* Backups List */}
        <div className="backups-container">
          <div className="container-header">
            <h3>📋 Backup History</h3>
            <div className="header-actions">
              <button className="refresh-btn" onClick={fetchBackups}>
                🔄 Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading backups...</p>
            </div>
          ) : backups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗃️</div>
              <h3>No backups found</h3>
              <p>Create your first backup to ensure data protection.</p>
              <button
                className="create-backup-btn"
                onClick={() => setShowCreateModal(true)}
              >
                📦 Create First Backup
              </button>
            </div>
          ) : (
            <div className="backups-table">
              <table>
                <thead>
                  <tr>
                    <th>Backup Details</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Size</th>
                    <th>Duration</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map((backup) => (
                    <tr key={backup._id} className={`backup-row status-${backup.status}`}>
                      <td className="backup-details">
                        <div className="backup-name">
                          <strong>{backup.name}</strong>
                          {backup.notes && <p className="backup-notes">{backup.notes}</p>}
                        </div>
                        <div className="backup-includes">
                          {backup.includes?.map((item, index) => (
                            <span key={index} className="include-tag">{item}</span>
                          ))}
                        </div>
                      </td>
                      <td className="backup-type">
                        <span className="type-badge">
                          {getBackupTypeIcon(backup.type)} {backup.type}
                        </span>
                      </td>
                      <td className="backup-status">
                        {getStatusBadge(backup.status, backup.progress)}
                        {backup.error && (
                          <p className="error-message">{backup.error}</p>
                        )}
                      </td>
                      <td className="backup-size">
                        {backup.size > 0 ? formatSize(backup.size) : 'N/A'}
                      </td>
                      <td className="backup-duration">
                        {backup.duration > 0 ? formatDuration(backup.duration) : 'N/A'}
                      </td>
                      <td className="backup-created">
                        <div className="date-info">
                          <span className="created-date">{formatDate(backup.createdAt)}</span>
                          <span className="created-by">by {backup.createdBy?.firstname} {backup.createdBy?.lastname}</span>
                        </div>
                      </td>
                      <td className="backup-actions">
                        <div className="action-buttons">
                          {backup.status === 'completed' && (
                            <>
                              <button
                                className="action-btn restore"
                                onClick={() => {
                                  setSelectedBackup(backup);
                                  setShowRestoreModal(true);
                                }}
                                disabled={restoreInProgress}
                                title="Restore from this backup"
                              >
                                🔄
                              </button>
                              <button
                                className="action-btn download"
                                onClick={() => handleDownloadBackup(backup._id, backup.name)}
                                title="Download backup"
                              >
                                📥
                              </button>
                            </>
                          )}
                          {backup.status !== 'in_progress' && (
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteBackup(backup._id)}
                              title="Delete backup"
                            >
                              🗑️
                            </button>
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

        {/* Create Backup Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Create New Backup</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowCreateModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <CreateBackupForm 
                  onSubmit={handleCreateBackup}
                  onCancel={() => setShowCreateModal(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Restore Backup Modal */}
        {showRestoreModal && selectedBackup && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Restore from Backup</h3>
                <button 
                  className="modal-close"
                  onClick={() => {
                    setShowRestoreModal(false);
                    setSelectedBackup(null);
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <RestoreBackupForm 
                  backup={selectedBackup}
                  onSubmit={(options) => handleRestoreBackup(selectedBackup._id, options)}
                  onCancel={() => {
                    setShowRestoreModal(false);
                    setSelectedBackup(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// Create Backup Form Component
const CreateBackupForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'full',
    includes: [],
    compressed: true,
    encrypted: true,
    notes: ''
  });

  const backupTypes = [
    { value: 'full', label: '🗃️ Full System Backup', description: 'Complete system backup including all data' },
    { value: 'database', label: '🗄️ Database Only', description: 'Database backup only' },
    { value: 'files', label: '📁 Files Only', description: 'User files and uploads only' },
    { value: 'system', label: '⚙️ System Config', description: 'System configuration and settings only' }
  ];

  const includeOptions = [
    { value: 'database', label: 'Database' },
    { value: 'user_uploads', label: 'User Uploads' },
    { value: 'system_config', label: 'System Configuration' },
    { value: 'logs', label: 'System Logs' },
    { value: 'certificates', label: 'SSL Certificates' },
    { value: 'cache', label: 'Cache Files' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a backup name');
      return;
    }
    onSubmit(formData);
  };

  const handleIncludeChange = (value, checked) => {
    setFormData(prev => ({
      ...prev,
      includes: checked 
        ? [...prev.includes, value]
        : prev.includes.filter(item => item !== value)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="create-backup-form">
      <div className="form-group">
        <label>Backup Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Enter backup name..."
          required
        />
      </div>

      <div className="form-group">
        <label>Backup Type</label>
        <div className="backup-types">
          {backupTypes.map(type => (
            <div 
              key={type.value}
              className={`backup-type-option ${formData.type === type.value ? 'selected' : ''}`}
              onClick={() => setFormData({...formData, type: type.value})}
            >
              <div className="type-header">
                <input
                  type="radio"
                  name="backupType"
                  value={type.value}
                  checked={formData.type === type.value}
                  onChange={() => {}}
                />
                <span className="type-label">{type.label}</span>
              </div>
              <p className="type-description">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      {formData.type === 'full' && (
        <div className="form-group">
          <label>Include Components</label>
          <div className="include-options">
            {includeOptions.map(option => (
              <label key={option.value} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.includes.includes(option.value)}
                  onChange={(e) => handleIncludeChange(option.value, e.target.checked)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Options</label>
        <div className="backup-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.compressed}
              onChange={(e) => setFormData({...formData, compressed: e.target.checked})}
            />
            Compress backup (recommended)
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.encrypted}
              onChange={(e) => setFormData({...formData, encrypted: e.target.checked})}
            />
            Encrypt backup (recommended)
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Notes (Optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Add notes about this backup..."
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn secondary">
          Cancel
        </button>
        <button type="submit" className="btn primary">
          📦 Create Backup
        </button>
      </div>
    </form>
  );
};

// Restore Backup Form Component
const RestoreBackupForm = ({ backup, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    restoreType: 'full',
    confirmRestore: false,
    createBackupBefore: true,
    restoreLocation: 'current',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.confirmRestore) {
      alert('Please confirm that you want to restore from this backup');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="restore-backup-form">
      <div className="backup-info">
        <h4>Backup Information</h4>
        <div className="info-grid">
          <div><strong>Name:</strong> {backup.name}</div>
          <div><strong>Type:</strong> {backup.type}</div>
          <div><strong>Size:</strong> {backup.size ? `${backup.size.toFixed(1)} MB` : 'N/A'}</div>
          <div><strong>Created:</strong> {new Date(backup.createdAt).toLocaleString()}</div>
        </div>
      </div>

      <div className="form-group">
        <label>Restore Options</label>
        <div className="restore-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.createBackupBefore}
              onChange={(e) => setFormData({...formData, createBackupBefore: e.target.checked})}
            />
            Create current system backup before restore (recommended)
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Notes (Optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Add notes about this restore..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label className="checkbox-label confirm-checkbox">
          <input
            type="checkbox"
            checked={formData.confirmRestore}
            onChange={(e) => setFormData({...formData, confirmRestore: e.target.checked})}
            required
          />
          <strong>I understand that this will restore the system to the backup state and may overwrite current data</strong>
        </label>
      </div>

      <div className="warning-message">
        ⚠️ <strong>Warning:</strong> This action will restore your system to the state when this backup was created. 
        Any changes made after the backup date will be lost. Please ensure you have a recent backup before proceeding.
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn secondary">
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn danger"
          disabled={!formData.confirmRestore}
        >
          🔄 Restore System
        </button>
      </div>
    </form>
  );
};

export default AdminBackup;
