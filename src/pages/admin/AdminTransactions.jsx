import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminTransactions.scss';

const AdminTransactions = () => {
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Determine activeTab based on current route
  const getActiveTabFromRoute = () => {
    const path = location.pathname;
    if (path.includes('/withdrawals')) return 'withdrawals';
    if (path.includes('/revenue')) return 'revenue';
    return 'transactions';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromRoute());
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: '30days',
    search: ''
  });
  const [revenueStats, setRevenueStats] = useState(null);

  // Update activeTab when route changes
  useEffect(() => {
    const newTab = getActiveTabFromRoute();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchData();
  }, [filters, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'transactions') {
        try {
          const [ordersRes, revenueRes] = await Promise.all([
            newRequest.get('/admin/orders'),
            newRequest.get('/admin/reports/revenue')
          ]);
          setTransactions(ordersRes.data.orders || []);
          setRevenueStats(revenueRes.data);
        } catch (err) {
          console.error('Error fetching transactions:', err);
          setTransactions([]);
          setRevenueStats(null);
        }
      } else if (activeTab === 'withdrawals') {
        try {
          const withdrawalsRes = await newRequest.get('/admin/withdrawals');
          setWithdrawals(withdrawalsRes.data.withdrawals || []);
        } catch (err) {
          console.error('Error fetching withdrawals:', err);
          setWithdrawals([]);
        }
      } else if (activeTab === 'revenue') {
        try {
          const revenueRes = await newRequest.get('/admin/reports/revenue');
          setRevenueStats(revenueRes.data);
        } catch (err) {
          console.error('Error fetching revenue:', err);
          setRevenueStats(null);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      // Set fallback empties only
      if (activeTab === 'transactions') {
        setTransactions([]);
        setRevenueStats(null);
      } else if (activeTab === 'withdrawals') {
        setWithdrawals([]);
      } else if (activeTab === 'revenue') {
        setRevenueStats(null);
      }
    } finally {
      setLoading(false);
    }
  };


  const handleWithdrawalAction = async (withdrawalId, action, data = {}) => {
    try {
      await newRequest.put(`/admin/withdrawals/${withdrawalId}/status`, {
        status: action,
        ...data
      });
      fetchData(); // Refresh data
      alert(`Withdrawal ${action} successfully`);
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusBadge = (status, type = 'transaction') => {
    const statusConfig = {
      transaction: {
        'completed': { class: 'success', text: 'Completed' },
        'pending': { class: 'warning', text: 'Pending' },
        'in progress': { class: 'info', text: 'In Progress' },
        'cancelled': { class: 'danger', text: 'Cancelled' },
        'disputed': { class: 'danger', text: 'Disputed' }
      },
      withdrawal: {
        'pending': { class: 'warning', text: 'Pending' },
        'processing': { class: 'info', text: 'Processing' },
        'completed': { class: 'success', text: 'Completed' },
        'failed': { class: 'danger', text: 'Failed' },
        'cancelled': { class: 'secondary', text: 'Cancelled' }
      }
    };

    const config = statusConfig[type][status] || { class: 'secondary', text: status };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const handleExportData = () => {
    try {
      let csvContent = '';
      let filename = '';
      
      if (activeTab === 'transactions') {
        // Export transactions
        const headers = [
          'Transaction ID',
          'Buyer',
          'Seller',
          'Service',
          'Amount',
          'Status',
          'Date',
          'Payment Method'
        ];
        
        const rows = transactions.map(transaction => [
          transaction._id,
          `${transaction.buyerId?.firstname || ''} ${transaction.buyerId?.lastname || ''}`,
          `${transaction.sellerId?.firstname || ''} ${transaction.sellerId?.lastname || ''}`,
          transaction.gigId?.title || 'N/A',
          transaction.price || 0,
          transaction.status || 'N/A',
          new Date(transaction.createdAt).toLocaleDateString(),
          transaction.paymentMethod || 'Card'
        ]);
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'transactions-export';
      } else if (activeTab === 'withdrawals') {
        // Export withdrawals
        const headers = [
          'Withdrawal ID',
          'User',
          'Amount',
          'Status',
          'Bank Details',
          'Date Requested',
          'Date Processed'
        ];
        
        const rows = withdrawals.map(withdrawal => [
          withdrawal._id,
          `${withdrawal.userId?.firstname || ''} ${withdrawal.userId?.lastname || ''}`,
          withdrawal.amount || 0,
          withdrawal.status || 'pending',
          `${withdrawal.bankName || ''} - ${withdrawal.accountNumber || ''}`,
          new Date(withdrawal.createdAt).toLocaleDateString(),
          withdrawal.processedAt ? new Date(withdrawal.processedAt).toLocaleDateString() : 'N/A'
        ]);
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'withdrawals-export';
      } else if (activeTab === 'revenue') {
        // Export revenue stats
        if (!revenueStats) {
          alert('No revenue data to export');
          return;
        }
        
        const headers = ['Metric', 'Value'];
        const rows = [
          ['Total Revenue', revenueStats.totalRevenue || 0],
          ['Platform Fees', revenueStats.platformFees || 0],
          ['Net Revenue', revenueStats.netRevenue || 0],
          ['Total Transactions', revenueStats.totalTransactions || 0],
          ['Average Transaction', revenueStats.averageTransaction || 0],
          ['Growth Rate', `${revenueStats.growthRate || 0}%`]
        ];
        
        csvContent = [headers.join(','), ...rows.map(row => [row[0], `"${row[1]}"`].join(','))].join('\n');
        filename = 'revenue-export';
      }

      if (!csvContent) {
        alert('No data available to export');
        return;
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}-${filters.dateRange}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`✅ ${activeTab.toUpperCase()} data exported successfully!\n\nFile: ${filename}-${filters.dateRange}-${new Date().toISOString().split('T')[0]}.csv\nRecords: ${activeTab === 'transactions' ? transactions.length : activeTab === 'withdrawals' ? withdrawals.length : 'Stats'}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export data. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-transactions">
        {/* Header */}
        <div className="page-header">
          <h1>Transaction & Payment Management</h1>
          <p>Monitor transactions, approve withdrawals, and track revenue</p>
        </div>

        {/* Revenue Overview Cards */}
        {revenueStats && (
          <div className="revenue-cards">
            <div className="revenue-card">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <h3>{formatCurrency(revenueStats.summary?.totalRevenue || 0)}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            <div className="revenue-card">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <h3>{revenueStats.summary?.totalOrders || 0}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="revenue-card">
              <div className="card-icon">⏱️</div>
              <div className="card-content">
                <h3>{formatCurrency((revenueStats.summary?.totalRevenue || 0) * 0.05)}</h3>
                <p>Platform Fees</p>
              </div>
            </div>
            <div className="revenue-card">
              <div className="card-icon">📈</div>
              <div className="card-content">
                <h3>+12.5%</h3>
                <p>Growth Rate</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            📦 Transactions
          </button>
          <button 
            className={`tab ${activeTab === 'withdrawals' ? 'active' : ''}`}
            onClick={() => setActiveTab('withdrawals')}
          >
            💸 Withdrawals
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="search-input"
            />
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="disputed">Disputed</option>
            </select>
            
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
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

        {/* Content */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="transactions-table-container">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Buyer</th>
                      <th>Seller</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Escrow Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>
                          <Link to={`/admin/orders/${transaction._id}`} className="order-link">
                            #{transaction._id.slice(-8)}
                          </Link>
                        </td>
                        <td>
                          <div className="user-info">
                            <img 
                              src={transaction.buyerId?.img || '/img/noavatar.jpg'} 
                              alt="Buyer"
                              className="user-avatar"
                            />
                            <span>{transaction.buyerId?.firstname} {transaction.buyerId?.lastname}</span>
                          </div>
                        </td>
                        <td>
                          <div className="user-info">
                            <img 
                              src={transaction.sellerId?.img || '/img/noavatar.jpg'} 
                              alt="Seller"
                              className="user-avatar"
                            />
                            <span>{transaction.sellerId?.firstname} {transaction.sellerId?.lastname}</span>
                          </div>
                        </td>
                        <td className="amount">{formatCurrency(transaction.price)}</td>
                        <td>{getStatusBadge(transaction.status, 'transaction')}</td>
                        <td>{getStatusBadge(transaction.escrowStatus, 'transaction')}</td>
                        <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <Link 
                              to={`/admin/orders/${transaction._id}`}
                              className="action-btn view"
                            >
                              👁️
                            </Link>
                            {transaction.status === 'disputed' && (
                              <button 
                                className="action-btn resolve"
                                onClick={() => {/* Handle dispute resolution */}}
                              >
                                ⚖️
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

            {/* Withdrawals Tab */}
            {activeTab === 'withdrawals' && (
              <div className="withdrawals-section">
                <div className="withdrawals-stats">
                  <div className="stat-card">
                    <h3>{withdrawals.filter(w => w.status === 'pending').length}</h3>
                    <p>Pending Withdrawals</p>
                  </div>
                  <div className="stat-card">
                    <h3>{formatCurrency(
                      withdrawals
                        .filter(w => w.status === 'pending')
                        .reduce((sum, w) => sum + w.amount, 0)
                    )}</h3>
                    <p>Pending Amount</p>
                  </div>
                  <div className="stat-card">
                    <h3>{withdrawals.filter(w => w.status === 'completed').length}</h3>
                    <p>Completed Today</p>
                  </div>
                </div>

                <div className="withdrawals-table-container">
                  <table className="withdrawals-table">
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Freelancer</th>
                        <th>Amount</th>
                        <th>Net Amount</th>
                        <th>Bank Details</th>
                        <th>Status</th>
                        <th>Requested</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal._id}>
                          <td className="reference">{withdrawal.transactionReference}</td>
                          <td>
                            <div className="user-info">
                              <img 
                                src={withdrawal.freelancerId?.img || '/img/noavatar.jpg'} 
                                alt="Freelancer"
                                className="user-avatar"
                              />
                              <div>
                                <span className="name">
                                  {withdrawal.freelancerId?.firstname} {withdrawal.freelancerId?.lastname}
                                </span>
                                <span className="email">{withdrawal.freelancerId?.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="amount">{formatCurrency(withdrawal.amount)}</td>
                          <td className="net-amount">{formatCurrency(withdrawal.netAmount)}</td>
                          <td>
                            <div className="bank-details">
                              <div>{withdrawal.bankDetails?.bankName}</div>
                              <div>{withdrawal.bankDetails?.accountNumber}</div>
                              <div>{withdrawal.bankDetails?.accountName}</div>
                            </div>
                          </td>
                          <td>{getStatusBadge(withdrawal.status, 'withdrawal')}</td>
                          <td>{new Date(withdrawal.requestedAt).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              {withdrawal.status === 'pending' && (
                                <>
                                  <button 
                                    className="action-btn approve"
                                    onClick={() => handleWithdrawalAction(withdrawal._id, 'completed')}
                                  >
                                    ✅ Approve
                                  </button>
                                  <button 
                                    className="action-btn reject"
                                    onClick={() => {
                                      const reason = prompt('Reason for rejection:');
                                      if (reason) {
                                        handleWithdrawalAction(withdrawal._id, 'failed', { failureReason: reason });
                                      }
                                    }}
                                  >
                                    ❌ Reject
                                  </button>
                                </>
                              )}
                              <button className="action-btn view">👁️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="analytics-section">
                <div className="analytics-grid">
                  <div className="chart-container">
                    <h3>Revenue Trends</h3>
                    <div className="chart-placeholder">
                      <p>Revenue chart will be displayed here</p>
                      <div className="mock-chart">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                          <div key={i} className="chart-bar" style={{height: `${Math.random() * 100}%`}}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="analytics-summary">
                    <h3>Transaction Summary</h3>
                    <div className="summary-stats">
                      <div className="summary-item">
                        <span className="label">Average Order Value</span>
                        <span className="value">{formatCurrency(25000)}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Conversion Rate</span>
                        <span className="value">23.5%</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Dispute Rate</span>
                        <span className="value">2.1%</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Refund Rate</span>
                        <span className="value">1.8%</span>
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

export default AdminTransactions;

