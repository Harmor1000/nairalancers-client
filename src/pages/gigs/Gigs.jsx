import React, { useState, useEffect } from 'react';
import "./Gigs.scss";
import GigCard from '../../components/gigCard/GigCard';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PulseLoader } from "react-spinners";
import { categoryDescriptions, getDefaultDescription } from '../../data/categoryDescriptions';
import InfiniteScroll from 'react-infinite-scroll-component';
import getCurrentUser from '../../utils/getCurrentUser';

// debounce helper
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const Gigs = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const cat = params.get("cat");
  const currentUser = getCurrentUser();

  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [validationError, setValidationError] = useState("");

  // Debounce min and max so query only triggers 500ms after user stops typing
  const debouncedMin = useDebounce(min, 500);
  const debouncedMax = useDebounce(max, 500);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.sort-dropdown')) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (debouncedMin !== "" && debouncedMax !== "" && Number(debouncedMin) > Number(debouncedMax)) {
      setValidationError("Minimum budget cannot be greater than maximum budget.");
    } else {
      setValidationError("");
    }
  }, [debouncedMin, debouncedMax]);

  // Fetch available categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => newRequest.get('/gigs/categories').then(res => res.data),
  });

  // Don't run query if validation error exists or min/max invalid
  const canQuery = !validationError && 
                   (debouncedMin === "" || !isNaN(Number(debouncedMin))) && 
                   (debouncedMax === "" || !isNaN(Number(debouncedMax)));

  // const { isLoading, error, data } = useQuery({
  //   queryKey: ['gigs', search, debouncedMin, debouncedMax, sort],
  //   queryFn: () =>
  //     newRequest
  //       .get(`/gigs${search}&min=${debouncedMin}&max=${debouncedMax}&sort=${sort}`)
  //       .then(res => res.data),
  //   enabled: canQuery,
  //   keepPreviousData: true,
  // });
  // Create fetch function for infinite scroll
  const fetchGigs = async ({ pageParam = 1 }) => {
    const queryParams = new URLSearchParams();
    
    // Add existing search params (like cat)
    if (search) {
      const existingParams = new URLSearchParams(search);
      for (const [key, value] of existingParams) {
        queryParams.set(key, value);
      }
    }
    
    // Add filter params
    if (debouncedMin) queryParams.set('min', debouncedMin);
    if (debouncedMax) queryParams.set('max', debouncedMax);
    if (sort) queryParams.set('sort', sort);
    queryParams.set('page', pageParam);
    queryParams.set('limit', 12);
    
    const queryString = queryParams.toString();
    const url = `/gigs?${queryString}`;
    
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
    queryKey: ['gigs', search, debouncedMin, debouncedMax, sort],
    queryFn: fetchGigs,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pagination?.hasMore ? pages.length + 1 : undefined;
    },
    enabled: canQuery,
    keepPreviousData: true,
  });

  // Flatten the data from all pages
  const gigs = data?.pages?.flatMap(page => page.data || []) || [];

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const clearMin = () => setMin("");
  const clearMax = () => setMax("");
  const clearAllFilters = () => {
    setMin("");
    setMax("");
    setSort("sales");
  };

  const handleCategorySelect = (categoryName) => {
    const newParams = new URLSearchParams();
    if (categoryName && categoryName !== "All Gigs") {
      newParams.set('cat', categoryName);
    }
    // Preserve other filters
    if (debouncedMin) newParams.set('min', debouncedMin);
    if (debouncedMax) newParams.set('max', debouncedMax);
    if (sort !== 'sales') newParams.set('sort', sort);
    
    const queryString = newParams.toString();
    const newPath = queryString ? `/gigs?${queryString}` : '/gigs';
    navigate(newPath);
    setShowCategoryFilter(false);
  };

  const getCurrentDescription = () => {
    if (cat && categoryDescriptions[cat]) {
      return categoryDescriptions[cat];
    }
    return getDefaultDescription();
  };

  const hasActiveFilters = min || max || sort !== "sales";

  return (
    <div className='gigs'>
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">NAIRALANCERS</Link>
          <span className="breadcrumb-separator" aria-hidden="true">›</span>
          <Link to={`/gigs?cat=${encodeURIComponent(cat || '')}`} className="breadcrumb-current">
            {cat || "All Gigs"}
          </Link>
        </nav>

        <header className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1>{cat ? cat : "All Gigs"}</h1>
              <p className="page-description">
                {getCurrentDescription()}
              </p>
            </div>
            {currentUser && !currentUser.isSeller && (
              <div className="header-actions">
                <Link to="/favorites" className="favorites-link">
                  <span className="favorites-icon">❤️</span>
                  My Favorites
                </Link>
              </div>
            )}
          </div>
        </header>

        <div className="filters-section">
          <div className="filters-header">
            <h2>Filters</h2>
            {hasActiveFilters && (
              <button className="clear-all-btn" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>

          <div className="filters-container">
            <div className="category-filter">
              <label className="filter-label">Category</label>
              <div className="category-dropdown">
                <button 
                  className="category-trigger"
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  aria-expanded={showCategoryFilter}
                  aria-haspopup="listbox"
                >
                  <span>{cat || "All Categories"}</span>
                  <span className={`category-arrow ${showCategoryFilter ? 'open' : ''}`}>▼</span>
                </button>
                
                {showCategoryFilter && (
                  <div className="category-menu" role="listbox">
                    <button
                      className={`category-option ${!cat ? 'active' : ''}`}
                      onClick={() => handleCategorySelect(null)}
                      role="option"
                      aria-selected={!cat}
                    >
                      <span className="category-name">All Categories</span>
                      <span className="category-count">
                        ({categoriesData?.totalCount || 0})
                      </span>
                    </button>
                    {categoriesData?.categories?.map((category) => (
                      <button
                        key={category._id}
                        className={`category-option ${cat === category._id ? 'active' : ''}`}
                        onClick={() => handleCategorySelect(category._id)}
                        role="option"
                        aria-selected={cat === category._id}
                      >
                        <span className="category-name">{category._id}</span>
                        <span className="category-count">({category.count})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="budget-filter">
              <label className="filter-label">Budget Range</label>
              <div className="budget-inputs">
                <div className="input-wrapper">
                  <input
                    type="number"
                    placeholder='Min (₦)'
                    value={min}
                    onChange={e => setMin(e.target.value)}
                    className={validationError ? 'error' : ''}
                    aria-label="Minimum budget"
                  />
                  {min && (
                    <button 
                      className="clear-input-btn" 
                      onClick={clearMin}
                      aria-label="Clear minimum budget"
                    >
                      ×
                    </button>
                  )}
                </div>

                <span className="budget-separator">to</span>

                <div className="input-wrapper">
                  <input
                    type="number"
                    placeholder='Max (₦)'
                    value={max}
                    onChange={e => setMax(e.target.value)}
                    className={validationError ? 'error' : ''}
                    aria-label="Maximum budget"
                  />
                  {max && (
                    <button 
                      className="clear-input-btn" 
                      onClick={clearMax}
                      aria-label="Clear maximum budget"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {validationError && (
                <div className="validation-error" role="alert">
                  <span className="error-icon">⚠</span>
                  {validationError}
                </div>
              )}
            </div>

            <div className="sort-filter">
              <label className="filter-label">Sort By</label>
              <div className="sort-dropdown">
                <button 
                  className="sort-trigger"
                  onClick={() => setOpen(!open)}
                  aria-expanded={open}
                  aria-haspopup="listbox"
                >
                  <span>{sort === "sales" ? "Best Selling" : "Newest"}</span>
                  <span className={`sort-arrow ${open ? 'open' : ''}`}>▼</span>
                </button>
                
                {open && (
                  <div className="sort-menu" role="listbox">
                    <button
                      className={`sort-option ${sort === "sales" ? 'active' : ''}`}
                      onClick={() => reSort("sales")}
                      role="option"
                      aria-selected={sort === "sales"}
                    >
                      Best Selling
                    </button>
                    <button
                      className={`sort-option ${sort === "createdAt" ? 'active' : ''}`}
                      onClick={() => reSort("createdAt")}
                      role="option"
                      aria-selected={sort === "createdAt"}
                    >
                      Newest
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="results-section">
          {canQuery && gigs && (
            <div className="results-info">
              <span className="results-count">
                {gigs.length} {gigs.length === 1 ? 'gig' : 'gigs'} found
              </span>
            </div>
          )}

          <div className="cards-container">
            {isLoading && gigs.length === 0 ? (
              <div className="loading-container">
                <PulseLoader
                  color='#1dbf73'
                  loading={true}
                  size={15}
                  aria-label="Loading gigs"
                />
                <p className="loading-text">Finding amazing gigs for you...</p>
              </div>
            ) : isError ? (
              <div className="error-container">
                <div className="error-icon">⚠</div>
                <h3>Oops! Something went wrong</h3>
                <p>We couldn't load the gigs right now. Please try again.</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                  Try Again
                </button>
              </div>
            ) : gigs?.length ? (
              <InfiniteScroll
                dataLength={gigs.length}
                next={fetchNextPage}
                hasMore={!!hasNextPage}
                loader={
                  <div className="infinite-loader">
                    <div className="loading-more">
                      <PulseLoader color="#1dbf73" size={8} />
                      <p>Loading more gigs...</p>
                    </div>
                  </div>
                }
                endMessage={
                  gigs.length > 12 ? (
                    <div className="end-of-results">
                      <p>You've reached the end of the results</p>
                    </div>
                  ) : null
                }
                style={{ overflow: 'visible' }}
                className="infinite-scroll-container"
              >
                <div className="cards-grid">
                  {gigs.map((gig) => <GigCard key={gig._id} item={gig} />)}
                </div>
              </InfiniteScroll>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No gigs found</h3>
                <p>Try adjusting your filters or browse other categories</p>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="clear-filters-btn">
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gigs;