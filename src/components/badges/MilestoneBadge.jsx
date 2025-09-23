import React from "react";
import "./milestoneBadge.css";

const MilestoneBadge = ({ compact = false, className = "" }) => {
  return (
    <span className={`milestone-badge ${compact ? "compact" : ""} ${className}`.trim()} title="This gig uses milestone-based pricing">
      <span className="badge-icon">🎯</span>
      <span className="badge-text">Milestone-based</span>
    </span>
  );
};

export default MilestoneBadge;
