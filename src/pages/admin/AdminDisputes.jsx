import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminDisputes.scss';

const AdminDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionData, setResolutionData] = useState({
    resolution: '',
    refundAmount: 0,
    reason: '',
    notes: ''
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDisputes();
    fetchDisputeStats();
  }, [activeTab]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      console.log(`Fetching disputes for ${activeTab} status`);
      
      const response = await newRequest.get(`/admin/disputes?status=${activeTab}`);
      const disputesData = response.data?.disputes || response.data || [];
      
      if (Array.isArray(disputesData)) {
        setDisputes(disputesData);
      } else {
        setDisputes([]);
      }
    } catch (err) {
      console.error('Error fetching disputes:', err);
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisputeStats = async () => {
    try {
      const response = await newRequest.get('/admin/disputes/statistics');
      setStats(response.data || null);
    } catch (err) {
      console.error('Error fetching dispute stats:', err);
      setStats(null);
    }
  };

  const handleStartReview = async (orderId) => {
    try {
      await newRequest.post(`/admin/disputes/${orderId}/start-review`);
      fetchDisputes();
      alert('Dispute review started successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start review');
    }
  };

  const handleResolution = async () => {
    try {
      const { resolution, refundAmount, reason, notes } = resolutionData;
      
      if (!resolution || !reason) {
        alert('Please fill in all required fields');
        return;
      }

      if (resolution === 'refund') {
        await newRequest.post(`/admin/disputes/${selectedDispute._id}/resolve-refund`, {
          refundAmount: parseFloat(refundAmount),
          reason,
          notes
        });
      } else if (resolution === 'freelancer') {
        await newRequest.post(`/admin/disputes/${selectedDispute._id}/resolve-freelancer`, {
          reason,
          notes
        });
      }

      setShowResolutionModal(false);
      setSelectedDispute(null);
      setResolutionData({ resolution: '', refundAmount: 0, reason: '', notes: '' });
      fetchDisputes();
      fetchDisputeStats();
      alert('Dispute resolved successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve dispute');
    }
  };

  const openResolutionModal = (dispute) => {
    setSelectedDispute(dispute);
    setResolutionData({
      resolution: '',
      refundAmount: dispute.price || 0,
      reason: '',
      notes: ''
    });
    setShowResolutionModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { class: 'warning', text: 'Open' },
      'under_review': { class: 'info', text: 'Under Review' },
      'resolved': { class: 'success', text: 'Resolved' },
      'closed': { class: 'secondary', text: 'Closed' }
    };

    const config = statusConfig[status] || { class: 'secondary', text: status };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPriorityLevel = (dispute) => {
    const amount = dispute.orderId?.price || dispute.price || 0;
    const daysSinceCreated = Math.floor((new Date() - new Date(dispute.createdAt)) / (1000 * 60 * 60 * 24));
    
    if (amount > 100000 || daysSinceCreated > 7) return 'high';
    if (amount > 50000 || daysSinceCreated > 3) return 'medium';
    return 'low';
  };

  const handleExportDisputes = () => {
    try {
      if (disputes.length === 0) {
        alert('No disputes available to export');
        return;
      }

      const headers = [
        'Dispute ID',
        'Order ID',
        'Service Title',
        'Buyer Name',
        'Seller Name',
        'Amount',
        'Status',
        'Priority',
        'Reason',
        'Dispute Reason',
        'Created Date',
        'Last Update',
        'Resolution',
        'Refund Amount',
        'Admin Notes'
      ];

      const rows = disputes.map(dispute => [
        dispute._id,
        dispute.orderId?._id || 'N/A',
        dispute.orderId?.gigId?.title || 'N/A',
        `${dispute.orderId?.buyerId?.firstname || ''} ${dispute.orderId?.buyerId?.lastname || ''}`.trim() || 'Unknown',
        `${dispute.orderId?.sellerId?.firstname || ''} ${dispute.orderId?.sellerId?.lastname || ''}`.trim() || 'Unknown',
        dispute.orderId?.price || dispute.price || 0,
        dispute.status || 'pending',
        getPriorityLevel(dispute),
        dispute.reason || 'N/A',
        (dispute.disputeReason || '').substring(0, 100) + (dispute.disputeReason?.length > 100 ? '...' : ''),
        new Date(dispute.createdAt).toLocaleDateString(),
        dispute.lastUpdate ? new Date(dispute.lastUpdate).toLocaleDateString() : 'N/A',
        dispute.resolution || 'None',
        dispute.refundAmount || 0,
        (dispute.adminNotes || '').substring(0, 100) + (dispute.adminNotes?.length > 100 ? '...' : '')
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
      link.setAttribute('download', `disputes-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`✅ Disputes exported successfully!\n\nFile: disputes-${activeTab}-${new Date().toISOString().split('T')[0]}.csv\nRecords: ${disputes.length}\nStatus: ${activeTab.toUpperCase()}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export disputes data. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-disputes">
        {/* Header */}
        <div className="page-header">
          <h1>⚖️ Dispute Resolution Center</h1>
          <p>Manage disputes and mediate between buyers and sellers</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="dispute-stats">
            <div className="stat-card urgent">
              <div className="stat-icon">🚨</div>
              <div className="stat-content">
                <h3>{stats.pending || 0}</h3>
                <p>Pending Disputes</p>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">👁️</div>
              <div className="stat-content">
                <h3>{stats.underReview || 0}</h3>
                <p>Under Review</p>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.resolved || 0}</h3>
                <p>Resolved Today</p>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stats.resolutionRate || 0}%</h3>
                <p>Resolution Rate</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tab-navigation">
          <div className="tabs-left">
            <button 
              className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              🚨 Pending ({stats?.pendingDisputes || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              👁️ Active ({stats?.activeDisputes || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'resolved' ? 'active' : ''}`}
              onClick={() => setActiveTab('resolved')}
            >
              ✅ Resolved ({stats?.resolvedDisputes || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              📋 All Disputes ({stats?.totalDisputes || 0})
            </button>
          </div>
          
          <div className="tabs-right">
            <button 
              className="export-btn"
              onClick={handleExportDisputes}
              disabled={loading || disputes.length === 0}
            >
              📥 Export Data
            </button>
          </div>
        </div>

        {/* Disputes List */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading disputes...</p>
          </div>
        ) : (
          <div className="disputes-container">
            {disputes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⚖️</div>
                <h3>No disputes found</h3>
                <p>No disputes match the current filter criteria.</p>
              </div>
            ) : (
              <div className="disputes-grid">
                {Array.isArray(disputes) && disputes.map((dispute) => (
                  <div key={dispute._id} className={`dispute-card priority-${getPriorityLevel(dispute)}`}>
                    <div className="dispute-header">
                      <div className="dispute-id">
                        <span className="label">Dispute ID:</span>
                        <span className="value">#{dispute._id.slice(-8)}</span>
                      </div>
                      <div className="dispute-priority">
                        <span className={`priority-badge ${getPriorityLevel(dispute)}`}>
                          {getPriorityLevel(dispute)} priority
                        </span>
                      </div>
                    </div>

                    <div className="dispute-details">
                      <div className="order-info">
                        <h4>{dispute.title}</h4>
                        <div className="order-meta">
                          <span>Order #{dispute.orderId?.slice(-8)}</span>
                          <span>•</span>
                          <span>{formatCurrency(dispute.price)}</span>
                        </div>
                      </div>

                      <div className="parties">
                        <div className="party buyer">
                          <div className="party-label">Buyer</div>
                          <div className="party-info">
                            <img 
                              src={dispute.buyerId?.img || '/img/noavatar.jpg'} 
                              alt="Buyer"
                              className="party-avatar"
                            />
                            <span>{dispute.buyerId?.firstname} {dispute.buyerId?.lastname}</span>
                          </div>
                        </div>
                        
                        <div className="vs-divider">VS</div>
                        
                        <div className="party seller">
                          <div className="party-label">Seller</div>
                          <div className="party-info">
                            <img 
                              src={dispute.sellerId?.img || '/img/noavatar.jpg'} 
                              alt="Seller"
                              className="party-avatar"
                            />
                            <span>{dispute.sellerId?.firstname} {dispute.sellerId?.lastname}</span>
                          </div>
                        </div>
                      </div>

                      <div className="dispute-reason">
                        <h5>Dispute Reason:</h5>
                        <p>{dispute.disputeReason || 'No reason provided'}</p>
                      </div>

                      {dispute.disputeEvidence && Array.isArray(dispute.disputeEvidence) && dispute.disputeEvidence.length > 0 && (
                        <div className="dispute-evidence">
                          <h5>Evidence Provided:</h5>
                          <div className="evidence-list">
                            {dispute.disputeEvidence.map((evidence, index) => (
                              <div key={index} className="evidence-item">
                                <span className="evidence-type">{evidence.type}</span>
                                <span className="evidence-desc">{evidence.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="dispute-footer">
                      <div className="dispute-status">
                        {getStatusBadge(dispute.disputeStatus)}
                        <span className="created-date">
                          Created {new Date(dispute.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="dispute-actions">
                        {dispute.disputeStatus === 'open' && (
                          <button 
                            className="action-btn primary"
                            onClick={() => handleStartReview(dispute._id)}
                          >
                            👁️ Start Review
                          </button>
                        )}
                        
                        {dispute.disputeStatus === 'under_review' && (
                          <button 
                            className="action-btn success"
                            onClick={() => openResolutionModal(dispute)}
                          >
                            ⚖️ Resolve Dispute
                          </button>
                        )}
                        
                        <Link 
                          to={`/admin/orders/${dispute._id}`}
                          className="action-btn secondary"
                        >
                          📄 View Details
                        </Link>
                        
                        <button className="action-btn info">
                          💬 Chat History
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resolution Modal */}
        {showResolutionModal && selectedDispute && (
          <div className="modal-overlay">
            <div className="resolution-modal">
              <div className="modal-header">
                <h3>⚖️ Resolve Dispute</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowResolutionModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-content">
                <div className="dispute-summary">
                  <h4>{selectedDispute.title}</h4>
                  <p><strong>Amount:</strong> {formatCurrency(selectedDispute.price)}</p>
                  <p><strong>Reason:</strong> {selectedDispute.disputeReason}</p>
                </div>

                <div className="resolution-options">
                  <h5>Resolution Decision:</h5>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="resolution"
                        value="refund"
                        checked={resolutionData.resolution === 'refund'}
                        onChange={(e) => setResolutionData({...resolutionData, resolution: e.target.value})}
                      />
                      <span>💸 Refund Buyer</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="resolution"
                        value="freelancer"
                        checked={resolutionData.resolution === 'freelancer'}
                        onChange={(e) => setResolutionData({...resolutionData, resolution: e.target.value})}
                      />
                      <span>✅ Rule in Favor of Freelancer</span>
                    </label>
                  </div>
                </div>

                {resolutionData.resolution === 'refund' && (
                  <div className="refund-details">
                    <label>Refund Amount (₦)</label>
                    <input
                      type="number"
                      min="0"
                      max={selectedDispute.price}
                      value={resolutionData.refundAmount}
                      onChange={(e) => setResolutionData({...resolutionData, refundAmount: e.target.value})}
                    />
                  </div>
                )}

                <div className="resolution-reason">
                  <label>Resolution Reason *</label>
                  <textarea
                    value={resolutionData.reason}
                    onChange={(e) => setResolutionData({...resolutionData, reason: e.target.value})}
                    placeholder="Explain your resolution decision..."
                    rows="4"
                    required
                  />
                </div>

                <div className="admin-notes">
                  <label>Admin Notes (optional)</label>
                  <textarea
                    value={resolutionData.notes}
                    onChange={(e) => setResolutionData({...resolutionData, notes: e.target.value})}
                    placeholder="Additional notes for internal reference..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn secondary"
                  onClick={() => setShowResolutionModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn primary"
                  onClick={handleResolution}
                  disabled={!resolutionData.resolution || !resolutionData.reason}
                >
                  ⚖️ Resolve Dispute
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDisputes;

