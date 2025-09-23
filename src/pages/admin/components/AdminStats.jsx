import React from 'react';
import './AdminStats.scss';

const AdminStats = ({ data, onReviewDisputes, onProcessWithdrawals }) => {
  if (!data) {
    return (
      <div className="admin-stats loading">
        <div className="stat-card">
          <div className="stat-skeleton"></div>
        </div>
        <div className="stat-card">
          <div className="stat-skeleton"></div>
        </div>
        <div className="stat-card">
          <div className="stat-skeleton"></div>
        </div>
        <div className="stat-card">
          <div className="stat-skeleton"></div>
        </div>
      </div>
    );
  }
  console.log("Data:", data);

  const stats = [
    {
      title: 'Total Users',
      value: data.totalUsers?.toLocaleString() || '0',
      change: data.newUsersThisMonth > 0 ? `+${data.newUsersThisMonth} this month` : 'No new users',
      icon: '👥',
      color: 'blue',
      trend: data.newUsersThisMonth > 0 ? 'up' : 'neutral'
    },
    {
      title: 'Active Orders',
      value: data.activeOrders?.toLocaleString() || '0',
      change: `${data.completedOrders} completed`,
      icon: '📦',
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: `₦${data.totalRevenue?.toLocaleString() || '0'}`,
      change: `₦${data.monthlyRevenue?.toLocaleString() || '0'} this month`,
      icon: '💰',
      color: 'purple',
      trend: data.monthlyRevenue > 0 ? 'up' : 'neutral'
    },
    {
      title: 'Active Gigs',
      value: data.totalGigs?.toLocaleString() || '0',
      change: data.newGigsThisMonth > 0 ? `+${data.newGigsThisMonth} this month` : 'No new gigs',
      icon: '🎯',
      color: 'orange',
      trend: data.newGigsThisMonth > 0 ? 'up' : 'neutral'
    }
  ];

  const alertStats = [
    {
      title: 'Pending Disputes',
      value: data.pendingDisputes || 0,
      critical: data.pendingDisputes > 5,
      icon: '⚖️'
    },
    {
      title: 'Pending Withdrawals',
      value: data.pendingWithdrawals || 0,
      critical: data.pendingWithdrawals > 10,
      icon: '💸'
    }
  ];

  const handleReviewDisputes = () => {
    if (onReviewDisputes) {
      onReviewDisputes();
    } else {
      // Default behavior - navigate to disputes page
      window.location.href = '/admin/disputes';
    }
  };

  const handleProcessWithdrawals = () => {
    if (onProcessWithdrawals) {
      onProcessWithdrawals();
    } else {
      // Default behavior - navigate to withdrawals page
      window.location.href = '/admin/withdrawals';
    }
  };

  return (
    <div className="admin-stats">
      {/* Main Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              <div className={`stat-trend ${stat.trend}`}>
                {stat.trend === 'up' && '📈'}
                {stat.trend === 'down' && '📉'}
                {stat.trend === 'neutral' && '➡️'}
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
              <span className="stat-change">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Stats */}
      {(alertStats[0].value > 0 || alertStats[1].value > 0) && (
        <div className="alert-stats">
          <h3>🚨 Requires Attention</h3>
          <div className="alert-grid">
            {alertStats.map((alert, index) => 
              alert.value > 0 && (
                <div key={index} className={`alert-card ${alert.critical ? 'critical' : 'warning'}`}>
                  <span className="alert-icon">{alert.icon}</span>
                  <div className="alert-content">
                    <strong className="alert-value">{alert.value}</strong>
                    <span className="alert-title">{alert.title}</span>
                  </div>
                  <button 
                    className="alert-action"
                    onClick={() => {
                      if (index === 0) {
                        handleReviewDisputes();
                      } else {
                        handleProcessWithdrawals();
                      }
                    }}
                  >
                    {index === 0 ? 'Review' : 'Process'}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Quick Ratios */}
      <div className="ratio-stats">
        <div className="ratio-item">
          <span className="ratio-label">Sellers vs Buyers</span>
          <div className="ratio-bar">
            <div 
              className="ratio-fill sellers" 
              style={{ 
                width: `${(data.totalSellers / (data.totalSellers + data.totalBuyers)) * 100}%` 
              }}
            ></div>
          </div>
          <span className="ratio-text">
            {data.totalSellers} sellers, {data.totalBuyers} buyers
          </span>
        </div>
        
        <div className="ratio-item">
          <span className="ratio-label">Order Completion Rate</span>
          <div className="ratio-bar">
            <div 
              className="ratio-fill completion" 
              style={{ 
                width: `${data.totalOrders > 0 ? (data.completedOrders / data.totalOrders) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <span className="ratio-text">
            {data.totalOrders > 0 ? 
              `${Math.round((data.completedOrders / data.totalOrders) * 100)}%` : 
              '0%'
            } completion rate
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
