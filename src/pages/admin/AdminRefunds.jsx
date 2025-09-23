import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminRefunds.scss';

const AdminRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '30days',
    minAmount: '',
    maxAmount: '',
    search: ''
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchRefunds();
    fetchRefundStats();
  }, [activeTab, filters]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      console.log(`Fetching refunds for ${activeTab} status`);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (activeTab !== 'all') queryParams.append('status', activeTab);
      if (filters.dateRange && filters.dateRange !== 'all') queryParams.append('dateRange', filters.dateRange);
      if (filters.minAmount) queryParams.append('minAmount', filters.minAmount);
      if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount);
      if (filters.search) queryParams.append('search', filters.search);
      
      const response = await newRequest.get(`/admin/refunds?${queryParams}`);
      const refundsData = response.data?.refunds || response.data || [];
      
      if (Array.isArray(refundsData)) {
        setRefunds(refundsData);
      } else {
        setRefunds([]);
      }
    } catch (err) {
      console.error('Error fetching refunds:', err);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefundStats = async () => {
    try {
      const response = await newRequest.get('/admin/refunds/statistics');
      setStats(response.data || null);
    } catch (err) {
      console.error('Error fetching refund stats:', err);
      setStats(null);
    }
  };

  const handleProcessRefund = async (refundId, action, data = {}) => {
    try {
      await newRequest.put(`/admin/refunds/${refundId}/process`, {
        action,
        ...data
      });
      
      setShowProcessModal(false);
      setSelectedRefund(null);
      fetchRefunds();
      fetchRefundStats();
      alert(`Refund ${action} successfully`);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} refund`);
    }
  };

  const handleExportRefunds = () => {
    try {
      if (refunds.length === 0) {
        alert('No refunds available to export');
        return;
      }

      const headers = [
        'Refund ID',
        'Order ID',
        'Service Title',
        'Buyer Name',
        'Buyer Email',
        'Seller Name',
        'Seller Email',
        'Refund Amount',
        'Original Amount',
        'Reason',
        'Status',
        'Priority',
        'Requested Date',
        'Processed Date',
        'Processed By',
        'Refund Method',
        'Transaction ID'
      ];

      const rows = refunds.map(refund => [
        refund._id,
        refund.orderId?._id || 'N/A',
        refund.orderId?.gigId?.title || 'N/A',
        `${refund.orderId?.buyerId?.firstname || ''} ${refund.orderId?.buyerId?.lastname || ''}`.trim() || 'Unknown',
        refund.orderId?.buyerId?.email || 'N/A',
        `${refund.orderId?.sellerId?.firstname || ''} ${refund.orderId?.sellerId?.lastname || ''}`.trim() || 'Unknown',
        refund.orderId?.sellerId?.email || 'N/A',
        refund.amount || 0,
        refund.orderId?.price || 0,
        refund.reason || 'N/A',
        refund.status || 'pending',
        refund.priority || 'medium',
        new Date(refund.requestedAt).toLocaleDateString(),
        refund.processedAt ? new Date(refund.processedAt).toLocaleDateString() : 'Not processed',
        refund.processedBy ? `${refund.processedBy.firstname} ${refund.processedBy.lastname}` : 'N/A',
        refund.refundMethod || 'original_payment',
        refund.transactionId || 'N/A'
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
      link.setAttribute('download', `refunds-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`✅ Refunds exported successfully!\n\nFile: refunds-${activeTab}-${new Date().toISOString().split('T')[0]}.csv\nRecords: ${refunds.length}\nStatus: ${activeTab.toUpperCase()}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export refunds data. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { class: 'warning', text: 'Pending Review' },
      'processing': { class: 'info', text: 'Processing' },
      'completed': { class: 'success', text: 'Completed' },
      'rejected': { class: 'danger', text: 'Rejected' }
    };

    const config = statusConfig[status] || { class: 'secondary', text: status };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'low': { class: 'info', text: 'Low', icon: '🔵' },
      'medium': { class: 'warning', text: 'Medium', icon: '🟡' },
      'high': { class: 'danger', text: 'High', icon: '🔴' },
      'critical': { class: 'critical', text: 'Critical', icon: '🚨' }
    };

    const config = priorityConfig[priority] || { class: 'info', text: priority, icon: '⚪' };
    return (
      <span className={`priority-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
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
      <div className="admin-refunds">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>💰 Refund Management</h1>
            <p>Process refund requests and manage customer disputes</p>
          </div>
          <div className="header-actions">
            <button
              className="export-btn"
              onClick={handleExportRefunds}
              disabled={loading || refunds.length === 0}
            >
              📥 Export Refunds
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="refund-stats">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>{formatCurrency(stats.totalRefundAmount)}</h3>
                <p>Total Refunded</p>
                <span className="stat-change">{stats.totalRefunds} requests</span>
              </div>
            </div>
            
            <div className="stat-card warning">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>{stats.pendingRefunds}</h3>
                <p>Pending Review</p>
                <span className="stat-change">Needs attention</span>
              </div>
            </div>
            
            <div className="stat-card info">
              <div className="stat-icon">⚙️</div>
              <div className="stat-content">
                <h3>{stats.processingRefunds}</h3>
                <p>Processing</p>
                <span className="stat-change">In progress</span>
              </div>
            </div>
            
            <div className="stat-card success">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.completedRefunds}</h3>
                <p>Completed</p>
                <span className="stat-change">{formatCurrency(stats.averageRefundAmount)} avg</span>
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
              ⏳ Pending ({stats?.pendingRefunds || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'processing' ? 'active' : ''}`}
              onClick={() => setActiveTab('processing')}
            >
              ⚙️ Processing ({stats?.processingRefunds || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              ✅ Completed ({stats?.completedRefunds || 0})
            </button>
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              📋 All Refunds ({stats?.totalRefunds || 0})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            
            <input
              type="number"
              placeholder="Min amount..."
              value={filters.minAmount}
              onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
              className="filter-input"
            />
            
            <input
              type="number"
              placeholder="Max amount..."
              value={filters.maxAmount}
              onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
              className="filter-input"
            />
            
            <input
              type="text"
              placeholder="Search refunds..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="filter-input"
            />
          </div>
        </div>

        {/* Refunds List */}
        <div className="refunds-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading refunds...</p>
            </div>
          ) : refunds.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <h3>No refunds found</h3>
              <p>No refund requests match your current filters.</p>
            </div>
          ) : (
            <div className="refunds-grid">
              {refunds.map((refund) => (
                <div key={refund._id} className={`refund-card priority-${refund.priority}`}>
                  <div className="refund-header">
                    <div className="refund-id">
                      <strong>#{refund._id.substring(0, 8)}</strong>
                      {getPriorityBadge(refund.priority)}
                    </div>
                    <div className="refund-status">
                      {getStatusBadge(refund.status)}
                    </div>
                  </div>

                  <div className="refund-service">
                    <img 
                      src={refund.orderId?.gigId?.cover || '/img/no-image.jpg'} 
                      alt="Service" 
                      className="service-image"
                    />
                    <div className="service-info">
                      <h4>{refund.orderId?.gigId?.title || 'Unknown Service'}</h4>
                      <p className="service-price">
                        Order: {formatCurrency(refund.orderId?.price || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="refund-parties">
                    <div className="party buyer">
                      <img 
                        src={refund.orderId?.buyerId?.img || '/img/noavatar.jpg'} 
                        alt="Buyer" 
                        className="party-avatar"
                      />
                      <div className="party-info">
                        <span className="party-name">
                          {refund.orderId?.buyerId?.firstname} {refund.orderId?.buyerId?.lastname}
                        </span>
                        <span className="party-role">Buyer</span>
                      </div>
                    </div>
                    <div className="vs-divider">VS</div>
                    <div className="party seller">
                      <img 
                        src={refund.orderId?.sellerId?.img || '/img/noavatar.jpg'} 
                        alt="Seller" 
                        className="party-avatar"
                      />
                      <div className="party-info">
                        <span className="party-name">
                          {refund.orderId?.sellerId?.firstname} {refund.orderId?.sellerId?.lastname}
                        </span>
                        <span className="party-role">Seller</span>
                      </div>
                    </div>
                  </div>

                  <div className="refund-details">
                    <div className="refund-amount">
                      <span className="amount-label">Refund Amount:</span>
                      <span className="amount-value">{formatCurrency(refund.amount)}</span>
                    </div>
                    <div className="refund-reason">
                      <span className="reason-label">Reason:</span>
                      <span className="reason-value">{refund.reason}</span>
                    </div>
                  </div>

                  <div className="refund-description">
                    <p>{refund.description}</p>
                  </div>

                  <div className="refund-timeline">
                    <div className="timeline-item">
                      <span className="timeline-label">Requested:</span>
                      <span className="timeline-date">{formatDate(refund.requestedAt)}</span>
                    </div>
                    {refund.processedAt && (
                      <div className="timeline-item">
                        <span className="timeline-label">Processed:</span>
                        <span className="timeline-date">{formatDate(refund.processedAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="refund-actions">
                    <button
                      className="action-btn view"
                      onClick={() => {
                        setSelectedRefund(refund);
                        setShowProcessModal(true);
                      }}
                    >
                      👁️ View Details
                    </button>
                    {refund.status === 'pending' && (
                      <>
                        <button
                          className="action-btn approve"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to approve this refund?')) {
                              handleProcessRefund(refund._id, 'approve', {
                                adminNotes: 'Refund approved after review'
                              });
                            }
                          }}
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => {
                            const reason = prompt('Reason for rejection:');
                            if (reason) {
                              handleProcessRefund(refund._id, 'reject', {
                                adminNotes: reason
                              });
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
          )}
        </div>

        {/* Process Modal */}
        {showProcessModal && selectedRefund && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Refund Details - #{selectedRefund._id.substring(0, 8)}</h3>
                <button 
                  className="modal-close"
                  onClick={() => {
                    setShowProcessModal(false);
                    setSelectedRefund(null);
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <div className="detail-section">
                  <h4>Refund Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">{formatCurrency(selectedRefund.amount)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Reason:</span>
                      <span className="detail-value">{selectedRefund.reason}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">{getStatusBadge(selectedRefund.status)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Priority:</span>
                      <span className="detail-value">{getPriorityBadge(selectedRefund.priority)}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Buyer Evidence</h4>
                  <ul className="evidence-list">
                    {selectedRefund.buyerEvidence?.map((evidence, index) => (
                      <li key={index}>{evidence}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>Seller Response</h4>
                  <p className="seller-response">{selectedRefund.sellerResponse}</p>
                </div>

                {selectedRefund.adminNotes && (
                  <div className="detail-section">
                    <h4>Admin Notes</h4>
                    <p className="admin-notes">{selectedRefund.adminNotes}</p>
                  </div>
                )}
              </div>
              
              <div className="modal-footer">
                {selectedRefund.status === 'pending' && (
                  <>
                    <button
                      className="btn approve"
                      onClick={() => {
                        if (window.confirm('Approve this refund?')) {
                          handleProcessRefund(selectedRefund._id, 'approve');
                        }
                      }}
                    >
                      ✅ Approve Refund
                    </button>
                    <button
                      className="btn reject"
                      onClick={() => {
                        const reason = prompt('Reason for rejection:');
                        if (reason) {
                          handleProcessRefund(selectedRefund._id, 'reject', { adminNotes: reason });
                        }
                      }}
                    >
                      ❌ Reject Refund
                    </button>
                  </>
                )}
                <button
                  className="btn secondary"
                  onClick={() => {
                    setShowProcessModal(false);
                    setSelectedRefund(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRefunds;
