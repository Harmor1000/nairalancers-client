import React, { useState } from "react";

import "./MyGigs.scss";
import { Link, Navigate } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import useToast from "../../components/toast/useToast";
import MilestoneBadge from "../../components/badges/MilestoneBadge";

// Enhanced skeleton loader
const SkeletonRow = () => (
  <tr className="skeleton">
    <td>
      <div className="skeleton-img"></div>
    </td>
    <td>
      <div className="skeleton-text"></div>
    </td>
    <td>
      <div className="skeleton-text medium"></div>
    </td>
    <td>
      <div className="skeleton-text short"></div>
    </td>
    <td>
      <div className="skeleton-btn"></div>
    </td>
    <td>
      <div className="skeleton-text short"></div>
    </td>
  </tr>
);

const SkeletonCard = () => (
  <div className="gig-card">
    <div className="card-header">
      <div className="gig-image">
        <div className="skeleton-img" style={{ width: '80px', height: '60px' }}></div>
      </div>
      <div className="gig-title">
        <div className="skeleton-text" style={{ width: '150px', marginBottom: '8px' }}></div>
        <div className="skeleton-text medium"></div>
      </div>
    </div>
    <div className="card-body">
      <div className="info-row">
        <div className="skeleton-text short"></div>
        <div className="skeleton-text short"></div>
      </div>
      <div className="info-row">
        <div className="skeleton-text short"></div>
        <div className="skeleton-text short"></div>
      </div>
    </div>
    <div className="card-footer">
      <div className="skeleton-btn" style={{ width: '36px', height: '36px' }}></div>
    </div>
  </div>
);

