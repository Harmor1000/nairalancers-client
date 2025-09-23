import React, { useState } from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import GigSkeleton from "./GigSkeleton.jsx";
import moment from 'moment';
import getCurrentUser from '../../utils/getCurrentUser';
import VerifiedBadge from '../../components/VerifiedBadge';
import MilestoneBadge from '../../components/badges/MilestoneBadge';
import useToast from '../../components/toast/useToast';

function Gig() {
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch gig details
  const {
    isLoading,
    error,
    data: gigData,
  } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then(res => res.data),
  });

  const userId = gigData?.userId;

  // Fetch seller details
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: userData,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then(res => res.data),
    enabled: !!userId,
  });

  // Calculate average rating safely
  const averageRating =
    gigData?.starNumber > 0
      ? Math.round(gigData.totalStars / gigData.starNumber)
      : null;

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {Array(5)
          .fill()
          .map((_, i) => (
            <img 
              src={i < rating ? "/img/star.png" : "/img/star-empty.png"} 
              alt="star" 
              key={i}
              className={i < rating ? "filled" : "empty"}
            />
          ))}
        <span className="rating-number">{rating}</span>
      </div>
    );
  };

  // Combine cover and gallery images for display
  const getAllImages = () => {
    const allImages = [];
    if (gigData?.cover) allImages.push(gigData.cover);
    if (gigData?.images && gigData.images.length > 0) {
      allImages.push(...gigData.images);
    }
    return allImages;
  };

  const allImages = getAllImages();

  // Gig management mutations (pause/resume)
  const pauseMutation = useMutation({
    mutationFn: () => newRequest.put(`/gigs/${id}/pause`),
    onMutate: () => setActionLoading(true),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["gig", id]);
      toast.success(res.data?.message || "Gig paused successfully.");
      setActionLoading(false);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to pause gig. Please try again.";
      toast.error(message);
      setActionLoading(false);
    }
  });

  const resumeMutation = useMutation({
    mutationFn: () => newRequest.put(`/gigs/${id}/resume`),
    onMutate: () => setActionLoading(true),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["gig", id]);
      toast.success(res.data?.message || "Gig resumed successfully.");
      setActionLoading(false);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to resume gig. Please try again.";
      toast.error(message);
      setActionLoading(false);
    }
  });

  const handlePauseGig = () => {
    const proceed = window.confirm("Pause this gig? It will be removed from public listings until you resume it.");
    if (proceed) pauseMutation.mutate();
  };

  const handleResumeGig = () => {
    const proceed = window.confirm("Resume this gig? Note: You can only have up to 5 active gigs.");
    if (proceed) resumeMutation.mutate();
  };

  // Contact seller functionality
  const handleContact = async () => {
    // Check if user is logged in
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Check if user is a buyer (not a seller)
    if (currentUser.isSeller) {
      setContactError("Only buyers can contact sellers");
      setTimeout(() => setContactError(null), 3000);
      return;
    }

    // Check if user is trying to contact themselves
    if (currentUser._id === gigData?.userId) {
      setContactError("You cannot contact yourself");
      setTimeout(() => setContactError(null), 3000);
      return;
    }

    setContactLoading(true);
    setContactError(null);

    try {
      // First try to get existing conversation
      const sellerId = gigData.userId;
      const buyerId = currentUser._id;
      const conversationId = sellerId + buyerId;

      try {
        const res = await newRequest.get(`/conversations/single/${conversationId}`);
        navigate(`/message/${res.data.id}`);
      } catch (err) {
        if (err.response?.status === 404) {
          // Conversation doesn't exist, create a new one
          const res = await newRequest.post(`/conversations/`, {
            to: sellerId,
          });
          navigate(`/message/${res.data.id}`);
        } else {
          throw err;
        }
      }
    } catch (error) {
      console.error("Contact error:", error);
      setContactError("Failed to start conversation. Please try again.");
      setTimeout(() => setContactError(null), 5000);
    } finally {
      setContactLoading(false);
    }
  };

  if (isLoading) return <GigSkeleton />;
  if (error) return (
    <div className="error-container">
      <div className="error-message">
        <h2>Oops! Something went wrong</h2>
        <p>We couldn't load this gig. Please try again later.</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    </div>
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Milestone helpers
  const isMilestoneGig = !!(gigData?.hasMilestones && Array.isArray(gigData?.milestones) && gigData.milestones.length > 0);
  const totalMilestonePrice = isMilestoneGig
    ? gigData.milestones.reduce((sum, m) => sum + (m.price || 0), 0)
    : null;
  const totalMilestoneDays = isMilestoneGig
    ? gigData.milestones.reduce((sum, m) => sum + (m.deliveryTime || 0), 0)
    : null;

  return (
    <div className="gig">
      <div className="container">
        {/* LEFT SIDE */}
        <div className="left">
          {/* Breadcrumbs */}
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Nairalancers</Link>
            <span className="separator">›</span>
            <Link to={`/gigs?cat=${gigData?.cat}`} className="breadcrumb-link">
              {gigData?.cat || "Category"}
            </Link>
            <span className="separator">›</span>
            <span className="current">{gigData?.subcategory || "Subcategory"}</span>
          </nav>

          {/* Title and Edit Button */}
          <div className="title-section">
            <h1 className="gig-title">{gigData?.title}</h1>
            {currentUser && currentUser._id === gigData?.userId && currentUser.isSeller && (
              <div className="gig-owner-actions">
                <Link to={`/edit-gig/${id}`} className="edit-gig-btn">
                  ✏️ Edit Gig
                </Link>
                <div className="gig-stats">
                  <span className="stat-item"><strong>{(gigData?.ordersCount ?? gigData?.sales ?? 0)}</strong> Orders</span>
                  <span className="stat-item">Status: <span className={`status-badge status-${gigData?.status || 'pending'}`}>{gigData?.status || 'pending'}</span></span>
                </div>
                <div className="gig-actions">
                  {gigData?.status === 'active' && (
                    <button
                      className="action-btn pause"
                      onClick={handlePauseGig}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Processing...' : '⏸️ Pause Gig'}
                    </button>
                  )}
                  {gigData?.status === 'paused' && (
                    <button
                      className="action-btn resume"
                      onClick={handleResumeGig}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Processing...' : '▶️ Resume Gig'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User info */}
          {isLoadingUser ? (
            <div className="user-skeleton">
              <div className="skeleton-circle"></div>
              <div className="skeleton-text"></div>
            </div>
          ) : errorUser ? (
            <div className="user-error">Unable to load seller information</div>
          ) : (
            <div className="user-info">
              <img
                className="profile-pic"
                src={userData?.img || "/img/noavatar.jpg"}
                alt={userData?.username || "Seller"}
                onError={(e) => {e.target.src = "/img/noavatar.jpg"}}
              />
              <div className="user-details">
                <span className="username">{userData?.username}</span>
                <VerifiedBadge user={userData} />
                {averageRating !== null && renderStars(averageRating)}
              </div>
            </div>
          )}

          {/* Image Gallery */}
          {allImages.length > 0 && (
            <div className="image-gallery">
              <div className="main-image">
                <img 
                  src={allImages[selectedImageIndex] || "/img/creating-product.gif"}
                  alt={`Gig image ${selectedImageIndex + 1}`}
                  onError={(e) => {e.target.src = "/img/creating-product.gif"}}
                />
              </div>
              {allImages.length > 1 && (
                <div className="image-thumbnails">
                  {allImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Gig thumbnail ${idx + 1}`}
                      className={`thumbnail ${idx === selectedImageIndex ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(idx)}
                      onError={(e) => {e.target.src = "/img/creating-product.gif"}}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About This Gig */}
          <section className="gig-description">
            <h2>About This Gig</h2>
            <div className="description-content">
              {gigData?.desc?.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Seller Information */}
          {isLoadingUser ? (
            <div className="seller-skeleton">
              <div className="skeleton-title"></div>
              <div className="skeleton-content"></div>
            </div>
          ) : errorUser ? (
            <div className="seller-error">Unable to load seller information</div>
          ) : (
            <section className="seller-info">
              <h2>About The Seller</h2>
              <div className="seller-header">
                <img
                  src={userData?.img || "/img/noavatar.jpg"}
                  alt={userData?.username || "Seller"}
                  className="seller-avatar"
                  onError={(e) => {e.target.src = "/img/noavatar.jpg"}}
                />
                <div className="seller-details">
                  <h3 className="seller-name">{userData?.username} <VerifiedBadge user={userData} /></h3>
                  {averageRating !== null && renderStars(averageRating)}
                  {currentUser && currentUser._id !== gigData?.userId && !currentUser.isSeller && (
                    <button 
                      className="contact-btn"
                      onClick={handleContact}
                      disabled={contactLoading}
                    >
                      {contactLoading ? "Connecting..." : "Contact Me"}
                    </button>
                  )}
                  {contactError && (
                    <div className="contact-error">
                      {contactError}
                    </div>
                  )}
                </div>
              </div>

              <div className="seller-stats">
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">From</span>
                    <span className="stat-value">{userData?.state || "N/A"}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Member since</span>
                    <span className="stat-value">
                      {moment(userData?.createdAt).format("MMMM YYYY")}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg. response time</span>
                    <span className="stat-value">{userData?.responseTime || "24 hours"}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Last delivery</span>
                    <span className="stat-value">{userData?.lastDelivery || "1 day"}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Languages</span>
                    <span className="stat-value">{userData?.languages?.map((lang) => lang.language).join(", ") || "English"}</span>
                  </div>
                </div>
                {userData?.desc && (
                  <>
                    <hr />
                    <div className="seller-description">
                      <p>{userData.desc}</p>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {/* Reviews Section */}
          <Reviews gigId={id} gigOwnerId={userId} />
        </div>

        {/* RIGHT SIDE - Order Panel */}
        <aside className="right">
          {gigData?.hasPackages && gigData?.packages ? (
            // Package-based pricing
            <div className="packages-panel">
              <div className="packages-header">
                <h3>Choose a Package</h3>
                <p>Select the package that best fits your needs</p>
              </div>
              
              <div className="packages-tabs">
                {['basic', 'standard', 'premium'].map((packageType) => {
                  const pkg = gigData.packages[packageType];
                  if (!pkg?.enabled) return null;
                  
                  return (
                    <div key={packageType} className="package-tab">
                      <div className="package-header">
                        <div className="package-info">
                          <h4 className="package-name">
                            {pkg.title || `${packageType.charAt(0).toUpperCase() + packageType.slice(1)}`}
                          </h4>
                          <div className="package-price">
                            <span className="currency">₦</span>
                            <span className="amount">{pkg.price?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="package-description">{pkg.description}</p>
                      
                      <div className="delivery-info">
                        <div className="info-item">
                          <img src="/img/clock.png" alt="Delivery time" />
                          <span>{pkg.deliveryTime} Days Delivery</span>
                        </div>
                        <div className="info-item">
                          <img src="/img/recycle.png" alt="Revisions" />
                          <span>{pkg.revisions} Revisions</span>
                        </div>
                      </div>
                      
                      {pkg.features && pkg.features.length > 0 && (
                        <div className="features-list">
                          <h5>What's included:</h5>
                          {pkg.features.map((feature, idx) => (
                            <div className="feature-item" key={idx}>
                              <img src="/img/greencheck.png" alt="Included" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {currentUser && currentUser._id !== gigData?.userId && !currentUser?.isSeller && (
                        <div className="action-buttons">
                          <Link to={`/pay/${id}?package=${packageType}`} className="continue-btn">
                            Continue ({formatPrice(pkg.price)})
                          </Link>
                        </div>
                      )}
                      {!currentUser && (
                        <div className="action-buttons">
                          <Link to="/login" className="continue-btn">
                            Login to Purchase
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Contact seller button - outside packages */}
              {currentUser && currentUser._id !== gigData?.userId && !currentUser?.isSeller && (
                <div className="contact-section">
                  <button 
                    className="contact-seller-btn"
                    onClick={handleContact}
                    disabled={contactLoading}
                  >
                    {contactLoading ? "Connecting..." : "Contact Seller"}
                  </button>
                </div>
              )}
              {!currentUser && (
                <div className="contact-section">
                  <Link to="/login" className="contact-seller-btn">
                    Login to Contact
                  </Link>
                </div>
              )}
              {currentUser?.isSeller && currentUser._id !== gigData?.userId && (
                <div className="seller-notice">
                  <p>🔒 Only buyers can purchase and contact sellers</p>
                </div>
              )}
            </div>
          ) : (
            // Standard pricing (or milestone-based single-purchase)
            <div className="order-panel">
              <div className="panel-header">
                <h3 className="package-title">{gigData?.shortTitle}</h3>
                <div className="price-display">
                  <span className="currency">₦</span>
                  <span className="amount">{
                    (
                      isMilestoneGig
                        ? totalMilestonePrice
                        : gigData?.price
                    )?.toLocaleString()
                  }</span>
                </div>
                {isMilestoneGig && (
                  <div style={{ marginTop: 8 }}>
                    <MilestoneBadge compact />
                  </div>
                )}
              </div>

              <p className="package-description">{gigData?.shortDesc}</p>

              <div className="delivery-info">
                {isMilestoneGig ? (
                  <>
                    <div className="info-item">
                      <img src="/img/clock.png" alt="Delivery time" />
                      <span>{totalMilestoneDays} Days Delivery (cumulative)</span>
                    </div>
                    <div className="info-item">
                      <img src="/img/recycle.png" alt="Revisions" />
                      <span>Revisions handled per milestone</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="info-item">
                      <img src="/img/clock.png" alt="Delivery time" />
                      <span>{gigData?.deliveryTime} Days Delivery</span>
                    </div>
                    <div className="info-item">
                      <img src="/img/recycle.png" alt="Revisions" />
                      <span>{gigData?.revisionNumber} Revisions</span>
                    </div>
                  </>
                )}
              </div>

              {gigData?.features && gigData.features.length > 0 && (
                <div className="features-list">
                  <h4>What you'll get:</h4>
                  {gigData.features.map((feature, idx) => (
                    <div className="feature-item" key={idx}>
                      <img src="/img/greencheck.png" alt="Included" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentUser && currentUser._id !== gigData?.userId && !currentUser?.isSeller && (
                <div className="action-buttons">
                  <Link to={`/pay/${id}`} className="continue-btn">
                    {`Continue (${formatPrice(isMilestoneGig ? totalMilestonePrice : gigData?.price)})`}
                  </Link>
                  <button 
                    className="contact-seller-btn"
                    onClick={handleContact}
                    disabled={contactLoading}
                  >
                    {contactLoading ? "Connecting..." : "Contact Seller"}
                  </button>
                </div>
              )}
              {!currentUser && (
                <div className="action-buttons">
                  <Link to="/login" className="continue-btn">
                    Login to Purchase
                  </Link>
                  <Link to="/login" className="contact-seller-btn">
                    Login to Contact
                  </Link>
                </div>
              )}
              {currentUser?.isSeller && currentUser._id !== gigData?.userId && (
                <div className="seller-notice">
                  <p>🔒 Only buyers can purchase and contact sellers</p>
                </div>
              )}
            </div>
          )}
          
          {/* Milestones Information */}
          {gigData?.hasMilestones && gigData?.milestones && gigData.milestones.length > 0 && (
            <div className="milestones-panel">
              <div className="milestones-header">
                <h3>🎯 Project Milestones</h3>
                <p>This project is structured in milestones for better organization</p>
              </div>
              
              <div className="milestones-list">
                {gigData.milestones.map((milestone, idx) => (
                  <div key={idx} className="milestone-item">
                    <div className="milestone-number">{idx + 1}</div>
                    <div className="milestone-content">
                      <h4>{milestone.title}</h4>
                      <p>{milestone.description}</p>
                      <div className="milestone-details">
                        <span className="milestone-price">₦{milestone.price?.toLocaleString()}</span>
                        <span className="milestone-delivery">{milestone.deliveryTime} days</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="milestones-total">
                <p><strong>Total Project Value: ₦{gigData.milestones.reduce((sum, m) => sum + (m.price || 0), 0).toLocaleString()}</strong></p>
              </div>
            </div>
          )}
          
          {/* Contact Error */}
          {contactError && (
            <div className="contact-error-panel">
              {contactError}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Gig;