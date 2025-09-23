import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import "./FreelancerDashboard.scss";
import newRequest from "../../utils/newRequest";
import { PulseLoader } from "react-spinners";
import getCurrentUser from "../../utils/getCurrentUser";

const FreelancerDashboard = () => {
  const currentUser = getCurrentUser();

  // Redirect if user is not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if user is not a seller
  if (!currentUser.isSeller) {
    return <Navigate to="/" replace />;
  }

  const queryClient = useQueryClient();
  
  // State for withdrawal
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  // Fetch freelancer statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["freelancer-stats", currentUser._id],
    queryFn: () => newRequest.get(`/freelancers/${currentUser._id}/stats`).then((res) => res.data),
  });

  // Note: Recent orders now come from stats instead of separate query

  // Fetch withdrawal history
  const { data: withdrawals, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ["freelancer-withdrawals", currentUser._id],
    queryFn: () => newRequest.get(`/freelancers/${currentUser._id}/withdrawals`).then((res) => res.data),
  });

  // Fetch user settings for saved bank details
  const { data: userSettings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: () => newRequest.get("/settings").then((res) => res.data),
  });

  // Create withdrawal mutation
  const withdrawalMutation = useMutation({
    mutationFn: (withdrawalData) => 
      newRequest.post(`/freelancers/${currentUser._id}/withdrawals`, withdrawalData),
    onSuccess: () => {
      queryClient.invalidateQueries(["freelancer-stats"]);
      queryClient.invalidateQueries(["freelancer-withdrawals"]);
      setShowWithdrawalModal(false);
      setWithdrawalAmount("");
      alert("Withdrawal request submitted successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Withdrawal request failed. Please try again.");
    }
  });



  const handleWithdrawal = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // Check if user has saved bank details
    const savedBankDetails = userSettings?.bankDetails;
    if (!savedBankDetails?.accountNumber || !savedBankDetails?.bankName || !savedBankDetails?.accountName) {
      alert("Please set up your bank details in Settings first before making a withdrawal.");
      return;
    }

    if (parseFloat(withdrawalAmount) > (stats?.availableBalance || 0)) {
      alert("Insufficient balance for withdrawal");
      return;
    }

    withdrawalMutation.mutate({
      amount: parseFloat(withdrawalAmount),
      // Bank details will be automatically used from settings by backend
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (escrowStatus) => {
    const statusMap = {
      pending: { text: "Payment Pending", color: "info", icon: "⏳" },
      funded: { text: "In Progress", color: "warning", icon: "🔄" },
      work_submitted: { text: "Awaiting Review", color: "warning", icon: "📋" },
      approved: { text: "Work Approved", color: "success", icon: "✅" },
      released: { text: "Completed", color: "success", icon: "💰" },
      disputed: { text: "Under Dispute", color: "danger", icon: "⚠️" },
      refunded: { text: "Refunded", color: "danger", icon: "↩️" },
      cancelled: { text: "Cancelled", color: "danger", icon: "❌" }
    };
    return statusMap[escrowStatus] || statusMap.pending;
  };

  if (statsLoading) {
    return (
      <div className="freelancer-dashboard">
        <div className="loading-container">
          <PulseLoader color="#1dbf73" loading={true} size={20} />
          <div className="loading-text">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="freelancer-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>💼 Freelancer Dashboard</h1>
            <p>Welcome back, {currentUser.username}!</p>
          </div>
          <button 
            className="withdraw-btn primary"
            onClick={() => setShowWithdrawalModal(true)}
            disabled={!stats?.availableBalance || stats?.availableBalance <= 0}
          >
            💰 Withdraw Earnings
          </button>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card earnings">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Earnings</h3>
              <div className="stat-value">{formatPrice(stats?.totalEarnings || 0)}</div>
              <div className="stat-change positive">+{formatPrice(stats?.thisMonthEarnings || 0)} this month</div>
            </div>
          </div>

          <div className="stat-card balance">
            <div className="stat-icon">🏦</div>
            <div className="stat-content">
              <h3>Available Balance</h3>
              <div className="stat-value">{formatPrice(stats?.availableBalance || 0)}</div>
              <div className="stat-note">Ready for withdrawal</div>
            </div>
          </div>

          <div className="stat-card projects">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Projects</h3>
              <div className="stat-value">{stats?.totalProjects || 0}</div>
              <div className="stat-change">{stats?.completedProjects || 0} completed</div>
            </div>
          </div>

          <div className="stat-card rating">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>Average Rating</h3>
              <div className="stat-value">{stats?.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}</div>
              <div className="stat-change">{stats?.totalReviews || 0} reviews</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="section recent-orders">
          <div className="section-header">
            <h2>📋 Recent Orders</h2>
            <Link to="/orders" className="view-all-link">View All</Link>
          </div>
          
          <div className="orders-table">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Client</th>
                      <th>Amount</th>
                      <th>Net Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => {
                      const statusInfo = getStatusBadge(order.status);
                      return (
                        <tr key={order.id}>
                          <td>
                            <div className="order-info">
                              <div>
                                <div className="order-title">{order.title}</div>
                                <div className="order-id">#{order.id.slice(-6)}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="client-info">
                              <div className="client-name">{order.clientUsername}</div>
                            </div>
                          </td>
                          <td>
                            <div className="amount">{formatPrice(order.amount)}</div>
                          </td>
                          <td>
                            <div className="net-amount">{formatPrice(order.netAmount)}</div>
                            <small className="commission-note">After 15% commission</small>
                          </td>
                          <td>
                            <span className={`status-badge ${statusInfo.color}`}>
                              {statusInfo.icon} {statusInfo.text}
                            </span>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Link to={`/orders/${order.id}`} className="action-btn">
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No Orders Yet</h3>
                <p>Start taking on projects to see your order history here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="section withdrawal-history">
          <div className="section-header">
            <h2>💳 Withdrawal History</h2>
          </div>
          
          <div className="withdrawals-table">
            {withdrawals && withdrawals.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Bank Details</th>
                      <th>Status</th>
                      <th>Requested</th>
                      <th>Processed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.slice(0, 5).map((withdrawal) => (
                      <tr key={withdrawal._id}>
                        <td>
                          <div className="amount">{formatPrice(withdrawal.amount)}</div>
                        </td>
                        <td>
                          <div className="bank-info">
                            <div>{withdrawal.bankDetails.bankName}</div>
                            <div className="account-number">***{withdrawal.bankDetails.accountNumber.slice(-4)}</div>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${withdrawal.status}`}>
                            {withdrawal.status === 'pending' && '⏳ Pending'}
                            {withdrawal.status === 'processing' && '🔄 Processing'}
                            {withdrawal.status === 'completed' && '✅ Completed'}
                            {withdrawal.status === 'failed' && '❌ Failed'}
                          </span>
                        </td>
                        <td>{new Date(withdrawal.requestedAt).toLocaleDateString()}</td>
                        <td>
                          {withdrawal.processedAt 
                            ? new Date(withdrawal.processedAt).toLocaleDateString()
                            : '-'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">💳</div>
                <h3>No Withdrawals Yet</h3>
                <p>Your withdrawal requests will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="modal-overlay" onClick={() => setShowWithdrawalModal(false)}>
          <div className="modal withdrawal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💰 Withdraw Earnings</h3>
              <button className="modal-close" onClick={() => setShowWithdrawalModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="balance-info">
                <div className="available-balance">
                  <span>Available Balance:</span>
                  <span className="balance-amount">{formatPrice(stats?.availableBalance || 0)}</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="withdrawalAmount">Withdrawal Amount *</label>
                <input
                  type="number"
                  id="withdrawalAmount"
                  placeholder="Enter amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  max={stats?.availableBalance || 0}
                  min="1000"
                />
                <small>Minimum withdrawal: ₦1,000</small>
              </div>

              {/* Bank Details Display */}
              <div className="bank-details-section">
                <h4>💳 Bank Details</h4>
                {userSettings?.bankDetails?.accountNumber ? (
                  <div className="saved-bank-details">
                    <div className="bank-info">
                      <div className="bank-row">
                        <span className="label">Bank:</span>
                        <span className="value">{userSettings.bankDetails.bankName}</span>
                      </div>
                      <div className="bank-row">
                        <span className="label">Account:</span>
                        <span className="value">***{userSettings.bankDetails.accountNumber.slice(-4)}</span>
                      </div>
                      <div className="bank-row">
                        <span className="label">Name:</span>
                        <span className="value">{userSettings.bankDetails.accountName}</span>
                      </div>
                    </div>
                    <small className="bank-note">
                      These saved bank details will be used for withdrawal.
                      <Link to="/settings" className="settings-link"> Update in Settings</Link>
                    </small>
                  </div>
                ) : (
                  <div className="no-bank-details">
                    <div className="warning-message">
                      <span className="warning-icon">⚠️</span>
                      <div>
                        <p><strong>No bank details found!</strong></p>
                        <p>Please set up your bank details in Settings first.</p>
                        <Link to="/settings" className="settings-btn">Go to Settings</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="withdrawal-note">
                <p><strong>Note:</strong> Withdrawals are processed within 1-3 business days. A processing fee of 2% applies to all withdrawals.</p>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn secondary" 
                onClick={() => setShowWithdrawalModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`btn primary ${withdrawalMutation.isLoading ? 'loading' : ''}`}
                onClick={handleWithdrawal}
                disabled={withdrawalMutation.isLoading || !userSettings?.bankDetails?.accountNumber}
              >
                {withdrawalMutation.isLoading ? '⏳ Processing...' : 
                 !userSettings?.bankDetails?.accountNumber ? '🏦 Set Bank Details First' :
                 '💰 Request Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerDashboard;

