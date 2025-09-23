import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from 'react';
import newRequest from '../../utils/newRequest.js';
import "./Reviews.scss";
import Review from '../review/Review';
import getCurrentUser from '../../utils/getCurrentUser';

const Reviews = ({gigId, gigOwnerId}) => {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    description: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const { isLoading, error, data } = useQuery({
    queryKey: ['reviews', gigId],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`)
        .then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post('/reviews', review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", gigId]);
      setFormData({ description: '', rating: 5 });
      setIsSubmitting(false);
      setSubmitError(null);
      setSubmitSuccess('✅ Review submitted successfully.');
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
      const message = error?.response?.data?.message || error?.response?.data || 'Failed to submit review.';
      setSubmitError(message);
      setIsSubmitting(false);
      setSubmitSuccess(null);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      return;
    }

    if (!currentUser) {
      // Require login to submit reviews
      window.location.href = '/login';
      return;
    }

    setIsSubmitting(true);
    
    mutation.mutate({ 
      gigId, 
      desc: formData.description.trim(), 
      star: parseInt(formData.rating)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className={`stars-display ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= rating ? 'filled' : 'empty'}`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
            disabled={!interactive}
          >
            <img 
              src="/img/star.png" 
              alt={`${star} star${star !== 1 ? 's' : ''}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = data && data.length > 0 
    ? Math.round(data.reduce((acc, review) => acc + review.star, 0) / data.length * 10) / 10
    : 0;

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h2>Reviews</h2>
        {data && data.length > 0 && (
          <div className="reviews-summary">
            <div className="average-rating">
              {renderStars(Math.round(averageRating))}
              <span className="rating-text">
                {averageRating} ({data.length} review{data.length !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="reviews-content">
        {isLoading ? (
          <div className="reviews-loading">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="review-skeleton">
                <div className="review-header-skeleton">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-info">
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line very-short"></div>
                  </div>
                </div>
                <div className="skeleton-stars"></div>
                <div className="skeleton-text">
                  <div className="skeleton-line long"></div>
                  <div className="skeleton-line medium"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="reviews-error">
            <div className="error-message">
              <h3>Unable to load reviews</h3>
              <p>There was an error loading the reviews. Please try again later.</p>
            </div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="reviews-list">
            {data.map((review) => (
              <Review key={review._id} review={review} gigOwnerId={gigOwnerId} />
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <div className="no-reviews-content">
              {/* <img src="/img/no-reviews.png" alt="No reviews" className="no-reviews-icon" /> */}
              <h3>No reviews yet</h3>
              <p>Be the first to review this gig and help others make informed decisions.</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Review Form */}
      {currentUser ? (
        !currentUser.isSeller && (
        <div className="add-review">
          <h3>Add a review</h3>
          {submitError && (
            <div className="reviews-feedback error" style={{ color: 'red' }}>
              {submitError}
              {submitError.includes('You can only review gigs you have ordered') && (
                <div className="hint">You need to purchase and complete an order for this gig before leaving a review.</div>
              )}
            </div>
          )}
          {submitSuccess && (
            <div className="reviews-feedback success">{submitSuccess}</div>
          )}
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                How was your experience?
              </label>
              <textarea
                id="description"
                name="description"
                className="review-textarea"
                placeholder="Share your experience with this service. What did you like? What could be improved?"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group rating-group">
              <label className="form-label">Rating</label>
              <div className="rating-container">
                {renderStars(formData.rating, true, (rating) => 
                  setFormData(prev => ({ ...prev, rating }))
                )}
                <span className="rating-label">
                  {formData.rating === 1 ? 'Poor' :
                   formData.rating === 2 ? 'Fair' :
                   formData.rating === 3 ? 'Good' :
                   formData.rating === 4 ? 'Very Good' : 'Excellent'}
                </span>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting || !formData.description.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
        )
      ) : (
        <div className="add-review">
          <h3>Add a review</h3>
          <div className="reviews-feedback info">
            Please <a href="/login">log in</a> to leave a review.
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;