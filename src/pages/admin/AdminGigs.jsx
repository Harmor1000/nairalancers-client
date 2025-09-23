import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminGigs.scss';

const AdminGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priceRange: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedGigs, setSelectedGigs] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [gigStats, setGigStats] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGig, setEditingGig] = useState(null);

  useEffect(() => {
    fetchGigs();
    fetchGigStats();
  }, [activeTab, filters]);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      
      // Build query parameters properly
      const queryParams = new URLSearchParams();
      if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
      console.log('Fetching gigs with params:', queryParams.toString());
      
      const response = await newRequest.get(`/admin/gigs${queryParams.toString() ? `?${queryParams}` : ''}`);
      console.log('Gigs response:', response.data);
      
      const gigsData = response.data.gigs || response.data || [];
      setGigs(Array.isArray(gigsData) ? gigsData : []);
    } catch (err) {
      console.error('Error fetching gigs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGigStats = async () => {
    try {
      const response = await newRequest.get('/admin/gigs/statistics');
      setGigStats(response.data);
    } catch (err) {
      console.error('Error fetching gig stats:', err);
    }
  };

  const handleGigAction = async (gigId, action, data = {}) => {
    try {
      // Validate input
      if (!gigId || !gigId.match(/^[0-9a-fA-F]{24}$/)) {
        alert('Invalid gig ID format');
        return;
      }
      
      // Get reason for actions that require it
      let reason = data.reason;
      if (['reject', 'suspend', 'delete'].includes(action) && !reason) {
        reason = prompt(`Reason for ${action}ing this gig (minimum 5 characters):`);
        if (!reason || reason.trim().length < 5) {
          alert('Please provide a reason (minimum 5 characters)');
          return;
        }
        data.reason = reason.trim();
      }
      
      let endpoint = '';
      let method = 'PUT';
      
      switch (action) {
        case 'approve':
          endpoint = `/admin/gigs/${gigId}/approve`;
          break;
        case 'reject':
          endpoint = `/admin/gigs/${gigId}/reject`;
          break;
        case 'suspend':
          endpoint = `/admin/gigs/${gigId}/suspend`;
          break;
        case 'restore':
          endpoint = `/admin/gigs/${gigId}/restore`;
          break;
        case 'delete':
          endpoint = `/admin/gigs/${gigId}`;
          method = 'DELETE';
          break;
        case 'feature':
          endpoint = `/admin/gigs/${gigId}/feature`;
          break;
        case 'update':
          endpoint = `/admin/gigs/${gigId}`;
          break;
        default:
          alert('Invalid action specified');
          return;
      }

      const requestMethod = method === 'DELETE' ? newRequest.delete : newRequest.put;
      const response = await requestMethod(endpoint, data);
      
      fetchGigs();
      fetchGigStats();
      
      // Enhanced success message
      const successMsg = response.data.message || `Gig ${action} completed successfully`;
      alert(`✅ ${successMsg}\n\nAction: ${action.toUpperCase()}\nGig ID: ${gigId.slice(-8)}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      // Enhanced error handling
      const errorMsg = err.response?.data?.message || `Failed to ${action} gig`;
      const statusCode = err.response?.status || 'Unknown';
      
      console.error('Gig action error:', {
        action,
        gigId,
        data,
        error: errorMsg,
        statusCode
      });
      
      alert(`❌ Error ${statusCode}: ${errorMsg}\n\nAction: ${action.toUpperCase()}\nPlease check the console for more details.`);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedGigs.length === 0) {
      alert('Please select gigs first');
      return;
    }

    const confirmation = window.confirm(`Are you sure you want to ${action} ${selectedGigs.length} gig(s)?`);
    if (!confirmation) return;

    try {
      const res = await newRequest.post('/admin/gigs/bulk-action', {
        gigIds: selectedGigs,
        action
      });
      
      setSelectedGigs([]);
      setShowBulkActions(false);
      fetchGigs();
      fetchGigStats();

      const updatedCount = res?.data?.updatedCount ?? res?.data?.modifiedCount;
      const requestedCount = res?.data?.requestedCount ?? selectedGigs.length;
      const skippedGigIds = res?.data?.skippedGigIds || [];
      const skippedCount = skippedGigIds.length;

      const details = [
        `Updated: ${updatedCount} of ${requestedCount}`,
        skippedCount ? `Skipped: ${skippedCount}` : null,
      ].filter(Boolean).join('\n');

      alert(`Bulk ${action} completed successfully` + (details ? `\n\n${details}` : ''));
    } catch (err) {
      alert(err.response?.data?.message || `Failed to perform bulk ${action}`);
    }
  };

  const handleSelectGig = (gigId) => {
    setSelectedGigs(prev => {
      const newSelection = prev.includes(gigId) 
        ? prev.filter(id => id !== gigId)
        : [...prev, gigId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedGigs.length === gigs.length) {
      setSelectedGigs([]);
      setShowBulkActions(false);
    } else {
      setSelectedGigs(gigs.map(g => g._id));
      setShowBulkActions(true);
    }
  };

  const openEditModal = (gig) => {
    setEditingGig({
      ...gig,
      features: gig.features || []
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      await handleGigAction(editingGig._id, 'update', {
        title: editingGig.title,
        desc: editingGig.desc,
        shortTitle: editingGig.shortTitle,
        shortDesc: editingGig.shortDesc,
        price: editingGig.price,
        deliveryTime: editingGig.deliveryTime,
        revisionNumber: editingGig.revisionNumber,
        cat: editingGig.cat,
        subcategory: editingGig.subcategory,
        features: editingGig.features
      });
      
      setShowEditModal(false);
      setEditingGig(null);
    } catch (err) {
      alert('Failed to update gig');
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
      'active': { class: 'success', text: 'Active' },
      'paused': { class: 'info', text: 'Paused' },
      'pending': { class: 'warning', text: 'Pending Approval' },
      'rejected': { class: 'danger', text: 'Rejected' },
      'suspended': { class: 'secondary', text: 'Suspended' },
      'draft': { class: 'info', text: 'Draft' }
    };

    const config = statusConfig[status] || { class: 'secondary', text: status };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPerformanceScore = (gig) => {
    const orders = gig.sales || 0;
    const rating = gig.totalStars && gig.starNumber ? gig.totalStars / gig.starNumber : 0;
    
    if (orders === 0) return { score: 0, label: 'New' };
    if (orders >= 50 && rating >= 4.5) return { score: 95, label: 'Excellent' };
    if (orders >= 20 && rating >= 4.0) return { score: 80, label: 'Very Good' };
    if (orders >= 10 && rating >= 3.5) return { score: 65, label: 'Good' };
    if (orders >= 5 && rating >= 3.0) return { score: 50, label: 'Average' };
    return { score: 30, label: 'Poor' };
  };

  const handleExportData = () => {
    try {
      // Create CSV content
      const headers = [
        'Gig ID',
        'Title',
        'Seller Name',
        'Category',
        'Price (NGN)',
        'Status',
        'Orders',
        'Rating',
        'Created Date',
        'Performance'
      ];
      
      const csvContent = [
        headers.join(','),
        ...gigs.map(gig => {
          const rating = gig.totalStars && gig.starNumber ? (gig.totalStars / gig.starNumber).toFixed(1) : '0.0';
          const performance = getPerformanceScore(gig);
          
          return [
            gig._id,
            `"${gig.title}"`,
            `"${gig.userId?.firstname || ''} ${gig.userId?.lastname || ''}"`,
            gig.cat,
            gig.price,
            gig.status || 'active',
            gig.sales || 0,
            rating,
            new Date(gig.createdAt).toLocaleDateString(),
            performance.label
          ].join(',');
        })
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `gigs-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`✅ Exported ${gigs.length} gigs to CSV file successfully!`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export data. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-gigs">
        {/* Header */}
        <div className="page-header">
          <h1>🎯 Gig Management</h1>
          <p>Manage and moderate all platform gigs</p>
        </div>

        {/* Statistics Cards */}
        {gigStats && (
          <div className="gig-stats">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>{gigStats.total || 0}</h3>
                <p>Total Gigs</p>
                <div className="stat-trend">
                  <span className="trend-indicator up">↑ 15%</span>
                  <span>this month</span>
                </div>
              </div>
            </div>
            
            <div className="stat-card warning">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>{gigStats.pending || 0}</h3>
                <p>Pending Approval</p>
                <div className="stat-trend">
                  <span className="trend-indicator up">↑ 8%</span>
                  <span>vs last week</span>
                </div>
              </div>
            </div>
            
            <div className="stat-card success">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{gigStats.active || 0}</h3>
                <p>Active Gigs</p>
                <div className="stat-trend">
                  <span className="trend-indicator up">↑ 12%</span>
                  <span>growth</span>
                </div>
              </div>
            </div>
            
            <div className="stat-card info">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{gigStats.avgRating || 0}</h3>
                <p>Average Rating</p>
                <div className="stat-trend">
                  <span className="trend-indicator up">↑ 0.2</span>
                  <span>improvement</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="bulk-actions-bar">
            <div className="bulk-info">
              <span>{selectedGigs.length} gig(s) selected</span>
            </div>
            <div className="bulk-actions">
              <button 
                className="bulk-btn approve"
                onClick={() => handleBulkAction('approve')}
              >
                ✅ Approve
              </button>
              <button 
                className="bulk-btn reject"
                onClick={() => handleBulkAction('reject')}
              >
                ❌ Reject
              </button>
              <button 
                className="bulk-btn suspend"
                onClick={() => handleBulkAction('suspend')}
              >
                🚫 Suspend
              </button>
              <button 
                className="bulk-btn delete"
                onClick={() => handleBulkAction('delete')}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            📦 All Gigs ({gigStats?.total || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            ⏳ Pending Approval ({gigStats?.pending || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            ✅ Active ({gigStats?.active || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'suspended' ? 'active' : ''}`}
            onClick={() => setActiveTab('suspended')}
          >
            🚫 Suspended ({gigStats?.suspended || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'top_performing' ? 'active' : ''}`}
            onClick={() => setActiveTab('top_performing')}
          >
            ⭐ Top Performing
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <input
              type="text"
              placeholder="Search gigs..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="search-input"
            />
            
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">All Categories</option>
              <option value="design">Design & Creative</option>
              <option value="development">Programming & Tech</option>
              <option value="writing">Writing & Translation</option>
              <option value="video">Video & Animation</option>
              <option value="music">Music & Audio</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
            
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            >
              <option value="all">All Prices</option>
              <option value="0-5000">₦0 - ₦5,000</option>
              <option value="5000-20000">₦5,000 - ₦20,000</option>
              <option value="20000-50000">₦20,000 - ₦50,000</option>
              <option value="50000+">₦50,000+</option>
            </select>

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters({...filters, sortBy, sortOrder});
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="sales-desc">Most Orders</option>
              <option value="rating-desc">Highest Rated</option>
            </select>

            <button 
              className="export-btn"
              onClick={handleExportData}
              disabled={loading}
            >
              📥 Export Data
            </button>
          </div>
        </div>

        {/* Gigs Content */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading gigs...</p>
          </div>
        ) : (
          <div className="gigs-container">
            {/* Gigs Header with Select All */}
            <div className="gigs-header">
              <label className="select-all">
                <input
                  type="checkbox"
                  checked={selectedGigs.length === gigs.length && gigs.length > 0}
                  onChange={handleSelectAll}
                />
                <span>Select All ({gigs.length})</span>
              </label>
            </div>

            {/* Gigs Grid */}
            <div className="gigs-grid">
              {gigs.map((gig) => {
                const performance = getPerformanceScore(gig);
                const isSelected = selectedGigs.includes(gig._id);
                
                return (
                  <div key={gig._id} className={`gig-card ${isSelected ? 'selected' : ''}`}>
                    <div className="gig-header">
                      <div className="gig-select">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectGig(gig._id)}
                        />
                      </div>
                      <div className="gig-status">
                        {getStatusBadge(gig.status || 'active')}
                      </div>
                    </div>

                    <div className="gig-image">
                      <img 
                        src={gig.cover || '/img/no-image.jpg'} 
                        alt={gig.title}
                        onError={(e) => e.target.src = '/img/no-image.jpg'}
                      />
                      <div className="gig-overlay">
                        <div className="overlay-actions">
                          <button 
                            className="overlay-btn"
                            onClick={() => openEditModal(gig)}
                          >
                            ✏️ Edit
                          </button>
                          <Link 
                            to={`/gig/${gig._id}`}
                            className="overlay-btn"
                            target="_blank"
                          >
                            👁️ View
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="gig-content">
                      <div className="gig-title">
                        <h4>{gig.title}</h4>
                        <span className="gig-id">#{gig._id.slice(-6)}</span>
                      </div>

                      <div className="gig-seller">
                        <img 
                          src={gig.userId?.img || '/img/noavatar.jpg'} 
                          alt="Seller"
                          className="seller-avatar"
                        />
                        <div className="seller-info">
                          <span className="seller-name">
                            {gig.userId?.firstname} {gig.userId?.lastname}
                          </span>
                          <span className="seller-level">Level {gig.userId?.level || 1}</span>
                        </div>
                      </div>

                      <div className="gig-meta">
                        <div className="meta-item">
                          <span className="meta-label">Category:</span>
                          <span className="meta-value">{gig.cat}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Price:</span>
                          <span className="meta-value price">{formatCurrency(gig.price)}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Delivery:</span>
                          <span className="meta-value">{gig.deliveryTime} days</span>
                        </div>
                      </div>

                      <div className="gig-performance">
                        <div className="performance-score">
                          <div className="score-circle" style={{
                            background: `conic-gradient(#10b981 ${performance.score * 3.6}deg, #e5e7eb 0deg)`
                          }}>
                            <span>{performance.score}</span>
                          </div>
                          <div className="score-info">
                            <span className="score-label">{performance.label}</span>
                            <span className="score-details">
                              {gig.sales || 0} orders • ⭐ {gig.totalStars && gig.starNumber ? (gig.totalStars / gig.starNumber).toFixed(1) : '0.0'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="gig-actions">
                        {gig.status === 'pending' && (
                          <>
                            <button 
                              className="action-btn approve"
                              onClick={() => handleGigAction(gig._id, 'approve')}
                            >
                              ✅ Approve
                            </button>
                            <button 
                              className="action-btn reject"
                              onClick={() => {
                                const reason = prompt('Reason for rejection:');
                                if (reason) {
                                  handleGigAction(gig._id, 'reject', { reason });
                                }
                              }}
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}
                        
                        {gig.status === 'active' && (
                          <>
                            <button 
                              className="action-btn feature"
                              onClick={() => handleGigAction(gig._id, 'feature')}
                            >
                              ⭐ Feature
                            </button>
                            <button 
                              className="action-btn suspend"
                              onClick={() => handleGigAction(gig._id, 'suspend')}
                            >
                              🚫 Suspend
                            </button>
                          </>
                        )}
                        
                        {gig.status === 'suspended' && (
                          <button 
                            className="action-btn restore"
                            onClick={() => handleGigAction(gig._id, 'restore')}
                          >
                            🔄 Restore
                          </button>
                        )}
                        
                        <button 
                          className="action-btn edit"
                          onClick={() => openEditModal(gig)}
                        >
                          ✏️ Edit
                        </button>
                        
                        <button 
                          className="action-btn delete"
                          onClick={() => {
                            const confirmation = window.confirm('Are you sure you want to delete this gig?');
                            if (confirmation) {
                              handleGigAction(gig._id, 'delete');
                            }
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {gigs.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <h3>No gigs found</h3>
                <p>No gigs match the current filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Edit Gig Modal */}
        {showEditModal && editingGig && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <div className="modal-header">
                <h3>✏️ Edit Gig</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editingGig.title}
                      onChange={(e) => setEditingGig({...editingGig, title: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Short Title</label>
                    <input
                      type="text"
                      value={editingGig.shortTitle}
                      onChange={(e) => setEditingGig({...editingGig, shortTitle: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={editingGig.cat}
                      onChange={(e) => setEditingGig({...editingGig, cat: e.target.value})}
                    >
                      <option value="design">Design & Creative</option>
                      <option value="development">Programming & Tech</option>
                      <option value="writing">Writing & Translation</option>
                      <option value="video">Video & Animation</option>
                      <option value="music">Music & Audio</option>
                      <option value="business">Business</option>
                      <option value="lifestyle">Lifestyle</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price (₦)</label>
                    <input
                      type="number"
                      min="500"
                      value={editingGig.price}
                      onChange={(e) => setEditingGig({...editingGig, price: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Delivery Time (days)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={editingGig.deliveryTime}
                      onChange={(e) => setEditingGig({...editingGig, deliveryTime: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Revisions</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={editingGig.revisionNumber}
                      onChange={(e) => setEditingGig({...editingGig, revisionNumber: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    rows="4"
                    value={editingGig.desc}
                    onChange={(e) => setEditingGig({...editingGig, desc: e.target.value})}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Short Description</label>
                  <textarea
                    rows="2"
                    value={editingGig.shortDesc}
                    onChange={(e) => setEditingGig({...editingGig, shortDesc: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn primary"
                  onClick={handleEditSave}
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGigs;

