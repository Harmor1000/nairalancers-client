import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminStats from './components/AdminStats';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import SystemHealth from './components/SystemHealth';
import getCurrentUser from '../../utils/getCurrentUser';
import newRequest from '../../utils/newRequest';
import './AdminDashboard.scss';

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);
        
        if (!user || !user.isAdmin) {
          setLoading(false);
          return;
        }

        // Test admin API health first
        try {
          await newRequest.get('/admin/health-check');
          console.log('✅ Admin API health check passed');
        } catch (healthErr) {
          console.warn('⚠️ Admin API health check failed:', healthErr);
        }

        const response = await newRequest.get('/admin/dashboard/stats');
        setDashboardData(response.data);
        
        // Log successful authentication for debugging
        console.log('✅ Admin dashboard loaded successfully for:', user.username || user.email);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        // Enhanced error handling
        if (err.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          localStorage.removeItem('currentUser');
        } else {
          setError('Failed to load dashboard data. Check console for details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Redirect non-admin users
  if (!loading && (!currentUser || !currentUser.isAdmin)) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {currentUser?.firstname}! Here's what's happening on your platform.</p>
          </div>
          <div className="header-time">
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <AdminStats data={dashboardData?.overview} />

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* System Health */}
          <div className="grid-item health-section">
            <SystemHealth />
          </div>

          {/* Quick Actions */}
          <div className="grid-item actions-section">
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <div className="grid-item activity-section full-width">
            <RecentActivity 
              recentOrders={dashboardData?.recentActivities?.orders}
              recentUsers={dashboardData?.recentActivities?.users}
            />
          </div>

          {/* Platform Growth Chart */}
          <div className="grid-item chart-section">
            <div className="chart-container">
              <h3>Platform Growth</h3>
              <div className="growth-chart">
                {dashboardData?.growthData?.map((data, index) => (
                  <div key={index} className="growth-bar">
                    <div 
                      className="bar" 
                      style={{ height: `${(data.users / 100) * 100}%` }}
                    ></div>
                    <span className="month">
                      {data._id?.month}/{data._id?.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Overview */}
          <div className="grid-item revenue-section">
            <div className="revenue-container">
              <h3>Revenue Overview</h3>
              <div className="revenue-stats">
                <div className="revenue-item">
                  <span className="label">Total Revenue</span>
                  <span className="value">
                    ₦{dashboardData?.overview?.totalRevenue?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="revenue-item">
                  <span className="label">This Month</span>
                  <span className="value monthly">
                    ₦{dashboardData?.overview?.monthlyRevenue?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="revenue-item">
                  <span className="label">Completed Orders</span>
                  <span className="value">{dashboardData?.overview?.completedOrders || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {(dashboardData?.overview?.pendingDisputes > 0 || 
          dashboardData?.overview?.pendingWithdrawals > 10) && (
          <div className="critical-alerts">
            <h3>⚠️ Critical Alerts</h3>
            <div className="alerts-grid">
              {dashboardData.overview.pendingDisputes > 0 && (
                <div className="alert dispute-alert">
                  <span className="alert-icon">⚖️</span>
                  <div className="alert-content">
                    <strong>{dashboardData.overview.pendingDisputes} Pending Disputes</strong>
                    <p>Require immediate attention</p>
                  </div>
                  <button className="alert-action">Review</button>
                </div>
              )}
              
              {dashboardData.overview.pendingWithdrawals > 10 && (
                <div className="alert withdrawal-alert">
                  <span className="alert-icon">💰</span>
                  <div className="alert-content">
                    <strong>{dashboardData.overview.pendingWithdrawals} Pending Withdrawals</strong>
                    <p>Process pending payments</p>
                  </div>
                  <button className="alert-action">Process</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
