import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Linkify from "linkify-react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { PulseLoader } from "react-spinners";
import socketService from "../../services/socketService";
import OrderContext from "../../components/orderContext/OrderContext";
import ContentWarning from "../../components/ContentWarning/ContentWarning";
import clientContentFilter from "../../utils/contentFilter";
import "./Message.scss";

dayjs.extend(relativeTime);

const Message = () => {
  const { id } = useParams();
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
      console.error("Error parsing currentUser from localStorage:", error);
      return null;
    }
  })();

  const queryClient = useQueryClient();
  const bottomRef = useRef(null);
  const quillRef = useRef(null);
  const [messageValue, setMessageValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageActions, setShowMessageActions] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  
  // Content filtering states
  const [contentWarning, setContentWarning] = useState(null);
  const [validationWarning, setValidationWarning] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isOrderContextCollapsed, setIsOrderContextCollapsed] = useState(true);
  const messagesContainerRef = useRef(null);

  // Debounced content validation
  const validateContentDebounced = useCallback(
    debounce((content) => {
      if (!content || !content.trim()) {
        setValidationWarning(null);
        return;
      }

      setIsValidating(true);
      
      // Remove HTML tags for validation
      const textContent = content.replace(/<[^>]*>/g, '');
      const validation = clientContentFilter.validateMessage(textContent);
      
      if (!validation.isValid || (validation.feedback && validation.feedback.type === 'warning')) {
        setValidationWarning(validation);
      } else {
        setValidationWarning(null);
      }
      
      setIsValidating(false);
    }, 500),
    []
  );

  // Handle content filtering warnings from server response
  const handleServerResponse = useCallback((response) => {
    if (response.contentWarning) {
      setContentWarning(response.contentWarning);
      
      // Auto-dismiss warning after 10 seconds for non-error warnings
      if (response.contentWarning.action !== 'block') {
        setTimeout(() => {
          setContentWarning(null);
        }, 10000);
      }
    }
  }, []);

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Fetch conversation details
  const { data: conversation } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => newRequest.get(`/conversations/single/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  // Get other user info
  const otherUserId = useMemo(() => {
    if (!conversation || !currentUser) return null;
    return conversation.buyerId === currentUser._id ? conversation.sellerId : conversation.buyerId;
  }, [conversation, currentUser]);

  // Fetch other user details
  const { data: otherUser } = useQuery({
    queryKey: ["user", otherUserId],
    queryFn: () => newRequest.get(`/users/${otherUserId}`).then((res) => res.data),
    enabled: !!otherUserId,
  });

  // Fetch all messages for this conversation
  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => newRequest.get(`/messages/${id}`).then((res) => {
      setMessages(res.data);
      return res.data;
    }),
  });

  // Scroll to bottom on messages load, with better handling
  useEffect(() => {
    if (data && messages.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [data]);

  // Scroll to top function for long conversations
  const scrollToTop = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  // Check if user can scroll to top
  const [canScrollToTop, setCanScrollToTop] = useState(false);
  
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      setCanScrollToTop(container.scrollTop > 200); // Show button if scrolled down more than 200px
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile detection and viewport handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Handle mobile viewport height changes (keyboard open/close)
    if (isMobile) {
      const handleViewportChange = () => {
        // Update CSS custom property for mobile viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      handleViewportChange();
      window.addEventListener('resize', handleViewportChange);
      window.addEventListener('orientationchange', handleViewportChange);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
        window.removeEventListener('resize', handleViewportChange);
        window.removeEventListener('orientationchange', handleViewportChange);
      };
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  // WebSocket connection and conversation management
  useEffect(() => {
    if (!currentUser) return;

    // Initialize WebSocket connection
    socketService.connect(currentUser);
    socketService.requestNotificationPermission();

    // Join conversation room
    if (id) {
      socketService.joinConversation(id);
    }

    // Subscribe to real-time message events
    const unsubscribeMessages = socketService.onMessage((eventType, data) => {
      switch (eventType) {
        case 'new-message':
          // Add new message to the list if it's not from current user
          if (data.userId !== currentUser._id) {
            setMessages(prev => [...prev, data]);
            
            // Scroll to bottom
            setTimeout(() => {
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }
          break;
          
        case 'reaction-update':
          // Update message reactions
          setMessages(prev => prev.map(msg => 
            msg._id === data.messageId 
              ? { ...msg, reactions: data.reactions }
              : msg
          ));
          break;
          
        case 'message-update':
          // Handle message edits/deletes
          if (data.type === 'delete') {
            setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
          } else if (data.type === 'edit') {
            setMessages(prev => prev.map(msg => 
              msg._id === data.messageId 
                ? { ...msg, desc: data.desc, isEdited: true, editedAt: data.editedAt }
                : msg
            ));
          }
          break;
          
        case 'message-read':
          // Update read status - could be implemented later
          console.log('Message read:', data);
          break;
      }
    });

    // Subscribe to typing indicators
    const unsubscribeTyping = socketService.onTyping((data) => {
      if (data.userId !== currentUser._id) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      }
    });

    // Subscribe to user status updates (client-seller specific)
    const unsubscribeStatus = socketService.onUserStatus((data) => {
      if (data.event === 'user-joined') {
        console.log(`${data.role} joined the conversation`);
        socketService.setOtherPersonOnline(true);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.add(data.userId);
          return newSet;
        });
      } else if (data.event === 'user-left') {
        console.log(`${data.role} ${data.disconnected ? 'disconnected' : 'left the conversation'}`);
        socketService.setOtherPersonOnline(false);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      } else {
        // General user status update
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (data.isOnline) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      }
    });

    // Cleanup on component unmount
    return () => {
      if (id) {
        socketService.leaveConversation();
      }
      unsubscribeMessages();
      unsubscribeTyping();
      unsubscribeStatus();
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentUser, id, bottomRef]);

  // Mutation for sending messages
  const mutation = useMutation({
    mutationFn: (messageData) => {
      // Check if it's FormData (file upload)
      if (messageData instanceof FormData) {
        return newRequest.post(`/messages`, messageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        return newRequest.post(`/messages`, messageData);
      }
    },
    onMutate: async (messageData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["messages", id]);

      // Extract data for optimistic update
      let desc = '';
      let attachments = [];
      let messageType = 'text';
      
      if (messageData instanceof FormData) {
        const rawDesc = messageData.get('desc') || '';
        // Only use desc if it has actual text content (not just HTML tags)
        const textContent = rawDesc.replace(/<[^>]*>/g, '').trim();
        desc = textContent.length > 0 ? rawDesc : '';
        const files = messageData.getAll('files');
        if (files.length > 0) {
          // Create temporary attachment previews
          attachments = files.map((file, index) => ({
            fileName: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            isTemporary: true
          }));
          
          // Determine message type
          if (files[0].type.startsWith('image/')) {
            messageType = 'image';
          } else if (files[0].type.startsWith('video/')) {
            messageType = 'video';
          } else if (files[0].type.startsWith('audio/')) {
            messageType = 'audio';
          } else {
            messageType = 'file';
          }
        }
      } else {
        desc = messageData.desc;
      }

      // Optimistically update with temporary message
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        conversationId: id,
        userId: currentUser._id,
        userImg: currentUser.img || null,
        username: currentUser.username || "You",
        desc: desc,
        messageType: messageType,
        attachments: attachments,
        replyTo: (() => {
          if (messageData instanceof FormData) {
            const replyToData = messageData.get('replyTo');
            return replyToData ? JSON.parse(replyToData) : null;
          }
          return messageData.replyTo || null;
        })(),
        reactions: [],
        isEdited: false,
        editedAt: null,
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isTemporary: true,
      };

      setMessages(prev => [...prev, tempMessage]);
      
      // Scroll to bottom immediately
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);

      return { tempMessage };
    },
    onSuccess: (response, variables, context) => {
      // The response from axios contains the data in response.data
      const savedMessage = response.data;
      
      // Handle content filtering warnings
      handleServerResponse(savedMessage);
      
      // Replace temporary message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg._id === context.tempMessage._id 
            ? { 
                ...savedMessage,
                userImg: savedMessage.userImg || currentUser.img,
                username: savedMessage.username || currentUser.username
              } 
            : msg
        )
      );
    },
    onError: (error, variables, context) => {
      // Remove temporary message on error
      if (context?.tempMessage) {
        setMessages(prev => prev.filter(msg => msg._id !== context.tempMessage._id));
      }
      
      // Handle content filtering errors
      if (error.response?.status === 400 && error.response?.data?.error === 'Message blocked') {
        setContentWarning({
          message: error.response.data.reason,
          action: 'block',
          isFiltered: true
        });
      }
      
      console.error('Failed to send message:', error);
    },
  });

  // Handle sending message
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for actual text content by stripping HTML tags
    const textContent = messageValue.replace(/<[^>]*>/g, '').trim();
    const hasMessage = textContent.length > 0;
    const hasFiles = selectedFiles.length > 0;
    
    if (!hasMessage && !hasFiles) return;
    if (!currentUser) {
      console.error("No current user found");
      return;
    }

    // Final validation before sending
    if (hasMessage) {
      const finalValidation = clientContentFilter.validateMessage(textContent);
      if (!finalValidation.canSend) {
        setValidationWarning(finalValidation);
        return;
      }
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('conversationId', id);

    if (hasMessage) {
      // Clean up the message content to remove excess newlines
      const cleanedMessage = messageValue
        .replace(/<p><br><\/p>/g, '') // Remove empty paragraphs
        .replace(/<p>\s*<\/p>/g, '') // Remove empty paragraphs with whitespace
        .replace(/(<\/p>)\s*(<p>)/g, '$1$2') // Remove whitespace between paragraphs
        .trim();
      
      formData.append('desc', cleanedMessage);
    }

    // Add reply information if replying
    if (replyingTo) {
      formData.append('replyTo', JSON.stringify({
        messageId: replyingTo._id,
        text: replyingTo.desc || "message", // Fallback if desc is undefined
        userId: replyingTo.userId
      }));
    }

    // Add files if any
    selectedFiles.forEach((file, index) => {
      formData.append('files', file);
    });

    // Send as multipart/form-data
    mutation.mutate(formData);
    
    // Clear form
    setMessageValue("");
    setSelectedFiles([]);
    setReplyingTo(null);
  };

  // Handle keyboard shortcuts
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle typing indicators
  const handleTyping = () => {
    // Start typing indicator
    socketService.startTyping();
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing indicator after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping();
    }, 3000);
  };

  const handleStopTyping = () => {
    socketService.stopTyping();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // Options for linkify-react to shorten URLs and open in new tab
  const linkifyOptions = {
    target: "_blank",
    format: (value) => (value.length > 30 ? value.slice(0, 20) + "..." : value),
  };

  // Common emojis for quick access
  const commonEmojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥', '💯', '🤔', '😎', '🙏', '👏', '💪'];
  
  // Quick reaction emojis
  const reactionEmojis = ['👍', '🔥', '❤️', '💯', '👎', '😡'];

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const currentSelection = quill.getSelection();
      const cursorPosition = currentSelection ? currentSelection.index : quill.getLength();
      
      // Insert emoji at cursor position
      quill.insertText(cursorPosition, emoji);
      
      // Move cursor after the inserted emoji
      quill.setSelection(cursorPosition + emoji.length);
      
      // Update the message value state
      setMessageValue(quill.root.innerHTML);
      
      // Focus back to the editor
      quill.focus();
    } else {
      // Fallback for cases where ref is not available
      setMessageValue(prev => prev + emoji);
    }
    
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
      if (showMessageActions && !event.target.closest('.message-actions-menu')) {
        setShowMessageActions(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker, showMessageActions]);

  // Message action handlers
  const handleCopyMessage = (messageText) => {
    const textToCopy = messageText ? messageText.replace(/<[^>]*>/g, '') : ''; // Remove HTML tags, handle undefined
    if (textToCopy.trim()) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        // You could show a toast notification here
        console.log('Message copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy message:', err);
      });
    }
    setShowMessageActions(null);
  };

  const handleReplyToMessage = (message) => {
    setReplyingTo(message);
    setShowMessageActions(null);
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setMessageValue(message.desc || ''); // Handle undefined desc
    setShowMessageActions(null);
  };

  const handleDeleteMessage = (messageId) => {
    // This would need backend implementation
    console.log('Delete message:', messageId);
    setShowMessageActions(null);
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      const response = await newRequest.post(`/messages/${messageId}/react`, {
        emoji: emoji
      });
      
      // Update the message in the local state
      setMessages(prev => prev.map(msg => {
        if (msg._id === messageId) {
          return {
            ...msg,
            reactions: response.data.reactions
          };
        }
        return msg;
      }));
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingMessage(null);
    setMessageValue("");
  };

  // Image compression helpers for attachments
  const compressImageFile = async (file, opts = { maxDim: 1600, quality: 0.8 }) => {
    try {
      if (!file || !file.type?.startsWith('image/') || file.type === 'image/gif') {
        return file; // skip non-images and GIFs
      }

      const loadImageBitmap = async (blob) => {
        if (window.createImageBitmap) {
          return await window.createImageBitmap(blob);
        }
        // Fallback for older browsers
        return await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = URL.createObjectURL(blob);
        });
      };

      const imgBitmap = await loadImageBitmap(file);
      const origW = imgBitmap.width;
      const origH = imgBitmap.height;
      const { maxDim, quality } = opts;
      const scale = Math.min(1, maxDim / Math.max(origW, origH));
      const targetW = Math.max(1, Math.round(origW * scale));
      const targetH = Math.max(1, Math.round(origH * scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgBitmap, 0, 0, targetW, targetH);

      // Prefer JPEG for best compression in chat context
      const mime = 'image/jpeg';
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
      if (!blob) return file; // fallback on failure

      // Preserve original base name, change extension to .jpg if needed
      const base = file.name.replace(/\.[^.]+$/, '');
      const compressed = new File([blob], `${base}.jpg`, { type: mime, lastModified: Date.now() });

      // Free object URL if fallback path used
      if (imgBitmap instanceof HTMLImageElement) {
        URL.revokeObjectURL(imgBitmap.src);
      }

      return compressed;
    } catch (err) {
      console.warn('Image compression failed, using original file:', err);
      return file;
    }
  };

  const processIncomingFiles = async (incoming) => {
    const files = Array.from(incoming || []);
    const processed = await Promise.all(files.map(async (f) => {
      if (f.type?.startsWith('image/')) {
        return await compressImageFile(f);
      }
      return f;
    }));
    setSelectedFiles(prev => [...prev, ...processed]);
  };

  // File handling functions
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    // Process compression asynchronously
    processIncomingFiles(files);
    event.target.value = ''; // Reset input
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    processIncomingFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Handle mobile file selection with better UX
  const handleMobileFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (file) => {
    return file.type.startsWith('image/');
  };

  const isVideoFile = (file) => {
    return file.type.startsWith('video/');
  };

  const isAudioFile = (file) => {
    return file.type.startsWith('audio/');
  };

  // Touch gesture handling for mobile
  const minSwipeDistance = 50;
  
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (messageId) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      // Toggle message actions on swipe
      setShowMessageActions(showMessageActions === messageId ? null : messageId);
    }
  };

  // Handle long press for message actions
  const handleLongPress = (messageId) => {
    if (isMobile) {
      setShowMessageActions(showMessageActions === messageId ? null : messageId);
      
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  // Filter messages based on search query
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    
    return messages.filter(message => {
      // Handle cases where message.desc might be undefined
      const messageText = message.desc 
        ? message.desc.replace(/<[^>]*>/g, '').toLowerCase()
        : '';
      
      // Also search in attachment file names
      const attachmentText = message.attachments 
        ? message.attachments.map(att => att.fileName).join(' ').toLowerCase()
        : '';
      
      return messageText.includes(searchQuery.toLowerCase()) || 
             attachmentText.includes(searchQuery.toLowerCase());
    });
  }, [messages, searchQuery]);

  // Group messages by sender for better UX
  const groupMessages = (messagesToGroup) => {
    const groups = [];
    let currentGroup = null;

    messagesToGroup.forEach((message, index) => {
      const isOwn = message.userId === currentUser?._id;
      const prevMessage = messagesToGroup[index - 1];
      const shouldStartNewGroup = !prevMessage || 
        prevMessage.userId !== message.userId ||
        dayjs(message.createdAt).diff(dayjs(prevMessage.createdAt), 'minutes') > 5;

      if (shouldStartNewGroup) {
        currentGroup = {
          userId: message.userId,
          userImg: message.userImg,
          isOwn,
          messages: [message],
        };
        groups.push(currentGroup);
      } else {
        currentGroup.messages.push(message);
      }
    });

    return groups;
  };

  if (!currentUser) {
    return (
      <div className="message">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">🔒</div>
            <p>Please log in to view messages</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message">
      <div className="container">
        {/* Order Context - Collapsible */}
        <OrderContext 
          conversationId={id}
          isVisible={true}
          isCollapsed={isOrderContextCollapsed}
          onToggleCollapse={() => setIsOrderContextCollapsed(!isOrderContextCollapsed)}
        />

        {/* Modern Chat Header */}
        <div className="chat-header">
          <div className="breadcrumbs">
            <Link to="/messages">Messages</Link>
            <span>›</span>
            <span>Chat</span>
          </div>
          
          <div className="chat-info">
            <div className="user-info">
              {otherUser && (
                <>
                  {/* <img 
                    // src={otherUser.img || "/img/noavatar.jpg"} 
                    alt={otherUser.username}
                    className="user-avatar"
                  /> */}
                  <div className="user-details">
                    <h2>{otherUser.username}</h2>
                    <span className={`status ${onlineUsers.has(otherUserId) ? 'online' : 'offline'}`}>
                      {onlineUsers.has(otherUserId) ? '• Online' : 'Offline'}
                    </span>
                  </div>
                </>
              )}
              {!otherUser && <h2>Loading...</h2>}
            </div>
          </div>

          <div className="chat-actions">
            {canScrollToTop && (
              <button 
                onClick={scrollToTop}
                className="scroll-to-top"
                title="Scroll to top"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                </svg>
              </button>
            )}
            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className={showSearch ? 'active' : ''}
              title="Search messages"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
            <button title="More options">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="search-bar">
            <div className="search-input-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                placeholder="Search in conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
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
          </div>
        )}

        {/* Messages Container */}
        <div className="messages-container">
          {isLoading ? (
            <div className="loading-container">
              <PulseLoader color="#22ab59" size={8} margin={2} />
              <span>Loading messages...</span>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <p>Failed to load messages</p>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <p>No messages yet</p>
              <span>Start the conversation below!</span>
            </div>
          ) : filteredMessages.length === 0 && searchQuery ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>No messages found</p>
              <span>Try different search terms</span>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setShowSearch(false);
                }}
                className="clear-search-btn"
              >
                Clear Search
              </button>
            </div>
            ) : (
             <div className="messages" ref={messagesContainerRef}>
              
              {groupMessages(filteredMessages).map((group, groupIndex) => (
                <div 
                  key={`group-${groupIndex}`} 
                  className={`message-group ${group.isOwn ? 'own' : ''}`}
                >
                  {group.messages.map((message, messageIndex) => {
                    // Sanitize and parse message content
                    const sanitizedHTML = DOMPurify.sanitize(message.desc, {
                      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
                      ALLOWED_ATTR: []
                    });
                    
                    const parseOptions = {
                      replace: (domNode) => {
                        if (domNode.type === "text") {
                          return (
                            <Linkify options={linkifyOptions}>
                              {domNode.data}
                            </Linkify>
                          );
                        }
                      },
                    };
                    
                    const messageContent = parse(sanitizedHTML, parseOptions);
                    const isFirstInGroup = messageIndex === 0;
                    const isLastInGroup = messageIndex === group.messages.length - 1;

                    return (
                      <div 
                        key={message._id} 
                        className={`message-item ${group.isOwn ? 'own' : ''}`}
                        onMouseEnter={() => !isMobile && setSelectedMessage(message._id)}
                        onMouseLeave={() => !isMobile && setSelectedMessage(null)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd(message._id)}
                        onContextMenu={(e) => {
                          if (isMobile) {
                            e.preventDefault();
                            handleLongPress(message._id);
                          }
                        }}
                      >
                        <div className={`avatar ${!isFirstInGroup ? 'hidden' : ''}`}>
                          <img
                            src={
                              group.userImg ||
                              "../img/user.png"
                            }
                            alt="Profile"
                          />
                        </div>
                        
                        <div className="message-content">
                          {/* Reply indicator */}
                          {message.replyTo && message.replyTo.text && ( 
                            <div className="reply-indicator">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
                              </svg>
                              <span>
                                Replied to: {parse(message.replyTo.text.length > 50 
                                  ? `${message.replyTo.text.substring(0, 50)}...` 
                                  : message.replyTo.text)}
                              </span>
                            </div>
                          )}
                          
                          {/* Only show message bubble if there's text content or attachments */}
                          {((message.desc && message.desc.replace(/<[^>]*>/g, '').trim().length > 0) || 
                            (message.attachments && message.attachments.length > 0)) && (
                            <div className={`message-bubble ${isFirstInGroup ? 'first-in-group' : ''} ${group.isOwn ? 'own' : ''} ${message.isTemporary ? 'temporary' : ''}`}>
                              {message.desc && message.desc.replace(/<[^>]*>/g, '').trim().length > 0 && (
                                <div className="message-text">
                                  {messageContent}
                                </div>
                              )}
                              
                              {/* Message Attachments */}
                              {message.attachments && message.attachments.length > 0 && (
                              <div className="message-attachments">
                                {message.attachments.map((attachment, attIndex) => (
                                  <div key={attIndex} className="attachment-item">
                                    {attachment.fileType.startsWith('image/') ? (
                                      <div className="image-attachment">
                                        <img 
                                          src={attachment.fileUrl} 
                                          alt={attachment.fileName}
                                          className="attachment-image"
                                          onClick={() => window.open(attachment.fileUrl, '_blank')}
                                        />
                                        <div className="image-overlay">
                                          <span className="file-name">{attachment.fileName}</span>
                                        </div>
                                      </div>
                                    ) : attachment.fileType.startsWith('video/') ? (
                                      <div className="video-attachment">
                                        <video 
                                          controls 
                                          className="attachment-video"
                                          preload="metadata"
                                        >
                                          <source src={attachment.fileUrl} type={attachment.fileType} />
                                          Your browser does not support the video tag.
                                        </video>
                                        <div className="video-info">
                                          <span className="file-name">{attachment.fileName}</span>
                                        </div>
                                      </div>
                                    ) : attachment.fileType.startsWith('audio/') ? (
                                      <div className="audio-attachment">
                                        <div className="audio-icon">🎵</div>
                                        <div className="audio-info">
                                          <span className="file-name">{attachment.fileName}</span>
                                          <audio controls className="attachment-audio">
                                            <source src={attachment.fileUrl} type={attachment.fileType} />
                                            Your browser does not support the audio tag.
                                          </audio>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="file-attachment">
                                        <div className="file-icon">📁</div>
                                        <div className="file-info">
                                          <a 
                                            href={attachment.fileUrl} 
                                            download={attachment.fileName}
                                            className="file-link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <span className="file-name">{attachment.fileName}</span>
                                            <span className="file-size">
                                              {formatFileSize(attachment.fileSize)}
                                            </span>
                                          </a>
                                        </div>
                                        <button 
                                          className="download-btn"
                                          onClick={() => window.open(attachment.fileUrl, '_blank')}
                                          title="Download file"
                                        >
                                          ⬇️
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Message Reactions */}
                            {message.reactions && message.reactions.length > 0 && (
                              <div className="message-reactions">
                                {Object.entries(
                                  message.reactions.reduce((acc, reaction) => {
                                    if (!acc[reaction.emoji]) {
                                      acc[reaction.emoji] = { count: 0, users: [], hasCurrentUser: false };
                                    }
                                    acc[reaction.emoji].count++;
                                    acc[reaction.emoji].users.push(reaction.userId);
                                    if (reaction.userId === currentUser?._id) {
                                      acc[reaction.emoji].hasCurrentUser = true;
                                    }
                                    return acc;
                                  }, {})
                                ).map(([emoji, data]) => (
                                  <button
                                    key={emoji}
                                    className={`reaction-item ${data.hasCurrentUser ? 'own' : ''}`}
                                    onClick={() => handleReaction(message._id, emoji)}
                                    title={`${data.count} reaction${data.count !== 1 ? 's' : ''}`}
                                  >
                                    <span className="emoji">{emoji}</span>
                                    <span className="count">{data.count}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* Message Actions */}
                            {(selectedMessage === message._id || (isMobile && showMessageActions === message._id)) && (
                              <div className={`message-hover-actions ${group.isOwn ? 'own' : ''}`}>
                                <div className="quick-reactions">
                                  {reactionEmojis.map((emoji, idx) => (
                                    <button
                                      key={idx}
                                      className="reaction-btn"
                                      onClick={() => handleReaction(message._id, emoji)}
                                      title={`React with ${emoji}`}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                                <button 
                                  className="more-actions-btn"
                                  onClick={() => setShowMessageActions(showMessageActions === message._id ? null : message._id)}
                                  title="More actions"
                                >
                                  <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                  </svg>
                                </button>
                              </div>
                            )}

                            {/* Message Actions Menu */}
                            {showMessageActions === message._id && (
                              <div className="message-actions-menu">
                                <button onClick={() => handleReplyToMessage(message)}>
                                  <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
                                  </svg>
                                  Reply
                                </button>
                                <button onClick={() => handleCopyMessage(message.desc)}>
                                  <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                                  </svg>
                                  Copy
                                </button>

                                {/* commented out by me because I don't want users to edit or delete messages */}
                                {/* {group.isOwn && (
                                  <>
                                    <button onClick={() => handleEditMessage(message)}>
                                      <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                      </svg>
                                      Edit
                                    </button>
                                    <button onClick={() => handleDeleteMessage(message._id)} className="delete-btn">
                                      <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                      </svg>
                                      Delete
                                    </button>
                                  </>
                                )} */}
                              </div>
                            )}
                          </div>
                          
                          )}
                          
                          {isLastInGroup && (
                            <div className={`message-meta ${group.isOwn ? 'own' : ''}`}>
                              <span className="time">
                                {dayjs(message.createdAt).fromNow()}
                              </span>
                              {group.isOwn && (
                                <div className="status delivered">
                                  ✓
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {typingUsers.size > 0 && (
                <div className="typing-indicator">
                  <div className="typing-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">
                    {typingUsers.size === 1 ? 'typing...' : `${typingUsers.size} people are typing...`}
                  </span>
                </div>
              )}
              
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Content Filtering Warnings */}
        {contentWarning && (
          <ContentWarning
            warning={contentWarning.message}
            type={contentWarning.action === 'block' ? 'error' : 'warning'}
            onDismiss={contentWarning.action !== 'block' ? () => setContentWarning(null) : undefined}
            showDetails={false}
          />
        )}
        
        {validationWarning && validationWarning.feedback && (
          <ContentWarning
            warning={validationWarning.feedback.message}
            type={validationWarning.feedback.type}
            suggestions={validationWarning.feedback.suggestions}
            violations={validationWarning.violations}
            showDetails={validationWarning.violations?.length > 0}
            onDismiss={() => setValidationWarning(null)}
          />
        )}

        {/* Modern Message Input */}
        <div className="message-input">
          {/* Reply Preview */}
          {replyingTo && (
            <div className="reply-preview">
              <div className="reply-content">
                <svg className="reply-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
                </svg>
                <div className="reply-text">
                  <strong>Replying to:</strong>
                  <span>
                    {replyingTo.desc 
                      ? (replyingTo.desc.replace(/<[^>]*>/g, '').length > 100 
                          ? `${replyingTo.desc.replace(/<[^>]*>/g, '').substring(0, 100)}...`
                          : replyingTo.desc.replace(/<[^>]*>/g, ''))
                      : "attachment or media"}
                  </span>
                </div>
              </div>
              <button type="button" onClick={cancelReply} className="cancel-reply">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          )}

          {/* Edit Preview */}
          {editingMessage && (
            <div className="edit-preview">
              <div className="edit-content">
                <svg className="edit-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                <div className="edit-text">
                  <strong>Editing message</strong>
                </div>
              </div>
              <button type="button" onClick={cancelEdit} className="cancel-edit">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          )}

          {/* File Preview Area */}
          {selectedFiles.length > 0 && (
            <div className="file-preview-area">
              <div className="file-preview-header">
                <span>{selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected</span>
                <button 
                  type="button" 
                  onClick={clearFiles}
                  className="clear-files-btn"
                  title="Clear all files"
                >
                  Clear All
                </button>
              </div>
              <div className="file-preview-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-preview-item">
                    <div className="file-preview-content">
                      <div className="file-icon">
                        {isImageFile(file) ? '🖼️' : 
                         isVideoFile(file) ? '🎥' : 
                         isAudioFile(file) ? '🎵' : '📁'}
                      </div>
                      <div className="file-info">
                        <div className="file-name" title={file.name}>
                          {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                        </div>
                        <div className="file-size">{formatFileSize(file.size)}</div>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeFile(index)}
                      className="remove-file-btn"
                      title="Remove file"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form 
            className={`input-form ${isDragOver ? 'drag-over' : ''}`}
            onSubmit={handleSubmit}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="input-container">
              <ReactQuill
                ref={quillRef}
                value={messageValue}
                onChange={(content) => {
                  setMessageValue(content);
                  
                  // Validate content for contact info
                  validateContentDebounced(content);
                  
                  // Trigger typing indicator
                  if (content.trim() && !editingMessage) {
                    handleTyping();
                  } else if (!content.trim()) {
                    handleStopTyping();
                  }
                }}
                onKeyPress={handleKeyPress}
                onBlur={handleStopTyping}
                placeholder="Type your message..."
                theme="snow"
                modules={{
                  toolbar: [
                    ["bold", "italic"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["clean"],
                  ],
                }}
              />
            </div>
            
            <div className="input-actions">
              {/* File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
              />
              
              <button 
                type="button"
                className="attach-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Attach files"
              >
                📎
              </button>

              <div className="emoji-picker-container">
                <button 
                  type="button" 
                  className={`emoji-btn ${showEmojiPicker ? 'active' : ''}`}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Add emoji"
                >
                  😊
                </button>
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <div className="emoji-grid">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          className="emoji-option"
                          onClick={() => handleEmojiSelect(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="send-btn"
                disabled={
                  mutation.isLoading || 
                  (!messageValue.trim() && selectedFiles.length === 0) ||
                  (validationWarning && !validationWarning.canSend)
                }
                title={editingMessage ? "Update message" : "Send message"}
              >
                {mutation.isLoading ? (
                  <PulseLoader color="white" size={4} margin={1} />
                ) : editingMessage ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                )}
              </button>
            </div>
          </form>
          
                      <div className="input-footer">
              <span className="hint">
                {isValidating ? 'Checking message...' : 'Press Enter to send, Shift+Enter for new line'}
              </span>
              {mutation.error && (
                <span className="error-text">Failed to send message</span>
              )}
              {validationWarning && !validationWarning.canSend && (
                <span className="error-text">Message contains prohibited content</span>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Message;