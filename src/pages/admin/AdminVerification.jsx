import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminVerification.scss';

const AdminVerification = () => {
  const { userId } = useParams();
  const [verifications, setVerifications] = useState([]);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'pending',
    type: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    if (userId) {
      fetchVerificationDetails();
    } else {
      fetchVerifications();
    }
  }, [filters, userId]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.type && filters.type !== 'all') queryParams.append('type', filters.type);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
      console.log('Fetching verifications with params:', queryParams.toString());
      
      const response = await newRequest.get(`/admin/verification/pending${queryParams.toString() ? `?${queryParams}` : ''}`);
      console.log('Verifications response:', response.data);
      
      const verificationsData = response.data.pendingVerifications || response.data.verifications || response.data || [];
      setVerifications(Array.isArray(verificationsData) ? verificationsData : []);
    } catch (err) {
      console.error('Error fetching verifications:', err);
      // Show empty state instead of mock data
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerificationDetails = async () => {
    try {
      setLoading(true);
      const response = await newRequest.get(`/admin/verification/${userId}`);
      setVerificationDetails(response.data);
    } catch (err) {
      console.error('Error fetching verification details:', err);
      // Show error state instead of mock data
      setVerificationDetails(null);
    } finally {
      setLoading(false);
    }
  };

  

  const handleVerificationAction = async (verificationId, action, data = {}) => {
    try {
      // Map UI actions to backend payload
      let payload = {};
      switch (action) {
        case 'approve':
          payload = { status: 'approved', adminNotes: data.notes || data.adminNotes };
          break;
        case 'reject':
          payload = { status: 'rejected', rejectionReason: data.reason || data.rejectionReason, adminNotes: data.notes || data.adminNotes };
          break;
        case 'request_more':
          // Keep status pending, append admin notes message
          payload = { status: 'pending', adminNotes: data.message || data.notes || data.adminNotes };
          break;
        default:
          alert('Invalid action');
          return;
      }

      const response = await newRequest.post(`/admin/verification/${verificationId}/review`, payload);
      
      // Refresh data
      if (userId) {
        fetchVerificationDetails();
      } else {
        fetchVerifications();
      }
      
      const successMsg = response.data.message || `Verification ${action} completed successfully`;
      alert(`✅ ${successMsg}\n\nAction: ${action.toUpperCase()}\nVerification ID: ${verificationId.slice(-8)}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Failed to ${action} verification`;
      const statusCode = err.response?.status || 'Unknown';
      
      console.error('Verification action error:', {
        action,
        verificationId,
        data,
        error: errorMsg,
        statusCode
      });
      
      alert(`❌ Error ${statusCode}: ${errorMsg}\n\nAction: ${action.toUpperCase()}\nPlease check the console for more details.`);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { class: 'warning', text: 'Pending Review' },
      'approved': { class: 'success', text: 'Approved' },
      'rejected': { class: 'danger', text: 'Rejected' },
      'under_review': { class: 'info', text: 'Under Review' }
    };

    const config = statusConfig[status] || { class: 'secondary', text: status };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'high': { class: 'danger', text: '🔴 High' },
      'medium': { class: 'warning', text: '🟡 Medium' },
      'low': { class: 'success', text: '🟢 Low' }
    };

    const config = priorityConfig[priority] || { class: 'secondary', text: priority };
    return <span className={`priority-badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExportData = () => {
    try {
      const headers = [
        'Verification ID',
        'User Name',
        'Email',
        'Type',
        'Status',
        'Priority',
        'Submitted Date',
        'Documents Count'
      ];
      
      const csvContent = [
        headers.join(','),
        ...verifications.map(verification => [
          verification._id,
          `"${verification.userId?.firstname || ''} ${verification.userId?.lastname || ''}"`,
          verification.userId?.email || '',
          verification.type,
          verification.status,
          verification.priority,
          new Date(verification.submittedAt).toLocaleDateString(),
          verification.documents?.length || 0
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `verifications-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`✅ Exported ${verifications.length} verifications to CSV file successfully!`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export data. Please try again.');
    }
  };

  // Verification Details View
  if (userId && verificationDetails) {
    const verification = verificationDetails.verification;
    
    return (
      <AdminLayout>
        <div className="admin-verification-details">
          <div className="page-header">
            <button 
              onClick={() => window.history.back()}
              className="back-btn"
            >
              ← Back to Verifications
            </button>
            <h1>Verification Review</h1>
          </div>

          <div className="verification-details-content">
            <div className="verification-card">
              <div className="verification-header">
                <div className="user-info">
                  <img 
                    src={verification?.userId?.img || '/img/noavatar.jpg'}
                    alt="User"
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <h2>{verification?.userId?.firstname} {verification?.userId?.lastname}</h2>
                    <p className="email">{verification?.userId?.email}</p>
                    <p className="phone">{verification?.userId?.phone}</p>
                    <p className="address">{verification?.userId?.address}</p>
                  </div>
                </div>
                
                <div className="verification-meta">
                  {getStatusBadge(verification?.status)}
                  {getPriorityBadge(verification?.priority)}
                  <span className="type-badge">{verification?.type} Verification</span>
                </div>
              </div>

              <div className="verification-notes">
                <h3>User Notes:</h3>
                <p>{verification?.notes || 'No additional notes provided.'}</p>
              </div>

              <div className="documents-section">
                <h3>Submitted Documents:</h3>
                <div className="documents-grid">
                  {verification?.documents?.map((doc, index) => (
                    <div key={index} className="document-card">
                      <div className="document-preview">
                        <img 
                          src={doc.url || '/img/no-image.jpg'}
                          alt={doc.type}
                          onError={(e) => e.target.src = '/img/no-image.jpg'}
                        />
                      </div>
                      <div className="document-info">
                        <h4>{doc.type.replace('_', ' ').toUpperCase()}</h4>
                        <p>Uploaded: {formatDate(doc.uploadedAt)}</p>
                        <button 
                          className="view-btn"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          View Full Size
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="verification-actions">
                <div className="action-group">
                  <button 
                    className="action-btn approve"
                    onClick={() => {
                      const notes = prompt('Add approval notes (optional):');
                      handleVerificationAction(verification._id, 'approve', { notes });
                    }}
                  >
                    ✅ Approve Verification
                  </button>
                  
                  <button 
                    className="action-btn reject"
                    onClick={() => {
                      const reason = prompt('Reason for rejection (required):');
                      if (reason && reason.trim().length >= 10) {
                        handleVerificationAction(verification._id, 'reject', { reason: reason.trim() });
                      } else {
                        alert('Please provide a detailed reason (minimum 10 characters)');
                      }
                    }}
                  >
                    ❌ Reject Verification
                  </button>
                  
                  <button 
                    className="action-btn request-more"
                    onClick={() => {
                      const message = prompt('What additional documents/information do you need?');
                      if (message) {
                        handleVerificationAction(verification._id, 'request_more', { message });
                      }
                    }}
                  >
                    📋 Request More Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-verification">
        {/* Page Header */}
        <div className="page-header">
          <h1>🔍 Identity Verification</h1>
          <p>Review and approve user identity verifications</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
            />

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="pending">Pending Review</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All Status</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="identity">Identity</option>
              <option value="business">Business</option>
              <option value="skills">Skills</option>
            </select>

            <button 
              className="export-btn"
              onClick={handleExportData}
              disabled={loading}
            >
              📥 Export Report
            </button>
          </div>
        </div>

        {/* Verification Queue */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading verifications...</p>
          </div>
        ) : (
          <div className="verifications-container">
            <div className="verifications-grid">
              {verifications.map((verification) => (
                <div key={verification._id} className="verification-card">
                  <div className="card-header">
                    <div className="user-info">
                      <img 
                        src={verification.userId?.img || '/img/noavatar.jpg'}
                        alt="User"
                        className="user-avatar"
                      />
                      <div className="user-details">
                        <h3>{verification.userId?.firstname} {verification.userId?.lastname}</h3>
                        <p>{verification.userId?.email}</p>
                      </div>
                    </div>
                    {getPriorityBadge(verification.priority)}
                  </div>

                  <div className="card-body">
                    <div className="verification-meta">
                      <div className="meta-item">
                        <span className="label">Type:</span>
                        <span className="value">{verification.type}</span>
                      </div>
                      <div className="meta-item">
                        <span className="label">Status:</span>
                        {getStatusBadge(verification.status)}
                      </div>
                      <div className="meta-item">
                        <span className="label">Documents:</span>
                        <span className="value">{verification.documents?.length || 0} files</span>
                      </div>
                      <div className="meta-item">
                        <span className="label">Submitted:</span>
                        <span className="value">{formatDate(verification.submittedAt)}</span>
                      </div>
                    </div>

                    <div className="verification-notes">
                      <p>{verification.notes}</p>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button 
                      className="action-btn review"
                      onClick={() => window.open(`/admin/verification/${verification.userId._id}`, '_blank')}
                    >
                      🔍 Review Details
                    </button>
                    
                    {verification.status === 'pending' && (
                      <>
                        <button 
                          className="action-btn approve"
                          onClick={() => {
                            const notes = prompt('Add approval notes (optional):');
                            handleVerificationAction(verification._id, 'approve', { notes });
                          }}
                        >
                          ✅ Quick Approve
                        </button>
                        
                        <button 
                          className="action-btn reject"
                          onClick={() => {
                            const reason = prompt('Reason for rejection:');
                            if (reason) {
                              handleVerificationAction(verification._id, 'reject', { reason });
                            }
                          }}
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {verifications.length === 0 && !loading && (
              <div className="no-data">
                <div className="no-data-icon">🔍</div>
                <h3>No Verifications Found</h3>
                <p>There are no verification requests matching your current filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminVerification;
