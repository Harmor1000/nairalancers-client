import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to top on route changes. If a hash is present, attempts to scroll to that element.
export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // If URL has a hash (e.g., /help#faq), try to scroll to that anchor
    if (location.hash) {
      try {
        const decoded = decodeURIComponent(location.hash);
        const el = document.querySelector(decoded);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      } catch (_) {
        // ignore
      }
    }

    // Default: scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

  return null;
}
