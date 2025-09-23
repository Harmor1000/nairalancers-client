import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./DisputeManagement.scss";
import newRequest from "../../utils/newRequest";
import { PulseLoader } from "react-spinners";

const DisputeManagement = () => {
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceForm, setEvidenceForm] = useState({
    evidenceType: '',
    description: '',
    fileUrls: []
  });

  // Fetch user's disputes
  const { data: disputes, isLoading, error } = useQuery({
    queryKey: ["disputes"],
    queryFn: () => newRequest.get(`/orders`).then((res) => {
      // Filter orders that have disputes
      return res.data.filter(order => order.disputeStatus !== 'none');
    }),
  });

  // Add evidence mutation
  const addEvidenceMutation = useMutation({
    mutationFn: (evidenceData) => 
      newRequest.post(`/disputes/${selectedDispute._id}/evidence`, evidenceData),
    onSuccess: () => {
      queryClient.invalidateQueries(["disputes"]);
      setShowEvidenceModal(false);
      setEvidenceForm({ evidenceType: '', description: '', fileUrls: [] });
    },
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDisputeStatusInfo = (status) => {
    const statusMap = {
      pending: { 
        text: "Pending Review", 
        color: "orange", 
        icon: "⏳",
        description: "Dispute submitted. Waiting for admin review."
      },
      under_review: { 
        text: "Under Review", 
        color: "blue", 
        icon: "👁️",
        description: "Admin team is reviewing the dispute and evidence."
      },
      resolved: { 
        text: "Resolved", 
        color: "green", 
        icon: "✅",
        description: "Dispute has been resolved by admin team."
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const handleSubmitEvidence = () => {
    if (!evidenceForm.evidenceType || !evidenceForm.description) return;
    
    addEvidenceMutation.mutate({
      orderId: selectedDispute._id,
      ...evidenceForm
    });
  };

  const handleFileUpload = (files) => {
    // This would integrate with your file upload system
    const uploadedUrls = Array.from(files).map(file => ({
      filename: file.name,
      url: URL.createObjectURL(file), // Replace with actual upload
      size: file.size
    }));
    setEvidenceForm(prev => ({
      ...prev,
      fileUrls: uploadedUrls
    }));
  };

  const renderDisputeCard = (dispute) => {
    const statusInfo = getDisputeStatusInfo(dispute.disputeStatus);
    const daysSinceDispute = dispute.disputeInitiatedAt 
      ? Math.floor((new Date() - new Date(dispute.disputeInitiatedAt)) / (1000 * 60 * 60 * 24))
      : 0;

    return (
      <div key={dispute._id} className="dispute-card">
        <div className="dispute-header">
          <div className="dispute-info">
            <img src={dispute.img} alt={dispute.title} className="dispute-image" />
            <div className="dispute-details">
              <h3>{dispute.title}</h3>
              <div className="dispute-meta">
                <span className="price">{formatPrice(dispute.price)}</span>
                <span className="dispute-id">ID: {dispute._id}</span>
              </div>
              <div className="participants">
                <span>Client: {currentUser.isSeller ? dispute.buyerUsername : "You"}</span>
                <span>Freelancer: {currentUser.isSeller ? "You" : dispute.sellerUsername}</span>
              </div>
            </div>
          </div>
          <div className={`dispute-status ${statusInfo.color}`}>
            <div className="status-icon">{statusInfo.icon}</div>
            <div className="status-text">
              <h4>{statusInfo.text}</h4>
              <p>{statusInfo.description}</p>
            </div>
          </div>
        </div>

        <div className="dispute-content">
          <div className="dispute-reason">
            <h4>Dispute Reason</h4>
            <p><strong>{dispute.disputeReason}</strong></p>
            <p>{dispute.disputeDetails}</p>
          </div>

          <div className="dispute-timeline">
            <div className="timeline-item">
              <span className="timeline-icon">📅</span>
              <span>Initiated {daysSinceDispute} days ago</span>
            </div>
            {dispute.disputeReviewStartedAt && (
              <div className="timeline-item">
                <span className="timeline-icon">👁️</span>
                <span>Review started {Math.floor((new Date() - new Date(dispute.disputeReviewStartedAt)) / (1000 * 60 * 60 * 24))} days ago</span>
              </div>
            )}
            {dispute.disputeResolvedAt && (
              <div className="timeline-item">
                <span className="timeline-icon">✅</span>
                <span>Resolved {Math.floor((new Date() - new Date(dispute.disputeResolvedAt)) / (1000 * 60 * 60 * 24))} days ago</span>
              </div>
            )}
          </div>

          {dispute.disputeResolution && (
            <div className="dispute-resolution">
              <h4>Resolution</h4>
              <p>{dispute.disputeResolution}</p>
              {dispute.refundAmount > 0 && (
                <p className="refund-info">
                  <strong>Refund Amount: {formatPrice(dispute.refundAmount)}</strong>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="dispute-actions">
          {dispute.disputeStatus !== 'resolved' && (
            <button 
              className="evidence-btn"
              onClick={() => {
                setSelectedDispute(dispute);
                setShowEvidenceModal(true);
              }}
            >
              📎 Add Evidence
            </button>
          )}
          <button 
            className="details-btn"
            onClick={() => window.open(`/orders/${dispute._id}`, '_blank')}
          >
            📋 View Order Details
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="dispute-management">
        <div className="loading-container">
          <PulseLoader color="#1dbf73" loading={true} size={20} />
          <div className="loading-text">Loading your disputes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dispute-management">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-message">Unable to load disputes</div>
          <div className="error-description">
            There was a problem loading your disputes. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dispute-management">
      <div className="container">
        <div className="header">
          <h1>🛡️ Dispute Management</h1>
          <p className="subtitle">
            Manage your active disputes and track their resolution progress
          </p>
        </div>

        {/* Dispute Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{disputes?.length || 0}</h3>
              <p>Total Disputes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{disputes?.filter(d => d.disputeStatus === 'pending').length || 0}</h3>
              <p>Pending Review</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <h3>{disputes?.filter(d => d.disputeStatus === 'under_review').length || 0}</h3>
              <p>Under Review</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{disputes?.filter(d => d.disputeStatus === 'resolved').length || 0}</h3>
              <p>Resolved</p>
            </div>
          </div>
        </div>

        {/* Disputes List */}
        <div className="disputes-section">
          {!disputes || disputes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🤝</div>
              <h3>No Disputes Found</h3>
              <p>You don't have any active disputes. This is great news!</p>
              <div className="empty-tips">
                <h4>💡 Tips to Avoid Disputes:</h4>
                <ul>
                  <li>Communicate clearly with clients/freelancers</li>
                  <li>Set clear expectations from the start</li>
                  <li>Use milestones for large projects</li>
                  <li>Deliver high-quality work on time</li>
                  <li>Review work thoroughly before approval</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="disputes-list">
              {disputes.map(renderDisputeCard)}
            </div>
          )}
        </div>

        {/* Evidence Modal */}
        {showEvidenceModal && (
          <div className="modal-overlay" onClick={() => setShowEvidenceModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📎 Add Evidence</h2>
                <button 
                  className="close-btn" 
                  onClick={() => setShowEvidenceModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <div className="evidence-info">
                  <p><strong>Dispute ID:</strong> {selectedDispute?._id}</p>
                  <p><strong>Order:</strong> {selectedDispute?.title}</p>
                </div>

                <div className="form-group">
                  <label>Evidence Type</label>
                  <select
                    value={evidenceForm.evidenceType}
                    onChange={(e) => setEvidenceForm(prev => ({
                      ...prev,
                      evidenceType: e.target.value
                    }))}
                  >
                    <option value="">Select evidence type</option>
                    <option value="screenshot">Screenshot</option>
                    <option value="document">Document</option>
                    <option value="communication">Communication</option>
                    <option value="video">Video</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={evidenceForm.description}
                    onChange={(e) => setEvidenceForm(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    placeholder="Describe this evidence and how it supports your case..."
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Upload Files (Optional)</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  {evidenceForm.fileUrls.length > 0 && (
                    <div className="uploaded-files">
                      {evidenceForm.fileUrls.map((file, index) => (
                        <div key={index} className="file-item">
                          📄 {file.filename}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="evidence-guidelines">
                  <h4>📋 Evidence Guidelines:</h4>
                  <ul>
                    <li>Provide clear, relevant evidence</li>
                    <li>Include timestamps where applicable</li>
                    <li>Screenshots should be unedited</li>
                    <li>Communication logs should be complete</li>
                    <li>Maximum 10MB per file</li>
                  </ul>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn secondary"
                  onClick={() => setShowEvidenceModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn primary"
                  onClick={handleSubmitEvidence}
                  disabled={
                    addEvidenceMutation.isLoading || 
                    !evidenceForm.evidenceType || 
                    !evidenceForm.description
                  }
                >
                  {addEvidenceMutation.isLoading ? 'Submitting...' : 'Submit Evidence'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputeManagement;
