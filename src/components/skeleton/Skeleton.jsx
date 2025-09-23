import React from "react";
import "./Skeleton.scss";

const Skeleton = ({ 
  width = "100%", 
  height = "20px", 
  borderRadius = "4px",
  className = "",
  variant = "rectangular" // rectangular, circular, text
}) => {
  const getSkeletonClass = () => {
    switch (variant) {
      case "circular":
        return "skeleton skeleton-circular";
      case "text":
        return "skeleton skeleton-text";
      default:
        return "skeleton skeleton-rectangular";
    }
  };

  return (
    <div 
      className={`${getSkeletonClass()} ${className}`}
      style={{
        width,
        height,
        borderRadius: variant === "circular" ? "50%" : borderRadius
      }}
    />
  );
};

// Profile skeleton components
export const ProfileHeaderSkeleton = () => (
  <div className="skeleton-profile-header">
    <div className="skeleton-avatar-section">
      <Skeleton variant="circular" width="120px" height="120px" />
      <div className="skeleton-user-info">
        <Skeleton width="200px" height="28px" className="skeleton-name" />
        <Skeleton width="150px" height="20px" className="skeleton-title" />
        <Skeleton width="100px" height="16px" className="skeleton-rating" />
      </div>
    </div>
    <div className="skeleton-stats">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="skeleton-stat-item">
          <Skeleton width="40px" height="24px" />
          <Skeleton width="60px" height="14px" />
        </div>
      ))}
    </div>
  </div>
);

export const ProfileContentSkeleton = () => (
  <div className="skeleton-profile-content">
    <div className="skeleton-section">
      <Skeleton width="120px" height="24px" className="skeleton-section-title" />
      <Skeleton width="100%" height="80px" className="skeleton-description" />
    </div>
    
    <div className="skeleton-section">
      <Skeleton width="80px" height="24px" className="skeleton-section-title" />
      <div className="skeleton-skills">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} width="80px" height="32px" borderRadius="16px" />
        ))}
      </div>
    </div>
    
    <div className="skeleton-section">
      <Skeleton width="100px" height="24px" className="skeleton-section-title" />
      <div className="skeleton-languages">
        {[1, 2, 3].map((item) => (
          <div key={item} className="skeleton-language-item">
            <Skeleton width="100px" height="20px" />
            <Skeleton width="60px" height="16px" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ProfileSidebarSkeleton = () => (
  <div className="skeleton-profile-sidebar">
    <div className="skeleton-contact-section">
      <Skeleton width="80px" height="20px" className="skeleton-section-title" />
      <div className="skeleton-contact-item">
        <Skeleton width="20px" height="20px" />
        <Skeleton width="120px" height="16px" />
      </div>
      <div className="skeleton-contact-item">
        <Skeleton width="20px" height="20px" />
        <Skeleton width="100px" height="16px" />
      </div>
    </div>
    
    <div className="skeleton-pricing-section">
      <Skeleton width="100px" height="20px" className="skeleton-section-title" />
      <Skeleton width="80px" height="24px" className="skeleton-price" />
      <Skeleton width="100%" height="40px" className="skeleton-button" />
    </div>
  </div>
);

// Edit Profile skeleton
export const EditProfileSkeleton = () => (
  <div className="skeleton-edit-profile">
    <div className="skeleton-edit-header">
      <Skeleton width="150px" height="32px" />
      <Skeleton width="300px" height="18px" />
    </div>
    
    <div className="skeleton-edit-form">
      <div className="skeleton-edit-sidebar">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="skeleton-nav-item">
            <Skeleton width="20px" height="20px" />
            <Skeleton width="80px" height="16px" />
          </div>
        ))}
      </div>
      
      <div className="skeleton-edit-content">
        <div className="skeleton-section">
          <Skeleton width="140px" height="24px" />
          <Skeleton width="250px" height="16px" />
        </div>
        
        <div className="skeleton-form-grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="skeleton-form-field">
              <Skeleton width="100px" height="16px" />
              <Skeleton width="100%" height="44px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Settings skeleton
export const SettingsSkeleton = () => (
  <div className="skeleton-settings">
    <div className="skeleton-settings-header">
      <Skeleton width="120px" height="32px" />
      <Skeleton width="280px" height="18px" />
    </div>
    
    <div className="skeleton-settings-content">
      <div className="skeleton-settings-sidebar">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="skeleton-settings-nav-item">
            <Skeleton width="20px" height="20px" />
            <Skeleton width="100px" height="16px" />
          </div>
        ))}
      </div>
      
      <div className="skeleton-settings-main">
        <div className="skeleton-settings-section">
          <Skeleton width="160px" height="24px" />
          <Skeleton width="320px" height="16px" />
          
          <div className="skeleton-settings-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="skeleton-settings-item">
                <div className="skeleton-settings-item-header">
                  <Skeleton width="30px" height="30px" borderRadius="50%" />
                  <div>
                    <Skeleton width="120px" height="18px" />
                    <Skeleton width="200px" height="14px" />
                  </div>
                </div>
                <Skeleton width="60px" height="32px" borderRadius="16px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Gig Card skeleton
export const GigCardSkeleton = () => (
  <div className="skeleton-gig-card">
    <div className="skeleton-gig-image">
      <Skeleton width="100%" height="180px" />
    </div>
    <div className="skeleton-gig-content">
      <div className="skeleton-gig-user">
        <Skeleton variant="circular" width="32px" height="32px" />
        <Skeleton width="100px" height="16px" />
      </div>
      <Skeleton width="100%" height="20px" className="skeleton-gig-title" />
      <Skeleton width="80%" height="16px" className="skeleton-gig-desc" />
      <div className="skeleton-gig-footer">
        <Skeleton width="60px" height="16px" />
        <Skeleton width="80px" height="24px" />
      </div>
    </div>
  </div>
);

// Gig Grid skeleton
export const GigGridSkeleton = ({ count = 6 }) => (
  <div className="skeleton-gig-grid">
    {Array.from({ length: count }, (_, index) => (
      <GigCardSkeleton key={index} />
    ))}
  </div>
);

export default Skeleton;
