import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./Profile.scss";
import newRequest from "../../utils/newRequest";
import VerifiedBadge from "../../components/VerifiedBadge";
import getCurrentUser from "../../utils/getCurrentUser";
import { formatLastSeen } from "../../utils/timeUtils";
import Review from "../../components/review/Review";
import { ProfileHeaderSkeleton, ProfileContentSkeleton, ProfileSidebarSkeleton } from "../../components/skeleton/Skeleton";

const BuyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState("about");

  // Fetch profile data
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => newRequest.get(`/profiles/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  // Fetch reviews given by this buyer
  const { data: givenReviews } = useQuery({
    queryKey: ["buyer-reviews", id],
    queryFn: () => newRequest.get(`/reviews?buyerId=${id}`).then((res) => res.data),
    enabled: !!id,
  });

  useEffect(() => {
    if (profileData?.user?.isSeller) {
      // Redirect to seller profile if user is a seller
      navigate(`/seller-profile/${id}`);
    }
  }, [profileData, id, navigate]);

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="container">
          <ProfileHeaderSkeleton />
          <div className="profile-layout">
            <div className="profile-main">
              <ProfileContentSkeleton />
            </div>
            <div className="profile-sidebar">
              <ProfileSidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="container">
          <h2>Profile not found</h2>
          <p>The buyer profile you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { user, stats } = profileData || {};

  if (!user) return null;

  const isOwnProfile = currentUser?._id === user._id;

  const formatMemberSince = (date) => {
    const memberDate = new Date(date);
    return memberDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleContactBuyer = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    // Navigate to messages or open contact modal
    navigate(`/message/new?to=${user._id}`);
  };

  return (
    <div className="buyer-profile">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-banner">
            <div className="profile-main-info">
              <div className="profile-avatar">
                <img
                  src={user.img || "/img/noavatar.jpg"}
                  alt={user.username}
                  className="avatar-img"
                />
                <div className="buyer-badge">BUYER</div>
              </div>
              
              <div className="profile-details">
                <div className="profile-name">
                  <h1>{user.firstname} {user.lastname}</h1>
                  <span className="username">@{user.username} <VerifiedBadge user={user} /></span>
                </div>
                
                <div className="profile-meta">
                  <div className="location">
                    <span className="icon">📍</span>
                    <span>{user.state || "Location not specified"}</span>
                  </div>
                  
                  <div className="member-since">
                    <span className="icon">📅</span>
                    <span>Member since {formatMemberSince(stats?.joinedDate)}</span>
                  </div>
                  
                  <div className="last-seen">
                    <span className="icon">👀</span>
                    <span>
                      Last seen {formatLastSeen(user.lastSeen)}
                    </span>
                  </div>
                </div>

                <div className="profile-stats buyer-stats">
                  <div className="stat">
                    <span className="stat-number">{stats?.totalOrders || 0}</span>
                    <span className="stat-label">Orders placed</span>
                  </div>
                  
                  <div className="stat">
                    <span className="stat-number">{stats?.completedOrders || 0}</span>
                    <span className="stat-label">Orders completed</span>
                  </div>
                  
                  <div className="stat">
                    <span className="stat-number">{givenReviews?.length || 0}</span>
                    <span className="stat-label">Reviews given</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {!isOwnProfile && currentUser?.isSeller && (
                <button 
                  className="contact-btn primary"
                  onClick={handleContactBuyer}
                >
                  Contact Buyer
                </button>
              )}
              
              {isOwnProfile && (
                <button 
                  className="edit-profile-btn primary"
                  onClick={() => navigate("/edit-profile")}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Trust Score */}
          <div className="trust-score">
            <div className="trust-indicator">
              <span className="trust-label">Trust Score</span>
              <div className="trust-meter">
                <div 
                  className="trust-fill" 
                  style={{ 
                    width: `${Math.min(
                      ((stats?.completedOrders || 0) / Math.max(stats?.totalOrders || 1, 1)) * 100, 
                      100
                    )}%` 
                  }}
                ></div>
              </div>
              <span className="trust-percentage">
                {Math.round(
                  ((stats?.completedOrders || 0) / Math.max(stats?.totalOrders || 1, 1)) * 100
                )}%
              </span>
            </div>
          </div>
        </div>

        {/* Profile Navigation */}
        <div className="profile-nav">
          <button
            className={`nav-tab ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`nav-tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews Given ({givenReviews?.length || 0})
          </button>
          <button
            className={`nav-tab ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </button>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* About Tab */}
          {activeTab === "about" && (
            <div className="tab-content about-tab">
              <div className="content-grid">
                <div className="main-content">
                  {/* Description */}
                  <div className="section">
                    <h3>About Me</h3>
                    <div className="description">
                      {user.desc ? (
                        <p>{user.desc}</p>
                      ) : (
                        <p className="no-content">No description available.</p>
                      )}
                    </div>
                  </div>

                  {/* Interests/Skills */}
                  {user.skills && user.skills.length > 0 && (
                    <div className="section">
                      <h3>Interests</h3>
                      <div className="skills-list">
                        {user.skills.map((skill, index) => (
                          <span key={index} className="skill-tag buyer-interest">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {user.languages && user.languages.length > 0 && (
                    <div className="section">
                      <h3>Languages</h3>
                      <div className="languages-list">
                        {user.languages.map((lang, index) => (
                          <div key={index} className="language-item">
                            <span className="language-name">{lang.language}</span>
                            <span className="language-level">{lang.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {user.education && user.education.length > 0 && (
                    <div className="section">
                      <h3>Education</h3>
                      <div className="education-list">
                        {user.education.map((edu, index) => (
                          <div key={index} className="education-item">
                            <div className="education-degree">{edu.degree} in {edu.field}</div>
                            <div className="education-school">{edu.institution}</div>
                            <div className="education-year">{edu.year}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="sidebar-content">
                  {/* Buyer Stats Card */}
                  <div className="buyer-stats-card">
                    <h4>Buyer Statistics</h4>
                    <div className="stat-item">
                      <span className="stat-icon">📦</span>
                      <div className="stat-details">
                        <span className="stat-number">{stats?.totalOrders || 0}</span>
                        <span className="stat-label">Total Orders</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">✅</span>
                      <div className="stat-details">
                        <span className="stat-number">{stats?.completedOrders || 0}</span>
                        <span className="stat-label">Completed</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">💬</span>
                      <div className="stat-details">
                        <span className="stat-number">{givenReviews?.length || 0}</span>
                        <span className="stat-label">Reviews Given</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">📅</span>
                      <div className="stat-details">
                        <span className="stat-number">
                          {formatMemberSince(stats?.joinedDate)}
                        </span>
                        <span className="stat-label">Member Since</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  {(user.phone || isOwnProfile) && (
                    <div className="contact-card">
                      <h4>Contact Information</h4>
                      <div className="contact-item">
                        <span className="contact-label">Last Seen:</span>
                        <span className="contact-value">
                          {formatLastSeen(user.lastSeen)}
                        </span>
                      </div>
                      {/* {user.phone && (
                        <div className="contact-item">
                          <span className="contact-label">Phone:</span>
                          <span className="contact-value">{user.phone}</span>
                        </div>
                      )} */}
                    </div>
                  )}

                  {/* Social Links */}
                  {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (
                    <div className="social-links">
                      <h4>Social Links</h4>
                      <div className="social-buttons">
                        {user.socialLinks.website && (
                          <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="social-btn">
                            🌐 Website
                          </a>
                        )}
                        {user.socialLinks.linkedin && (
                          <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn">
                            💼 LinkedIn
                          </a>
                        )}
                        {user.socialLinks.github && (
                          <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-btn">
                            💻 GitHub
                          </a>
                        )}
                        {/* {user.socialLinks.twitter && (
                          <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-btn">
                            🐦 Twitter
                          </a>
                        )} */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="tab-content reviews-tab">
              <div className="section">
                <h3>Reviews Given by {user.firstname}</h3>
                {givenReviews && givenReviews.length > 0 ? (
                  <div className="reviews-list">
                    {givenReviews.map((review) => (
                      <div key={review._id} className="buyer-review-item">
                        <div className="review-header">
                          <div className="gig-info">
                            <span className="gig-title">{review.gigTitle || "Gig Review"}</span>
                          </div>
                          <div className="review-rating">
                            {"⭐".repeat(review.rating)}
                          </div>
                        </div>
                        <div className="review-content">
                          <p>{review.desc}</p>
                        </div>
                        <div className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-content">
                    <p>No reviews given yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="tab-content activity-tab">
              <div className="section">
                <h3>Recent Activity</h3>
                <div className="activity-timeline">
                  <div className="activity-item">
                    <div className="activity-icon">👤</div>
                    <div className="activity-content">
                      <p>Joined Nairalancers</p>
                      <span className="activity-date">
                        {formatMemberSince(stats?.joinedDate)}
                      </span>
                    </div>
                  </div>
                  
                  {stats?.totalOrders > 0 && (
                    <div className="activity-item">
                      <div className="activity-icon">📦</div>
                      <div className="activity-content">
                        <p>Placed {stats.totalOrders} order{stats.totalOrders !== 1 ? 's' : ''}</p>
                        <span className="activity-date">Lifetime</span>
                      </div>
                    </div>
                  )}
                  
                  {givenReviews && givenReviews.length > 0 && (
                    <div className="activity-item">
                      <div className="activity-icon">⭐</div>
                      <div className="activity-content">
                        <p>Left {givenReviews.length} review{givenReviews.length !== 1 ? 's' : ''}</p>
                        <span className="activity-date">Lifetime</span>
                      </div>
                    </div>
                  )}
                  
                  {(!stats?.totalOrders || stats.totalOrders === 0) && 
                   (!givenReviews || givenReviews.length === 0) && (
                    <div className="no-content">
                      <p>No recent activity to display.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerProfile;
