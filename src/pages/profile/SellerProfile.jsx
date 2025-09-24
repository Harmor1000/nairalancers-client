import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./Profile.scss";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import { formatLastSeen } from "../../utils/timeUtils";
import GigCard from "../../components/gigCard/GigCard";
import VerifiedBadge from "../../components/VerifiedBadge";
import Review from "../../components/review/Review";
import { ProfileHeaderSkeleton, ProfileContentSkeleton, ProfileSidebarSkeleton } from "../../components/skeleton/Skeleton";

const SellerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState("about");
  const [isFavorited, setIsFavorited] = useState(false);
  const queryClient = useQueryClient();

  // Fetch profile data
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => newRequest.get(`/profiles/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: (sellerId) => newRequest.put(`/favorites/toggle/${sellerId}?type=seller`),
    onSuccess: (data) => {
      setIsFavorited(data.data.isFavorite);
      queryClient.invalidateQueries(["favorites"]);
    },
    onError: (error) => {
      console.error("Error toggling favorite:", error);
    },
  });

  // Check if seller is favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (currentUser && id && profileData?.user && currentUser._id !== profileData.user._id) {
        try {
          const response = await newRequest.get(`/favorites/check/${id}?type=seller`);
          setIsFavorited(response.data.isFavorite);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };
    
    checkFavoriteStatus();
  }, [id, currentUser, profileData]);

  useEffect(() => {
    if (profileData?.user && !profileData.user.isSeller) {
      // Redirect to buyer profile if user is not a seller
      navigate(`/buyer-profile/${id}`);
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
          <p>The seller profile you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { user, gigs, reviews, stats } = profileData || {};

  if (!user) return null;

  const isOwnProfile = currentUser?._id === user._id;

  const formatMemberSince = (date) => {
    const memberDate = new Date(date);
    return memberDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getAvailabilityColor = (availability) => {
    const colors = {
      Available: "#1dbf73",
      Busy: "#ffaa00",
      Away: "#ff6b6b",
      Unavailable: "#95a5a6",
    };
    return colors[availability] || "#95a5a6";
  };

  const handleContactSeller = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    // Navigate to messages or open contact modal
    navigate(`/message/new?to=${user._id}`);
  };

  const handleToggleFavorite = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    toggleFavoriteMutation.mutate(id);
  };

  return (
    <div className="seller-profile">
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
                <div
                  className="availability-indicator"
                  style={{ backgroundColor: getAvailabilityColor(user.availability) }}
                  title={user.availability}
                ></div>
              </div>
              
              <div className="profile-details">
                <div className="profile-name">
                  <h1>{user.firstname} {user.lastname}</h1>
                  <span className="username">@{user.username} <VerifiedBadge user={user} /></span>
                </div>
                
                {user.professionalTitle && (
                  <h2 className="professional-title">{user.professionalTitle}</h2>
                )}
                
                <div className="profile-meta">
                  <div className="location">
                    <span className="icon">📍</span>
                    <span>{user.state || "Location not specified"}</span>
                  </div>
                  
                  <div className="member-since">
                    <span className="icon">📅</span>
                    <span>Member since {formatMemberSince(stats?.joinedDate)}</span>
                  </div>
                  
                  {user.responseTime && (
                    <div className="response-time">
                      <span className="icon">⚡</span>
                      <span>Responds {user.responseTime.toLowerCase()}</span>
                    </div>
                  )}
                </div>

                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-number">{stats?.averageRating || 0}</span>
                    <span className="stat-label">
                      ⭐ ({stats?.totalReviews || 0} reviews)
                    </span>
                  </div>
                  
                  <div className="stat">
                    <span className="stat-number">{stats?.completedOrders || 0}</span>
                    <span className="stat-label">Orders completed</span>
                  </div>
                  
                  <div className="stat">
                    <span className="stat-number">{Math.round(stats?.completionRate || 0)}%</span>
                    <span className="stat-label">On-time delivery</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {!isOwnProfile && (
                <>
                  <button 
                    className="contact-btn primary"
                    onClick={handleContactSeller}
                  >
                    Contact Me
                  </button>
                  {!currentUser?.isSeller && (
                    <button 
                      className={`favorite-btn secondary ${isFavorited ? 'favorited' : ''}`}
                      onClick={handleToggleFavorite}
                      disabled={toggleFavoriteMutation.isLoading}
                    >
                      {toggleFavoriteMutation.isLoading ? (
                        "⏳ Loading..."
                      ) : isFavorited ? (
                        "💖 Remove from Favorites"
                      ) : (
                        "❤️ Add to Favorites"
                      )}
                    </button>
                  )}
                </>
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

          {user.hourlyRate && (
            <div className="hourly-rate">
              <span className="rate-label">Starting at</span>
              <span className="rate-amount">₦{user.hourlyRate.toLocaleString()}/hr</span>
            </div>
          )}
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
            className={`nav-tab ${activeTab === "gigs" ? "active" : ""}`}
            onClick={() => setActiveTab("gigs")}
          >
            Gigs ({gigs?.length || 0})
          </button>
          <button
            className={`nav-tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({reviews?.length || 0})
          </button>
          <button
            className={`nav-tab ${activeTab === "portfolio" ? "active" : ""}`}
            onClick={() => setActiveTab("portfolio")}
          >
            Portfolio
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

                  {/* Skills */}
                  {user.skills && user.skills.length > 0 && (
                    <div className="section">
                      <h3>Skills</h3>
                      <div className="skills-list">
                        {user.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">
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

                  {/* Certifications */}
                  {user.certifications && user.certifications.length > 0 && (
                    <div className="section">
                      <h3>Certifications</h3>
                      <div className="certifications-list">
                        {user.certifications.map((cert, index) => (
                          <div key={index} className="certification-item">
                            <div className="certification-name">{cert.name}</div>
                            <div className="certification-issuer">{cert.issuer}</div>
                            <div className="certification-year">{cert.year}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="sidebar-content">
                  {/* Contact Information */}
                  <div className="contact-card">
                    <h4>Contact Information</h4>
                    <div className="contact-item">
                      <span className="contact-label">Response Time:</span>
                      <span className="contact-value">{user.responseTime || "Within 24 hours"}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Last Seen:</span>
                      <span className="contact-value">
                        {formatLastSeen(user.lastSeen)}
                      </span>
                    </div>
                    {/* {user._id === currentUser._id && (user.phone && (
                      <div className="contact-item">
                        <span className="contact-label">Phone:</span>
                        <span className="contact-value">{user.phone}</span>
                      </div>
                    ))} */}
                  </div>

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

          {/* Gigs Tab */}
          {activeTab === "gigs" && (
            <div className="tab-content gigs-tab">
              <div className="section">
                <h3>Active Gigs</h3>
                {gigs && gigs.length > 0 ? (
                  <div className="gigs-grid">
                    {gigs.map((gig) => (
                      <GigCard key={gig._id} item={gig} />
                    ))}
                  </div>
                ) : (
                  <div className="no-content">
                    <p>No active gigs at the moment.</p>
                    {isOwnProfile && (
                      <button 
                        className="create-gig-btn"
                        onClick={() => navigate("/add")}
                      >
                        Create Your First Gig
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="tab-content reviews-tab">
              <div className="section">
                <h3>Customer Reviews</h3>
                {reviews && reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <Review key={review._id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="no-content">
                    <p>No reviews yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === "portfolio" && (
            <div className="tab-content portfolio-tab">
              <div className="section">
                <h3>Portfolio</h3>
                {user.portfolio && user.portfolio.length > 0 ? (
                  <div className="portfolio-grid">
                    {user.portfolio.map((item, index) => (
                      <div key={index} className="portfolio-item">
                        {item.image && (
                          <div className="portfolio-image">
                            <img src={item.image} alt={item.title} />
                          </div>
                        )}
                        <div className="portfolio-content">
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                          {item.link && (
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="portfolio-link"
                            >
                              View Project →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-content">
                    <p>No portfolio items to display.</p>
                    {isOwnProfile && (
                      <p>Add portfolio items in your settings to showcase your work.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
