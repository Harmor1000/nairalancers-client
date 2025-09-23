import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminUsers.scss';

const AdminUsers = () => {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    role: searchParams.get('role') || 'all',
    status: searchParams.get('status') || 'all',
    verification: searchParams.get('verification') || 'all',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Update filters when URL parameters change
  useEffect(() => {
    const newFilters = {
      search: searchParams.get('search') || '',
      role: searchParams.get('role') || 'all',
      status: searchParams.get('status') || 'all',
      verification: searchParams.get('verification') || 'all',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      page: parseInt(searchParams.get('page')) || 1,
      limit: 20
    };
    setFilters(newFilters);
  }, [searchParams]);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    } else {
      fetchUsers();
    }
  }, [filters, userId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await newRequest.get(`/admin/users?${params}`);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await newRequest.get(`/admin/users/${userId}`);
      setUserDetails(response.data);
    } catch (err) {
      console.error('Error fetching user details:', err);
      // If user details fetch fails, redirect to users list
      window.history.pushState({}, '', '/admin/users');
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== '' && !(k === 'page' && v === 1)) {
        newParams.set(k, v);
      }
    });
    setSearchParams(newParams);
  };

  const handleUserAction = async (userId, action, data = {}) => {
    try {
      // Validate input before sending request
      if (action === 'suspend' && (!data.reason || data.reason.trim().length < 5)) {
        alert('Suspension reason must be at least 5 characters long');
        return;
      }
      
      if (action === 'delete' && (!data.reason || data.reason.trim().length < 10)) {
        alert('Deletion reason must be at least 10 characters long');
        return;
      }
      
      let response;
      switch (action) {
        case 'suspend':
          response = await newRequest.post(`/admin/users/${userId}/suspend`, data);
          break;
        case 'unsuspend':
          response = await newRequest.post(`/admin/users/${userId}/unsuspend`);
          break;
        case 'delete':
          response = await newRequest.delete(`/admin/users/${userId}`, { data });
          break;
        default:
          return;
      }
      
      // Refresh users list
      fetchUsers();
      
      // Show success message with details
      const successMsg = response.data.message;
      alert(`✅ ${successMsg}\n\nAction: ${action.toUpperCase()}\nUser ID: ${userId.slice(-8)}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      // Enhanced error handling
      const errorMsg = err.response?.data?.message || 'Action failed';
      const statusCode = err.response?.status || 'Unknown';
      
      console.error('Admin action error:', {
        action,
        userId,
        data,
        error: errorMsg,
        statusCode
      });
      
      alert(`❌ Error ${statusCode}: ${errorMsg}\n\nAction: ${action.toUpperCase()}\nPlease check the console for more details.`);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserStatusBadge = (user) => {
    if (user.isBlacklisted) {
      return <span className="status-badge suspended">Suspended</span>;
    }
    if (user.fraudFlags > 0) {
      return <span className="status-badge flagged">Flagged</span>;
    }
    if (user.emailVerified) {
      return <span className="status-badge verified">Verified</span>;
    }
    return <span className="status-badge unverified">Unverified</span>;
  };

  // If viewing user details
  if (userId && userDetails) {
    return (
      <AdminLayout>
        <div className="admin-user-details">
          <div className="page-header">
            <div className="header-left">
              <Link to="/admin/users" className="back-btn">
                ← Back to Users
              </Link>
              <h1>User Details</h1>
            </div>
          </div>

          <div className="user-details-content">
            <div className="user-profile-card">
              <div className="profile-header">
                <img 
                  src={userDetails.user?.img || '/img/noavatar.jpg'} 
                  alt="User Avatar"
                  className="profile-avatar"
                />
                <div className="profile-info">
                  <h2>{userDetails.user?.firstname} {userDetails.user?.lastname}</h2>
                  <p className="username">@{userDetails.user?.username}</p>
                  <p className="email">{userDetails.user?.email}</p>
                  <span className={`role-badge ${userDetails.user?.isAdmin ? 'admin' : userDetails.user?.isSeller ? 'seller' : 'buyer'}`}>
                    {userDetails.user?.isAdmin ? 'Admin' : userDetails.user?.isSeller ? 'Seller' : 'Buyer'}
                  </span>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{userDetails.stats?.totalOrders || 0}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{userDetails.user?.trustScore || 0}/100</span>
                  <span className="stat-label">Trust Score</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">₦{userDetails.stats?.totalEarnings?.toLocaleString() || 0}</span>
                  <span className="stat-label">Total Earnings</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{userDetails.stats?.totalGigs || 0}</span>
                  <span className="stat-label">Active Gigs</span>
                </div>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-section">
                <h3>Recent Gigs</h3>
                <div className="gigs-list">
                  {userDetails.gigs?.slice(0, 5).map(gig => (
                    <div key={gig._id} className="gig-item">
                      <img src={gig.cover || '/img/no-image.jpg'} alt="Gig" />
                      <div className="gig-info">
                        <h4>{gig.title}</h4>
                        <span className="gig-price">₦{gig.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Recent Orders</h3>
                <div className="orders-list">
                  {userDetails.orders?.slice(0, 5).map(order => (
                    <div key={order._id} className="order-item">
                      <div className="order-info">
                        <h4>#{order._id.slice(-8)}</h4>
                        <span className="order-status">{order.status}</span>
                        <span className="order-price">₦{order.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="user-actions">
              <button 
                className="action-btn suspend"
                onClick={() => {
                  const reason = prompt('Reason for suspension:');
                  if (reason) {
                    handleUserAction(userId, 'suspend', { reason });
                  }
                }}
              >
                🚫 Suspend User
              </button>
              <button 
                className="action-btn delete"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this user?')) {
                    const reason = prompt('Reason for deletion:');
                    if (reason) {
                      handleUserAction(userId, 'delete', { reason });
                    }
                  }
                }}
              >
                🗑️ Delete User
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-users">
        {/* Page Header */}
        <div className="page-header">
          <h1>User Management</h1>
          <p>Manage all users on your platform</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
            
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="seller">Sellers</option>
              <option value="buyer">Buyers</option>
              <option value="admin">Admins</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="flagged">Flagged</option>
            </select>
            
            <select
              value={filters.verification}
              onChange={(e) => handleFilterChange('verification', e.target.value)}
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="firstname-asc">Name A-Z</option>
              <option value="firstname-desc">Name Z-A</option>
              <option value="trustScore-desc">Highest Trust Score</option>
              <option value="trustScore-asc">Lowest Trust Score</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(users.map(u => u._id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Trust Score</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user._id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                          }
                        }}
                      />
                    </td>
                    <td>
                      <div className="user-info">
                        <img
                          src={user.img || '/img/noavatar.jpg'}
                          alt={user.username}
                          className="user-avatar"
                        />
                        <div>
                          <Link
                            to={`/admin/users/${user._id}`}
                            className="user-name"
                          >
                            {user.firstname} {user.lastname}
                          </Link>
                          <span className="username">@{user.username}</span>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.isAdmin ? 'admin' : user.isSeller ? 'seller' : 'buyer'}`}>
                        {user.isAdmin ? 'Admin' : user.isSeller ? 'Seller' : 'Buyer'}
                      </span>
                    </td>
                    <td>{getUserStatusBadge(user)}</td>
                    <td>
                      <div className="trust-score">
                        <span className={`score ${user.trustScore >= 80 ? 'high' : user.trustScore >= 50 ? 'medium' : 'low'}`}>
                          {user.trustScore}/100
                        </span>
                      </div>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/admin/users/${user._id}`}
                          className="action-btn view"
                          title="View Details"
                        >
                          👁️
                        </Link>
                        
                        {!user.isBlacklisted ? (
                          <button
                            className="action-btn suspend"
                            title="Suspend User"
                            onClick={() => {
                              const reason = prompt('Reason for suspension (minimum 5 characters):');
                              if (reason && reason.trim().length >= 5) {
                                const durationStr = prompt('Suspension duration in days (leave empty for permanent):');
                                const duration = durationStr ? parseInt(durationStr) : null;
                                
                                if (durationStr && (isNaN(duration) || duration < 1 || duration > 365)) {
                                  alert('Duration must be between 1 and 365 days');
                                  return;
                                }
                                
                                handleUserAction(user._id, 'suspend', { reason: reason.trim(), duration });
                              } else if (reason !== null) {
                                alert('Suspension reason must be at least 5 characters long');
                              }
                            }}
                          >
                            🚫
                          </button>
                        ) : (
                          <button
                            className="action-btn unsuspend"
                            title="Unsuspend User"
                            onClick={() => handleUserAction(user._id, 'unsuspend')}
                          >
                            ✅
                          </button>
                        )}
                        
                        <button
                          className="action-btn delete"
                          title="Delete User"
                          onClick={() => {
                            if (window.confirm(`⚠️ WARNING: Delete ${user.firstname} ${user.lastname}?\n\nThis action cannot be undone. The user account will be permanently disabled.`)) {
                              const reason = prompt('Reason for deletion (minimum 10 characters):');
                              if (reason && reason.trim().length >= 10) {
                                const force = user.lastSeen && new Date(user.lastSeen) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                                if (force) {
                                  const confirmForce = window.confirm('This user has been active within 30 days. Force deletion anyway?');
                                  if (!confirmForce) return;
                                }
                                handleUserAction(user._id, 'delete', { reason: reason.trim(), force });
                              } else if (reason !== null) {
                                alert('Deletion reason must be at least 10 characters long');
                              }
                            }
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bulk-actions">
            <p>{selectedUsers.length} users selected</p>
            <button
              className="bulk-btn suspend"
              onClick={() => {
                const reason = prompt('Reason for bulk suspension:');
                if (!reason) return;
                if (!window.confirm(`Suspend ${selectedUsers.length} users?`)) return;
                newRequest.post('/admin/bulk/suspend-users', {
                  userIds: selectedUsers,
                  reason: reason.trim(),
                })
                .then((res) => {
                  alert(res.data?.message || 'Bulk suspension completed');
                  setSelectedUsers([]);
                  fetchUsers();
                })
                .catch((err) => {
                  alert(err.response?.data || 'Failed to suspend selected users');
                });
              }}
            >
              Suspend Selected
            </button>
            <button
              className="bulk-btn delete"
              onClick={() => {
                if (!window.confirm(`Delete ${selectedUsers.length} users? This cannot be undone.`)) return;
                const reason = prompt('Reason for deletion (minimum 10 characters):');
                if (!reason || reason.trim().length < 10) {
                  alert('Deletion reason must be at least 10 characters long');
                  return;
                }
                newRequest.post('/admin/bulk/delete-users', {
                  userIds: selectedUsers,
                  reason: reason.trim(),
                })
                .then((res) => {
                  alert(res.data?.message || 'Bulk deletion completed');
                  setSelectedUsers([]);
                  fetchUsers();
                })
                .catch((err) => {
                  alert(err.response?.data || 'Failed to delete selected users');
                });
              }}
            >
              Delete Selected
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => handleFilterChange('page', filters.page - 1)}
            >
              Previous
            </button>
            
            <span className="page-info">
              Page {pagination.currentPage} of {pagination.totalPages} 
              ({pagination.totalUsers} total users)
            </span>
            
            <button
              disabled={!pagination.hasNext}
              onClick={() => handleFilterChange('page', filters.page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
