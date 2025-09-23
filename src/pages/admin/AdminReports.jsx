import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminReports.scss';

const AdminReports = () => {
  const [reports, setReports] = useState({
    revenue: null,
    users: null,
    orders: null,
    performance: null
  });
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState('revenue');
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Fetch different report types based on active report
      const promises = [];
      
      if (activeReport === 'revenue' || activeReport === 'all') {
        // Map UI dateRange to backend period param
        const mapRangeToPeriod = (range) => {
          switch (range) {
            case '7days': return 'day';
            case '30days': return 'day';
            case '90days': return 'week';
            case '6months': return 'month';
            case '1year': return 'month';
            default: return 'month';
          }
        };
        const period = mapRangeToPeriod(dateRange);

        promises.push(
          newRequest.get(`/admin/reports/revenue?period=${period}`)
            .then(response => {
              const api = response.data || {};
              // Map minimally without generating synthetic values
              const mapped = {
                totalRevenue: api.summary?.totalRevenue || 0,
                platformFees: api.summary?.platformFees ?? 0,
                netRevenue: api.summary?.netRevenue ?? (api.summary?.totalRevenue || 0) - (api.summary?.platformFees || 0),
                growth: api.summary?.growth ?? 0,
                topCategories: Array.isArray(api.topCategories) ? api.topCategories : [],
                monthlyBreakdown: Array.isArray(api.revenueData)
                  ? api.revenueData.map(item => {
                      const id = item._id || {};
                      const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                      const monthIdx = (id.month || 1) - 1;
                      const label = id.day ? `${monthShort[monthIdx]} ${id.day}` : (id.week ? `Wk ${id.week}` : (monthShort[monthIdx] || ''));
                      return {
                        month: label,
                        revenue: item.revenue || 0,
                        fees: item.fees || 0,
                        transactions: item.orders || 0
                      };
                    })
                  : []
              };
              return { type: 'revenue', data: mapped };
            })
            .catch(err => {
              console.error('Error fetching revenue report:', err);
              return { type: 'revenue', data: null };
            })
        );
      }
      
      if (activeReport === 'users' || activeReport === 'all') {
        promises.push(
          newRequest.get(`/admin/reports/users?range=${dateRange}`)
            .then(response => ({ type: 'users', data: response.data || null }))
            .catch(err => {
              console.error('Error fetching users report:', err);
              return { type: 'users', data: null };
            })
        );
      }
      
      if (activeReport === 'orders' || activeReport === 'all') {
        promises.push(
          newRequest.get(`/admin/orders?range=${dateRange}&summary=true`)
            .then(response => ({ type: 'orders', data: response.data || null }))
            .catch(err => {
              console.error('Error fetching orders report:', err);
              return { type: 'orders', data: null };
            })
        );
      }
      
      if (activeReport === 'performance' || activeReport === 'all') {
        promises.push(
          newRequest.get(`/admin/analytics/performance?range=${dateRange}`)
            .then(response => ({ type: 'performance', data: response.data || null }))
            .catch(err => {
              console.error('Error fetching performance report:', err);
              return { type: 'performance', data: null };
            })
        );
      }
      
      const results = await Promise.all(promises);
      const newReports = { ...reports };
      
      results.forEach(result => {
        newReports[result.type] = result.data;
      });
      
      setReports(newReports);
      
    } catch (err) {
      console.error('Error fetching reports:', err);
      // Leave as nulls when failing
      setReports({
        revenue: null,
        users: null,
        orders: null,
        performance: null
      });
    } finally {
      setLoading(false);
    }
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
      
      const currentReport = reports[activeReport];
      if (!currentReport) {
        alert('No data available to export');
        return;
      }

      if (activeReport === 'revenue') {
        const headers = ['Category', 'Revenue', 'Orders', 'Avg Order Value'];
        const rows = currentReport.topCategories?.map(cat => [
          cat.name,
          cat.revenue,
          cat.orders,
          Math.round(cat.revenue / cat.orders)
        ]) || [];
        
        csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        filename = 'revenue-report';
      } else if (activeReport === 'users') {
        const headers = ['Country', 'Users', 'Percentage'];
        const rows = currentReport.topCountries?.map(country => [
          country.country,
          country.users,
          `${country.percentage}%`
        ]) || [];
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'users-report';
      } else if (activeReport === 'orders') {
        const headers = ['Seller', 'Orders', 'Revenue'];
        const rows = currentReport.topSellers?.map(seller => [
          seller.name,
          seller.orders,
          seller.revenue
        ]) || [];
        
        csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = 'orders-report';
      }

      if (!csvContent) {
        alert('No exportable data for this report');
        return;
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`✅ ${activeReport.toUpperCase()} report exported successfully!`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export report. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-reports">
        {/* Page Header */}
        <div className="page-header">
          <h1>📊 Reports & Analytics</h1>
          <p>Generate comprehensive business reports</p>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="controls-grid">
            <select
              value={activeReport}
              onChange={(e) => {
                setActiveReport(e.target.value);
                if (e.target.value !== 'all') fetchReports();
              }}
            >
              <option value="revenue">Revenue Report</option>
              <option value="users">Users Report</option>
              <option value="orders">Orders Report</option>
              <option value="performance">Performance Report</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>

            <button 
              className="export-btn"
              onClick={handleExportReport}
              disabled={loading}
            >
              📥 Export Report
            </button>

            <button 
              className="refresh-btn"
              onClick={fetchReports}
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Report Content */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Generating report...</p>
          </div>
        ) : (
          <div className="reports-content">
            {activeReport === 'revenue' && reports.revenue && (
              <div className="report-section">
                <h2>Revenue Report</h2>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">{formatCurrency(reports.revenue.totalRevenue)}</p>
                    <span className="stat-growth positive">+{reports.revenue.growth}%</span>
                  </div>
                  <div className="stat-card">
                    <h3>Platform Fees</h3>
                    <p className="stat-value">{formatCurrency(reports.revenue.platformFees)}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Net Revenue</h3>
                    <p className="stat-value">{formatCurrency(reports.revenue.netRevenue)}</p>
                  </div>
                </div>

                <div className="chart-section">
                  <h3>Top Categories by Revenue</h3>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Revenue</th>
                          <th>Orders</th>
                          <th>Avg Order Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.revenue.topCategories?.map((cat, index) => (
                          <tr key={index}>
                            <td>{cat.name}</td>
                            <td>{formatCurrency(cat.revenue)}</td>
                            <td>{cat.orders}</td>
                            <td>{formatCurrency(Math.round(cat.revenue / cat.orders))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeReport === 'users' && reports.users && (
              <div className="report-section">
                <h2>Users Report</h2>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-value">{reports.users.totalUsers?.toLocaleString()}</p>
                  </div>
                  <div className="stat-card">
                    <h3>New Users</h3>
                    <p className="stat-value">{reports.users.newUsers?.toLocaleString()}</p>
                    <span className="stat-growth positive">+{reports.users.userGrowth}%</span>
                  </div>
                  <div className="stat-card">
                    <h3>Active Users</h3>
                    <p className="stat-value">{reports.users.activeUsers?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="chart-section">
                  <h3>Users by Country</h3>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Country</th>
                          <th>Users</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.users.topCountries?.map((country, index) => (
                          <tr key={index}>
                            <td>{country.country}</td>
                            <td>{country.users.toLocaleString()}</td>
                            <td>{country.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeReport === 'orders' && reports.orders && (
              <div className="report-section">
                <h2>Orders Report</h2>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{reports.orders.totalOrders?.toLocaleString()}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Completion Rate</h3>
                    <p className="stat-value">{reports.orders.completionRate}%</p>
                  </div>
                  <div className="stat-card">
                    <h3>Avg Order Value</h3>
                    <p className="stat-value">{formatCurrency(reports.orders.averageOrderValue)}</p>
                  </div>
                </div>

                <div className="chart-section">
                  <h3>Top Performing Sellers</h3>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Seller</th>
                          <th>Orders</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.orders.topSellers?.map((seller, index) => (
                          <tr key={index}>
                            <td>{seller.name}</td>
                            <td>{seller.orders}</td>
                            <td>{formatCurrency(seller.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeReport === 'performance' && reports.performance && (
              <div className="report-section">
                <h2>Performance Report</h2>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Uptime</h3>
                    <p className="stat-value">{reports.performance.uptime}%</p>
                  </div>
                  <div className="stat-card">
                    <h3>Response Time</h3>
                    <p className="stat-value">{reports.performance.averageResponseTime}</p>
                  </div>
                  <div className="stat-card">
                    <h3>User Satisfaction</h3>
                    <p className="stat-value">{reports.performance.userSatisfaction}/5</p>
                  </div>
                </div>

                <div className="chart-section">
                  <h3>System Health</h3>
                  <div className="health-grid">
                    {Object.entries(reports.performance.systemHealth || {}).map(([system, status]) => (
                      <div key={system} className={`health-item ${status}`}>
                        <span className="system-name">{system.toUpperCase()}</span>
                        <span className={`status-badge ${status}`}>{status.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