function MyGigs() {
  const currentUser = getCurrentUser();
  const toast = useToast();

  // Redirect if user is not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if user is not a seller
  if (!currentUser.isSeller) {
    return <Navigate to="/" replace />;
  }

  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionType, setActionType] = useState(null); // 'pause' | 'resume'

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => {
        console.log('API Response:', res.data);
        // The API now returns {data: [...], pagination: {...}} instead of directly the array
        return res.data.data || [];
      }),
  });

  console.log('MyGigs data:', data);

  const activeCount = Array.isArray(data) ? data.filter(g => g.status === 'active').length : 0;
  // Sort gigs by latest update/creation time (descending)
  const sortedData = Array.isArray(data)
    ? [...data].sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return bTime - aTime;
      })
    : [];

  const mutation = useMutation({
    mutationFn: (id) => {
      setDeletingId(id);
      return newRequest.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      setDeletingId(null);
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err?.response?.data || "Failed to delete gig. Please try again.";
      toast.error(`❌ ${message}`);
      console.error(err);
      setDeletingId(null);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this gig? This action cannot be undone.")) {
      mutation.mutate(id);
    }
  };

  // Pause / Resume mutations
  const pauseMutation = useMutation({
    mutationFn: (id) => newRequest.put(`/gigs/${id}/pause`),
    onMutate: (id) => {
      setActionLoadingId(id);
      setActionType('pause');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      setActionLoadingId(null);
      setActionType(null);
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err?.response?.data || "Failed to pause gig.";
      toast.error(`❌ ${message}`);
      setActionLoadingId(null);
      setActionType(null);
    }
  });

  const resumeMutation = useMutation({
    mutationFn: (id) => newRequest.put(`/gigs/${id}/resume`),
    onMutate: (id) => {
      setActionLoadingId(id);
      setActionType('resume');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      setActionLoadingId(null);
      setActionType(null);
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err?.response?.data || "Failed to resume gig.";
      toast.error(`❌ ${message}`);
      setActionLoadingId(null);
      setActionType(null);
    }
  });

  const handlePause = (id) => {
    const proceed = window.confirm("Pause this gig? It will be removed from public listings until you resume it.");
    if (!proceed) return;
    pauseMutation.mutate(id);
  };

  const handleResume = (id) => {
    const proceed = window.confirm("Resume this gig? Note: You can only have up to 5 active gigs.");
    if (!proceed) return;
    resumeMutation.mutate(id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getGigDisplayPrice = (gig) => {
    try {
      if (gig?.hasMilestones && Array.isArray(gig.milestones) && gig.milestones.length > 0) {
        const total = gig.milestones.reduce((sum, m) => sum + (m.price || 0), 0);
        return formatPrice(total);
      }
    } catch (e) {}
    return formatPrice(gig.price);
  };

  const renderLoadingState = () => (
    <div className="loading-container">
      <div className="loading-text">Loading your gigs...</div>
    </div>
  );

  const renderEmptyState = () => (
    <tr className="empty-row">
      <td colSpan="6" className="empty-state">
        <div className="empty-container">
          <Link to="/add">
            <img
              src="/img/empty-gigs.svg"
              alt="No gigs"
              className="empty-img"
            />
          </Link>
          <div className="empty-title">No gigs yet</div>
          <div className="empty-description">
            Start your freelancing journey by creating your first gig. 
            Showcase your skills and attract potential clients!
          </div>
          <Link to="/add" className="empty-btn">
            Create Your First Gig
          </Link>
        </div>
      </td>
    </tr>
  );

  const renderDesktopTable = () => (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Sales</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : Array.isArray(sortedData) && sortedData.length > 0 ? (
            sortedData.map((gig) => (
              <tr key={gig._id} style={{ 
                opacity: deletingId === gig._id ? 0.5 : 1,
                pointerEvents: deletingId === gig._id ? 'none' : 'auto'
              }}>
                <td>
                  <Link to={`/gig/${gig._id}`} className="link">
                    <img
                      className="img"
                      src={gig.cover}
                      alt={gig.title || "Gig"}
                      loading="lazy"
                    />
                  </Link>
                </td>
                <td>
                  <Link to={`/gig/${gig._id}`} className="link">
                    {gig.title}
                  </Link>
                </td>
                <td>
                  {gig?.hasMilestones && Array.isArray(gig.milestones) && gig.milestones.length > 0 && (
                    <span style={{ marginRight: 8 }}>
                      <MilestoneBadge compact />
                    </span>
                  )}
                  <span className="price">{getGigDisplayPrice(gig)}</span>
                </td>
                <td>
                  <span className="sales-badge">{gig.sales || 0}</span>
                </td>
                <td>
                  <span className={`status-badge status-${gig.status || 'pending'}`} title={`Status: ${gig.status || 'pending'}`}>
                    {gig.status || 'pending'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    {gig.status === 'active' && (
                      <button
                        className="action-btn pause"
                        onClick={() => handlePause(gig._id)}
                        disabled={actionLoadingId === gig._id && actionType === 'pause'}
                        title="Pause this gig"
                      >
                        {actionLoadingId === gig._id && actionType === 'pause' ? (
                          'Pausing…'
                        ) : (
                          <img src="/img/pause.svg" alt="Pause" className="pause" />
                        )}
                      </button>
                    )}
                    {gig.status === 'paused' && (
                      <button
                        className="action-btn pause"
                        onClick={() => handleResume(gig._id)}
                        disabled={actionLoadingId === gig._id && actionType === 'resume'}
                        title="Resume this gig"
                      >
                        {actionLoadingId === gig._id && actionType === 'resume' ? (
                          'Resuming…'
                        ) : (
                          <img src="/img/resume.svg" alt="Resume" className="pause" />
                        )}
                      </button>
                    )}
                    <img
                      className="delete"
                      src="/img/delete.png"
                      alt="Delete"
                      onClick={() => handleDelete(gig._id)}
                      title="Delete this gig"
                      style={{ 
                        cursor: deletingId === gig._id ? 'not-allowed' : 'pointer'
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            renderEmptyState()
          )}
        </tbody>
      </table>
    </div>
  );

  const renderMobileCards = () => (
    <div className="mobile-cards">
      {isLoading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : Array.isArray(sortedData) && sortedData.length > 0 ? (
        sortedData.map((gig) => (
          <div 
            key={gig._id} 
            className="gig-card"
            style={{ 
              opacity: deletingId === gig._id ? 0.5 : 1,
              pointerEvents: deletingId === gig._id ? 'none' : 'auto'
            }}
          >
            <div className="card-header">
              <div className="gig-image">
                <Link to={`/gig/${gig._id}`}>
                  <img
                    className="img"
                    src={gig.cover}
                    alt={gig.title || "Gig"}
                    loading="lazy"
                  />
                </Link>
              </div>
              <div className="gig-title">
                <h3>
                  <Link to={`/gig/${gig._id}`}>
                    {gig.title}
                  </Link>
                </h3>
                <div className="price">
                  {gig?.hasMilestones && Array.isArray(gig.milestones) && gig.milestones.length > 0 && (
                    <span style={{ marginRight: 8 }}>
                      <MilestoneBadge compact />
                    </span>
                  )}
                  {getGigDisplayPrice(gig)}
                </div>
              </div>
            </div>
            
            <div className="card-body">
              <div className="info-row">
                <span className="label">Sales:</span>
                <span className="value">
                  <span className="sales-badge">{gig.sales || 0}</span>
                </span>
              </div>
              <div className="info-row">
                <span className="label">Status:</span>
                <span className="value">
                  <span className={`status-badge status-${gig.status || 'pending'}`}>{gig.status || 'pending'}</span>
                </span>
              </div>
            </div>
            
            <div className="card-footer">
              <div className="actions">
                {gig.status === 'active' && (
                  <button
                    className="action-btn pause"
                    onClick={() => handlePause(gig._id)}
                    disabled={actionLoadingId === gig._id && actionType === 'pause'}
                    title="Pause this gig"
                  >
                    {actionLoadingId === gig._id && actionType === 'pause' ? 'Pausing…' : (
                      <img src="/img/pause.svg" alt="Pause" className="pause" />
                    )}
                  </button>
                )}
                {gig.status === 'paused' && (
                  <button
                    className="action-btn pause"
                    onClick={() => handleResume(gig._id)}
                    disabled={actionLoadingId === gig._id && actionType === 'resume'}
                    title="Resume this gig"
                  >
                    {actionLoadingId === gig._id && actionType === 'resume' ? 'Resuming…' : (
                      <img src="/img/resume.svg" alt="Resume" className="pause" />
                    )}
                  </button>
                )}
                <img
                  className="delete"
                  src="/img/delete.png"
                  alt="Delete"
                  onClick={() => handleDelete(gig._id)}
                  title="Delete this gig"
                  style={{ 
                    cursor: deletingId === gig._id ? 'not-allowed' : 'pointer'
                  }}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <div className="empty-container">
            <Link to="/add">
              <img
                src="/img/empty-gigs.svg"
                alt="No gigs"
                className="empty-img"
              />
            </Link>
            <div className="empty-title">No gigs yet</div>
            <div className="empty-description">
              Start your freelancing journey by creating your first gig. 
              Showcase your skills and attract potential clients!
            </div>
            <Link to="/add" className="empty-btn">
              Create Your First Gig
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>
            My Gigs{' '}
            <span className="active-count" title="Active gigs / Maximum allowed">
              ({activeCount}/5 active)
            </span>
          </h1>
          {activeCount >= 5 && (
            <div className="cap-warning" title="You have reached the maximum number of active gigs">
              You have reached the maximum of 5 active gigs.
            </div>
          )}
          <Link to="/add">
            <button>Add New Gig</button>
          </Link>
        </div>

        {error && (
          <div className="error-message">
            Failed to load gigs. Please refresh the page.
          </div>
        )}

        {renderDesktopTable()}
        {renderMobileCards()}
      </div>
    </div>
  );
}

export default MyGigs;