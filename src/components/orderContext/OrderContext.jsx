import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./OrderContext.scss";
import newRequest from "../../utils/newRequest";

const OrderContext = ({ orderId, conversationId, isVisible = true, isCollapsed = true, onToggleCollapse }) => {
  // Try to get order by orderId first, then by conversationId if no orderId
  const { data: order, isLoading } = useQuery({
    queryKey: ["order-context", orderId, conversationId],
    queryFn: async () => {
      if (orderId) {
        return newRequest.get(`/orders/${orderId}/details`).then((res) => res.data);
      } else if (conversationId) {
        try {
          // Get conversation details to find participants
          const conversationRes = await newRequest.get(`/conversations/single/${conversationId}`);
          const conversation = conversationRes.data;
          
          if (!conversation) return null;

          // Get all orders to find orders between these users
          const ordersRes = await newRequest.get(`/orders`);
          const ordersBetweenUsers = ordersRes.data.filter(order => 
            (order.sellerId === conversation.sellerId && order.buyerId === conversation.buyerId) ||
            (order.sellerId === conversation.buyerId && order.buyerId === conversation.sellerId)
          );

          if (ordersBetweenUsers.length === 0) return null;

          // Prioritize active orders first, then most recent
          const activeOrders = ordersBetweenUsers.filter(order => 
            order.escrowStatus !== 'released' && 
            order.escrowStatus !== 'refunded' &&
            order.escrowStatus !== 'cancelled'
          );

          if (activeOrders.length > 0) {
            // Return most recent active order
            return activeOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          } else {
            // If no active orders, return most recent completed order
            return ordersBetweenUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          }
        } catch (error) {
          console.log("Error fetching order context:", error);
          return null;
        }
      }
      return null;
    },
    enabled: (!!orderId || !!conversationId) && isVisible,
  });

  if (!isVisible || isLoading || !order) {
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getEscrowStatusInfo = (escrowStatus) => {
    const statusMap = {
      pending: { text: "Payment Pending", color: "orange", icon: "⏳" },
      funded: { text: "Escrowed", color: "blue", icon: "🔒" },
      work_submitted: { text: "Awaiting Review", color: "purple", icon: "📋" },
      approved: { text: "Work Approved", color: "green", icon: "✅" },
      released: { text: "Payment Released", color: "green", icon: "💰" },
      disputed: { text: "Under Dispute", color: "red", icon: "⚠️" },
      refunded: { text: "Refunded", color: "gray", icon: "↩️" }
    };
    return statusMap[escrowStatus] || statusMap.pending;
  };

  const escrowInfo = getEscrowStatusInfo(order.escrowStatus);

  return (
    <div className={`order-context ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="context-header" onClick={onToggleCollapse}>
        <span className="context-icon">📋</span>
        <span className="context-title">Active Order</span>
        <div className="header-actions">
          <span className={`status ${escrowInfo.color}`}>
            {escrowInfo.icon} {escrowInfo.text}
          </span>
          <button className="toggle-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="context-content">
          <div className="order-summary">
            <img src={order.img} alt={order.title} className="order-thumb" />
            <div className="order-info">
              <h4 className="order-title">{order.title}</h4>
              <div className="order-meta">
                <span className="price">{formatPrice(order.price)}</span>
                <Link to={`/orders/${order._id}`} className="view-order-btn">
                  View Details
                </Link>
              </div>
            </div>
          </div>

          {order.milestones && order.milestones.length > 0 && (
            <div className="milestone-progress">
              <div className="progress-info">
                <span>Progress: {order.milestones.filter(m => m.status === 'approved').length}/{order.milestones.length} milestones</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(order.milestones.filter(m => m.status === 'approved').length / order.milestones.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Expected Delivery (before submission) */}
          {order.expectedDeliveryDate && (order.escrowStatus === 'funded' || order.escrowStatus === 'in progress') && (
            <div className="expected-delivery-info">
              <span className="expected-icon">📅</span>
              <span>Expected delivery: {new Date(order.expectedDeliveryDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* Auto-release (after submission) */}
          {order.autoReleaseDate && (
            <div className="auto-release-info">
              <span className="auto-release-icon">⏰</span>
              <span>
                {order.escrowStatus === 'work_submitted' ? 'Auto-release after review: ' : 'Auto-release: '}
                {new Date(order.autoReleaseDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderContext;
