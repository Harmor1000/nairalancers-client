import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import newRequest from "../../utils/newRequest";
import VerifiedBadge from "../VerifiedBadge";
import getCurrentUser from "../../utils/getCurrentUser";
import "./Review.scss";
import moment from 'moment';

const Review = ({ review, gigOwnerId }) => {
  const [helpful, setHelpful] = useState({ yes: 0, no: 0, userVote: null });
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const isOwnReview = currentUser?._id === review.userId;
  const isGigOwner = currentUser?._id === gigOwnerId || currentUser?._id === review.sellerId;

  const { isLoading, error, data } = useQuery({
    queryKey: ['user', review.userId],
    queryFn: () =>
      newRequest.get(`/users/${review.userId}`).then((res) => {
        return res.data;
      }),
  });

  // Fetch review vote data - exclude gig owners from voting
  const { data: voteData } = useQuery({
    queryKey: ['reviewVote', review._id],
    queryFn: () =>
      newRequest.get(`/reviews/${review._id}/vote`).then((res) => res.data),
    enabled: !!currentUser && !isOwnReview && !isGigOwner,
  });

  // Update helpful state when vote data loads
  useEffect(() => {
    if (voteData) {
      setHelpful({
        yes: voteData.helpfulScore?.yes || 0,
        no: voteData.helpfulScore?.no || 0,
        userVote: voteData.userVote,
      });
    } else if (review.helpfulScore) {
      setHelpful({
        yes: review.helpfulScore.yes || 0,
        no: review.helpfulScore.no || 0,
        userVote: null,
      });
    }
  }, [voteData, review.helpfulScore]);

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: (vote) =>
      newRequest.post(`/reviews/${review._id}/vote`, { vote }),
    onSuccess: (data) => {
      setHelpful({
        yes: data.data.helpfulScore.yes,
        no: data.data.helpfulScore.no,
        userVote: data.data.userVote,
      });
      queryClient.invalidateQueries(['reviewVote', review._id]);
    },
    onError: (error) => {
      console.error('Vote failed:', error);
    },
  });

  // Report mutation
  const reportMutation = useMutation({
    mutationFn: (reportData) =>
      newRequest.post(`/reviews/${review._id}/report`, reportData),
    onSuccess: () => {
      setShowReportModal(false);
      setReportReason("");
      setReportDescription("");
      alert("Review reported successfully");
    },
    onError: (error) => {
      console.error('Report failed:', error);
      alert("Failed to report review. Please try again.");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () =>
      newRequest.delete(`/reviews/${review._id}`),
    onSuccess: () => {
      setShowDeleteConfirm(false);
      queryClient.invalidateQueries(['reviews']);
      alert("Review deleted successfully");
    },
    onError: (error) => {
      console.error('Delete failed:', error);
      alert("Failed to delete review. Please try again.");
    },
  });

  const renderStars = (rating) => {
    return (
      <div className="stars-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
          >
            <img 
              src="/img/star.png" 
              alt={`${star} star${star !== 1 ? 's' : ''}`}
            />
          </div>
        ))}
        <span className="rating-number">{rating}</span>
      </div>
    );
  };

  const handleHelpfulClick = (type) => {
    if (!currentUser) {
      alert("Please login to vote on reviews");
      return;
    }

    if (isOwnReview) {
      alert("You cannot vote on your own review");
      return;
    }

    if (isGigOwner) {
      alert("You cannot vote on reviews for your own gig");
      return;
    }

    if (helpful.userVote === type) return;

    voteMutation.mutate(type);
  };

  const handleReport = () => {
    if (!currentUser) {
      alert("Please login to report reviews");
      return;
    }

    if (isOwnReview) {
      alert("You cannot report your own review");
      return;
    }

    setShowReportModal(true);
  };

  const handleDelete = () => {
    if (!isOwnReview) {
      alert("You can only delete your own reviews");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const submitReport = () => {
    if (!reportReason) {
      alert("Please select a reason for reporting");
      return;
    }

    reportMutation.mutate({
      reason: reportReason,
      description: reportDescription,
    });
  };

  if (isLoading) {
    return (
      <div className="review">
        <div className="review-skeleton">
          <div className="review-header-skeleton">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-info">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line very-short"></div>
            </div>
            <div className="skeleton-date"></div>
          </div>
          <div className="skeleton-stars"></div>
          <div className="skeleton-content">
            <div className="skeleton-line long"></div>
            <div className="skeleton-line medium"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review">
        <div className="review-error">
          <p>Unable to load review details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review">
      <div className="review-header">
        <img 
          className="reviewer-avatar" 
          src={data?.img || "/img/noavatar.jpg"} 
          alt={`${data?.username || 'User'} avatar`}
          onError={(e) => {e.target.src = "/img/noavatar.jpg"}}
        />
        <div className="reviewer-info">
          <h4 className="reviewer-name">{data?.username || 'Anonymous User'} <VerifiedBadge user={data} /></h4>
          <div className="reviewer-location">
            {data?.country && (
              <>
                <img 
                  src={`/img/flags/${data.country.toLowerCase()}.png`} 
                  alt={`${data.country} flag`}
                  className="country-flag"
                  onError={(e) => {e.target.style.display = 'none'}}
                />
              </>
            )}
            <span>{data?.state || data?.country || 'Unknown'}</span>
          </div>
        </div>
        <div className="review-date">
          {moment(review.createdAt).fromNow()}
        </div>
      </div>

      <div className="review-rating">
        {renderStars(review.star || review.rating)}
      </div>

      <div className="review-content">
        <p>{review.desc}</p>
      </div>

      {/* Show actions based on user relationship to review */}
      {currentUser && (
        <div className="review-actions">
          {/* Show helpful/report for non-owners and non-gig-owners */}
          {!isOwnReview && !isGigOwner && (
            <>
              <div className="helpful-section">
                <span className="helpful-label">Helpful?</span>
                <div className="action-buttons">
                  <button 
                    className={`action-btn ${helpful.userVote === 'yes' ? 'active' : ''}`}
                    onClick={() => handleHelpfulClick('yes')}
                    aria-label="Mark as helpful"
                    disabled={voteMutation.isLoading}
                  >
                    <img src="/img/like.png" alt="Like" />
                    <span>Yes</span>
                    {helpful.yes > 0 && <span className="vote-count">({helpful.yes})</span>}
                  </button>
                  <button 
                    className={`action-btn ${helpful.userVote === 'no' ? 'active' : ''}`}
                    onClick={() => handleHelpfulClick('no')}
                    aria-label="Mark as not helpful"
                    disabled={voteMutation.isLoading}
                  >
                    <img src="/img/dislike.png" alt="Dislike" />
                    <span>No</span>
                    {helpful.no > 0 && <span className="vote-count">({helpful.no})</span>}
                  </button>
                </div>
              </div>
              <button 
                className="report-btn" 
                onClick={handleReport}
                disabled={reportMutation.isLoading}
                aria-label="Report review"
              >
                Report
              </button>
            </>
          )}
          
          {/* Show delete button for review owner */}
          {isOwnReview && (
            <button 
              className="delete-btn" 
              onClick={handleDelete}
              disabled={deleteMutation.isLoading}
              aria-label="Delete review"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* Show helpful stats for own reviews without actions */}
      {isOwnReview && (helpful.yes > 0 || helpful.no > 0) && (
        <div className="review-stats">
          <span className="stats-label">Helpfulness:</span>
          <span className="stat-item">👍 {helpful.yes}</span>
          <span className="stat-item">👎 {helpful.no}</span>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="report-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report Review</h3>
              <button 
                className="close-btn"
                onClick={() => setShowReportModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Reason for reporting:</label>
                <select 
                  value={reportReason} 
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="fake">Fake review</option>
                  <option value="harassment">Harassment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Additional details (optional):</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Please provide more details about your report..."
                  maxLength={500}
                />
                <span className="char-count">{reportDescription.length}/500</span>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-btn"
                onClick={submitReport}
                disabled={reportMutation.isLoading || !reportReason}
              >
                {reportMutation.isLoading ? 'Reporting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="report-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="report-modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Review</h3>
              <button 
                className="close-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <p>Are you sure you want to delete this review? This action cannot be undone.</p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-confirm-btn"
                onClick={confirmDelete}
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? 'Deleting...' : 'Delete Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;