import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminAnalytics.scss';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('30days');
  const [analyticsData, setAnalyticsData] = useState({
    overview: null,
    users: null,
    revenue: null,
    orders: null,
    performance: null
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe, activeTab]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching analytics data for ${activeTab} tab with ${timeframe} timeframe`);

      // Fetch data based on active tab to improve performance
      let analyticsResponse = { ...analyticsData };

      if (activeTab === 'overview' || activeTab === 'all') {
        try {
          const response = await newRequest.get(`/admin/analytics/overview?timeframe=${timeframe}`);
          analyticsResponse.overview = response.data;
          console.log('Overview data fetched:', response.data);
        } catch (err) {
          console.error('Failed to fetch overview data:', err);
          analyticsResponse.overview = null;
        }
      }

      if (activeTab === 'users' || activeTab === 'all') {
        try {
          const response = await newRequest.get(`/admin/analytics/users?timeframe=${timeframe}`);
          analyticsResponse.users = response.data;
          console.log('Users analytics fetched:', response.data);
        } catch (err) {
          console.error('Failed to fetch users data:', err);
          analyticsResponse.users = null;
        }
      }

      if (activeTab === 'revenue' || activeTab === 'all') {
        try {
          const response = await newRequest.get(`/admin/analytics/revenue?timeframe=${timeframe}`);
          analyticsResponse.revenue = response.data;
          console.log('Revenue analytics fetched:', response.data);
        } catch (err) {
          console.error('Failed to fetch revenue data:', err);
          analyticsResponse.revenue = null;
        }
      }

      if (activeTab === 'orders' || activeTab === 'all') {
        try {
          const response = await newRequest.get(`/admin/analytics/orders?timeframe=${timeframe}`);
          analyticsResponse.orders = response.data;
          console.log('Orders analytics fetched:', response.data);
        } catch (err) {
          console.error('Failed to fetch orders data:', err);
          analyticsResponse.orders = null;
        }
      }

      if (activeTab === 'performance' || activeTab === 'all') {
        try {
          const response = await newRequest.get(`/admin/analytics/performance?timeframe=${timeframe}`);
          analyticsResponse.performance = response.data;
          console.log('Performance analytics fetched:', response.data);
        } catch (err) {
          console.error('Failed to fetch performance data:', err);
          analyticsResponse.performance = null;
        }
      }

      // Leave missing tab data as null (no mock fallback)

      setAnalyticsData(analyticsResponse);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      // Keep existing data; do not populate mock data
    } finally {
      setLoading(false);
    }
  };
  

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const generateChartBars = (data, maxHeight = 100) => {
    const maxValue = Math.max(...data.map(d => d.value || d.revenue || d.orders || d.registrations));
    return data.map((item, index) => {
      const value = item.value || item.revenue || item.orders || item.registrations;
      const height = (value / maxValue) * maxHeight;
      return (
        <div key={index} className="chart-bar" style={{ height: `${height}%` }}>
          <div className="bar-value">{value}</div>
        </div>
      );
    });
  };

  const handleExportData = () => {
    try {
      let csvContent = '';
      let filename = '';
      const currentData = analyticsData[activeTab];
      
      if (!currentData) {
        alert('No data available to export for this tab');
        return;
      }

      if (activeTab === 'overview') {
        const headers = ['Metric', 'Value', 'Percentage Change'];
        const rows = [
          ['Total Revenue', formatCurrency(currentData.totalRevenue), formatPercentage(currentData.growthRate || 0)],
          ['Total Orders', currentData.totalOrders?.toLocaleString() || '0', ''],
          ['Active Users', currentData.activeUsers?.toLocaleString() || '0', ''],
          ['Conversion Rate', `${currentData.conversionRate || 0}%`, ''],
          ['Average Order Value', formatCurrency(currentData.avgOrderValue || 0), '']
        ];
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'analytics-overview';
      } else if (activeTab === 'users') {
        const headers = ['Country', 'Users', 'Percentage'];
        const rows = currentData.usersByCountry?.map(country => [
          country.country,
          country.users,
          `${country.percentage}%`
        ]) || [];
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'analytics-users';
      } else if (activeTab === 'revenue') {
        const headers = ['Category', 'Revenue', 'Percentage'];
        const rows = currentData.revenueByCategory?.map(cat => [
          cat.category,
          cat.revenue,
          `${cat.percentage}%`
        ]) || [];
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'analytics-revenue';
      } else if (activeTab === 'orders') {
        const headers = ['Status', 'Count', 'Percentage'];
        const total = Object.values(currentData.ordersByStatus || {}).reduce((sum, val) => sum + val, 0);
        const rows = Object.entries(currentData.ordersByStatus || {}).map(([status, count]) => [
          status.replace('_', ' ').toUpperCase(),
          count,
          `${((count / total) * 100).toFixed(1)}%`
        ]);
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'analytics-orders';
      } else if (activeTab === 'performance') {
        const headers = ['Seller', 'Revenue', 'Orders', 'Rating'];
        const rows = currentData.topSellersByRevenue?.map(seller => [
          seller.name,
          seller.revenue,
          seller.orders,
          seller.rating
        ]) || [];
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'analytics-performance';
      }

      if (!csvContent) {
        alert('No exportable data found for this tab');
        return;
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`✅ ${activeTab.toUpperCase()} analytics exported successfully!\n\nFile: ${filename}-${timeframe}-${new Date().toISOString().split('T')[0]}.csv\nTimeframe: ${timeframe}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export analytics data. Please try again.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-analytics">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>📊 Analytics Dashboard</h1>
            <p>Comprehensive insights and platform analytics</p>
          </div>
          
          <div className="header-controls">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="timeframe-select"
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
              📥 Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="key-metrics">
          <div className="metric-card revenue">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>{formatCurrency(analyticsData.overview?.totalRevenue || 0)}</h3>
              <p>Total Revenue</p>
              <div className="metric-change positive">
                <span>↗️ +15.8%</span>
                <span>vs last period</span>
              </div>
            </div>
          </div>
          
          <div className="metric-card orders">
            <div className="metric-icon">📦</div>
            <div className="metric-content">
              <h3>{analyticsData.overview?.totalOrders?.toLocaleString() || '0'}</h3>
              <p>Total Orders</p>
              <div className="metric-change positive">
                <span>↗️ +12.3%</span>
                <span>vs last period</span>
              </div>
            </div>
          </div>
          
          <div className="metric-card users">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h3>{analyticsData.overview?.activeUsers?.toLocaleString() || '0'}</h3>
              <p>Active Users</p>
              <div className="metric-change positive">
                <span>↗️ +8.7%</span>
                <span>vs last period</span>
              </div>
            </div>
          </div>
          
          <div className="metric-card conversion">
            <div className="metric-icon">🎯</div>
            <div className="metric-content">
              <h3>{analyticsData.overview?.conversionRate || 0}%</h3>
              <p>Conversion Rate</p>
              <div className="metric-change positive">
                <span>↗️ +0.5%</span>
                <span>improvement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button 
            className={`tab ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            💰 Revenue
          </button>
          <button 
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders
          </button>
          <button 
            className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            ⚡ Performance
          </button>
        </div>

        {/* Content */}
        <div className="analytics-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="charts-grid">
                <div className="chart-container">
                  <h3>📈 Revenue Trend</h3>
                  <div className="chart-area">
                    <div className="chart-bars">
                      {generateChartBars(analyticsData.overview?.trends?.revenue || [])}
                    </div>
                    <div className="chart-labels">
                      {analyticsData.overview?.trends?.revenue?.map((item, index) => (
                        <span key={index}>{item.date.toLocaleDateString('en', {weekday: 'short'})}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="chart-container">
                  <h3>👥 User Activity</h3>
                  <div className="chart-area">
                    <div className="chart-bars">
                      {generateChartBars(analyticsData.overview?.trends?.users || [])}
                    </div>
                    <div className="chart-labels">
                      {analyticsData.overview?.trends?.users?.map((item, index) => (
                        <span key={index}>{item.date.toLocaleDateString('en', {weekday: 'short'})}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="chart-container">
                  <h3>📦 Order Volume</h3>
                  <div className="chart-area">
                    <div className="chart-bars">
                      {generateChartBars(analyticsData.overview?.trends?.orders || [])}
                    </div>
                    <div className="chart-labels">
                      {analyticsData.overview?.trends?.orders?.map((item, index) => (
                        <span key={index}>{item.date.toLocaleDateString('en', {weekday: 'short'})}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="summary-card">
                  <h3>📋 Quick Summary</h3>
                  <div className="summary-stats">
                    <div className="summary-item">
                      <span className="label">Average Order Value</span>
                      <span className="value">{formatCurrency(analyticsData.overview?.avgOrderValue || 0)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Growth Rate</span>
                      <span className="value">{formatPercentage(analyticsData.overview?.growthRate || 0)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Platform Health</span>
                      <span className="value">98.5%</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Customer Satisfaction</span>
                      <span className="value">4.7⭐</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="users-section">
              <div className="analytics-grid">
                <div className="chart-container">
                  <h3>👥 User Registration Trend</h3>
                  <div className="chart-area">
                    <div className="line-chart">
                      {analyticsData.users?.registrationTrend?.map((item, index) => (
                        <div key={index} className="chart-point" style={{
                          left: `${(index / 29) * 100}%`,
                          bottom: `${(item.registrations / 20) * 100}%`
                        }}></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="user-breakdown">
                  <h3>🔄 User Distribution</h3>
                  <div className="breakdown-chart">
                    <div className="pie-chart">
                      <div className="pie-slice buyers" style={{transform: 'rotate(0deg)'}}>
                        <span>58%</span>
                      </div>
                      <div className="pie-slice sellers" style={{transform: 'rotate(208deg)'}}>
                        <span>30%</span>
                      </div>
                      <div className="pie-slice admins" style={{transform: 'rotate(316deg)'}}>
                        <span>12%</span>
                      </div>
                    </div>
                    <div className="pie-legend">
                      <div className="legend-item">
                        <span className="legend-color buyers"></span>
                        <span>Buyers ({analyticsData.users?.usersByType?.buyers?.toLocaleString()})</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color sellers"></span>
                        <span>Sellers ({analyticsData.users?.usersByType?.sellers?.toLocaleString()})</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color admins"></span>
                        <span>Admins ({analyticsData.users?.usersByType?.admins})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="geographic-breakdown">
                  <h3>🌍 Users by Country</h3>
                  <div className="country-list">
                    {analyticsData.users?.usersByCountry?.map((country, index) => (
                      <div key={index} className="country-item">
                        <div className="country-info">
                          <span className="country-name">{country.country}</span>
                          <span className="country-percentage">{country.percentage}%</span>
                        </div>
                        <div className="country-bar">
                          <div 
                            className="country-fill" 
                            style={{width: `${country.percentage}%`}}
                          ></div>
                        </div>
                        <span className="country-count">{country.users.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <div className="revenue-section">
              <div className="analytics-grid">
                <div className="chart-container large">
                  <h3>💰 Monthly Revenue Trend</h3>
                  <div className="chart-area">
                    <div className="chart-bars">
                      {generateChartBars(analyticsData.revenue?.monthlyRevenue || [])}
                    </div>
                    <div className="chart-labels">
                      {analyticsData.revenue?.monthlyRevenue?.map((item, index) => (
                        <span key={index}>{item.month}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="category-revenue">
                  <h3>📊 Revenue by Category</h3>
                  <div className="category-list">
                    {analyticsData.revenue?.revenueByCategory?.map((category, index) => (
                      <div key={index} className="category-item">
                        <div className="category-info">
                          <span className="category-name">{category.category}</span>
                          <span className="category-amount">{formatCurrency(category.revenue)}</span>
                        </div>
                        <div className="category-bar">
                          <div 
                            className="category-fill" 
                            style={{width: `${category.percentage}%`}}
                          ></div>
                        </div>
                        <span className="category-percentage">{category.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-section">
              <div className="analytics-grid">
                <div className="chart-container">
                  <h3>📦 Order Activity by Hour</h3>
                  <div className="chart-area">
                    <div className="chart-bars">
                      {generateChartBars(analyticsData.orders?.orderTrends || [])}
                    </div>
                    <div className="chart-labels">
                      {analyticsData.orders?.orderTrends?.map((item, index) => (
                        <span key={index}>{item.hour}:00</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="order-status-breakdown">
                  <h3>📋 Order Status Distribution</h3>
                  <div className="status-chart">
                    <div className="status-item">
                      <div className="status-circle completed">
                        <span>{analyticsData.orders?.ordersByStatus?.completed || 0}</span>
                      </div>
                      <span className="status-label">Completed</span>
                    </div>
                    <div className="status-item">
                      <div className="status-circle in-progress">
                        <span>{analyticsData.orders?.ordersByStatus?.in_progress || 0}</span>
                      </div>
                      <span className="status-label">In Progress</span>
                    </div>
                    <div className="status-item">
                      <div className="status-circle cancelled">
                        <span>{analyticsData.orders?.ordersByStatus?.cancelled || 0}</span>
                      </div>
                      <span className="status-label">Cancelled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="performance-section">
              <div className="analytics-grid">
                <div className="top-sellers">
                  <h3>🏆 Top Sellers by Revenue</h3>
                  <div className="sellers-list">
                    {analyticsData.performance?.topSellersByRevenue?.map((seller, index) => (
                      <div key={index} className="seller-item">
                        <div className="seller-rank">#{index + 1}</div>
                        <div className="seller-info">
                          <div className="seller-name">{seller.name}</div>
                          <div className="seller-stats">
                            <span>{formatCurrency(seller.revenue)}</span>
                            <span>•</span>
                            <span>{seller.orders} orders</span>
                            <span>•</span>
                            <span>⭐ {seller.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="category-performance">
                  <h3>📊 Category Performance</h3>
                  <div className="performance-list">
                    {analyticsData.performance?.categoryPerformance?.map((category, index) => (
                      <div key={index} className="performance-item">
                        <div className="performance-info">
                          <span className="performance-name">{category.category}</span>
                          <div className="performance-metrics">
                            <span>⭐ {category.avgRating}</span>
                            <span>📦 {category.orderCount}</span>
                            <span>😊 {category.satisfaction}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;

