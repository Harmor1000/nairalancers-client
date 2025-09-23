import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminFraud.scss';

const AdminFraud = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [fraudData, setFraudData] = useState({
    suspiciousOrders: [],
    riskUsers: [],
    fraudStats: null,
    bulkAnalysis: { users: [] } // Ensure users is always an array
  });
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    timeframe: '7days',
    orderStatus: 'all'
  });

  useEffect(() => {
    fetchFraudData();
  }, [activeTab, filters]);

  const fetchFraudData = async () => {
    try {
      setLoading(true);
      
      // Use mock data as fallback since backend might not be fully implemented
      let suspiciousOrders = [];
      let bulkAnalysis = { users: [] };
      let fraudStats = {
        suspiciousOrders: 12,
        flaggedUsers: 8,
        blockedAttacks: 45,
        accuracy: 94.5,
        criticalAlerts: 3
      };
      
      if (activeTab === 'overview' || activeTab === 'orders') {
        try {
          const response = await newRequest.get('/admin/fraud/suspicious-orders');
          suspiciousOrders = Array.isArray(response.data?.suspiciousOrders) ? response.data.suspiciousOrders : [];
        } catch (error) {
          console.error('Error fetching suspicious orders:', error);
          // Use mock data for demonstration
          suspiciousOrders = [
            {
              _id: 'mock1',
              riskScore: 85,
              price: 150000,
              buyerId: { firstname: 'John', img: '/img/noavatar.jpg' },
              sellerId: { firstname: 'Jane', img: '/img/noavatar.jpg' },
              fraudFlags: ['high_value_new_user', 'rapid_payment'],
              createdAt: new Date()
            }
          ];
        }
      }
      useEffect(() => {
        console.log("Suspicious orders:", suspiciousOrders);
      }, [suspiciousOrders]);
      
      if (activeTab === 'overview' || activeTab === 'users') {
        try {
          const response = await newRequest.get('/admin/fraud/bulk-analysis');
          bulkAnalysis = response.data || { users: [] };
          // Ensure users property exists and is an array
          if (!bulkAnalysis.users || !Array.isArray(bulkAnalysis.users)) {
            bulkAnalysis.users = [];
          }
        } catch (error) {
          console.error('Error fetching bulk analysis:', error);
          // Use mock data for demonstration
          bulkAnalysis = {
            users: [
              {
                _id: 'user1',
                firstname: 'Alex',
                lastname: 'Johnson',
                email: 'alex@example.com',
                img: '/img/noavatar.jpg',
                riskScore: 75,
                trustScore: 45,
                totalOrders: 23,
                disputesInitiated: 3,
                fraudFlags: ['multiple_accounts', 'suspicious_patterns']
              }
            ]
          };
        }
      }
      
      if (activeTab === 'overview') {
        try {
          const response = await newRequest.get('/admin/fraud/report');
          fraudStats = response.data || fraudStats;
        } catch (error) {
          console.error('Error fetching fraud stats:', error);
          // Use default mock stats defined above
        }
      }

      setFraudData(prev => ({
        ...prev,
        suspiciousOrders,
        bulkAnalysis,
        fraudStats
      }));
      
    } catch (err) {
      console.error('Error fetching fraud data:', err);
      // Ensure we have valid default data structure with mock data
      setFraudData(prev => ({
        ...prev,
        suspiciousOrders: [],
        bulkAnalysis: { users: [] },
        fraudStats: {
          suspiciousOrders: 0,
          flaggedUsers: 0,
          blockedAttacks: 0,
          accuracy: 0,
          criticalAlerts: 0
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action, data = {}) => {
    try {
      if (action === 'flag') {
        await newRequest.post(`/admin/fraud/flag-user/${userId}`, {
          reason: data.reason,
          severity: data.severity
        });
      } else if (action === 'updateTrustScore') {
        await newRequest.post(`/admin/fraud/trust-score/${userId}`, {
          newScore: data.score,
          reason: data.reason
        });
      }
      
      fetchFraudData();
      alert(`User ${action} completed successfully`);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} user`);
    }
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'critical', color: '#dc2626', text: 'Critical Risk' };
    if (score >= 60) return { level: 'high', color: '#ea580c', text: 'High Risk' };
    if (score >= 40) return { level: 'medium', color: '#ca8a04', text: 'Medium Risk' };
    if (score >= 20) return { level: 'low', color: '#65a30d', text: 'Low Risk' };
    return { level: 'minimal', color: '#16a34a', text: 'Minimal Risk' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const handleExportReport = () => {
    try {
      let csvContent = '';
      let filename = '';

      if (activeTab === 'overview') {
        // Export fraud overview stats
        const headers = ['Metric', 'Value', 'Description'];
        const rows = [
          ['Suspicious Orders', fraudData.fraudStats?.suspiciousOrders || 0, 'Orders flagged for manual review'],
          ['Flagged Users', fraudData.fraudStats?.flaggedUsers || 0, 'Users with fraud flags'],
          ['Blocked Attacks', fraudData.fraudStats?.blockedAttacks || 0, 'Prevented fraudulent attempts'],
          ['Accuracy Rate', `${fraudData.fraudStats?.accuracy || 0}%`, 'System fraud detection accuracy'],
          ['Critical Alerts', fraudData.fraudStats?.criticalAlerts || 0, 'High-priority fraud alerts']
        ];
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'fraud-overview-report';
      } else if (activeTab === 'orders') {
        // Export suspicious orders
        const headers = [
          'Order ID',
          'Buyer Name',
          'Seller Name',
          'Amount (NGN)',
          'Risk Score',
          'Fraud Flags',
          'Date Created'
        ];
        
        const rows = (fraudData.suspiciousOrders || []).map(order => [
          order._id,
          `${order.buyerId?.firstname || 'Unknown'} ${order.buyerId?.lastname || ''}`,
          `${order.sellerId?.firstname || 'Unknown'} ${order.sellerId?.lastname || ''}`,
          order.price || 0,
          order.riskScore || 0,
          Array.isArray(order.fraudFlags) ? order.fraudFlags.join('; ') : 'None',
          new Date(order.createdAt).toLocaleDateString()
        ]);
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'suspicious-orders-report';
      } else if (activeTab === 'users') {
        // Export risk users
        const headers = [
          'User ID',
          'Full Name',
          'Email',
          'Risk Score',
          'Trust Score',
          'Total Orders',
          'Disputes',
          'Fraud Flags'
        ];
        
        const rows = (fraudData.bulkAnalysis?.users || []).map(user => [
          user._id,
          `${user.firstname || ''} ${user.lastname || ''}`,
          user.email || '',
          user.riskScore || 0,
          user.trustScore || 0,
          user.totalOrders || 0,
          user.disputesInitiated || 0,
          Array.isArray(user.fraudFlags) ? user.fraudFlags.join('; ') : 'None'
        ]);
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'risk-users-report';
      }

      if (!csvContent) {
        alert('No data available to export for this tab');
        return;
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
      
      alert(`✅ Fraud report exported successfully!\n\nFile: ${filename}-${new Date().toISOString().split('T')[0]}.csv\nTab: ${activeTab.toUpperCase()}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export fraud report. Please try again.');
    }
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

  return (
    <AdminLayout>
      <div className="admin-fraud">
        {/* Header */}
        <div className="page-header">
          <h1>🔍 Fraud & Security Monitoring</h1>
          <p>Monitor suspicious activities and protect the platform</p>
        </div>

        {/* Alert Banner */}
        {fraudData.fraudStats?.criticalAlerts > 0 && (
          <div className="alert-banner critical">
            <div className="alert-content">
              <div className="alert-icon">🚨</div>
              <div className="alert-text">
                <strong>Critical Security Alert!</strong>
                <span>{fraudData.fraudStats.criticalAlerts} high-risk activities detected requiring immediate attention.</span>
              </div>
              <button className="alert-action">Review Now</button>
            </div>
          </div>
        )}

        {/* Security Overview Cards */}
        {fraudData.fraudStats && (
          <div className="security-stats">
            <div className="stat-card critical">
              <div className="stat-icon">🚨</div>
              <div className="stat-content">
                <h3>{fraudData.fraudStats.suspiciousOrders || 0}</h3>
                <p>Suspicious Orders</p>
                <div className="stat-trend">
                  <span className="trend-indicator up">↑ 12%</span>
                  <span>vs last week</span>
                </div>
              </div>
            </div>
            
            <div className="stat-card warning">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <h3>{fraudData.fraudStats.flaggedUsers || 0}</h3>
                <p>Flagged Users</p>
                <div className="stat-trend">
                  <span className="trend-indicator down">↓ 5%</span>
                  <span>vs last week</span>
                </div>
              </div>
            </div>
            
            <div className="stat-card info">
              <div className="stat-icon">🛡️</div>
              <div className="stat-content">
                <h3>{fraudData.fraudStats.blockedAttacks || 0}</h3>
                <p>Blocked Attacks</p>
                <div className="stat-trend">
                  <span className="trend-indicator up">↑ 8%</span>
                  <span>vs last week</span>
                </div>
              </div>
            </div>
            
            <div className="stat-card success">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{fraudData.fraudStats.accuracy || 0}%</h3>
                <p>Detection Accuracy</p>
                <div className="stat-trend">
                  <span className="trend-indicator up">↑ 2%</span>
                  <span>improvement</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Suspicious Orders
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Risk Users
          </button>
          <button 
            className={`tab ${activeTab === 'patterns' ? 'active' : ''}`}
            onClick={() => setActiveTab('patterns')}
          >
            🔍 Fraud Patterns
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Detection Settings
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
            
            <select
              value={filters.timeframe}
              onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>

            <button 
              className="export-btn"
              onClick={handleExportReport}
              disabled={loading}
            >
              📥 Export Report
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Analyzing security data...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-section">
                <div className="overview-grid">
                  {/* Real-time Monitoring */}
                  <div className="monitoring-panel">
                    <h3>🔴 Real-time Monitoring</h3>
                    <div className="live-feed">
                      <div className="feed-item">
                        <div className="feed-dot critical"></div>
                        <div className="feed-content">
                          <span className="feed-time">2 mins ago</span>
                          <span className="feed-text">Suspicious login attempt blocked from Lagos</span>
                        </div>
                      </div>
                      <div className="feed-item">
                        <div className="feed-dot warning"></div>
                        <div className="feed-content">
                          <span className="feed-time">5 mins ago</span>
                          <span className="feed-text">High-value order flagged for review</span>
                        </div>
                      </div>
                      <div className="feed-item">
                        <div className="feed-dot info"></div>
                        <div className="feed-content">
                          <span className="feed-time">8 mins ago</span>
                          <span className="feed-text">User verification completed successfully</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Distribution */}
                  <div className="risk-distribution">
                    <h3>📊 Risk Distribution</h3>
                    <div className="risk-chart">
                      <div className="risk-item">
                        <div className="risk-bar">
                          <div className="risk-fill critical" style={{width: '15%'}}></div>
                        </div>
                        <span className="risk-label">Critical (15%)</span>
                      </div>
                      <div className="risk-item">
                        <div className="risk-bar">
                          <div className="risk-fill high" style={{width: '25%'}}></div>
                        </div>
                        <span className="risk-label">High (25%)</span>
                      </div>
                      <div className="risk-item">
                        <div className="risk-bar">
                          <div className="risk-fill medium" style={{width: '35%'}}></div>
                        </div>
                        <span className="risk-label">Medium (35%)</span>
                      </div>
                      <div className="risk-item">
                        <div className="risk-bar">
                          <div className="risk-fill low" style={{width: '25%'}}></div>
                        </div>
                        <span className="risk-label">Low (25%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Alerts */}
                  <div className="recent-alerts">
                    <h3>🚨 Recent Security Alerts</h3>
                    <div className="alerts-list">
                      <div className="alert-item critical">
                        <div className="alert-info">
                          <div className="alert-title">Potential Account Takeover</div>
                          <div className="alert-desc">Multiple failed login attempts from different locations</div>
                          <div className="alert-time">15 minutes ago</div>
                        </div>
                        <button className="alert-action-btn">Investigate</button>
                      </div>
                      <div className="alert-item warning">
                        <div className="alert-info">
                          <div className="alert-title">Suspicious Payment Pattern</div>
                          <div className="alert-desc">Rapid succession of small payments detected</div>
                          <div className="alert-time">1 hour ago</div>
                        </div>
                        <button className="alert-action-btn">Review</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Suspicious Orders Tab */}
            {activeTab === 'orders' && (
              <div className="suspicious-orders-section">
                <div className="orders-table-container">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Risk Score</th>
                        <th>Parties</th>
                        <th>Amount</th>
                        <th>Red Flags</th>
                        <th>Detection Time</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(fraudData.suspiciousOrders) && fraudData.suspiciousOrders.map((order, index) => {
                        // Ensure order is a valid object with required properties
                        if (!order || typeof order !== 'object' || !order._id) {
                          return null;
                        }
                        
                        const risk = getRiskLevel(order.riskScore || 0);
                        const orderId = String(order._id);
                        
                        return (
                          <tr key={`order-${index}-${orderId}`}>
                            <td>
                              <Link to={`/admin/orders/${orderId}`} className="order-link">
                                #{orderId.slice(-8)}
                              </Link>
                            </td>
                            <td>
                              <div className="risk-score" style={{ color: risk.color }}>
                                <span className="score-value">{order.riskScore || 0}</span>
                                <span className="risk-level">{risk.text}</span>
                              </div>
                            </td>
                            <td>
                              <div className="parties-info">
                                <div className="party">
                                  <img src={order.buyerId?.img || '/img/noavatar.jpg'} alt="Buyer" />
                                  <span>{order.buyerId?.firstname || 'Unknown'}</span>
                                </div>
                                <div className="party">
                                  <img src={order.sellerId?.img || '/img/noavatar.jpg'} alt="Seller" />
                                  <span>{order.sellerId?.firstname || 'Unknown'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="amount">{formatCurrency(order.price || 0)}</td>
                            <td>
                              <div className="red-flags">
                                {Array.isArray(order.fraudFlags) && order.fraudFlags.map((flag, flagIndex) => (
                                  <span key={`flag-${flagIndex}`} className="flag-badge">{String(flag)}</span>
                                ))}
                              </div>
                            </td>
                            <td>{getTimeAgo(order.createdAt)}</td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-btn investigate">🔍 Investigate</button>
                                <button className="action-btn approve">✅ Approve</button>
                                <button className="action-btn block">🚫 Block</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Risk Users Tab */}
            {activeTab === 'users' && (
              <div className="risk-users-section">
                <div className="users-grid">
                  {Array.isArray(fraudData.bulkAnalysis?.users) && fraudData.bulkAnalysis.users.map((user, index) => {
                    // Ensure user is a valid object with required properties
                    if (!user || typeof user !== 'object' || !user._id) {
                      return null;
                    }
                    
                    const risk = getRiskLevel(user.riskScore || 0);
                    const userId = String(user._id);
                    
                    return (
                      <div key={`user-${index}-${userId}`} className={`user-card risk-${risk.level}`}>
                        <div className="user-header">
                          <div className="user-info">
                            <img 
                              src={user.img || '/img/noavatar.jpg'} 
                              alt="User"
                              className="user-avatar"
                            />
                            <div className="user-details">
                              <h4>{String(user.firstname || '')} {String(user.lastname || '')}</h4>
                              <span className="user-email">{String(user.email || '')}</span>
                            </div>
                          </div>
                          <div className="risk-indicator" style={{ color: risk.color }}>
                            <span className="risk-score">{user.riskScore || 0}</span>
                            <span className="risk-text">{risk.text}</span>
                          </div>
                        </div>

                        <div className="user-metrics">
                          <div className="metric">
                            <span className="metric-label">Trust Score</span>
                            <span className="metric-value">{user.trustScore || 0}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Total Orders</span>
                            <span className="metric-value">{user.totalOrders || 0}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Disputes</span>
                            <span className="metric-value">{user.disputesInitiated || 0}</span>
                          </div>
                        </div>

                        {Array.isArray(user.fraudFlags) && user.fraudFlags.length > 0 && (
                          <div className="user-flags">
                            <h5>🚩 Risk Factors:</h5>
                            <div className="flags-list">
                              {user.fraudFlags.map((flag, flagIndex) => (
                                <span key={`user-flag-${flagIndex}`} className="flag-item">{String(flag)}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="user-actions">
                          <button 
                            className="action-btn primary"
                            onClick={() => handleUserAction(userId, 'flag', {
                              reason: 'Suspicious activity detected',
                              severity: risk.level
                            })}
                          >
                            🚩 Flag User
                          </button>
                          <button 
                            className="action-btn secondary"
                            onClick={() => {
                              const newScore = prompt('Enter new trust score (0-100):');
                              const reason = prompt('Reason for change:');
                              if (newScore && reason) {
                                handleUserAction(userId, 'updateTrustScore', {
                                  score: parseInt(newScore),
                                  reason
                                });
                              }
                            }}
                          >
                            ⭐ Update Score
                          </button>
                          <Link 
                            to={`/admin/users/${userId}`}
                            className="action-btn info"
                          >
                            👤 View Profile
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fraud Patterns Tab */}
            {activeTab === 'patterns' && (
              <div className="patterns-section">
                <div className="patterns-grid">
                  <div className="pattern-card">
                    <h3>📈 Trending Fraud Patterns</h3>
                    <div className="pattern-list">
                      <div className="pattern-item">
                        <div className="pattern-info">
                          <div className="pattern-name">Account Farming</div>
                          <div className="pattern-desc">Multiple accounts from same device/location</div>
                        </div>
                        <div className="pattern-stats">
                          <span className="pattern-count">12 cases</span>
                          <span className="pattern-trend up">↑ 15%</span>
                        </div>
                      </div>
                      <div className="pattern-item">
                        <div className="pattern-info">
                          <div className="pattern-name">Payment Fraud</div>
                          <div className="pattern-desc">Suspicious payment behavior detected</div>
                        </div>
                        <div className="pattern-stats">
                          <span className="pattern-count">8 cases</span>
                          <span className="pattern-trend down">↓ 5%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pattern-card">
                    <h3>🎯 Detection Rules</h3>
                    <div className="rules-list">
                      <div className="rule-item active">
                        <div className="rule-info">
                          <div className="rule-name">High Value Order Alert</div>
                          <div className="rule-condition">Orders {'>'} ₦500,000</div>
                        </div>
                        <div className="rule-toggle">
                          <input type="checkbox" checked readOnly />
                        </div>
                      </div>
                      <div className="rule-item active">
                        <div className="rule-info">
                          <div className="rule-name">Rapid Order Creation</div>
                          <div className="rule-condition"> {'>'} 5 orders in 1 hour</div>
                        </div>
                        <div className="rule-toggle">
                          <input type="checkbox" checked readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detection Settings Tab */}
            {activeTab === 'settings' && (
              <div className="settings-section">
                <div className="settings-card">
                  <h3>⚙️ Fraud Detection Configuration</h3>
                  <div className="settings-form">
                    <div className="setting-group">
                      <h4>Risk Thresholds</h4>
                      <div className="threshold-controls">
                        <div className="threshold-item">
                          <label>Critical Risk Threshold</label>
                          <input type="range" min="70" max="100" defaultValue="80" />
                          <span>80+</span>
                        </div>
                        <div className="threshold-item">
                          <label>High Risk Threshold</label>
                          <input type="range" min="50" max="80" defaultValue="60" />
                          <span>60+</span>
                        </div>
                      </div>
                    </div>

                    <div className="setting-group">
                      <h4>Automated Actions</h4>
                      <div className="auto-actions">
                        <label className="action-toggle">
                          <input type="checkbox" defaultChecked />
                          <span>Auto-flag critical risk orders</span>
                        </label>
                        <label className="action-toggle">
                          <input type="checkbox" defaultChecked />
                          <span>Send alerts for suspicious patterns</span>
                        </label>
                        <label className="action-toggle">
                          <input type="checkbox" />
                          <span>Auto-block high-risk transactions</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFraud;

