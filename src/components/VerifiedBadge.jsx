import React from 'react';
import './VerifiedBadge.scss';

// Helper to determine if a user is ID-verified
export const isUserIdVerified = (user) => {
  if (!user) return false;
  // Prefer explicit verification level, fallback to idVerification.status
  const level = user.verificationLevel;
  if (level && (level === 'id_verified' || level === 'enhanced')) return true;
  if (user.idVerification && user.idVerification.status === 'approved') return true;
  return false;
};

const VerifiedBadge = ({ user, className = '' }) => {
  if (!isUserIdVerified(user)) return null;
  return (
    <span className={`verified-badge ${className}`} title="ID Verified" aria-label="ID Verified">
      {/* Inline SVG checkmark in a circle */}
      <svg className="verified-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* <circle cx="12" cy="12" r="10" fill="#1dbf73"/> */}
        <circle cx="12" cy="12" r="10" fill="#0d91e9"/>
        <path d="M7 12.5L10.2 15.7L17 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
};

export default VerifiedBadge;
