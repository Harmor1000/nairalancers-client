import React, { useState } from 'react';
import "./Favorites.scss";
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import getCurrentUser from '../../utils/getCurrentUser';
import SellerCard from '../../components/sellerCard/SellerCard';
import GigCard from '../../components/gigCard/GigCard';
import { PulseLoader } from "react-spinners";
import { Link, Navigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from '@tanstack/react-query';

const Favorites = () => {
  const currentUser = getCurrentUser();
  const [filterType, setFilterType] = useState('all'); // 'all', 'gig', 'seller'

  // Redirect if user is not logged in or is a seller
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect sellers to their dashboard as they can't access favorites
  if (currentUser.isSeller) {
    return <Navigate to="/dashboard" replace />;
  }

  // Fetch function for infinite scroll
  const fetchFavorites = async ({ pageParam = 1 }) => {
    const queryParams = new URLSearchParams();
    queryParams.set('page', pageParam);
    queryParams.set('limit', 12);
    if (filterType !== 'all') {
      queryParams.set('type', filterType);
    }
    
    const url = `/favorites?${queryParams.toString()}`;
    return newRequest.get(url).then(res => res.data);
  };

  // Use react-query infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['favorites', filterType],
    queryFn: fetchFavorites,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pagination?.hasMore ? pages.length + 1 : undefined;
    },
    enabled: !!currentUser,
  });

  // Flatten the data from all pages
  const favorites = data?.pages?.flatMap(page => page.favorites || page.data || []) || [];

  return (
    <div className="favorites">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">NAIRALANCERS</Link>
          <span className="breadcrumb-separator" aria-hidden="true">›</span>
          <span className="breadcrumb-current">My Favorites</span>
        </nav>

        <header className="page-header">
          <h1>My Favorites</h1>
          <p className="page-description">
            {filterType === 'all' && "Gigs and sellers you've saved"}
            {filterType === 'gig' && "Gigs you've saved for later"}
            {filterType === 'seller' && "Sellers you've saved for future projects"}
          </p>
          
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All ({favorites.length})
            </button>
            <button 
              className={`filter-tab ${filterType === 'gig' ? 'active' : ''}`}
              onClick={() => setFilterType('gig')}
            >
              Gigs
            </button>
            <button 
              className={`filter-tab ${filterType === 'seller' ? 'active' : ''}`}
              onClick={() => setFilterType('seller')}
            >
              Sellers
            </button>
          </div>
        </header>

        <div className="favorites-content">
          {isLoading ? (
            <div className="loading-container">
              <PulseLoader
                color='#1dbf73'
                loading={true}
                size={15}
                aria-label="Loading favorites"
              />
              <p className="loading-text">Loading your favorite sellers...</p>
            </div>
          ) : isError ? (
            <div className="error-container">
              <div className="error-icon">⚠</div>
              <h3>Oops! Something went wrong</h3>
              <p>We couldn't load your favorites right now. Please try again.</p>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : favorites && favorites.length > 0 ? (
            <>
              <div className="results-info">
                <span className="results-count">
                  {favorites.length} {favorites.length === 1 ? 'favorite item' : 'favorite items'}
                </span>
              </div>
              <InfiniteScroll
                dataLength={favorites.length}
                next={fetchNextPage}
                hasMore={!!hasNextPage}
                loader={
                  <div className="infinite-loader">
                    <div className="loading-more">
                      <PulseLoader color="#1dbf73" size={8} />
                      <p>Loading more items...</p>
                    </div>
                  </div>
                }
                endMessage={
                  favorites.length > 12 ? (
                    <div className="end-of-results">
                      <p>You've seen all your favorites</p>
                    </div>
                  ) : null
                }
                style={{ overflow: 'visible' }}
                className="infinite-scroll-container"
              >
                <div className="favorites-grid">
                  {favorites.map((item) => (
                    item.type === 'seller' ? (
                      <SellerCard key={item._id} seller={item} />
                    ) : (
                      <GigCard key={item._id} item={item} />
                    )
                  ))}
                </div>
              </InfiniteScroll>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💝</div>
              <h3>
                {filterType === 'all' && 'No favorites yet'}
                {filterType === 'gig' && 'No favorite gigs yet'}
                {filterType === 'seller' && 'No favorite sellers yet'}
              </h3>
              <p>
                {filterType === 'all' && 'Start exploring and save gigs and sellers you\'re interested in'}
                {filterType === 'gig' && 'Start exploring and save gigs you\'re interested in by clicking the heart icon'}
                {filterType === 'seller' && 'Start exploring and save sellers you\'re interested in working with by clicking the heart icon on their profiles'}
              </p>
              <Link to="/gigs" className="browse-btn">
                {filterType === 'seller' ? 'Browse Sellers' : 'Browse Gigs'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
