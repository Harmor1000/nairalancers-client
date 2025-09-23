import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { PulseLoader } from "react-spinners";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState(null);

  // Check for payment errors from localStorage
  useEffect(() => {
    const storedError = localStorage.getItem('paymentError');
    if (storedError) {
      try {
        const errorData = JSON.parse(storedError);
        // Only show errors from the last 5 minutes to avoid stale errors
        const errorAge = Date.now() - new Date(errorData.timestamp).getTime();
        if (errorAge < 5 * 60 * 1000) { // 5 minutes
          setPaymentError(errorData.error);
        }
        // Clear the error from localStorage
        localStorage.removeItem('paymentError');
      } catch (err) {
        console.error('Error parsing stored payment error:', err);
        localStorage.removeItem('paymentError');
      }
    }
  }, []);

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        // Sort orders by creation date (latest first)
        const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return sortedOrders;
      }),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getEscrowStatusInfo = (order) => {
    const escrowStatus = order.escrowStatus || 'pending';
    const statusMap = {
      pending: { text: 'Payment Pending', color: 'orange', icon: '⏳' },
      funded: { text: 'Escrowed - Work in Progress', color: 'blue', icon: '🔒' },
      work_submitted: { text: 'Work Submitted - Awaiting Review', color: 'purple', icon: '📋' },
      approved: { text: 'Work Approved', color: 'green', icon: '✅' },
      released: { text: 'Payment Released', color: 'green', icon: '💰' },
      disputed: { text: 'Under Dispute', color: 'red', icon: '⚠️' },
      refunded: { text: 'Refunded', color: 'gray', icon: '↩️' }
    };
    return statusMap[escrowStatus] || statusMap.pending;
  };

  const getActionButtons = (order) => {
    const actions = [];
    const isFreelancer = currentUser.isSeller;
    const isClient = !currentUser.isSeller;

    if (isFreelancer && order.escrowStatus === 'funded') {
      actions.push({
        text: 'Submit Work',
        color: 'primary',
        icon: '📤',
        action: () => navigate(`/orders/${order._id}`)
      });
    }

    if (isClient && order.escrowStatus === 'work_submitted') {
      actions.push(
        {
          text: 'Review Work',
          color: 'success',
          icon: '✅',
          action: () => navigate(`/orders/${order._id}`)
        }
      );
    }

    if (order.escrowStatus !== 'released' && order.escrowStatus !== 'refunded' && order.disputeStatus !== 'pending' && order.disputeStatus !== 'under_review') {
      actions.push({
        text: 'Dispute',
        color: 'danger',
        icon: '⚠️',
        action: () => navigate(`/orders/${order._id}`)
      });
    }

    return actions;
  };

  const getMilestoneProgress = (order) => {
    if (!order.milestones || order.milestones.length === 0) return null;
    
    const completed = order.milestones.filter(m => m.status === 'approved').length;
    const total = order.milestones.length;
    const percentage = (completed / total) * 100;
    
    return { completed, total, percentage };
  };

  const renderLoadingState = () => (
    <div className="loading-container">
      <PulseLoader
        color="#1dbf73"
        loading={true}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <div className="loading-text">Loading your orders...</div>
    </div>
  );

  const renderErrorState = () => (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <div className="error-message">Unable to load orders</div>
      <div className="error-description">
        There was a problem loading your orders. Please check your connection and try again.
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="empty-container">
      <div className="empty-icon">📦</div>
      <div className="empty-title">No orders yet</div>
      <div className="empty-description">
        When you start buying or selling services, your orders will appear here.
      </div>
    </div>
  );

  const renderPaymentError = () => {
    if (!paymentError) return null;

    return (
      <div className="payment-error-container">
        <div className="payment-error-card">
          <div className="error-header">
            <span className="error-icon">❌</span>
            <h3>Payment Failed</h3>
            <button 
              className="close-error-btn"
              onClick={() => setPaymentError(null)}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
          
          <div className="error-content">
            <p className="error-message">{paymentError.message}</p>
            
            {paymentError.verificationSteps && (
              <div className="verification-steps">
                <h4>📋 Next Steps:</h4>
                <ol>
                  {paymentError.verificationSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.action}</strong>
                      {step.description && <span className="step-description"> - {step.description}</span>}
                    </li>
                  ))}
                </ol>
                <button 
                  className="verification-btn"
                  onClick={() => navigate('/verification')}
                >
                  🔧 Go to Verification Settings
                </button>
              </div>
            )}
            
            {paymentError.currentLimit && (
              <div className="limit-info">
                <p className="current-limit">
                  <strong>Current Limit:</strong> ₦{paymentError.currentLimit.toLocaleString()}
                </p>
                <p className="requested-amount">
                  <strong>Requested Amount:</strong> ₦{paymentError.requestedAmount?.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDesktopTable = () => (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Client</th>
            <th>Price</th>
            <th>Escrow Status</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => {
            const escrowInfo = getEscrowStatusInfo(order);
            const actions = getActionButtons(order);
            const milestoneProgress = getMilestoneProgress(order);

            return (
              <tr key={order._id}>
                <td>
                  <Link to={`/orders/${order._id}`} className="link">
                    <img 
                      className="image" 
                      src={order.img} 
                      alt={order.title}
                      loading="lazy"
                    />
                  </Link>
                </td>
                <td>
                  <Link to={`/orders/${order._id}`} className="link order-title">
                    {order.title}
                  </Link>
                  {order.protectionLevel === 'enhanced' && (
                    <span className="protection-badge">🛡️ Enhanced</span>
                  )}
                </td>
                <td>
                  <div className="client-info">
                    <span className="client-name">
                      {currentUser.isSeller ? order.buyerUsername : order.sellerUsername}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="price-info">
                    <span className="price">{formatPrice(order.price)}</span>
                    {order.autoReleaseDate && order.escrowStatus === 'work_submitted' && (
                      <small className="auto-release">
                        Auto-release: {new Date(order.autoReleaseDate).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                </td>
                <td>
                  <div className={`escrow-status ${escrowInfo.color}`}>
                    <span className="status-icon">{escrowInfo.icon}</span>
                    <span className="status-text">{escrowInfo.text}</span>
                  </div>
                </td>
                <td>
                  <div className="progress-info">
                    {milestoneProgress ? (
                      <div className="milestone-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${milestoneProgress.percentage}%` }}
                          />
                        </div>
                        <small>{milestoneProgress.completed}/{milestoneProgress.total} milestones</small>
                      </div>
                    ) : (
                      <span className="single-order">Single Order</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="message-btn"
                      onClick={() => handleContact(order)}
                      title="Contact"
                      aria-label="Send message"
                    >
                      💬
                    </button>
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        className={`action-btn ${action.color}`}
                        onClick={action.action}
                        title={action.text}
                      >
                        {action.icon}
                      </button>
                    ))}
                    <Link to={`/orders/${order._id}`} className="details-btn" title="View Details">
                      📋
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderMobileCards = () => (
    <div className="mobile-cards">
      {data.map((order) => {
        const escrowInfo = getEscrowStatusInfo(order);
        const actions = getActionButtons(order);
        const milestoneProgress = getMilestoneProgress(order);

        return (
          <div key={order._id} className="order-card">
            <div className="card-header">
              <div className="order-image">
                <Link to={`/orders/${order._id}`}>
                  <img 
                    className="image" 
                    src={order.img} 
                    alt={order.title}
                    loading="lazy"
                  />
                </Link>
              </div>
              <div className="order-title">
                <h3>
                  <Link to={`/orders/${order._id}`}>
                    {order.title}
                  </Link>
                  {order.protectionLevel === 'enhanced' && (
                    <span className="protection-badge">🛡️</span>
                  )}
                </h3>
                <div className="price">{formatPrice(order.price)}</div>
              </div>
            </div>
            
            <div className="card-body">
              <div className="info-row">
                <span className="label">Client:</span>
                <span className="value">
                  {currentUser.isSeller ? order.buyerUsername : order.sellerUsername}
                </span>
              </div>
              
              <div className="info-row">
                <span className="label">Escrow Status:</span>
                <span className={`escrow-status-mobile ${escrowInfo.color}`}>
                  {escrowInfo.icon} {escrowInfo.text}
                </span>
              </div>

              {milestoneProgress && (
                <div className="info-row">
                  <span className="label">Progress:</span>
                  <div className="milestone-progress-mobile">
                    <div className="progress-bar-small">
                      <div 
                        className="progress-fill-small" 
                        style={{ width: `${milestoneProgress.percentage}%` }}
                      />
                    </div>
                    <small>{milestoneProgress.completed}/{milestoneProgress.total}</small>
                  </div>
                </div>
              )}

              {order.autoReleaseDate && order.escrowStatus === 'work_submitted' && (
                <div className="info-row">
                  <span className="label">Auto-release:</span>
                  <span className="value auto-release-mobile">
                    {new Date(order.autoReleaseDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="card-footer">
              <div className="footer-actions">
                <button
                  className="message-btn"
                  onClick={() => handleContact(order)}
                  aria-label="Send message"
                >
                  💬 Contact
                </button>
                
                {actions.map((action, index) => (
                  <button
                    key={index}
                    className={`mobile-action-btn ${action.color}`}
                    onClick={action.action}
                    title={action.text}
                  >
                    {action.icon} {action.text}
                  </button>
                ))}
                
                <Link to={`/orders/${order._id}`} className="details-btn-mobile">
                  📋 Details
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="orders">
      <div className="container">
        <div className="title">
          <h1>Orders</h1>
        </div>
        
        {/* Show payment error if it exists */}
        {renderPaymentError()}
        
        {isLoading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : !data || data.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderDesktopTable()}
            {renderMobileCards()}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;