import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminOrders.scss';

const AdminOrders = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      fetchOrders();
    }
  }, [filters, orderId]);

  // Sync filters with URL query (e.g., /admin/orders?status=active)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    if (statusParam && statusParam !== filters.status) {
      setFilters(prev => ({ ...prev, status: statusParam, page: 1 }));
    }
  }, [location.search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      queryParams.append('page', filters.page);
      queryParams.append('limit', filters.limit);
      
      console.log('Fetching orders with params:', queryParams.toString());
      
      const response = await newRequest.get(`/admin/orders${queryParams.toString() ? `?${queryParams}` : ''}`);
      console.log('Orders response:', response.data);
      
      const ordersData = response.data.orders || response.data || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await newRequest.get(`/admin/orders/${orderId}`);
      setOrderDetails(response.data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      // Redirect to orders list if order not found
      window.history.pushState({}, '', '/admin/orders');
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderIdParam, action, data = {}) => {
    try {
      // Validate input
      if (!orderIdParam || !orderIdParam.match(/^[0-9a-fA-F]{24}$/)) {
        alert('Invalid order ID format');
        return;
      }
      
      let endpoint = '';
      let method = 'PUT';
      let payload = { ...data };
      
      switch (action) {
        case 'updateStatus':
          endpoint = `/admin/orders/${orderIdParam}/status`;
          break;
        case 'refund':
          endpoint = `/admin/orders/${orderIdParam}/refund`;
          method = 'POST';
          break;
        case 'release':
          // Use the order status endpoint to mark escrow as released
          endpoint = `/admin/orders/${orderIdParam}/status`;
          method = 'PUT';
          payload = { ...payload, escrowStatus: 'released' };
          break;
        default:
          alert('Invalid action specified');
          return;
      }

      const requestMethod = method === 'POST' ? newRequest.post : newRequest.put;
      const response = await requestMethod(endpoint, payload);
      
      fetchOrders();
      
      // Enhanced success message
      const successMsg = response.data.message || `Order ${action} completed successfully`;
      alert(`✅ ${successMsg}\n\nAction: ${action.toUpperCase()}\nOrder ID: ${orderIdParam.slice(-8)}\nTime: ${new Date().toLocaleString()}`);
    } catch (err) {
      // Enhanced error handling
      const errorMsg = err.response?.data?.message || `Failed to ${action} order`;
      const statusCode = err.response?.status || 'Unknown';
      
      console.error('Order action error:', {
        action,
        orderId: orderIdParam,
        data,
        error: errorMsg,
        statusCode
      });
      
      alert(`❌ Error ${statusCode}: ${errorMsg}\n\nAction: ${action.toUpperCase()}\nPlease check the console for more details.`);
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
      'pending': { class: 'warning', text: 'Pending' },
      'in progress': { class: 'info', text: 'In Progress' },
      'completed': { class: 'success', text: 'Completed' },
      'cancelled': { class: 'danger', text: 'Cancelled' },
      'disputed': { class: 'danger', text: 'Disputed' },
      'refunded': { class: 'secondary', text: 'Refunded' }
    };

    const config = statusConfig[status] || { class: 'secondary', text: status };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExportData = () => {
    try {
      // Create CSV content
      const headers = [
        'Order ID',
        'Gig Title',
        'Buyer Name',
        'Seller Name',
        'Price (NGN)',
        'Status',
        'Payment Status',
        'Created Date',
        'Completed'
      ];
      
      const csvContent = [
        headers.join(','),
        ...orders.map(order => [
          order._id,
          `"${order.gigId?.title || 'N/A'}"`,
          `"${order.buyerId?.firstname || ''} ${order.buyerId?.lastname || ''}"`,
          `"${order.sellerId?.firstname || ''} ${order.sellerId?.lastname || ''}"`,
          order.price,
          order.status,
          order.paymentStatus,
          new Date(order.createdAt).toLocaleDateString(),
          order.isCompleted ? 'Yes' : 'No'
        ].join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`✅ Exported ${orders.length} orders to CSV file successfully!`);
    } catch (err) {
      console.error('Export error:', err);
      alert('❌ Failed to export data. Please try again.');
    }
  };

  // If viewing order details
  if (orderId && orderDetails) {
    return (
      <AdminLayout>
        <div className="admin-order-details">
          <div className="page-header">
            <Link to="/admin/orders" className="back-btn">
              ← Back to Orders
            </Link>
            <h1>Order Details</h1>
          </div>

          <div className="order-details-content">
            <div className="order-info-card">
              <div className="order-header">
                <h2>Order #{orderDetails.order?._id.slice(-8)}</h2>
                {getStatusBadge(orderDetails.order?.status)}
              </div>
              
              <div className="order-participants">
                <div className="participant buyer">
                  <h4>Buyer</h4>
                  <img src={orderDetails.order?.buyerId?.img || '/img/noavatar.jpg'} alt="Buyer" />
                  <span>{orderDetails.order?.buyerId?.firstname} {orderDetails.order?.buyerId?.lastname}</span>
                </div>
                
                <div className="participant seller">
                  <h4>Seller</h4>
                  <img src={orderDetails.order?.sellerId?.img || '/img/noavatar.jpg'} alt="Seller" />
                  <span>{orderDetails.order?.sellerId?.firstname} {orderDetails.order?.sellerId?.lastname}</span>
                </div>
              </div>

              <div className="order-actions">
                <button 
                  className="action-btn refund"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to process a refund for this order?')) {
                      handleOrderAction(orderId, 'refund');
                    }
                  }}
                >
                  💰 Process Refund
                </button>
                <button 
                  className="action-btn release"
                  onClick={() => {
                    if (window.confirm('Release payment to seller?')) {
                      handleOrderAction(orderId, 'release');
                    }
                  }}
                >
                  ✅ Release Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-orders">
        {/* Page Header */}
        <div className="page-header">
          <h1>📦 Order Management</h1>
          <p>Monitor and manage all platform orders</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <input
              type="text"
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="search-input"
            />

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="disputed">Disputed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters({ ...filters, sortBy, sortOrder });
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-desc">Highest Value</option>
              <option value="price-asc">Lowest Value</option>
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

        {/* Orders Content */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <div className="orders-container">
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Order ID</th>
                    <th>Gig</th>
                    <th>Buyer</th>
                    <th>Seller</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrders([...selectedOrders, order._id]);
                            } else {
                              setSelectedOrders(selectedOrders.filter(id => id !== order._id));
                            }
                          }}
                        />
                      </td>
                      <td>
                        <Link 
                          to={`/admin/orders/${order._id}`}
                          className="order-id-link"
                        >
                          #{order._id.slice(-8)}
                        </Link>
                      </td>
                      <td>
                        <div className="gig-info">
                          {/* <img src={order.gigId?.img || '/img/no-image.jpg'} alt="Gig" /> */}
                          <span>{order.gigId?.title || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="user-info">
                          {/* <img src={order.buyerId?.img || '/img/noavatar.jpg'} alt="Buyer" /> */}
                          <span>{order.buyerId?.firstname} {order.buyerId?.lastname}</span>
                        </div>
                      </td>
                      <td>
                        <div className="user-info">
                          {/* <img src={order.sellerId?.img || '/img/noavatar.jpg'} alt="Seller" /> */}
                          <span>{order.sellerId?.firstname} {order.sellerId?.lastname}</span>
                        </div>
                      </td>
                      <td className="price">{formatCurrency(order.price)}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        <span className={`payment-status ${order.paymentStatus}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="action-btn view"
                            title="View Details"
                          >
                            👁️
                          </Link>
                          
                          {order.status !== 'completed' && order.status !== 'refunded' && (
                            <button
                              className="action-btn refund"
                              title="Process Refund"
                              onClick={() => {
                                if (window.confirm('Process refund for this order?')) {
                                  handleOrderAction(order._id, 'refund');
                                }
                              }}
                            >
                              💰
                            </button>
                          )}
                          
                          {order.status === 'completed' && order.escrowStatus === 'held' && (
                            <button
                              className="action-btn release"
                              title="Release Payment"
                              onClick={() => {
                                if (window.confirm('Release payment to seller?')) {
                                  handleOrderAction(order._id, 'release');
                                }
                              }}
                            >
                              ✅
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {orders.length === 0 && !loading && (
                <div className="no-data">
                  <p>No orders found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
