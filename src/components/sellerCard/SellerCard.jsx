import React from "react";
import { Link } from "react-router-dom";
import "./SellerCard.scss";
import VerifiedBadge from "../VerifiedBadge";
import { formatLastSeen } from "../../utils/timeUtils";

const SellerCard = ({ seller }) => {
  if (!seller) return null;

  const getAvailabilityColor = (availability) => {
    const colors = {
      Available: "#1dbf73",
      Busy: "#ffaa00", 
      Away: "#ff6b6b",
      Unavailable: "#95a5a6",
    };
    return colors[availability] || "#95a5a6";
  };

  const formatMemberSince = (date) => {
    const memberDate = new Date(date);
    return memberDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="seller-card">
      <Link to={`/seller-profile/${seller._id}`} className="seller-card-link">
        <div className="seller-card-header">
          <div className="seller-avatar">
            <img
              src={seller.img || "/img/noavatar.jpg"}
              alt={seller.username}
              className="avatar-img"
            />
            <div
              className="availability-indicator"
              style={{ backgroundColor: getAvailabilityColor(seller.availability) }}
              title={seller.availability}
            ></div>
          </div>
          
          <div className="seller-info">
            <h3 className="seller-name">
              {seller.firstname} {seller.lastname}
            </h3>
            <div className="seller-username">
              @{seller.username} <VerifiedBadge user={seller} />
            </div>
          </div>
        </div>

        {seller.professionalTitle && (
          <div className="seller-title">
            {seller.professionalTitle}
          </div>
        )}

        <div className="seller-details">
          {seller.state && (
            <div className="location">
              <span className="icon">📍</span>
              <span>{seller.state}</span>
            </div>
          )}
          
          <div className="member-since">
            <span className="icon">📅</span>
            <span>Member since {formatMemberSince(seller.createdAt)}</span>
          </div>

          {seller.responseTime && (
            <div className="response-time">
              <span className="icon">⚡</span>
              <span>Responds {seller.responseTime.toLowerCase()}</span>
            </div>
          )}
        </div>

        {seller.skills && seller.skills.length > 0 && (
          <div className="seller-skills">
            {seller.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
            {seller.skills.length > 3 && (
              <span className="skill-more">+{seller.skills.length - 3} more</span>
            )}
          </div>
        )}

        {seller.hourlyRate && (
          <div className="seller-rate">
            <span className="rate-label">Starting at</span>
            <span className="rate-amount">₦{seller.hourlyRate.toLocaleString()}/hr</span>
          </div>
        )}
      </Link>
    </div>
  );
};

export default SellerCard;
