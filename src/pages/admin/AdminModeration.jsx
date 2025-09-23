import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminModeration.scss';

const AdminModeration = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [moderationData, setModerationData] = useState({
    pendingGigs: [],
    pendingReviews: [],
    flaggedProfiles: [],
    reportedContent: []
  });
  const [moderationStats, setModerationStats] = useState(null);
  const [filters, setFilters] = useState({
    contentType: 'all',
    priority: 'all',
    timeframe: '7days'
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchModerationData();
    fetchModerationStats();
  }, [activeTab, filters]);

  const fetchModerationData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching moderation data for ${activeTab} tab`);

      // Map timeframe to period days for backend
      const period = filters.timeframe === '24hours' ? '1' : (filters.timeframe === '30days' ? '30' : '7');

      if (activeTab === 'reviews') {
        // Use filtered messages stats as proxy for review-related moderation
        try {
          const { data } = await newRequest.get(`/content-moderation/stats/filtered-messages?period=${period}`);
          const topUsers = Array.isArray(data?.topUsers) ? data.topUsers : [];
          const items = topUsers.map((u) => ({
            _id: u.userId, // treat userId as item identifier for actions
            type: 'review',
            title: `Filtered messages for ${u.username || 'User'}`,
            author: {
              _id: u.userId,
              firstname: u.username || 'User',
              lastname: '',
              name: u.username || 'User',
              img: '/img/noavatar.jpg'
            },
            rating: 'N/A',
            desc: 'Messages filtered due to content policy violations',
            reportCount: u.count || 0,
            reasons: ['Contact info filtering', 'Policy violations'],
            createdAt: new Date(),
            status: 'pending',
            isReported: true,
            reportedBy: [],
            content: `Filtered messages due to content policy violations: ${u.count || 0}`
          }));

          setModerationData((prev) => ({
            ...prev,
            pendingReviews: Array.isArray(items) ? items : []
          }));
        } catch (err) {
          console.error('Error fetching filtered messages stats:', err);
          setModerationData((prev) => ({
            ...prev,
            pendingReviews: []
          }));
        }
      } else if (activeTab === 'gigs') {
        // Use admin gigs endpoint for pending gigs moderation queue
        try {
          const response = await newRequest.get('/admin/gigs?status=pending');
          const gigsData = response.data?.gigs || response.data || [];
          const mappedGigs = Array.isArray(gigsData)
            ? gigsData.map((g) => ({
                ...g,
                type: 'gig',
                author: g.author || {
                  name: (g.userId?.firstname || g.userId?.lastname)
                    ? `${g.userId?.firstname || ''} ${g.userId?.lastname || ''}`.trim()
                    : g.userId?.username || 'Seller',
                  img: '/img/noavatar.jpg'
                },
                reportCount: g.reportCount || 0,
                reasons: Array.isArray(g.reasons) ? g.reasons : [],
                createdAt: g.createdAt || new Date(),
                content: g.desc || g.title || ''
              }))
            : [];
          setModerationData((prev) => ({
            ...prev,
            pendingGigs: mappedGigs
          }));
          if (mappedGigs.length === 0) {
            setModerationData((prev) => ({
              ...prev,
              pendingGigs: []
            }));
          }
        } catch (err) {
          console.error('Error fetching gigs:', err);
          setModerationData((prev) => ({
            ...prev,
            pendingGigs: []
          }));
        }
      } else if (activeTab === 'profiles') {
        // Use violation stats top violators as flagged profiles
        try {
          const { data } = await newRequest.get(`/content-moderation/stats/violations?period=${period}`);
          const topViolators = Array.isArray(data?.topViolators) ? data.topViolators : [];
          const profiles = topViolators.map((v) => ({
            _id: v.userId,
            type: 'profile',
            title: `Profile: ${v.username || 'User'}`,
            author: {
              _id: v.userId,
              firstname: v.username || 'User',
              lastname: '',
              name: v.username || 'User',
              img: '/img/noavatar.jpg'
            },
            reportCount: v.violationCount || 0,
            reasons: [v.highestSeverity || 'medium'],
            createdAt: v.lastViolation || new Date(),
            status: 'pending',
            email: v.email || 'N/A',
            isSeller: true,
            content: `Violations in last period: ${v.violationCount || 0}`
          }));

          setModerationData((prev) => ({
            ...prev,
            flaggedProfiles: Array.isArray(profiles) ? profiles : []
          }));
        } catch (err) {
          console.error('Error fetching violation stats:', err);
          setModerationData((prev) => ({
            ...prev,
            flaggedProfiles: []
          }));
        }
      } else {
        // Populate generic lists (pending/reported) from combined stats
        try {
          const [violationsRes, filteredRes] = await Promise.all([
            newRequest.get(`/content-moderation/stats/violations?period=${period}`),
            newRequest.get(`/content-moderation/stats/filtered-messages?period=${period}`)
          ]);

          const violators = Array.isArray(violationsRes.data?.topViolators) ? violationsRes.data.topViolators : [];
          const filteredTopUsers = Array.isArray(filteredRes.data?.topUsers) ? filteredRes.data.topUsers : [];

          const items = [
            ...violators.map((v) => ({
              _id: v.userId,
              type: 'profile',
              title: `User violations - ${v.username || 'User'}`,
              author: { name: v.username || 'User', img: '/img/noavatar.jpg' },
              reportCount: v.violationCount || 0,
              reasons: [v.highestSeverity || 'medium'],
              createdAt: v.lastViolation || new Date(),
              content: `Total violations: ${v.violationCount || 0}`,
              status: 'pending'
            })),
            ...filteredTopUsers.map((u) => ({
              _id: u.userId,
              type: 'review',
              title: `Filtered messages - ${u.username || 'User'}`,
              author: { name: u.username || 'User', img: '/img/noavatar.jpg' },
              reportCount: u.count || 0,
              reasons: ['Contact info filtering'],
              createdAt: new Date(),
              content: `Filtered messages: ${u.count || 0}`,
              status: 'pending'
            }))
          ];

          setModerationData((prev) => ({
            ...prev,
            [activeTab]: Array.isArray(items) ? items : []
          }));
        } catch (err) {
          console.error(`Error fetching combined moderation data for ${activeTab}:`, err);
          setModerationData((prev) => ({
            ...prev,
            [activeTab]: []
          }));
        }
      }
    } catch (err) {
      console.error('Error in fetchModerationData:', err);
      // Set fallback data based on active tab
      if (activeTab === 'reviews') {
        setModerationData((prev) => ({
          ...prev,
          pendingReviews: []
        }));
      } else if (activeTab === 'gigs') {
        setModerationData((prev) => ({
          ...prev,
          pendingGigs: []
        }));
      } else if (activeTab === 'profiles') {
        setModerationData((prev) => ({
          ...prev,
          flaggedProfiles: []
        }));
      } else {
        setModerationData((prev) => ({
          ...prev,
          [activeTab]: []
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchModerationStats = async () => {
    try {
      const period = filters.timeframe === '24hours' ? '1' : (filters.timeframe === '30days' ? '30' : '7');
      const [violationsRes, filteredRes] = await Promise.all([
        newRequest.get(`/content-moderation/stats/violations?period=${period}`),
        newRequest.get(`/content-moderation/stats/filtered-messages?period=${period}`)
      ]);

      const v = violationsRes.data || {};
      const f = filteredRes.data || {};

      const stats = {
        pending: (v.topViolators || []).length,
        flagged: v?.stats?.severity?.high || 0,
        approved: f?.stats?.actionBreakdown?.filter || 0,
        rejected: f?.stats?.actionBreakdown?.warn || 0,
        totalReviews: f?.stats?.totalFiltered || 0,
        pendingReviews: (f?.topUsers || []).length,
        flaggedReviews: Math.min((f?.topUsers || []).length, 5),
        totalGigs: 0,
        pendingGigs: 0,
        flaggedGigs: 0,
        totalProfiles: v?.totalUsers || 0,
        flaggedProfiles: v?.summary?.highRiskUsers || 0,
        autoModerationAccuracy: 87.5,
      };

      setModerationStats(stats);
    } catch (err) {
      console.error('Error fetching moderation stats:', err);
      setModerationStats(null);
    }
  };

  const handleModerationAction = async (itemId, action, reason = '') => {
    try {
      const currentItems = getCurrentModerationData();
      const item = currentItems.find((i) => i._id === itemId) || {};

      if (item.type === 'gig') {
        // Route gig actions to admin gig endpoints
        if (action === 'approve') {
          await newRequest.put(`/admin/gigs/${itemId}/approve`);
        } else if (action === 'reject') {
          await newRequest.put(`/admin/gigs/${itemId}/reject`, { reason });
        } else {
          await newRequest.post('/content-moderation/test', { content: `Gig moderation note: ${reason}` });
        }
      } else {
        // Default to user-scoped content moderation actions
        if (action === 'approve') {
          await newRequest.delete(`/content-moderation/users/${itemId}/violations`, { data: { reason } });
        } else if (action === 'reject') {
          await newRequest.put(`/content-moderation/users/${itemId}/filtering-level`, { level: 'strict' });
        } else if (action === 'warn') {
          await newRequest.put(`/content-moderation/users/${itemId}/filtering-level`, { level: 'standard' });
        } else {
          await newRequest.post('/content-moderation/test', { content: `Moderation note: ${reason}` });
        }
      }

      fetchModerationData();
      fetchModerationStats();
      alert(`Content ${action} successfully`);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} content`);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      alert('Please select items first');
      return;
    }

    const reason = prompt(`Reason for ${action}:`);
    if (!reason && action !== 'approve') return;

    try {
      // Execute per-item actions since no bulk endpoint exists
      const currentItems = getCurrentModerationData();
      const tasks = selectedItems.map((id) => {
        const item = currentItems.find((i) => i._id === id) || {};
        if (item.type === 'gig') {
          if (action === 'approve') return newRequest.put(`/admin/gigs/${id}/approve`);
          if (action === 'reject' || action === 'flag') return newRequest.put(`/admin/gigs/${id}/reject`, { reason: reason || 'Bulk reject' });
          return newRequest.post('/content-moderation/test', { content: `Gig bulk moderation note: ${reason || ''}` });
        }
        if (action === 'approve') {
          return newRequest.delete(`/content-moderation/users/${id}/violations`, { data: { reason: reason || 'Bulk approve' } });
        }
        if (action === 'reject' || action === 'flag') {
          return newRequest.put(`/content-moderation/users/${id}/filtering-level`, { level: 'strict' });
        }
        if (action === 'warn') {
          return newRequest.put(`/content-moderation/users/${id}/filtering-level`, { level: 'standard' });
        }
        return Promise.resolve();
      });

      await Promise.all(tasks);

      setSelectedItems([]);
      setShowBulkActions(false);
      fetchModerationData();
      fetchModerationStats();
      alert(`Bulk ${action} completed successfully`);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to perform bulk ${action}`);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSelection = prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const getPriorityLevel = (item) => {
    // Determine priority based on content type and flags
    if (item.reportCount > 10) return 'critical';
    if (item.reportCount > 5) return 'high';
    if (item.reportCount > 2) return 'medium';
    return 'low';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Recently';
  };


  // Get current data based on active tab
  const getCurrentModerationData = () => {
    switch (activeTab) {
      case 'reviews':
        return moderationData.pendingReviews || [];
      case 'gigs':
        return moderationData.pendingGigs || [];
      case 'profiles':
        return moderationData.flaggedProfiles || [];
      case 'reported':
        return moderationData.reportedContent || [];
      default:
        return moderationData[activeTab] || [];
    }
  };

  const handleExportModerationData = () => {
    try {
      const currentData = getCurrentModerationData();
      if (currentData.length === 0) {
        alert('No data available to export for this tab');
        return;
      }

      let csvContent = '';
      let filename = '';

      if (activeTab === 'reviews') {
        // Export reviews data
        const headers = [
          'Review ID',
          'Reviewer Name',
          'Service Title',
          'Seller Name', 
          'Rating',
          'Review Content',
          'Report Count',
          'Reasons',
          'Date Created',
          'Status'
        ];

        const rows = currentData.map(review => [
          review._id,
          `${review.author?.firstname || ''} ${review.author?.lastname || ''}`.trim() || review.author?.name || 'Unknown',
          review.gigId?.title || 'N/A',
          `${review.gigId?.userId?.firstname || ''} ${review.gigId?.userId?.lastname || ''}`.trim() || 'Unknown',
          review.rating || 'N/A',
          (review.desc || review.content || '').substring(0, 100) + '...',
          review.reportCount || 0,
          Array.isArray(review.reasons) ? review.reasons.join('; ') : (review.reasons || 'None'),
          new Date(review.createdAt).toLocaleDateString(),
          review.status || 'pending'
        ]);

        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'moderation-reviews-export';
      } else if (activeTab === 'gigs') {
        // Export gigs data  
        const headers = [
          'Gig ID',
          'Title',
          'Seller Name',
          'Category',
          'Price',
          'Report Count',
          'Reasons',
          'Date Created',
          'Status'
        ];

        const rows = currentData.map(gig => [
          gig._id,
          gig.title || 'N/A',
          `${gig.author?.firstname || ''} ${gig.author?.lastname || ''}`.trim() || gig.author?.name || 'Unknown',
          gig.cat || gig.category || 'N/A',
          gig.price || 'N/A',
          gig.reportCount || 0,
          Array.isArray(gig.reasons) ? gig.reasons.join('; ') : (gig.reasons || 'None'),
          new Date(gig.createdAt).toLocaleDateString(),
          gig.status || 'pending'
        ]);

        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'moderation-gigs-export';
      } else if (activeTab === 'profiles') {
        // Export profiles data
        const headers = [
          'Profile ID',
          'User Name',
          'Email',
          'Account Type',
          'Report Count',
          'Reasons',
          'Date Flagged',
          'Status'
        ];

        const rows = currentData.map(profile => [
          profile._id,
          `${profile.author?.firstname || ''} ${profile.author?.lastname || ''}`.trim() || profile.author?.name || 'Unknown',
          profile.email || profile.author?.email || 'N/A',
          profile.isSeller ? 'Seller' : 'Buyer',
          profile.reportCount || 0,
          Array.isArray(profile.reasons) ? profile.reasons.join('; ') : (profile.reasons || 'None'),
          new Date(profile.createdAt).toLocaleDateString(),
          profile.status || 'pending'
        ]);

        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'moderation-profiles-export';
      } else {
        // Generic export for other tabs
        const headers = [
          'Item ID',
          'Type',
          'Title',
          'Author',
          'Report Count',
          'Reasons',
          'Date Created',
          'Status'
        ];

        const rows = currentData.map(item => [
          item._id,
          item.type || 'unknown',
          item.title || 'N/A',
          item.author?.name || 'Unknown',
          item.reportCount || 0,
          Array.isArray(item.reasons) ? item.reasons.join('; ') : (item.reasons || 'None'),
          new Date(item.createdAt).toLocaleDateString(),
          item.status || 'pending'
        ]);

        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = `moderation-${activeTab}-export`;
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`✅ ${activeTab.toUpperCase()} moderation data exported successfully!\n\nFile: ${filename}-${new Date().toISOString().split('T')[0]}.csv\nRecords: ${currentData.length}\nType: ${activeTab}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export moderation data. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-moderation">
        {/* Header */}
        <div className="page-header">
          <h1>🛡️ Content Moderation</h1>
          <p>Review and moderate platform content for quality and safety</p>
        </div>

        {/* Statistics Cards */}
        <div className="moderation-stats">
          <div className="stat-card urgent">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <h3>{moderationStats?.pending || 0}</h3>
              <p>Pending Review</p>
              <div className="stat-trend">
                <span className="trend-indicator up">↑ 5</span>
                <span>since yesterday</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>{moderationStats?.flagged || 0}</h3>
              <p>High Priority</p>
              <div className="stat-trend">
                <span className="trend-indicator up">↑ 2</span>
                <span>new reports</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{moderationStats?.approved || 0}</h3>
              <p>Approved Today</p>
              <div className="stat-trend">
                <span className="trend-indicator up">↑ 12</span>
                <span>vs yesterday</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card danger">
            <div className="stat-icon">🚫</div>
            <div className="stat-content">
              <h3>{moderationStats?.rejected || 0}</h3>
              <p>Rejected Today</p>
              <div className="stat-trend">
                <span className="trend-indicator down">↓ 3</span>
                <span>improvement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="bulk-actions-bar">
            <div className="bulk-info">
              <span>{selectedItems.length} item(s) selected</span>
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
                className="bulk-btn flag"
                onClick={() => handleBulkAction('flag')}
              >
                🚩 Flag for Review
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            ⏳ Pending Review ({moderationStats?.pending || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'gigs' ? 'active' : ''}`}
            onClick={() => setActiveTab('gigs')}
          >
            🎯 Gigs ({moderationStats?.pendingGigs || moderationData.pendingGigs?.length || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            ⭐ Reviews ({moderationStats?.pendingReviews || moderationData.pendingReviews?.length || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'profiles' ? 'active' : ''}`}
            onClick={() => setActiveTab('profiles')}
          >
            👤 Profiles ({moderationStats?.flaggedProfiles || moderationData.flaggedProfiles?.length || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'reported' ? 'active' : ''}`}
            onClick={() => setActiveTab('reported')}
          >
            📢 Reported Content ({moderationData.reportedContent?.length || 0})
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <select
              value={filters.contentType}
              onChange={(e) => setFilters({...filters, contentType: e.target.value})}
            >
              <option value="all">All Content Types</option>
              <option value="gigs">Gigs</option>
              <option value="reviews">Reviews</option>
              <option value="profiles">Profiles</option>
              <option value="messages">Messages</option>
            </select>
            
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
            >
              <option value="all">All Priority Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={filters.timeframe}
              onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>

            <button className="auto-moderate-btn">
              🤖 Auto-Moderate
            </button>
            
            <button 
              className="export-btn"
              onClick={handleExportModerationData}
              disabled={loading}
            >
              📥 Export Data
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading moderation queue...</p>
          </div>
        ) : (
          <div className="moderation-content">
            <div className="moderation-list">
              {getCurrentModerationData().map((item) => {
                const priority = getPriorityLevel(item);
                const isSelected = selectedItems.includes(item._id);
                
                return (
                  <div key={item._id} className={`moderation-item priority-${priority} ${isSelected ? 'selected' : ''}`}>
                    <div className="item-header">
                      <div className="item-select">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectItem(item._id)}
                        />
                      </div>
                      
                      <div className="item-type">
                        <span className={`type-badge ${item.type}`}>
                          {item.type === 'gig' && '🎯'}
                          {item.type === 'review' && '⭐'}
                          {item.type === 'profile' && '👤'}
                          {item.type} 
                        </span>
                      </div>
                      
                      <div className="priority-indicator">
                        <span className={`priority-badge ${priority}`}>
                          {priority === 'critical' && '🔴'}
                          {priority === 'high' && '🟠'}
                          {priority === 'medium' && '🟡'}
                          {priority === 'low' && '🟢'}
                          {priority} priority
                        </span>
                      </div>
                    </div>

                    <div className="item-content">
                      <div className="content-info">
                        <h4>{item.title}</h4>
                        <div className="author-info">
                          <img 
                            src={item.author.img} 
                            alt="Author"
                            className="author-avatar"
                          />
                          <span className="author-name">{item.author.name}</span>
                          <span className="report-time">{getTimeAgo(item.createdAt)}</span>
                        </div>
                      </div>

                      <div className="report-details">
                        <div className="report-count">
                          <span className="count-number">{item.reportCount}</span>
                          <span className="count-label">reports</span>
                        </div>
                        
                        <div className="report-reasons">
                          <h5>Report Reasons:</h5>
                          <div className="reasons-list">
                            {item.reasons.map((reason, index) => (
                              <span key={index} className="reason-tag">{reason}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="content-preview">
                        <h5>Content Preview:</h5>
                        <div className="preview-text">
                          {item.content.substring(0, 150)}
                          {item.content.length > 150 && '...'}
                        </div>
                      </div>
                    </div>

                    <div className="item-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => {/* View full content */}}
                      >
                        👁️ View Full
                      </button>
                      
                      <button 
                        className="action-btn approve"
                        onClick={() => handleModerationAction(item._id, 'approve')}
                      >
                        ✅ Approve
                      </button>
                      
                      <button 
                        className="action-btn reject"
                        onClick={() => {
                          const reason = prompt('Reason for rejection:');
                          if (reason) {
                            handleModerationAction(item._id, 'reject', reason);
                          }
                        }}
                      >
                        ❌ Reject
                      </button>
                      
                      <button 
                        className="action-btn edit"
                        onClick={() => {/* Open edit modal */}}
                      >
                        ✏️ Edit
                      </button>
                      
                      <button 
                        className="action-btn warn"
                        onClick={() => {
                          const warning = prompt('Warning message to user:');
                          if (warning) {
                            handleModerationAction(item._id, 'warn', warning);
                          }
                        }}
                      >
                        ⚠️ Warn User
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {getCurrentModerationData().length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🛡️</div>
                <h3>No content pending moderation</h3>
                <p>All content has been reviewed. Great job!</p>
              </div>
            )}
          </div>
        )}

        {/* Moderation Guidelines */}
        <div className="moderation-guidelines">
          <h3>📋 Moderation Guidelines</h3>
          <div className="guidelines-grid">
            <div className="guideline-card">
              <h4>🎯 Gig Content</h4>
              <ul>
                <li>Check for accurate service descriptions</li>
                <li>Verify pricing is reasonable</li>
                <li>Ensure delivery times are realistic</li>
                <li>Look for inappropriate imagery</li>
              </ul>
            </div>
            
            <div className="guideline-card">
              <h4>⭐ Reviews</h4>
              <ul>
                <li>Identify fake or paid reviews</li>
                <li>Check for inappropriate language</li>
                <li>Verify review authenticity</li>
                <li>Ensure relevance to service</li>
              </ul>
            </div>
            
            <div className="guideline-card">
              <h4>👤 Profiles</h4>
              <ul>
                <li>Verify profile information accuracy</li>
                <li>Check for appropriate profile images</li>
                <li>Review skill claims and credentials</li>
                <li>Ensure compliance with policies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminModeration;

