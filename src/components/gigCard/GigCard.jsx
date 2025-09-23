import React, { useState, useEffect } from 'react';
import "./GigCard.scss";
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from '../../utils/newRequest';
import getCurrentUser from '../../utils/getCurrentUser';
import VerifiedBadge from '../VerifiedBadge';
import MilestoneBadge from "../badges/MilestoneBadge";

const GigCard = ({ item }) => {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Support both populated and unpopulated userId
  const sellerId = typeof item.userId === 'object' ? item.userId._id : item.userId;

  const { isLoading, error, data } = useQuery({
    queryKey: ['user', sellerId],
    queryFn: () => newRequest.get(`/users/${sellerId}`).then(res => res.data),
    enabled: !!sellerId, // only fetch when we have an ID
  });

  const fallbackUser = typeof item.userId === 'object' ? item.userId : null;
  const displayImg = fallbackUser?.img || data?.img || "/img/noavatar.jpg";
  const displayUsername = fallbackUser?.username || data?.username || 'Unknown User';

  // Check if gig is in favorites when component mounts
  const { data: favoriteStatus } = useQuery({
    queryKey: ['favorite', item._id, currentUser?._id, 'gig'],
    queryFn: () =>
      newRequest
        .get(`/favorites/check/${item._id}?type=gig`)
        .then(res => res.data),
    enabled: !!(currentUser && !currentUser.isSeller),
    onSuccess: (data) => {
      setIsFavorite(data.isFavorite);
    }
  });

  // Update isFavorite when favoriteStatus changes
  useEffect(() => {
    if (favoriteStatus) {
      setIsFavorite(favoriteStatus.isFavorite);
    }
  }, [favoriteStatus]);

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: () =>
      newRequest.put(`/favorites/toggle/${item._id}?type=gig`),
    onMutate: () => {
      setFavoriteLoading(true);
      // Optimistic update
      setIsFavorite(prev => !prev);
    },
    onSuccess: (data) => {
      setIsFavorite(data.data.isFavorite);
      // Invalidate favorites query to refetch
      queryClient.invalidateQueries(['favorites']);
      queryClient.invalidateQueries(['favorite', item._id, currentUser?._id, 'gig']);
    },
    onError: (error) => {
      // Revert optimistic update on error
      setIsFavorite(prev => !prev);
      console.error('Failed to toggle favorite:', error);
    },
    onSettled: () => {
      setFavoriteLoading(false);
    }
  });

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    if (currentUser.isSeller) {
      // Show message to sellers
      const message = "Sellers cannot favorite gigs. Only buyers can save gigs to their favorites list.";
      if (window.confirm(message + "\n\nWould you like to browse gigs as inspiration for your own services?")) {
        window.location.href = '/gigs';
      }
      return;
    }

    toggleFavoriteMutation.mutate();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateRating = () => {
    if (!item.totalStars || !item.starNumber || item.starNumber === 0) {
      return null;
    }
    return Math.round((item.totalStars / item.starNumber) * 10) / 10;
  };

  const rating = calculateRating();

  const getCardPriceInfo = () => {
    try {
      if (item?.hasMilestones && Array.isArray(item.milestones) && item.milestones.length > 0) {
        const total = item.milestones.reduce((sum, m) => sum + (m.price || 0), 0);
        return { label: 'PROJECT TOTAL', value: formatPrice(total) };
      }
    } catch (e) {
      // Fallback quietly to base price
    }
    return { label: 'STARTING AT', value: formatPrice(item.price) };
  };
  const priceInfo = getCardPriceInfo();

  return (
    <Link to={`/gig/${item._id}`} className='gig-link'>
      <article className='gigCard'>
        <div className="image-container">
          <img 
            src={item.cover} 
            alt={item.title || "Gig cover image"}
            className="gig-image"
            loading="lazy"
          />
          <div className="image-overlay">
            <span className="view-details">View Details</span>
          </div>
        </div>

        <div className="card-content">
          <div className="user-info">
            {isLoading ? (
              <div className="user-skeleton">
                <div className="avatar-skeleton"></div>
                <div className="username-skeleton"></div>
              </div>
            ) : error ? (
              <div className="user-error">
                <img src={displayImg} alt="Default avatar" className="user-avatar" />
                <span className="username">{displayUsername}</span>
                <VerifiedBadge user={fallbackUser || data} />
              </div>
            ) : (
              <div className="user-details">
                <img 
                  src={displayImg} 
                  alt={`${displayUsername}'s avatar`}
                  className="user-avatar"
                />
                <span className="username">{displayUsername}</span>
                <VerifiedBadge user={fallbackUser || data} />
              </div>
            )}
          </div>

          <h3 className="gig-title" title={item.title}>
            {item.title}
          </h3>

          <div className="rating-container">
            {rating ? (
              <div className="rating">
                <div className="stars">
                  <img src="./img/star.png" alt="Rating star" className="star-icon" />
                  <span className="rating-value">{rating}</span>
                </div>
                <span className="rating-count">({item.starNumber})</span>
              </div>
            ) : (
              <div className="no-rating">
                <span className="new-badge">New</span>
              </div>
            )}
          </div>
        </div>

        <hr className="divider" />

        <footer className="card-footer">
          {/* {currentUser && !currentUser.isSeller && ( */}
            <button 
              className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
              onClick={handleFavoriteClick}
              disabled={favoriteLoading}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {favoriteLoading ? (
                <div className="favorite-loading">⏳</div>
              ) : (
                <img 
                  src={isFavorite ? "./img/heart-filled.png" : "./img/heart.png"} 
                  alt="" 
                  className="heart-icon" 
                />
              )}
            </button>
          {/* )} */}
          
          <div className="pricing">
            {item?.hasMilestones && Array.isArray(item.milestones) && item.milestones.length > 0 && (
              <MilestoneBadge compact className="card-badge" />
            )}
            <span className="price-label">{priceInfo.label}</span>
            <div className="price-value">{priceInfo.value}</div>
          </div>
        </footer>
      </article>
    </Link>
  );
};

export default GigCard;