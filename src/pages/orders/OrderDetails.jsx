import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./OrderDetails.scss";
import newRequest from "../../utils/newRequest";
import MilestoneSetup from "../../components/milestoneSetup/MilestoneSetup";
import { PulseLoader } from "react-spinners";
import useToast from "../../components/toast/useToast";

const OrderDetails = () => {
  const toast = useToast();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  const [showSubmitWork, setShowSubmitWork] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [showMilestoneSetup, setShowMilestoneSetup] = useState(false);
  const [showMilestoneSubmission, setShowMilestoneSubmission] = useState(false);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [milestoneFiles, setMilestoneFiles] = useState([]);
  const [workDescription, setWorkDescription] = useState("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [revisionReason, setRevisionReason] = useState("");
  const [revisionDetails, setRevisionDetails] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDetails, setDisputeDetails] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [selectedMilestoneForAction, setSelectedMilestoneForAction] = useState(null);
  const [approvalFeedback, setApprovalFeedback] = useState("");

  // Fetch order details
  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => newRequest.get(`/orders/${orderId}/details`).then((res) => res.data),
  });

  // Submit work mutation
  const submitWorkMutation = useMutation({
    mutationFn: (workData) => newRequest.post(`/orders/${orderId}/submit-work`, workData),
    onSuccess: () => {
      queryClient.invalidateQueries(["order", orderId]);
      setShowSubmitWork(false);
      setWorkDescription("");
      setSelectedFiles([]);
    },
  });

  // Approve work mutation
  const approveWorkMutation = useMutation({
    mutationFn: (approvalData) => newRequest.post(`/orders/${orderId}/approve`, approvalData),
    onSuccess: () => {
      queryClient.invalidateQueries(["order", orderId]);
    },
  });

  // Request revision mutation
  const requestRevisionMutation = useMutation({
    mutationFn: (revisionData) => newRequest.post(`/orders/${orderId}/request-revision`, revisionData),
    onSuccess: () => {
      queryClient.invalidateQueries(["order", orderId]);
      setShowRevision(false);
      setRevisionReason("");
      setRevisionDetails("");
    },
  });

  // Initiate dispute mutation
  const initiateDisputeMutation = useMutation({
    mutationFn: (disputeData) => newRequest.post(`/orders/${orderId}/dispute`, disputeData),
    onSuccess: () => {
      queryClient.invalidateQueries(["order", orderId]);
      setShowDispute(false);
      setDisputeReason("");
      setDisputeDetails("");
    },
  });

  // Approve milestone mutation
  const approveMilestoneMutation = useMutation({
    mutationFn: ({ milestoneIndex, feedback }) => 
      newRequest.post(`/orders/${orderId}/milestones/${milestoneIndex}/approve`, { feedback }),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["order", orderId]);
      queryClient.refetchQueries(["order", orderId]);
      toast.success(response.data.message || "Milestone approved successfully! Payment has been released to freelancer.");
    },
    onError: (error) => {
      console.error("Error approving milestone:", error);
      const errorMessage = error.response?.data?.message || "Failed to approve milestone. Please try again.";
      toast.error(errorMessage);
    }
  });

  // Submit milestone work mutation
  const submitMilestoneWorkMutation = useMutation({
    mutationFn: ({ milestoneIndex, workData }) => 
      newRequest.post(`/orders/${orderId}/milestones/${milestoneIndex}/submit`, workData),
    onSuccess: () => {
      queryClient.invalidateQueries(["order", orderId]);
      setShowMilestoneSubmission(false);
      setMilestoneFiles([]);
      setMilestoneDescription("");
      setSelectedMilestoneIndex(null);
      toast.success("Milestone work submitted successfully! Client will be notified to review.");
    },
    onError: (error) => {
      console.error("Backend error:", error);
      toast.error("Failed to submit milestone work. Please try again.");
    }
  });

  // Request revision for a specific milestone
  const requestMilestoneRevisionMutation = useMutation({
    mutationFn: ({ milestoneIndex, reason, details }) => 
      newRequest.post(`/orders/${orderId}/milestones/${milestoneIndex}/revise`, { reason, details }),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["order", orderId]);
      queryClient.refetchQueries(["order", orderId]);
      toast.success(response.data?.message || "Revision request sent successfully!");
    },
    onError: (error) => {
      console.error("Error requesting revision:", error);
      const errorMessage = error.response?.data?.message || "Failed to request revision. Please try again.";
      toast.error(errorMessage);
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getEscrowStatusInfo = (escrowStatus) => {
    const statusMap = {
      pending: { text: "Payment Pending", color: "orange", icon: "⏳", description: "Waiting for payment to be processed" },
      funded: { text: "Escrowed - Work in Progress", color: "blue", icon: "🔒", description: "Payment secured in escrow. Work can begin." },
      work_submitted: { text: "Work Submitted - Awaiting Review", color: "purple", icon: "📋", description: "Work has been delivered. Client needs to review and approve." },
      approved: { text: "Work Approved", color: "green", icon: "✅", description: "Work approved by client" },
      released: { text: "Payment Released", color: "green", icon: "💰", description: "Payment has been released to freelancer" },
      disputed: { text: "Under Dispute", color: "red", icon: "⚠️", description: "Dispute is being reviewed by admin team" },
      refunded: { text: "Refunded", color: "gray", icon: "↩️", description: "Payment has been refunded to client" }
    };
    return statusMap[escrowStatus] || statusMap.pending;
  };

  const handleFileUpload = async (files) => {
    setUploading(true);
    setUploadError(null); // Clear previous errors
    
    try {
      // Validate file count before upload
      if (files.length > 5) {
        throw new Error(`Too many files selected. Maximum is 5 files per upload. You selected ${files.length} files.`);
      }

      // Create FormData for backend upload
      const formData = new FormData();
      for (let file of files) {
        formData.append('files', file);
      }

      // Upload to backend using the PROTECTED deliverable upload service (with watermarks)
      const response = await newRequest.post('/upload/deliverables', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Transform backend response to match expected format (watermarked deliverables)
      const uploadedFiles = response.data.files.map(file => ({
        originalName: file.originalName,
        filename: file.filename,
        fileUrl: file.fileUrl, // This is the preview URL (watermarked)
        previewUrl: file.previewUrl,
        originalUrl: file.originalUrl,
        fileSize: file.fileSize,
        fileType: file.fileType,
        isWatermarked: file.isWatermarked,
        accessLevel: file.accessLevel,
        submittedAt: new Date().toISOString(),
        description: workDescription || milestoneDescription
      }));
      
      console.log("✅ Files uploaded successfully:", uploadedFiles.length, "files");
      return uploadedFiles;
    } catch (error) {
      console.error("❌ File upload failed:", error);
      
      let errorMessage = "File upload failed. Please try again.";
      let errorDetails = null;
      
      // Handle specific error types from backend
      if (error.response?.data) {
        const errorData = error.response.data;
        errorMessage = errorData.error || errorMessage;
        
        // Handle failed files in batch uploads
        if (errorData.failedFiles && errorData.failedFiles.length > 0) {
          errorDetails = errorData.failedFiles;
        }
        
        // Include suggestion if provided
        if (errorData.suggestion) {
          errorMessage += `\n\nSuggestion: ${errorData.suggestion}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Set error state for UI display
      setUploadError({
        message: errorMessage,
        details: errorDetails,
        errorCode: error.response?.data?.errorCode
      });
      
      // Return null to indicate failure (different from empty array)
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitWork = async () => {
    try {
      // Validate that files are selected
      if (!selectedFiles || selectedFiles.length === 0) {
        toast.warning("Please select at least one file before submitting work.");
        return;
      }

      const deliverableUrls = await handleFileUpload(selectedFiles);
      
      // Check if file upload failed
      if (deliverableUrls === null) {
        console.error("❌ Cannot submit work - file upload failed");
        toast.error("Cannot submit work because file upload failed. Please fix the upload issues and try again.");
        return;
      }

      // Check if no files were uploaded
      if (!deliverableUrls || deliverableUrls.length === 0) {
        console.error("❌ Cannot submit work - no files uploaded");
        toast.error("No files were successfully uploaded. Please try uploading files again.");
        return;
      }

      console.log("✅ Submitting work with", deliverableUrls.length, "files");
      submitWorkMutation.mutate({
        description: workDescription,
        deliverableUrls
      });
    } catch (error) {
      console.error("Error submitting work:", error);
      toast.error("Failed to submit work. Please try again.");
    }
  };

  const handleApproveWork = () => {
    const rating = 5; // You might want to add a rating component
    const feedback = "Great work!"; // You might want to add a feedback form
    approveWorkMutation.mutate({ rating, feedback });
  };

  const handleRequestRevision = () => {
    requestRevisionMutation.mutate({
      reason: revisionReason,
      details: revisionDetails
    });
  };

  const handleInitiateDispute = () => {
    initiateDisputeMutation.mutate({
      reason: disputeReason,
      details: disputeDetails
    });
  };

  const getDisputeReasons = () => {
    const isClient = !currentUser.isSeller;
    
    if (isClient) {
      return [
        { value: "no_delivery", label: "Freelancer didn't deliver work" },
        { value: "poor_quality", label: "Work quality doesn't meet requirements" },
        { value: "not_as_described", label: "Work not as described in gig" },
        { value: "missed_deadline", label: "Freelancer missed agreed deadline" },
        { value: "communication", label: "Poor communication from freelancer" },
        { value: "plagiarism", label: "Work appears to be plagiarized" },
        { value: "incomplete", label: "Work delivered is incomplete" },
        { value: "other", label: "Other issue" }
      ];
    } else {
      return [
        { value: "non_payment", label: "Client refusing to pay for completed work" },
        { value: "scope_creep", label: "Client requesting work beyond agreed scope" },
        { value: "unfair_revision", label: "Client requesting unreasonable revisions" },
        { value: "communication", label: "Poor communication from client" },
        { value: "delayed_response", label: "Client not responding to delivered work" },
        { value: "payment_issue", label: "Payment processing or escrow issues" },
        { value: "false_claims", label: "Client making false claims about work" },
        { value: "other", label: "Other issue" }
      ];
    }
  };

  const handleApproveMilestone = (milestoneIndex) => {
    setSelectedMilestoneForAction(milestoneIndex);
    setApprovalFeedback("");
    setShowApproveModal(true);
  };

  const confirmApproval = () => {
    if (selectedMilestoneForAction !== null) {
      approveMilestoneMutation.mutate({ 
        milestoneIndex: parseInt(selectedMilestoneForAction), 
        feedback: approvalFeedback || "Milestone approved"
      });
      setShowApproveModal(false);
      setSelectedMilestoneForAction(null);
      setApprovalFeedback("");
    }
  };

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response?.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.isSeller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  const handleDownloadFile = async (deliverable) => {
    try {
      // Handle legacy uploads (PDFs that were incorrectly uploaded as images before the fix)
      const isLegacyFile = deliverable.fileUrl.includes('/image/upload/') && 
                          !deliverable.originalName.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);

      // Method 1: Try fetch and blob approach for all file types
      try {
        const response = await fetch(deliverable.fileUrl, {
          method: 'GET',
          headers: {
            'Accept': '*/*',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        // Create download URL
        const url = window.URL.createObjectURL(blob);
        
        // Create and trigger download
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = deliverable.originalName;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
        
        return;
        
      } catch (fetchError) {
        // If it's a legacy file and fetch failed due to 401, try alternative approach
        if (isLegacyFile && fetchError.message.includes('401')) {
          // For legacy files, try opening in new tab instead of downloading
          window.open(deliverable.fileUrl, '_blank');
          return;
        }
        // Continue to next method if fetch fails
      }
      
      // Method 2: Try Cloudinary-specific download URL
      if (deliverable.fileUrl.includes('cloudinary.com')) {
        try {
          let downloadUrl = deliverable.fileUrl;
          
          // Add fl_attachment flag to force download - handle different resource types
          if (!downloadUrl.includes('fl_attachment')) {
            if (downloadUrl.includes('/image/upload/')) {
              // For images
              downloadUrl = downloadUrl.replace('/image/upload/', '/image/upload/fl_attachment/');
            } else if (downloadUrl.includes('/video/upload/')) {
              // For videos
              downloadUrl = downloadUrl.replace('/video/upload/', '/video/upload/fl_attachment/');
            } else if (downloadUrl.includes('/raw/upload/')) {
              // For raw files (PDFs, documents, etc.)
              downloadUrl = downloadUrl.replace('/raw/upload/', '/raw/upload/fl_attachment/');
            } else {
              // Fallback for any other format
              downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
            }
          }
          
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = downloadUrl;
          link.download = deliverable.originalName;
          link.target = '_blank';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          return;
          
        } catch (cloudinaryError) {
          // Continue to next method if Cloudinary method fails
        }
      }
      
      // Method 3: Direct link download
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = deliverable.fileUrl;
      link.download = deliverable.originalName;
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
      
    } catch (error) {
      try {
        window.open(deliverable.fileUrl, '_blank');
      } finally {
        const isLegacy = deliverable.fileUrl.includes('/image/upload/') && 
          !deliverable.originalName.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
        if (isLegacy) {
          toast.info("This file was uploaded with an older system and may not download directly. Opened in a new tab instead.");
        } else {
          toast.error(`Download failed for ${deliverable.originalName}. Opened in a new tab instead.`);
        }
      }
    }
  };

  // Open milestone submission modal
  const handleMilestoneSubmission = (index) => {
    setSelectedMilestoneIndex(index);
    setMilestoneDescription("");
    setMilestoneFiles([]);
    setShowMilestoneSubmission(true);
  };

  // Open milestone revision modal
  const handleRequestMilestoneRevision = (index) => {
    setSelectedMilestoneForAction(index);
    setRevisionReason("");
    setRevisionDetails("");
    setShowRevisionModal(true);
  };

  // Helper to add more files with 5-file limit
  const addMoreFiles = (fileList, isMilestone = false) => {
    const fileArray = Array.from(fileList);
    if (isMilestone) {
      setMilestoneFiles(prev => {
        const combined = [...prev, ...fileArray];
        if (combined.length > 5) {
          toast.warning(`Cannot add ${fileArray.length} files. This would exceed the 5-file limit (max 5).`);
          return prev;
        }
        return combined;
      });
    } else {
      setSelectedFiles(prev => {
        const combined = [...prev, ...fileArray];
        if (combined.length > 5) {
          toast.warning(`Cannot add ${fileArray.length} files. This would exceed the 5-file limit (max 5).`);
          return prev;
        }
        return combined;
      });
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeMilestoneFile = (index) => {
    setMilestoneFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitMilestoneWork = async () => {
    try {
      if (!milestoneFiles || milestoneFiles.length === 0) {
        toast.warning("Please select at least one file before submitting milestone work.");
        return;
      }
      const deliverableUrls = await handleFileUpload(milestoneFiles);
      
      // Check if file upload failed
      if (deliverableUrls === null) {
        toast.error("Cannot submit milestone work because file upload failed. Please fix upload issues and try again.");
        return;
      }

      // Check if no files were uploaded
      if (!deliverableUrls || deliverableUrls.length === 0) {
        toast.error("No files were successfully uploaded. Please try again.");
        return;
      }
      const validDeliverables = deliverableUrls.filter(d => d.fileUrl);
      if (validDeliverables.length === 0) {
        toast.error("All file uploads failed. Please try again.");
        return;
      }
      if (validDeliverables.length !== deliverableUrls.length) {
        const failedCount = deliverableUrls.length - validDeliverables.length;
        toast.warning(`${failedCount} file(s) failed to upload. Submitting ${validDeliverables.length} successful upload(s).`);
      }
      submitMilestoneWorkMutation.mutate({
        milestoneIndex: parseInt(selectedMilestoneIndex),
        workData: {
          description: milestoneDescription,
          deliverableUrls: validDeliverables
        }
      });
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    }
  };

  const handleResetOrder = async () => {
    const confirmReset = window.confirm(
      "This will reset your work submission so you can upload files properly and re-submit. " +
      "Make sure you have all your files ready before proceeding. Continue?"
    );
    if (!confirmReset) return;
    try {
      const response = await newRequest.post(`/orders/${orderId}/reset-for-resubmission`);
      
      // Refresh the order data
      queryClient.invalidateQueries(["order", orderId]);
      queryClient.refetchQueries(["order", orderId]);
      toast.success(response.data.message || "Order reset successfully. You can now re-submit your work with proper file uploads.");
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reset order. Please try again or contact support.";
      toast.error(`Reset Failed: ${errorMessage}`);
    }
  };

  const confirmRevisionRequest = () => {
    if (selectedMilestoneForAction !== null && revisionReason.trim()) {
      requestMilestoneRevisionMutation.mutate({
        milestoneIndex: parseInt(selectedMilestoneForAction),
        reason: revisionReason.trim(),
        details: revisionDetails.trim()
      });
      setShowRevisionModal(false);
      setSelectedMilestoneForAction(null);
      setRevisionReason("");
      setRevisionDetails("");
    }
  };

  const renderTimelineEvent = (event, index) => (
    <div key={index} className="timeline-event">
      <div className="event-icon">{event.icon}</div>
      <div className="event-content">
        <h4>{event.title}</h4>
        <p>{event.description}</p>
        <small>{new Date(event.timestamp).toLocaleString()}</small>
        {event.details && (
          <div className="event-details">
            <p><strong>Details:</strong> {event.details}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="order-details">
        <div className="loading-container">
          <PulseLoader color="#1dbf73" loading={true} size={20} />
          <div className="loading-text">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-message">Unable to load order details</div>
          <div className="error-description">
            There was a problem loading the order. Please check your connection and try again.
          </div>
          <button onClick={() => navigate("/orders")} className="back-btn">
            ← Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details">
        <div className="error-container">
          <div className="error-icon">📋</div>
          <div className="error-message">Order not found</div>
          <div className="error-description">
            The order you're looking for doesn't exist or you don't have access to it.
          </div>
          <button onClick={() => navigate("/orders")} className="back-btn">
            ← Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const escrowInfo = getEscrowStatusInfo(order.escrowStatus);
  const isFreelancer = currentUser.isSeller;
  const isClient = !currentUser.isSeller;

  // Build timeline of events
  const timeline = [];
  
  if (order.paidAt) {
    timeline.push({
      icon: "💳",
      title: "Payment Received",
      description: "Payment secured in escrow",
      timestamp: order.paidAt
    });
  }

  // Add milestone submissions to timeline
  if (order.milestones && order.milestones.length > 0) {
    order.milestones.forEach((milestone, index) => {
      // Add milestone creation event
      if (milestone.createdAt) {
        timeline.push({
          icon: "📋",
          title: `Milestone ${index + 1} Created`,
          description: `"${milestone.title}" - $${milestone.amount}`,
          timestamp: milestone.createdAt,
          details: milestone.description
        });
      }

      // Add milestone work submission events
      if (milestone.deliverables && milestone.deliverables.length > 0 && milestone.submittedAt) {
        const firstDesc = milestone.deliverables.find(d => d.description && d.description.trim())?.description;
        const filesList = `${milestone.deliverables.length} file${milestone.deliverables.length > 1 ? 's' : ''}: ${milestone.deliverables.map(f => f.originalName).join(', ')}`;
        const details = firstDesc ? `Summary: "${firstDesc}" | ${filesList}` : filesList;
        timeline.push({
          icon: "📤",
          title: `Milestone ${index + 1} Work Submitted`,
          description: `Deliverables submitted for "${milestone.title}"`,
          timestamp: milestone.submittedAt,
          details
        });
      }

      // Add milestone approval events
      if (milestone.approvedAt) {
        timeline.push({
          icon: "✅",
          title: `Milestone ${index + 1} Approved`,
          description: `"${milestone.title}" approved and payment released`,
          timestamp: milestone.approvedAt,
          details: milestone.clientFeedback
            ? `Payment: ₦${milestone.amount} | Client feedback: "${milestone.clientFeedback}"`
            : `Payment: ₦${milestone.amount}`
        });
      }
    });
  }

  // Add milestone-specific revision requests
  if (order.revisionRequests && order.revisionRequests.length > 0) {
    order.revisionRequests.forEach((revision, index) => {
      const isMilestoneRevision = revision.reason && revision.reason.includes('Milestone');
      timeline.push({
        icon: "🔄",
        title: isMilestoneRevision ? revision.reason.split(':')[0] + ' Revision Requested' : `Revision Requested (#${index + 1})`,
        description: isMilestoneRevision ? revision.reason.split(':')[1]?.trim() || "Client requested changes" : revision.reason || "Client requested changes",
        timestamp: revision.requestedAt,
        details: revision.details
      });
    });
  }

  // Add regular order revision requests (non-milestone)
  if (order.revisionRequests && order.revisionRequests.length > 0) {
    const regularRevisions = order.revisionRequests.filter(revision => 
      !revision.reason || !revision.reason.includes('Milestone')
    );
    
    regularRevisions.forEach((revision, index) => {
      timeline.push({
        icon: "🔄", 
        title: `Work Revision Requested (#${index + 1})`,
        description: revision.reason || "Client requested changes to deliverables",
        timestamp: revision.requestedAt,
        details: revision.details
      });
    });
  }

  // Add regular work submissions grouped by revision number (only if no milestones)
  if (order.deliverables && order.deliverables.length > 0) {
    const groupedDeliverables = order.deliverables.reduce((acc, deliverable) => {
      const revisionNum = deliverable.revisionNumber || 1;
      if (!acc[revisionNum]) {
        acc[revisionNum] = [];
      }
      acc[revisionNum].push(deliverable);
      return acc;
    }, {});

    Object.keys(groupedDeliverables)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .forEach((revisionNum) => {
        const files = groupedDeliverables[revisionNum];
        const isOriginal = parseInt(revisionNum) === 1;
        
        timeline.push({
          icon: isOriginal ? "📤" : "🔄",
          title: isOriginal ? "Work Submitted" : `Revision Submitted (#${parseInt(revisionNum) - 1})`,
          description: files[0].description || "Freelancer delivered work",
          timestamp: files[0].submittedAt,
          details: `${files.length} file${files.length > 1 ? 's' : ''}: ${files.map(f => f.originalName).join(', ')}`
        });
      });
  }

  if (order.approvedAt) {
    timeline.push({
      icon: "✅",
      title: "Work Approved",
      description: "Client approved the deliverables",
      timestamp: order.approvedAt,
      details: order.clientNotes ? `Client feedback: "${order.clientNotes}"` : undefined
    });
  }

  if (order.disputeInitiatedAt) {
    timeline.push({
      icon: "⚠️",
      title: "Dispute Initiated",
      description: `Dispute initiated by ${order.disputeInitiatedBy === currentUser._id ? 'you' : 'other party'}`,
      timestamp: order.disputeInitiatedAt,
      details: order.disputeDetails
    });
  }

  if (order.releasedAt) {
    timeline.push({
      icon: "💰",
      title: "Payment Released",
      description: "Payment transferred to freelancer",
      timestamp: order.releasedAt
    });
  }

  // Sort timeline by timestamp
  timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="order-details">
      <div className="container">
        {/* Header */}
        <div className="header">
          <button onClick={() => navigate("/orders")} className="back-btn">
            ← Back to Orders
          </button>
          <div className="header-content">
            <div className="order-info">
              <img src={order.img} alt={order.title} className="order-image" />
              <div className="order-meta">
                <h1>{order.title}</h1>
                <Link to={`/gig/${order.gigId}`} className="gig-link">
                  📋 View Original Gig
                </Link>
                <div className="price">{formatPrice(order.price)}</div>
                <div className="participants">
                  <span className="client">Client: {isFreelancer ? order.buyerInfo?.username : "You"}</span>
                  <span className="freelancer">Freelancer: {isClient ? order.sellerInfo?.username : "You"}</span>
                </div>
              </div>
            </div>
            <div className={`escrow-status ${escrowInfo.color}`}>
              <div className="status-icon">{escrowInfo.icon}</div>
              <div className="status-text">
                <h3>{escrowInfo.text}</h3>
                <p>{escrowInfo.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-grid">
          {/* Main Content */}
          <div className="main-content">
            {/* Milestones */}
            {order.milestones && order.milestones.length > 0 && (
              <div className="section milestones-section">
                <h2>Project Milestones</h2>
                <div className="milestones">
                  {order.milestones.map((milestone, index) => (
                    <div key={index} className={`milestone ${milestone.status}`}>
                      <div className="milestone-header">
                        <h3>{milestone.title}</h3>
                        <div className="milestone-amount">{formatPrice(milestone.amount)}</div>
                      </div>
                      <p className="milestone-description">{milestone.description}</p>
                      <div className="milestone-status">
                        <span className={`status-badge ${milestone.status}`}>
                          {milestone.status.replace('_', ' ').toUpperCase()}
                        </span>
                        {milestone.dueDate && (
                          <span className="due-date">Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                      
                      {/* Milestone Actions */}
                      {isFreelancer && (milestone.status === 'pending' || milestone.status === 'in_progress') && order.escrowStatus === 'funded' && (
                        <button 
                          className="milestone-btn primary"
                          onClick={() => handleMilestoneSubmission(index)}
                        >
                          {milestone.status === 'in_progress' ? '🔄 Resubmit Work' : '📤 Submit Milestone Work'}
                        </button>
                      )}
                      
                      {/* Show submission status for freelancer */}
                      {isFreelancer && milestone.status === 'submitted' && (
                        <div className="milestone-status-info">
                          <span className="status-badge submitted">✅ Work Submitted - Awaiting Client Review</span>
                        </div>
                      )}

                      {/* Client Actions */}
                      {isClient && milestone.status === 'submitted' && (
                        <div className="milestone-actions">
                          <button 
                            className="milestone-btn success"
                            onClick={() => handleApproveMilestone(index)}
                            disabled={approveMilestoneMutation.isLoading}
                          >
                            {approveMilestoneMutation.isLoading ? '⏳ Processing...' : '✅ Approve Milestone'}
                          </button>
                          <button 
                            className="milestone-btn warning"
                            onClick={() => handleRequestMilestoneRevision(index)}
                            disabled={requestMilestoneRevisionMutation.isLoading}
                          >
                            {requestMilestoneRevisionMutation.isLoading ? '⏳ Processing...' : '🔄 Request Revision'}
                          </button>
                        </div>
                      )}

                      {/* Show approved status */}
                      {milestone.status === 'approved' && (
                        <div className="milestone-status-info">
                          <span className="status-badge approved">✅ Milestone Approved & Paid</span>
                          {milestone.approvedAt && (
                            <small>Approved on {new Date(milestone.approvedAt).toLocaleDateString()}</small>
                          )}
                          {/* Show client feedback to freelancer */}
                          {isFreelancer && milestone.clientFeedback && (
                            <div className="client-feedback">
                              <h6>💬 Client Feedback:</h6>
                              <p>"{milestone.clientFeedback}"</p>
                            </div>
                          )}
                        </div>
                      )}



                      {/* Show milestone deliverables if submitted or approved */}
                      {(milestone.status === 'submitted' || milestone.status === 'approved') && 
                       milestone.deliverables && milestone.deliverables.length > 0 && (
                        <div className="milestone-deliverables">
                          <h5>📎 Submitted Work:</h5>
                          {(() => {
                            const submissionDesc = milestone.deliverables.find(d => d.description && d.description.trim())?.description;
                            return submissionDesc ? (
                              <p className="submission-desc">"{submissionDesc}"</p>
                            ) : null;
                          })()}
                          <div className="deliverables-list">
                            {milestone.deliverables.map((deliverable, delivIndex) => (
                              <div key={delivIndex} className="deliverable-item">
                                <div className="file-info">
                                  <span className="file-name">📄 {deliverable.originalName}</span>
                                  <span className="file-size">({(deliverable.fileSize / 1024 / 1024).toFixed(2)}MB)</span>
                                </div>
                                <div className="file-actions">
                                  {deliverable.fileUrl ? (
                                    <>
                                      <a href={deliverable.fileUrl} target="_blank" rel="noopener noreferrer" className="view-btn">
                                        👁️ View
                                      </a>
                                      <button 
                                        className="download-btn"
                                        onClick={() => handleDownloadFile(deliverable)}
                                      >
                                        📥 Download
                                      </button>
                                    </>
                                  ) : (
                                    <span className="file-error">❌ Upload Failed</span>
                                  )}</div>
                              </div>
                            ))}
                          </div>
                          {milestone.submittedAt && (
                            <small className="submission-date">
                              Submitted on {new Date(milestone.submittedAt).toLocaleString()}
                            </small>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables */}
            {order.deliverables && order.deliverables.length > 0 && (
              <div className="section deliverables-section">
                {(() => {
                  // Group deliverables by revision number
                  const groupedDeliverables = order.deliverables.reduce((acc, deliverable) => {
                    const revisionNum = deliverable.revisionNumber || 1;
                    if (!acc[revisionNum]) {
                      acc[revisionNum] = [];
                    }
                    acc[revisionNum].push(deliverable);
                    return acc;
                  }, {});

                  const revisionNumbers = Object.keys(groupedDeliverables).sort((a, b) => parseInt(a) - parseInt(b));
                  const totalRevisions = revisionNumbers.length;

                  return (
                    <>
                      <h2>Work Submissions ({totalRevisions} submission{totalRevisions > 1 ? 's' : ''})</h2>
                      <div className="deliverables">
                        {revisionNumbers.map((revisionNum, revisionIndex) => {
                          const files = groupedDeliverables[revisionNum];
                          const isOriginal = parseInt(revisionNum) === 1;
                          
                          return (
                            <div key={revisionNum} className={`deliverable-group ${isOriginal ? 'original' : 'revision'}`}>
                              <div className="group-header">
                                <div className="submission-info">
                                  <div className="file-icon">
                                    {isOriginal ? '📄' : '🔄'}
                                  </div>
                                  <div className="submission-details">
                                    <h3>{isOriginal ? 'Original Submission' : `Revision #${parseInt(revisionNum) - 1}`}</h3>
                                    <span className="submission-date">
                                      {new Date(files[0].submittedAt).toLocaleDateString()}
                                    </span>
                                    <span className="file-count">{files.length} file{files.length > 1 ? 's' : ''}</span>
                                  </div>
                                </div>
                              </div>
                              {(() => {
                                const groupDesc = files.find(d => d.description && d.description.trim())?.description;
                                return groupDesc ? (
                                  <div className="submission-overview">
                                    <p className="submission-desc">"{groupDesc}"</p>
                                  </div>
                                ) : null;
                              })()}
                              <div className="files-list">
                                {files.map((deliverable, fileIndex) => (
                                  <div key={fileIndex} className="file-item">
                                    <div className="file-info">
                                      <h4>{deliverable.originalName}</h4>
                                      <div className="file-meta">
                                        <span>Size: {(deliverable.fileSize / 1024).toFixed(1)}KB</span>
                                        <span>Uploaded: {new Date(deliverable.submittedAt).toLocaleString()}</span>
                                      </div>
                                    </div>
                                    <div className="file-actions">
                                      {deliverable.fileUrl ? (
                                        <>
                                          <a href={deliverable.fileUrl} target="_blank" rel="noopener noreferrer" className="view-btn">
                                            👁️ View
                                          </a>
                                          <button 
                                            className="download-btn"
                                            onClick={() => handleDownloadFile(deliverable)}
                                          >
                                            📥 Download
                                          </button>
                                        </>
                                      ) : (
                                        <span className="file-error">❌ Upload Failed</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Timeline */}
            <div className="section timeline-section">
              <h2>Order Timeline</h2>
              <div className="timeline">
                {timeline.map((event, index) => renderTimelineEvent(event, index))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Protection Info */}
            <div className="card protection-card">
              <h3>🛡️ Payment Protection</h3>
              <div className="protection-info">
                <div className="protection-item">
                  <span className="check">✅</span>
                  <span>Payment secured in escrow</span>
                </div>
                <div className="protection-item">
                  <span className="check">✅</span>
                  <span>Funds held until work approved</span>
                </div>
                {order.autoReleaseDate && (
                  <div className="protection-item">
                    <span className="clock">⏰</span>
                    <span>Auto-release: {new Date(order.autoReleaseDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Panel */}
            <div className="card actions-card">
              <h3>Actions</h3>
              <div className="actions">
                {/* Milestone Setup Option */}
                {isClient && order.escrowStatus === 'funded' && (!order.milestones || order.milestones.length === 0) && order.price >= 50000 && !order.gigHasSellerMilestones && (
                  <div className="milestone-promotion">
                    <div className="promotion-text">
                      <strong>💡 Recommended:</strong> Set up milestones for secure progress payments
                    </div>
                    <button 
                      className="action-btn milestone"
                      onClick={() => {
                        if (order.gigHasSellerMilestones) {
                          toast.warning("This order is based on a gig with seller-defined milestones. Custom milestones cannot be created for this order.");
                          return;
                        }
                        setShowMilestoneSetup(true);
                      }}
                    >
                      🎯 Set Up Milestones
                    </button>
                  </div>
                )}
                {isClient && order.escrowStatus === 'funded' && (!order.milestones || order.milestones.length === 0) && order.gigHasSellerMilestones && (
                  <div className="milestone-info-message">
                    <span className="info-icon">ℹ️</span>
                    <span>This order is based on a gig with seller-defined milestones. Custom milestones cannot be created.</span>
                  </div>
                )}

                {/* Freelancer Actions */}
                {isFreelancer && order.escrowStatus === 'funded' && order.canSubmitWork && 
                 (!order.milestones || order.milestones.length === 0) && (
                  <button 
                    className="action-btn primary"
                    onClick={() => setShowSubmitWork(true)}
                  >
                    📤 Submit Work
                  </button>
                )}

                {/* Recovery Action for Stuck Orders */}
                {isFreelancer && order.escrowStatus === 'work_submitted' && 
                 (!order.deliverables || order.deliverables.length === 0) && (
                  <div className="stuck-order-recovery">
                    <div className="recovery-alert">
                      <span className="alert-icon">⚠️</span>
                      <div className="alert-content">
                        <strong>Work Submission Issue Detected</strong>
                        <p>Your work was submitted but no files were uploaded successfully. This usually happens when file uploads fail due to size or quantity limits.</p>
                      </div>
                    </div>
                    <button 
                      className="action-btn warning"
                      onClick={() => handleResetOrder()}
                      disabled={uploading}
                    >
                      🔄 Reset & Re-submit Work
                    </button>
                  </div>
                )}

                {/* Show message when milestones are setup */}
                {isFreelancer && order.escrowStatus === 'funded' && 
                 order.milestones && order.milestones.length > 0 && (
                  <div className="milestone-info-message">
                    <span className="info-icon">ℹ️</span>
                    <span>This order uses milestone-based delivery. Please submit work through individual milestones above.</span>
                  </div>
                )}

                {/* Client Actions */}
                {isClient && order.escrowStatus === 'work_submitted' && order.canApprove && (
                  <>
                    <button 
                      className="action-btn success"
                      onClick={handleApproveWork}
                    >
                      ✅ Approve Work
                    </button>
                    <button 
                      className="action-btn warning"
                      onClick={() => setShowRevision(true)}
                    >
                      🔄 Request Revision
                    </button>
                  </>
                )}

                {/* Dispute Action */}
                {order.canDispute && (
                  <button 
                    className="action-btn danger"
                    onClick={() => setShowDispute(true)}
                  >
                    ⚠️ Initiate Dispute
                  </button>
                )}

                {/* Contact Button */}
                <button 
                  className="action-btn secondary"
                  onClick={() => handleContact(order)}
                >
                  💬 Contact {isFreelancer ? 'Client' : 'Freelancer'}
                </button>
              </div>
            </div>

            {/* Order Details */}
            <div className="card details-card">
              <h3>Order Details</h3>
              <div className="detail-item">
                <span className="label">Order ID:</span>
                <span className="value">{order._id}</span>
              </div>
              <div className="detail-item">
                <span className="label">Created:</span>
                <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Protection Level:</span>
                <span className={`value protection-${order.protectionLevel}`}>
                  {order.protectionLevel === 'enhanced' ? '🛡️ Enhanced' : '🔒 Standard'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {/* Submit Work Modal */}
        {showSubmitWork && (
          <div className="modal-overlay" onClick={() => setShowSubmitWork(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📤 Submit Your Work</h3>
                <button className="modal-close" onClick={() => setShowSubmitWork(false)}>×</button>
              </div>
              <div className="modal-body">
                <p><strong>Ready to deliver?</strong> Upload your completed work and provide a description of what you've accomplished.</p>
                
                <div className="form-group">
                  <label>Work Description (required):</label>
                  <textarea
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    placeholder="Describe the work you've completed, any challenges overcome, and key features delivered..."
                    rows={4}
                    className="form-textarea"
                    required
                    autoFocus
                  />
                </div>
                
                <div className="form-group">
                  <label>Upload Deliverables (required):</label>
                  <div className="file-input-container">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => selectedFiles.length === 0 ? 
                        setSelectedFiles(Array.from(e.target.files)) : 
                        addMoreFiles(e.target.files, false)}
                      accept="*/*"
                      disabled={selectedFiles.length >= 5}
                    />
                    {selectedFiles.length > 0 && selectedFiles.length < 5 && (
                      <button 
                        type="button"
                        className="add-more-files-btn"
                        onClick={() => document.querySelector('input[type="file"]').click()}
                      >
                        ➕ Add More Files
                      </button>
                    )}
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="file-list">
                      <div className="file-list-header">
                        <p><strong>Selected files ({selectedFiles.length}/5):</strong></p>
                        <button 
                          type="button"
                          className="clear-all-btn"
                          onClick={() => setSelectedFiles([])}
                          title="Clear all selected files"
                        >
                          🗑️ Clear All
                        </button>
                      </div>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="file-item">
                          <div className="file-info">
                            <span className="file-icon">📄</span>
                            <div className="file-details">
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)}MB)</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            className="remove-file-btn"
                            onClick={() => removeSelectedFile(index)}
                            title={`Remove ${file.name}`}
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                      {selectedFiles.length >= 5 && (
                        <div className="file-limit-notice">
                          <span className="limit-icon">⚠️</span>
                          <span>Maximum file limit reached (5 files)</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn secondary" onClick={() => setShowSubmitWork(false)}>
                  Cancel
                </button>
                <button 
                  className={`btn primary ${(submitWorkMutation.isLoading || uploading) ? 'loading' : ''}`}
                  onClick={handleSubmitWork}
                  disabled={submitWorkMutation.isLoading || uploading || !workDescription || selectedFiles.length === 0}
                >
                  {uploading ? 'Uploading files...' : submitWorkMutation.isLoading ? 'Processing...' : '✅ Submit Work'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Request Revision Modal */}
        {showRevision && (
          <div className="modal-overlay" onClick={() => setShowRevision(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🔄 Request Revision</h3>
                <button className="modal-close" onClick={() => setShowRevision(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="warning-message">
                  <p><strong>Need changes?</strong> Please select a reason and provide specific details so the freelancer can deliver exactly what you need.</p>
                </div>
                
                <div className="form-group">
                  <label>Revision Reason (required):</label>
                  <select
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                    required
                  >
                    <option value="">Select a reason for revision</option>
                    <option value="quality">Quality doesn't meet requirements</option>
                    <option value="incomplete">Work is incomplete</option>
                    <option value="instructions">Didn't follow instructions properly</option>
                    <option value="scope">Work doesn't match project scope</option>
                    <option value="timeline">Deliverables missing or delayed</option>
                    <option value="other">Other issue</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Detailed Explanation (required):</label>
                  <textarea
                    value={revisionDetails}
                    onChange={(e) => setRevisionDetails(e.target.value)}
                    placeholder="Please provide specific details about what needs to be revised, changed, or improved..."
                    rows={5}
                    className="form-textarea"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn secondary" onClick={() => setShowRevision(false)}>
                  Cancel
                </button>
                <button 
                  className={`btn warning ${requestRevisionMutation.isLoading ? 'loading' : ''}`}
                  onClick={handleRequestRevision}
                  disabled={requestRevisionMutation.isLoading || !revisionReason || !revisionDetails}
                >
                  {requestRevisionMutation.isLoading ? 'Processing...' : '🔄 Request Revision'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dispute Modal */}
        {showDispute && (
          <div className="modal-overlay" onClick={() => setShowDispute(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>⚠️ Initiate Dispute</h3>
                <button className="modal-close" onClick={() => setShowDispute(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="warning-message">
                  <p><strong>⚠️ Important:</strong> Disputes should only be initiated when other resolution methods have failed. Our mediation team will review all evidence, communications, and project history before making a decision.</p>
                </div>
                
                <div className="form-group">
                  <label>Dispute Reason (required):</label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    required
                  >
                    <option value="">Select the primary reason for this dispute</option>
                    {getDisputeReasons().map(reason => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Detailed Explanation (required):</label>
                  <textarea
                    value={disputeDetails}
                    onChange={(e) => setDisputeDetails(e.target.value)}
                    placeholder="Please provide a comprehensive explanation of the issue, including timeline of events, communication attempts, and any relevant evidence..."
                    rows={6}
                    className="form-textarea"
                    required
                  />
                  <small style={{color: '#6c757d', fontSize: '13px', marginTop: '8px', display: 'block'}}>
                    💡 Tip: Include specific dates, reference previous communications, and explain what resolution you're seeking.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn secondary" onClick={() => setShowDispute(false)}>
                  Cancel
                </button>
                <button 
                  className={`btn danger ${initiateDisputeMutation.isLoading ? 'loading' : ''}`}
                  onClick={handleInitiateDispute}
                  disabled={initiateDisputeMutation.isLoading || !disputeReason || !disputeDetails}
                >
                  {initiateDisputeMutation.isLoading ? 'Processing...' : '⚠️ Initiate Dispute'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Milestone Setup Modal */}
        {showMilestoneSetup && (
          <div className="modal-overlay" onClick={() => setShowMilestoneSetup(false)}>
            <div className="modal milestone-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🎯 Set Up Project Milestones</h3>
                <button 
                  className="modal-close" 
                  onClick={() => setShowMilestoneSetup(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body milestone-content">
                <MilestoneSetup 
                  order={order}
                  onClose={() => setShowMilestoneSetup(false)}
                  onSuccess={() => {
                    setShowMilestoneSetup(false);
                    queryClient.invalidateQueries(["order", orderId]);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Milestone Work Submission Modal */}
        {showMilestoneSubmission && (
          <div className="modal-overlay" onClick={() => setShowMilestoneSubmission(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📤 Submit Milestone Work</h3>
                <button className="modal-close" onClick={() => setShowMilestoneSubmission(false)}>×</button>
              </div>
              
              <div className="modal-body">
                {selectedMilestoneIndex !== null && order.milestones && (
                  <div className="milestone-info">
                    <h4>{order.milestones[selectedMilestoneIndex]?.title}</h4>
                    <p>{order.milestones[selectedMilestoneIndex]?.description}</p>
                    <div className="milestone-amount">
                      Payment: {formatPrice(order.milestones[selectedMilestoneIndex]?.amount)}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Work Description (required):</label>
                  <textarea
                    value={milestoneDescription}
                    onChange={(e) => setMilestoneDescription(e.target.value)}
                    placeholder="Describe what you've completed for this milestone, including key features, deliverables, and any important notes for the client..."
                    rows={4}
                    className="form-textarea"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label>Upload Deliverables (required):</label>
                  <div className="file-input-container">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => milestoneFiles.length === 0 ? 
                        setMilestoneFiles(Array.from(e.target.files)) : 
                        addMoreFiles(e.target.files, true)}
                      accept="*/*"
                      disabled={milestoneFiles.length >= 5}
                    />
                    {milestoneFiles.length > 0 && milestoneFiles.length < 5 && (
                      <button 
                        type="button"
                        className="add-more-files-btn"
                        onClick={() => {
                          const fileInputs = document.querySelectorAll('input[type="file"]');
                          const milestoneFileInput = fileInputs[fileInputs.length - 1]; // Get the last file input (milestone one)
                          milestoneFileInput.click();
                        }}
                      >
                        ➕ Add More Files
                      </button>
                    )}
                  </div>
                  {milestoneFiles.length > 0 && (
                    <div className="file-list">
                      <div className="file-list-header">
                        <p><strong>Selected files ({milestoneFiles.length}/5):</strong></p>
                        <button 
                          type="button"
                          className="clear-all-btn"
                          onClick={() => setMilestoneFiles([])}
                          title="Clear all selected files"
                        >
                          🗑️ Clear All
                        </button>
                      </div>
                      {milestoneFiles.map((file, index) => (
                        <div key={index} className="file-item">
                          <div className="file-info">
                            <span className="file-icon">📄</span>
                            <div className="file-details">
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)}MB)</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            className="remove-file-btn"
                            onClick={() => removeMilestoneFile(index)}
                            title={`Remove ${file.name}`}
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                      {milestoneFiles.length >= 5 && (
                        <div className="file-limit-notice">
                          <span className="limit-icon">⚠️</span>
                          <span>Maximum file limit reached (5 files)</span>
                        </div>
                      )}
                    </div>
                  )}
                  <small style={{color: '#6c757d', fontSize: '13px', marginTop: '8px', display: 'block'}}>
                    💡 Upload all relevant files for this milestone. Supported formats: documents, images, videos, code files, etc.
                  </small>

                  {/* Upload Error Display for Milestone Modal */}
                  {uploadError && (
                    <div className="upload-error-container">
                      <div className="error-header">
                        <span className="error-icon">❌</span>
                        <h4>Upload Failed</h4>
                      </div>
                      <div className="error-message">
                        {uploadError.message}
                      </div>
                      {uploadError.details && uploadError.details.length > 0 && (
                        <div className="error-details">
                          <h5>Failed Files:</h5>
                          <ul>
                            {uploadError.details.map((failedFile, index) => (
                              <li key={index} className="failed-file">
                                <strong>{failedFile.filename}</strong>
                                {failedFile.fileSize && <span className="file-size">({failedFile.fileSize})</span>}
                                <div className="file-error">{failedFile.error}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <button 
                        className="dismiss-error-btn"
                        onClick={() => setUploadError(null)}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn secondary" onClick={() => setShowMilestoneSubmission(false)}>
                  Cancel
                </button>
                <button 
                  className={`btn primary ${(submitMilestoneWorkMutation.isLoading || uploading) ? 'loading' : ''}`}
                  onClick={handleSubmitMilestoneWork}
                  disabled={
                    submitMilestoneWorkMutation.isLoading || 
                    uploading || 
                    !milestoneDescription || 
                    milestoneFiles.length === 0
                  }
                >
                  {uploading ? 'Uploading files...' : submitMilestoneWorkMutation.isLoading ? 'Processing...' : '✅ Submit Milestone Work'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approve Milestone Modal */}
        {showApproveModal && (
          <div className="modal-overlay" onClick={() => setShowApproveModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Approve Milestone {selectedMilestoneForAction !== null ? selectedMilestoneForAction + 1 : ''}</h3>
                <button className="modal-close" onClick={() => setShowApproveModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <p><strong>⚠️ Important:</strong> Payment will be released to the freelancer immediately after approval.</p>
                <div className="form-group">
                  <label>Optional feedback for the freelancer:</label>
                  <textarea
                    value={approvalFeedback}
                    onChange={(e) => setApprovalFeedback(e.target.value)}
                    placeholder="Great work! The milestone meets all requirements..."
                    rows={4}
                    className="form-textarea"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn secondary" 
                  onClick={() => setShowApproveModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={`btn success ${approveMilestoneMutation.isLoading ? 'loading' : ''}`}
                  onClick={confirmApproval}
                  disabled={approveMilestoneMutation.isLoading}
                >
                  {approveMilestoneMutation.isLoading ? 'Processing...' : '✅ Approve & Release Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Request Revision Modal */}
        {showRevisionModal && (
          <div className="modal-overlay" onClick={() => setShowRevisionModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Request Revision for Milestone {selectedMilestoneForAction !== null ? selectedMilestoneForAction + 1 : ''}</h3>
                <button className="modal-close" onClick={() => setShowRevisionModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Reason for revision (required):</label>
                  <textarea
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                    placeholder="Please explain what needs to be changed or improved..."
                    rows={3}
                    className="form-textarea"
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label>Additional details (optional):</label>
                  <textarea
                    value={revisionDetails}
                    onChange={(e) => setRevisionDetails(e.target.value)}
                    placeholder="Any specific instructions or requirements..."
                    rows={3}
                    className="form-textarea"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn secondary" 
                  onClick={() => setShowRevisionModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={`btn warning ${requestMilestoneRevisionMutation.isLoading ? 'loading' : ''}`}
                  onClick={confirmRevisionRequest}
                  disabled={requestMilestoneRevisionMutation.isLoading || !revisionReason.trim()}
                >
                  {requestMilestoneRevisionMutation.isLoading ? 'Processing...' : '🔄 Request Revision'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
