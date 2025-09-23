import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Profiles.scss";
import newRequest from "../../utils/newRequest";
import InfiniteScroll from 'react-infinite-scroll-component';
import VerifiedBadge from '../../components/VerifiedBadge';
import { useInfiniteQuery } from '@tanstack/react-query';

const Profiles = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    skills: searchParams.get("skills") || "",
    location: searchParams.get("location") || "",
    minRating: searchParams.get("minRating") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minPrice: searchParams.get("minPrice") || "",
    isSeller: searchParams.get("isSeller") || "true",
    sort: searchParams.get("sort") || "relevance",
    page: parseInt(searchParams.get("page")) || 1,
  });

  const [showFilters, setShowFilters] = useState(false);

  // Create fetch function for infinite scroll
  const fetchProfiles = async ({ pageParam = 1 }) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'page') { // Exclude page from filters, it's handled by infinite scroll
        params.append(key, value);
      }
    });
    params.append('page', pageParam);
    params.append('limit', 12);
    
    const response = await newRequest.get(`/profiles/search?${params}`);
    
    return {
      data: response.data.users, // The API returns users array
      pagination: response.data.pagination
    };
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
    queryKey: ['profiles', filters],
    queryFn: fetchProfiles,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pagination?.hasMore ? pages.length + 1 : undefined;
    },
    keepPreviousData: true,
  });

  // Flatten the data from all pages and remove duplicates
  const profiles = useMemo(() => {
    const allProfiles = data?.pages?.flatMap(page => page.data || []) || [];
    // Remove duplicates by user ID
    const uniqueProfiles = allProfiles.filter((profile, index, self) => 
      index === self.findIndex(p => p._id === profile._id)
    );
    return uniqueProfiles;
  }, [data?.pages]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && !(key === "page" && value === 1)) {
        params.append(key, value);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
      // No need to reset page for infinite scroll
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by filter changes
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      skills: "",
      location: "",
      minRating: "",
      maxPrice: "",
      minPrice: "",
      isSeller: "true",
      sort: "relevance",
      page: 1,
    });
  };

  // Removed handlePageChange - not needed for infinite scroll

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="profiles-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>
            {filters.isSeller === "true" ? "Find Talented Sellers" : "Browse Buyers"}
          </h1>
          <p>
            {filters.isSeller === "true" 
              ? "Discover skilled freelancers ready to bring your projects to life"
              : "Connect with potential clients looking for services"
            }
          </p>
        </div>

        {/* Search and Filters */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder={`Search ${filters.isSeller === "true" ? "sellers" : "buyers"}...`}
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                🔍 Search
              </button>
            </div>
          </form>

          <div className="filter-controls">
            <button 
              className={`filter-toggle ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              🔧 Filters {showFilters ? "▲" : "▼"}
            </button>

            <div className="profile-type-toggle">
              <button
                className={filters.isSeller === "true" ? "active" : ""}
                onClick={() => handleFilterChange("isSeller", "true")}
              >
                Sellers
              </button>
              <button
                className={filters.isSeller === "false" ? "active" : ""}
                onClick={() => handleFilterChange("isSeller", "false")}
              >
                Buyers
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filter-grid">
                <div className="filter-group">
                  <label>Skills/Interests</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Design, Writing"
                    value={filters.skills}
                    onChange={(e) => handleFilterChange("skills", e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Abuja"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                  />
                </div>

                {filters.isSeller === "true" && (
                  <>
                    <div className="filter-group">
                      <label>Minimum Rating</label>
                      <select
                        value={filters.minRating}
                        onChange={(e) => handleFilterChange("minRating", e.target.value)}
                      >
                        <option value="">Any Rating</option>
                        <option value="4">4+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4.8">4.8+ Stars</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Min Price (₦/hr)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                      />
                    </div>

                    <div className="filter-group">
                      <label>Max Price (₦/hr)</label>
                      <input
                        type="number"
                        placeholder="No limit"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="filter-group">
                  <label>Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest Members</option>
                    {filters.isSeller === "true" && (
                      <>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="filter-actions">
                <button onClick={clearFilters} className="clear-filters">
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="results-section">
          {isLoading ? (
            <div className="loading-state">
              <div className="profiles-skeleton">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="profile-skeleton">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line short"></div>
                      <div className="skeleton-line"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isError ? (
            <div className="error-state">
              <h3>Something went wrong</h3>
              <p>Unable to load profiles. Please try again.</p>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="results-header">
                <h2>
                  {profiles?.length || 0} {filters.isSeller === "true" ? "sellers" : "buyers"} found
                </h2>
              </div>

              {/* Profiles Grid */}
              {profiles?.length > 0 ? (
                <InfiniteScroll
                  dataLength={profiles.length}
                  next={fetchNextPage}
                  hasMore={!!hasNextPage}
                  loader={
                    <div className="infinite-loader">
                      <div className="loading-more">
                        <div className="profiles-skeleton">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="profile-skeleton">
                              <div className="skeleton-avatar"></div>
                              <div className="skeleton-content">
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line short"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p>Loading more profiles...</p>
                      </div>
                    </div>
                  }
                  endMessage={
                    profiles.length > 12 ? (
                      <div className="end-of-results">
                        <p>You've seen all available {filters.isSeller === "true" ? "sellers" : "buyers"}</p>
                      </div>
                    ) : null
                  }
                  style={{ overflow: 'visible' }}
                  className="infinite-scroll-container"
                >
                  <div className="profiles-grid">
                    {profiles.map((user, index) => (
                    <div 
                      key={user._id} 
                      className="profile-card"
                      onClick={() => navigate(`/${user.isSeller ? 'seller' : 'buyer'}-profile/${user._id}`)}
                    >
                      <div className="profile-card-header">
                        <div className="profile-avatar">
                          <img 
                            src={user.img || "/img/noavatar.jpg"} 
                            alt={user.username}
                          />
                          {user.isSeller && user.availability && (
                            <div 
                              className="availability-dot"
                              style={{
                                backgroundColor: 
                                  user.availability === "Available" ? "#1dbf73" :
                                  user.availability === "Busy" ? "#ffaa00" :
                                  user.availability === "Away" ? "#ff6b6b" : "#95a5a6"
                              }}
                            ></div>
                          )}
                        </div>
                        
                        <div className="profile-info">
                          <h3>{user.firstname} {user.lastname}</h3>
                          <p className="username">@{user.username} <VerifiedBadge user={user} /></p>
                          {user.professionalTitle && (
                            <p className="professional-title">{user.professionalTitle}</p>
                          )}
                        </div>

                        {!user.isSeller && (
                          <div className="buyer-badge">BUYER</div>
                        )}
                      </div>

                      <div className="profile-card-content">
                        {user.desc && (
                          <p className="description">
                            {user.desc.length > 120 ? `${user.desc.substring(0, 120)}...` : user.desc}
                          </p>
                        )}

                        {user.skills && user.skills.length > 0 && (
                          <div className="skills-preview">
                            {user.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="skill-tag">
                                {skill}
                              </span>
                            ))}
                            {user.skills.length > 3 && (
                              <span className="more-skills">+{user.skills.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="profile-card-footer">
                        <div className="profile-stats">
                          {user.isSeller ? (
                            <>
                              <div className="stat">
                                <span className="stat-icon">⭐</span>
                                <span>{user.averageRating || 0} ({user.totalReviews || 0})</span>
                              </div>
                              <div className="stat">
                                <span className="stat-icon">📦</span>
                                <span>{user.totalOrders || 0} orders</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="stat">
                                <span className="stat-icon">📦</span>
                                <span>{user.totalOrders || 0} orders</span>
                              </div>
                              <div className="stat">
                                <span className="stat-icon">📍</span>
                                <span>{user.state || "Location N/A"}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {user.isSeller && user.hourlyRate && (
                          <div className="hourly-rate">
                            <span className="rate-label">From</span>
                            <span className="rate-amount">
                              {formatPrice(user.hourlyRate)}/hr
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                </InfiniteScroll>
              ) : (
                <div className="no-results">
                  <div className="no-results-content">
                    <h3>No {filters.isSeller === "true" ? "sellers" : "buyers"} found</h3>
                    <p>Try adjusting your search criteria or filters.</p>
                    <button onClick={clearFilters} className="clear-filters-btn">
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profiles;
