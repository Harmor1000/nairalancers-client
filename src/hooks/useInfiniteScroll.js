import { useState, useEffect, useCallback, useRef } from 'react';

const useInfiniteScroll = ({
  fetchFunction,
  initialPage = 1,
  threshold = 100, // Distance from bottom to trigger load
  enabled = true,
  dependencies = []
}) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const observerRef = useRef();
  const loaderRef = useRef();

  // Reset everything when dependencies change
  useEffect(() => {
    setData([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    setError(null);
    setInitialLoading(true);
  }, dependencies);

  // Fetch data function
  const fetchData = useCallback(async (page, reset = false) => {
    if (!enabled || loading) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetchFunction(page);
      const newData = response.data || response;
      const pagination = response.pagination;

      if (reset) {
        setData(newData);
      } else {
        setData(prev => [...prev, ...newData]);
      }

      // Check if there's more data based on pagination info
      if (pagination) {
        setHasMore(page < pagination.pages);
      } else {
        // Fallback: assume no more data if we got less than expected
        setHasMore(newData.length > 0);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  }, [fetchFunction, enabled, loading, initialLoading]);

  // Initial load
  useEffect(() => {
    if (enabled) {
      fetchData(initialPage, true);
    }
  }, [enabled, ...dependencies]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!enabled || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          setCurrentPage(prev => {
            const nextPage = prev + 1;
            fetchData(nextPage);
            return nextPage;
          });
        }
      },
      {
        threshold: 0.1,
        rootMargin: `${threshold}px`,
      }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current && currentLoaderRef) {
        observerRef.current.unobserve(currentLoaderRef);
      }
    };
  }, [enabled, hasMore, loading, threshold, fetchData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    setData([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    setError(null);
    setInitialLoading(true);
    fetchData(initialPage, true);
  }, [fetchData, initialPage]);

  // Load more function for manual trigger
  const loadMore = useCallback(() => {
    if (hasMore && !loading && enabled) {
      setCurrentPage(prev => {
        const nextPage = prev + 1;
        fetchData(nextPage);
        return nextPage;
      });
    }
  }, [hasMore, loading, enabled, fetchData]);

  return {
    data,
    loading,
    initialLoading,
    hasMore,
    error,
    loaderRef,
    refresh,
    loadMore,
    currentPage
  };
};

export default useInfiniteScroll;
