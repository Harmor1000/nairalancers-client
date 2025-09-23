import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./MilestoneSetup.scss";
import newRequest from "../../utils/newRequest";

const MilestoneSetup = ({ order, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [milestones, setMilestones] = useState([
    {
      title: "",
      description: "",
      amount: 0,
      dueDate: ""
    }
  ]);
  const [submitError, setSubmitError] = useState(null);

  const createMilestonesMutation = useMutation({
    mutationFn: (milestoneData) => 
      newRequest.post(`/orders/${order._id}/milestones`, milestoneData),
    onSuccess: () => {
      queryClient.invalidateQueries(["order", order._id]);
      onSuccess && onSuccess();
      onClose();
    },
    onError: (error) => {
      // Parse backend error message
      const backendMsg = error?.response?.data?.message || error?.response?.data?.error;
      const msg = backendMsg || error?.message || "Failed to create milestones. Please try again.";
      setSubmitError(msg);
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: "",
        description: "",
        amount: 0,
        dueDate: ""
      }
    ]);
  };

  const removeMilestone = (index) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const getTotalAmount = () => {
    return milestones.reduce((sum, milestone) => sum + (parseFloat(milestone.amount) || 0), 0);
  };

  const handleSubmit = () => {
    setSubmitError(null);
    const totalAmount = getTotalAmount();
    if (Math.abs(totalAmount - order.price) > 1) {
      alert(`Total milestone amount (${formatPrice(totalAmount)}) must equal order price (${formatPrice(order.price)})`);
      return;
    }

    const isValid = milestones.every(m => 
      m.title.trim() && 
      m.description.trim() && 
      m.amount > 0 && 
      m.dueDate
    );

    if (!isValid) {
      alert("Please fill in all milestone fields");
      return;
    }

    createMilestonesMutation.mutate({
      milestones: milestones.map(m => ({
        ...m,
        amount: parseFloat(m.amount)
      }))
    });
  };

  return (
    <div className="milestone-setup">
      {submitError && (
        <div className="setup-error" style={{
          background: '#fdecea', color: '#b71c1c', border: '1px solid #f5c6cb',
          padding: '10px 12px', borderRadius: 6, marginBottom: 12
        }}>
          <strong>❌ Error:</strong> {submitError}
        </div>
      )}
      <div className="setup-header">
        <h2>🎯 Set Up Project Milestones</h2>
        <p>Break down your project into manageable milestones for secure payments</p>
        <div className="order-info">
          <span><strong>Order:</strong> {order.title}</span>
          <span><strong>Total Amount:</strong> {formatPrice(order.price)}</span>
        </div>
      </div>

      <div className="milestones-container">
        {milestones.map((milestone, index) => (
          <div key={index} className="milestone-form">
            <div className="milestone-header">
              <h3>Milestone #{index + 1}</h3>
              {milestones.length > 1 && (
                <button 
                  className="remove-btn"
                  onClick={() => removeMilestone(index)}
                  type="button"
                >
                  ❌
                </button>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Milestone Title *</label>
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                  placeholder="e.g., Design Mockups"
                />
              </div>

              <div className="form-group">
                <label>Amount (₦) *</label>
                <input
                  type="number"
                  value={milestone.amount}
                  onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                  placeholder="0"
                  min="1"
                />
              </div>

              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  value={milestone.description}
                  onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                  placeholder="Describe what will be delivered in this milestone..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  value={milestone.dueDate}
                  onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="milestone-actions">
        <button className="add-milestone-btn" onClick={addMilestone} type="button">
          ➕ Add Another Milestone
        </button>
      </div>

      <div className="milestone-summary">
        <div className="summary-row">
          <span>Total Milestones:</span>
          <span>{milestones.length}</span>
        </div>
        <div className="summary-row">
          <span>Total Amount:</span>
          <span className={getTotalAmount() === order.price ? 'correct' : 'incorrect'}>
            {formatPrice(getTotalAmount())}
          </span>
        </div>
        <div className="summary-row">
          <span>Order Price:</span>
          <span>{formatPrice(order.price)}</span>
        </div>
        {Math.abs(getTotalAmount() - order.price) > 1 && (
          <div className="warning">
            ⚠️ Total milestone amount must equal order price
          </div>
        )}
      </div>

      <div className="setup-footer">
        <button className="btn secondary" onClick={onClose}>
          Cancel
        </button>
        <button 
          className="btn primary"
          onClick={handleSubmit}
          disabled={createMilestonesMutation.isLoading || Math.abs(getTotalAmount() - order.price) > 1}
        >
          {createMilestonesMutation.isLoading ? 'Creating...' : 'Create Milestones'}
        </button>
      </div>

      <div className="milestone-benefits">
        <h4>🛡️ Milestone Benefits:</h4>
        <ul>
          <li>Pay only for completed work at each stage</li>
          <li>Reduced risk for large projects</li>
          <li>Better project management and tracking</li>
          <li>Freelancer motivation through progress payments</li>
          <li>Easy dispute resolution per milestone</li>
        </ul>
      </div>
    </div>
  );
};

export default MilestoneSetup;
