import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import newRequest from "../../utils/newRequest";
import useUnreadMessages from "../../hooks/useUnreadMessages";
import socketService from "../../services/socketService";
// import {useNavigate} from "react-router-dom";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifUnread, setNotifUnread] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {pathname} = useLocation();
  const { unreadCount } = useUnreadMessages();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);

    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const fetchUnreadNotifications = async () => {
    try {
      const res = await newRequest.get('/dashboard/notifications/unread-count');
      setNotifUnread(res.data?.count || 0);
    } catch (e) {
      // ignore
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      const res = await newRequest.get('/dashboard/notifications?limit=5');
      const items = (res.data || []).map(n => ({
        id: n.id,
        title: n.title,
        message: stripHtml(n.message),
        type: n.type,
        time: n.time,
        actionButton: n.actionButton
      }));
      setRecentNotifs(items);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchUnreadNotifications();
    fetchRecentNotifications();

    // Poll occasionally to keep in sync
    const interval = setInterval(() => {
      fetchUnreadNotifications();
    }, 60000);

    // Live updates via socket
    const unsubscribe = socketService.onMessage((eventType, data) => {
      if (eventType === 'notification') {
        setNotifUnread(prev => prev + 1);
        if (data?.title || data?.body) {
          setRecentNotifs(prev => [{
            id: Date.now() + Math.random(),
            title: data.title || 'New Notification',
            message: stripHtml(data.body || data.message),
            type: data.type || 'custom',
            time: 'Just now',
            actionButton: data.data?.action ? { url: data.data?.orderId ? `/orders/${data.data.orderId}` : '#' } : null
          }, ...prev].slice(0, 5));
        }
      }
    });

    return () => {
      clearInterval(interval);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      localStorage.removeItem("token");
      navigate("/");

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link to="/" className="link">
            <span className="text">naira</span>
            <span className="l">l</span>
            <span className="text">ancers</span>
            <span className="dot">.com</span>
          </Link>

        </div>
        <div className="links">
          <div className="desktop-links">
            {/* <span>Nairalancers Business</span> */}
            <Link className="link" to="/profiles">Browse Profiles</Link>
            <Link className="link" to="/gigs"> Browse Gigs</Link>
            {currentUser?.isAdmin && (
                      <>
                        <Link className="link" to="/admin">Admin</Link>
                      </>
            )}
           
            {!currentUser && <Link className="link" to="/login">Sign in</Link>}
            {/* {!currentUser?.isSeller && <span>Become a Seller</span>} */}
            {!currentUser && <button><Link className="link" to="/register">Join</Link></button>}
            {currentUser && (
              <div className="notifications">
                <button className="bell-btn" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">
                  <span className="bell">🔔</span>
                  {notifUnread > 0 && <span className="notif-badge">{notifUnread}</span>}
                </button>
                {notifOpen && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span>Notifications</span>
                      {notifUnread > 0 && <button className="mark-all" onClick={async () => {
                        try {
                          await newRequest.put('/dashboard/notifications/clear-all');
                          setNotifUnread(0);
                          fetchRecentNotifications();
                        } catch {}
                      }}>Mark all read</button>}
                    </div>
                    <div className="notif-list">
                      {recentNotifs.length === 0 ? (
                        <div className="notif-empty">No notifications</div>
                      ) : recentNotifs.map(item => (
                        <div key={item.id} className={`notif-item ${item.type || 'custom'}`} onClick={async () => {
                          try {
                            if (item.id && typeof item.id === 'string') {
                              await newRequest.put(`/dashboard/notifications/${item.id}/read`);
                              setNotifUnread(prev => Math.max(0, prev - 1));
                            }
                          } catch {}
                          if (item.actionButton?.url) {
                            window.location.href = item.actionButton.url;
                          }
                        }}>
                          <div className="notif-title">{item.title}</div>
                          <div className="notif-message">{item.message}</div>
                          <div className="notif-time">{item.time || ''}</div>
                        </div>
                      ))}
                    </div>
                    <div className="notif-footer">
                      <Link className="link" to="/freelancer-dashboard" onClick={() => setNotifOpen(false)}>View all</Link>
                    </div>
                  </div>
                )}
              </div>
            )}
            {currentUser && (
              <div className="user" onClick={() => setOpen(!open)}>
                <img
                  src={currentUser?.img || "/img/noavatar.jpg"}
                  alt=""
                />
                {/* <span>{currentUser?.username}</span> */}
                {open && (
                  <div className="options">
                    <Link className="link" to={`/${currentUser?.isSeller ? 'seller' : 'buyer'}-profile/${currentUser?._id}`}>
                      View My Profile
                    </Link>
                    {currentUser?.isSeller && (
                      <>
                        <Link className="link" to="/freelancer-dashboard">💼 Dashboard</Link>
                        <Link className="link" to="/mygigs">My Gigs</Link>
                        <Link className="link" to="/add">Add New Gig</Link>
                      </>
                    )}
                    {!currentUser?.isSeller && (
                      <Link className="link" to="/favorites">Favorites ❤️</Link>
                    )}
                    <Link className="link" to="/orders">Orders</Link>
                    <Link className="link messages-link" to="/messages">
                      Messages
                      {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount}</span>
                      )}
                    </Link>
                    <Link className="link" to="/settings">Settings</Link>
                    <Link className="link" onClick={handleLogout}>Logout</Link>
                  </div>
                )}
              </div>
            )}
            
          </div>
          
          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            {/* <span>Nairalancers Business</span> */}
            <Link className="link" to="/profiles" onClick={() => setMobileMenuOpen(false)}>Browse Profiles</Link>
            <Link className="link" to="/gigs" onClick={() => setMobileMenuOpen(false)}>Browse Gigs</Link>
            {currentUser?.isAdmin && (
              <>
                <Link className="link" to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
              </>
            )}
            {!currentUser && <Link className="link" to="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>}
            {/* {!currentUser?.isSeller && <span>Become a Seller</span>} */}
            {!currentUser && (
              <button>
                <Link className="link" to="/register" onClick={() => setMobileMenuOpen(false)}>Join</Link>
              </button>
            )}
            {currentUser && (
              <div className="mobile-user-section">
                <div className="user-info">
                  <img
                    src={currentUser?.img || "/img/noavatar.jpg"}
                    alt=""
                  />
                  <span>{currentUser?.username}</span>
                </div>
                <Link 
                  className="link" 
                  to={`/${currentUser?.isSeller ? 'seller' : 'buyer'}-profile/${currentUser?._id}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View My Profile
                </Link>
                {currentUser?.isSeller && (
                  <>
                    <Link className="link" to="/freelancer-dashboard" onClick={() => setMobileMenuOpen(false)}>💼 Dashboard</Link>
                    <Link className="link" to="/mygigs" onClick={() => setMobileMenuOpen(false)}>My Gigs</Link>
                    <Link className="link" to="/add" onClick={() => setMobileMenuOpen(false)}>Add New Gig</Link>
                  </>
                )}
                {!currentUser?.isSeller && (
                  <Link className="link" to="/favorites" onClick={() => setMobileMenuOpen(false)}>Favorites ❤️</Link>
                )}
                <Link className="link" to="/orders" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
                <Link className="link messages-link" to="/messages" onClick={() => setMobileMenuOpen(false)}>
                  Messages
                  {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                  )}
                </Link>
                <Link className="link" to="/settings" onClick={() => setMobileMenuOpen(false)}>Settings</Link>
                <Link className="link" onClick={() => {handleLogout(); setMobileMenuOpen(false);}}>Logout</Link>
              </div>
            )}
          </div>
        )}
      </div>
      {active || pathname !== "/" && (
        <>
          <hr />
          <div className="menu">
                <Link className="link menuLink" to="/profiles">
                    Browse Freelancers
                </Link>
                <Link className="link menuLink" to="/gigs?cat=Graphics%20%26%20Design">
                    Graphics & Design
                </Link>
                <Link className="link menuLink" to="/gigs?cat=Writing%20%26%20Translation">
                    Writing & Translation
                </Link>
                <Link className="link menuLink" to="/gigs?cat=Digital%20Marketing">
                    Digital Marketing
                </Link>
                <Link className="link menuLink" to="/gigs?cat=Programming%20%26%20Tech">
                    Programming & Tech
                </Link>
                <Link className="link menuLink" to="/gigs?cat=Video%20%26%20Animation">
                    Video & Animation
                </Link>
                <Link className="link menuLink" to="/gigs?cat=Business">
                    Business
                </Link>
                <Link className="link menuLink" to="/gigs?cat=Personal%20Growth%20%26%20Hobbies">
                    Personal Growth & Hobbies
                </Link>
            </div>
            <hr />
        </>
      )}
    </div>
  );
};

export default Navbar;
