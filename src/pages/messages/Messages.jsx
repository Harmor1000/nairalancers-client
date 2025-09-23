import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import UserStatusIndicator from "../../components/UserStatusIndicator";
import "./Messages.scss";
import moment from "moment";
import { PulseLoader } from "react-spinners";

const Messages = () => {
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
      console.error("Error parsing currentUser from localStorage:", error);
      return null;
    }
  })();
  const queryClient = useQueryClient();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, unread, read
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name

  // 1️⃣ Fetch conversations
  const {
    isLoading: convLoading,
    error: convError,
    data: conversations,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => newRequest.get(`/conversations`).then((res) => res.data),
  });

  // 2️⃣ Fetch all usernames based on conversation participants
  const {
    isLoading: namesLoading,
    data: userNames = {},
    error: namesError,
  } = useQuery({
    queryKey: ["usernames", conversations],
    queryFn: async () => {
      if (!conversations || conversations.length === 0) return {};

      const ids = conversations.map((c) =>
        currentUser?.isSeller ? c.buyerId : c.sellerId
      );
      const uniqueIds = [...new Set(ids)];

      const res = await newRequest.get(`/users`, {
        params: { ids: uniqueIds.join(",") },
      });

      const nameMap = {};
      res.data.forEach((user) => {
        nameMap[user.id] = {
          username: user.username || user.name || "Unknown",
          img: user.img || null
        };
      });

      return nameMap;
    },
    enabled: !!conversations, // Only fetch usernames after conversations load
  });

  // 3️⃣ Mark as read mutation
  const mutation = useMutation({
    mutationFn: (id) => newRequest.put(`/conversations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  // Filter and sort conversations based on search and filters
  const filteredAndSortedConversations = useMemo(() => {
    if (!conversations || !userNames) return [];

    let filtered = conversations.filter((conv) => {
      const userId = currentUser?.isSeller ? conv.buyerId : conv.sellerId;
      const displayName = userNames[userId] || "Unknown";
      
      // Search filter
      const matchesSearch = searchQuery === "" || 
        displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (conv.lastMessage && typeof conv.lastMessage === 'string' && conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Status filter
      const isUnread = (currentUser?.isSeller && !conv.readBySeller) ||
                      (!currentUser?.isSeller && !conv.readByBuyer);
      
      let matchesFilter = true;
      if (filterType === "unread") matchesFilter = isUnread;
      else if (filterType === "read") matchesFilter = !isUnread;
      
      return matchesSearch && matchesFilter;
    });

    // Sort conversations
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else if (sortBy === "oldest") {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      } else if (sortBy === "name") {
        const nameA = userNames[currentUser?.isSeller ? a.buyerId : a.sellerId] || "Unknown";
        const nameB = userNames[currentUser?.isSeller ? b.buyerId : b.sellerId] || "Unknown";
        return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
      }
      return 0;
    });

    return filtered;
  }, [conversations, userNames, searchQuery, filterType, sortBy, currentUser]);

  // Get unread count for badge
  const unreadCount = useMemo(() => {
    if (!conversations || !currentUser) return 0;
    return conversations.filter(conv => 
      (currentUser.isSeller && !conv.readBySeller) ||
      (!currentUser.isSeller && !conv.readByBuyer)
    ).length;
  }, [conversations, currentUser]);

  if (!currentUser) {
    return (
      <div className="messages">
        <div className="container">
          <p className="error">Please log in to view messages.</p>
        </div>
      </div>
    );
  }

  if (convLoading || namesLoading) {
    return (
      <div className="messages">
        <div className="container">
          <div className="loading-state">
            <PulseLoader color="#1dbf73" size={12} margin={3} />
            <span>Loading conversations...</span>
          </div>
        </div>
      </div>
    );
  }

  if (convError || namesError) {
    return (
      <div className="messages">
        <div className="container">
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <h3>Error loading conversations</h3>
            <p>Please try refreshing the page</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages">
      <div className="container">
        <div className="messages-header">
          <div className="header-title">
            <h1>Messages</h1>
            {unreadCount > 0 && (
              <span className="unread-count-badge">{unreadCount}</span>
            )}
          </div>
          <div className="header-actions">
            <span className="conversation-count">
              {filteredAndSortedConversations.length} of {conversations?.length || 0} conversations
            </span>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="search-and-filters">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
          </div>

          <div className="filter-controls">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread ({unreadCount})</option>
              <option value="read">Read</option>
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">By Name</option>
            </select>
          </div>
        </div>

        {!conversations || conversations.length === 0 ? (
          <div className="empty-conversations">
            <div className="empty-icon">💬</div>
            <h3>No conversations yet</h3>
            <p>Your messages will appear here when you start chatting</p>
          </div>
        ) : filteredAndSortedConversations.length === 0 ? (
          <div className="empty-conversations">
            <div className="empty-icon">🔍</div>
            <h3>No conversations found</h3>
            <p>Try adjusting your search or filter settings</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
              }}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          </div>
        ) : (
        <div className="conversations-list">
            {filteredAndSortedConversations.map((c) => {
              const isUnread =
                (currentUser?.isSeller && !c.readBySeller) ||
                (!currentUser?.isSeller && !c.readByBuyer);

              const userId = currentUser?.isSeller ? c.buyerId : c.sellerId;
              const userData = userNames[userId] || { username: "Loading...", img: null };
              const displayName = userData.username || "Loading...";
              const userImg = userData.img;

              return (
                <Link 
                  to={`/message/${c.id}`} 
                  key={c.id} 
                  className={`conversation-item ${isUnread ? 'unread' : ''}`}
                  onClick={() => isUnread && handleRead(c.id)}
                >
                  <div className="conversation-avatar">
                    <img
                      src={userImg || "./img/user.png"}
                      alt={displayName}
                      onError={(e) => {
                        e.target.src = "./img/user.png";
                      }}
                    />
                    {isUnread && <div className="unread-indicator"></div>}
                  </div>
                  
                  <div className="conversation-content">
                    <div className="conversation-header">
                      <div className="contact-info">
                        <h3 className="contact-name">{displayName}</h3>
                        <UserStatusIndicator 
                          userId={userId}
                          username={displayName}
                          showText={true}
                          size="small"
                        />
                      </div>
                      <div className="conversation-meta">
                        <span className="conversation-time" title={moment(c.updatedAt).format('LLLL')}>
                          {moment(c.updatedAt).fromNow()}
                        </span>
                        {isUnread && (
                          <div className="unread-count">1</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="conversation-preview">
                      <p className="last-message">
                        {c?.lastMessage && typeof c.lastMessage === 'string'
                          ? c.lastMessage.length > 80
                            ? `${c.lastMessage.replace(/<[^>]*>/g, '').substring(0, 80)}...`
                            : c.lastMessage.replace(/<[^>]*>/g, '')
                          : "No messages yet"}
                      </p>
                      <div className="message-status">
                        {isUnread ? (
                          <svg className="status-icon new" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                          </svg>
                        ) : (
                          <svg className="status-icon read" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="conversation-actions">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </div>
                </Link>
              );
            })}
        </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
