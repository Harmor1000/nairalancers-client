import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import getCurrentUser from '../../utils/getCurrentUser';
import newRequest from '../../utils/newRequest';
import './AdminLayout.scss';

const AdminLayout = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    // Fetch system health for header indicator
    const fetchSystemHealth = async () => {
      try {
        const response = await newRequest.get('/admin/system/health');
        setSystemHealth(response.data);
      } catch (err) {
        console.error('Failed to fetch system health:', err);
      }
    };

    if (user?.isAdmin) {
      fetchSystemHealth();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await newRequest.post('/admin/auth/logout');
      localStorage.removeItem('currentUser');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    {
      section: 'Overview',
      items: [
        { name: 'Dashboard', path: '/admin', icon: '🏠', exact: true },
        { name: 'Analytics', path: '/admin/analytics', icon: '📊' },
        { name: 'Reports', path: '/admin/reports', icon: '📈' },
      ]
    },
    {
      section: 'User Management',
      items: [
        { name: 'All Users', path: '/admin/users', icon: '👥' },
        { name: 'Sellers', path: '/admin/users?role=seller', icon: '💼' },
        { name: 'Buyers', path: '/admin/users?role=buyer', icon: '🛒' },
        { name: 'Admins', path: '/admin/users?role=admin', icon: '👑' },
      ]
    },
    {
      section: 'Content Management',
      items: [
        { name: 'All Gigs', path: '/admin/gigs', icon: '🎯' },
        { name: 'Categories', path: '/admin/categories', icon: '📂' },
        { name: 'Reviews', path: '/admin/reviews', icon: '⭐' },
        { name: 'Moderation', path: '/admin/moderation', icon: '🛡️' },
      ]
    },
    {
      section: 'Order Management',
      items: [
        { name: 'All Orders', path: '/admin/orders', icon: '📦' },
        { name: 'Active Orders', path: '/admin/orders?status=active', icon: '🔄' },
        { name: 'Disputes', path: '/admin/disputes', icon: '⚖️' },
        { name: 'Refunds', path: '/admin/refunds', icon: '💸' },
      ]
    },
    {
      section: 'Financial',
      items: [
        { name: 'Withdrawals', path: '/admin/withdrawals', icon: '💰' },
        { name: 'Transactions', path: '/admin/transactions', icon: '💳' },
        { name: 'Revenue', path: '/admin/revenue', icon: '📈' },
      ]
    },
    {
      section: 'Security & Fraud',
      items: [
        { name: 'Fraud Detection', path: '/admin/fraud', icon: '🔍' },
        { name: 'Verification', path: '/admin/verification', icon: '✅' },
        { name: 'Banned Users', path: '/admin/banned', icon: '🚫' },
        { name: 'Security Logs', path: '/admin/logs', icon: '📋' },
      ]
    },
    {
      section: 'System',
      items: [
        { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
        { name: 'Notifications', path: '/admin/notifications', icon: '🔔' },
        { name: 'System Health', path: '/admin/system', icon: '🩺' },
        { name: 'Backups', path: '/admin/backups', icon: '💾' },
      ]
    }
  ];

  const isActiveRoute = (path, exact = false) => {
    // Support matching with query parameters if provided in nav link
    const [basePath, queryString] = path.split('?');
    if (exact) {
      if (location.pathname !== basePath) return false;
    } else {
      if (!location.pathname.startsWith(basePath)) return false;
    }

    if (queryString) {
      const targetParams = new URLSearchParams(queryString);
      const currentParams = new URLSearchParams(location.search || '');
      for (const [k, v] of targetParams.entries()) {
        if (currentParams.get(k) !== v) return false;
      }
    }
    return true;
  };

  const getHealthStatusColor = () => {
    if (!systemHealth) return '#gray';
    switch (systemHealth.overall) {
      case 'healthy': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <h2>Nairalancers</h2>
            <span>Admin Panel</span>
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '➡️' : '⬅️'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="nav-section">
              <h3 className="section-title">{section.section}</h3>
              <ul className="nav-items">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link 
                      to={item.path}
                      className={`nav-link ${isActiveRoute(item.path, item.exact) ? 'active' : ''}`}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-text">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <img 
              src={currentUser?.img || '/img/noavatar.jpg'} 
              alt="Admin" 
              className="user-avatar"
            />
            <div className="user-details">
              <span className="user-name">{currentUser?.firstname} {currentUser?.lastname}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <h1>Admin Panel</h1>
            <div className="breadcrumb">
              <span>Nairalancers</span>
              <span> / </span>
              <span>Admin</span>
            </div>
          </div>
          
          <div className="header-right">
            {/* System Health Indicator */}
            <div className="health-indicator">
              <div 
                className="health-dot"
                style={{ backgroundColor: getHealthStatusColor() }}
              ></div>
              <span className="health-text">
                System {systemHealth?.overall || 'Unknown'}
              </span>
            </div>

            {/* Quick Notifications */}
            <div className="notifications">
              <span className="notification-icon">🔔</span>
              <span className="notification-count">3</span>
            </div>

            {/* Admin Profile */}
            <div className="admin-profile">
              <img 
                src={currentUser?.img || '/img/noavatar.jpg'} 
                alt="Admin" 
                className="profile-img"
              />
              <span className="profile-name">{currentUser?.firstname}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
