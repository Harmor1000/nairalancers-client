// src/components/Add.jsx

import React, { useState, useReducer, useEffect } from "react";
import "./Add.scss";
import "./PackagesAndMilestones.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams, Navigate, Link } from "react-router-dom";
import { categories } from "./categoriesData";
import getCurrentUser from "../../utils/getCurrentUser";

const Add = ({ editMode = false }) => {
  const currentUser = getCurrentUser();

  // Redirect if user is not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if user is not a seller
  if (!currentUser.isSeller) {
    return <Navigate to="/" replace />;
  }

  const { id: gigId } = useParams();
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [uploading, setUploading] = useState({ cover: false, gallery: false });
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSubcat, setSelectedSubcat] = useState("");
  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState({ cover: null, gallery: [] });
  const [uploadSuccess, setUploadSuccess] = useState({ cover: false, gallery: false });

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  // Pre-check: block form if seller already has 5 active gigs (better UX)
  const { data: activeGigCount, isLoading: isLoadingActiveCount, error: activeCountError } = useQuery({
    queryKey: ["myActiveGigCount", currentUser?._id],
    enabled: !!currentUser?._id && !editMode,
    queryFn: async () => {
      const res = await newRequest.get(`/gigs`, {
        params: { userId: currentUser._id, status: "active", limit: 1, page: 1 },
      });
      return res.data?.pagination?.totalCount || 0;
    },
  });

  // Fetch existing gig data if in edit mode
  const { data: existingGig, isLoading: isLoadingGig } = useQuery({
    queryKey: ["gig", gigId],
    queryFn: () => newRequest.get(`/gigs/single/${gigId}`).then(res => res.data),
    enabled: editMode && !!gigId,
  });

  // Pre-populate form with existing gig data
  useEffect(() => {
    if (editMode && existingGig) {
      // Reset the entire state with existing gig data
      dispatch({ type: "RESET_STATE", payload: {
        ...existingGig,
        userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
      }});
      
      // Set categories
      setSelectedCat(existingGig.cat || "");
      setSelectedSubcat(existingGig.subcategory || "");
    }
  }, [editMode, existingGig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "CHANGE_INPUT", payload: { name, value } });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCat(value);
    setSelectedSubcat("");
    dispatch({ type: "CHANGE_INPUT", payload: { name: "cat", value } });
    
    if (errors.cat) {
      setErrors(prev => ({ ...prev, cat: "" }));
    }
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setSelectedSubcat(value);
    dispatch({ type: "CHANGE_INPUT", payload: { name: "subcategory", value } });
  };

  const handleFileChange = (e, type) => {
    const files = e.target.files;
    if (!files.length) return;

    // Clear success message when new files are selected
    setUploadSuccess(prev => ({ ...prev, [type]: false }));
    setErrors(prev => ({ ...prev, [type]: "" }));

    if (type === 'cover') {
      setCoverFile(files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => ({ ...prev, cover: e.target.result }));
      };
      reader.readAsDataURL(files[0]);
    } else if (type === 'gallery') {
      setGalleryFiles(Array.from(files));
      const previews = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target.result);
          if (previews.length === files.length) {
            setPreviewImages(prev => ({ ...prev, gallery: previews }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common required fields
    if (!state.title.trim()) newErrors.title = "Title is required";
    if (!selectedCat) newErrors.cat = "Category is required";
    if (!state.desc.trim()) newErrors.desc = "Description is required";
    if (!state.shortTitle.trim()) newErrors.shortTitle = "Service title is required";
    if (!state.shortDesc.trim()) newErrors.shortDesc = "Short description is required";

    // Pricing mode specific validations
    if (state.hasPackages && state.hasMilestones) {
      newErrors.packages = "You cannot enable both Packages and Milestones. Please choose one pricing mode.";
    } else if (state.hasPackages) {
      const enabled = ['basic','standard','premium']
        .map(k => state.packages[k])
        .filter(p => p?.enabled);
      if (enabled.length === 0) {
        newErrors.packages = "Enable at least one package";
      } else {
        for (const [idx, k] of ['basic','standard','premium'].entries()) {
          const p = state.packages[k];
          if (p.enabled) {
            if (!p.price || p.price < 1) newErrors.packages = "Each enabled package must have a price greater than 0";
            if (!p.deliveryTime || p.deliveryTime < 1) newErrors.packages = "Each enabled package must have delivery time of at least 1 day";
            if (p.revisions < 0 || p.revisions > 10) newErrors.packages = "Package revisions must be between 0 and 10";
          }
        }
      }
    } else if (state.hasMilestones) {
      if (!state.milestones || state.milestones.length === 0) {
        newErrors.milestones = "Add at least one milestone";
      } else {
        for (const m of state.milestones) {
          if (!m.title || !m.title.trim()) newErrors.milestones = "Each milestone must have a title";
          if (!m.price || m.price < 1) newErrors.milestones = "Each milestone must have a price greater than 0";
          if (!m.deliveryTime || m.deliveryTime < 1) newErrors.milestones = "Each milestone must have delivery time of at least 1 day";
        }
      }
    } else {
      // Standard mode validations
      if (!state.deliveryTime || state.deliveryTime < 1) newErrors.deliveryTime = "Delivery time must be at least 1 day";
      if (state.revisionNumber < 0 || state.revisionNumber > 10) newErrors.revisionNumber = "Revisions must be between 0 and 10";
      if (!state.price || state.price < 1) newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCoverUpload = async () => {
    if (!coverFile) {
      setErrors(prev => ({ ...prev, cover: "Please select a cover image" }));
      return;
    }

    setUploading(prev => ({ ...prev, cover: true }));
    setErrors(prev => ({ ...prev, cover: "" }));
    setUploadSuccess(prev => ({ ...prev, cover: false }));
    
    try {
      const coverUrl = await upload(coverFile);
      setUploading(prev => ({ ...prev, cover: false }));
      dispatch({ type: "CHANGE_INPUT", payload: { name: "cover", value: coverUrl } });
      
      // Show success message
      setUploadSuccess(prev => ({ ...prev, cover: true }));
      setTimeout(() => setUploadSuccess(prev => ({ ...prev, cover: false })), 3000);
      
      // Clear selected file and update preview to show uploaded image
      setCoverFile(null);
      // Set preview to the uploaded image URL for immediate visual feedback
      setPreviewImages(prev => ({ ...prev, cover: coverUrl }));
    } catch (err) {
      console.error(err);
      setUploading(prev => ({ ...prev, cover: false }));
      setErrors(prev => ({ ...prev, cover: "Cover upload failed. Please try again." }));
    }
  };

  const handleGalleryUpload = async () => {
    if (galleryFiles.length === 0) {
      setErrors(prev => ({ ...prev, gallery: "Please select gallery images" }));
      return;
    }

    setUploading(prev => ({ ...prev, gallery: true }));
    setErrors(prev => ({ ...prev, gallery: "" }));
    setUploadSuccess(prev => ({ ...prev, gallery: false }));
    
    try {
      const imageUrls = await Promise.all(galleryFiles.map((file) => upload(file)));
      setUploading(prev => ({ ...prev, gallery: false }));
      dispatch({ type: "CHANGE_INPUT", payload: { name: "images", value: imageUrls } });
      
      // Show success message
      setUploadSuccess(prev => ({ ...prev, gallery: true }));
      setTimeout(() => setUploadSuccess(prev => ({ ...prev, gallery: false })), 3000);
      
      // Clear selected files and update preview to show uploaded images
      setGalleryFiles([]);
      // Set preview to the uploaded image URLs for immediate visual feedback
      setPreviewImages(prev => ({ ...prev, gallery: imageUrls }));
    } catch (err) {
      console.error(err);
      setUploading(prev => ({ ...prev, gallery: false }));
      setErrors(prev => ({ ...prev, gallery: "Gallery upload failed. Please try again." }));
    }
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (gig) => {
      if (editMode) {
        return newRequest.put(`/gigs/${gigId}`, gig);
      } else {
        return newRequest.post("/gigs", gig);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      if (editMode) {
        queryClient.invalidateQueries(["gig", gigId]);
        navigate(`/gig/${gigId}`);
      } else {
        navigate("/mygigs");
      }
    },
    onError: (error) => {
      const serverMsg = error?.response?.data?.message;
      const fallbackMsg = editMode ? "Failed to update gig. Please try again." : "Failed to create gig. Please try again.";
      setErrors(prev => ({ ...prev, submit: serverMsg || fallbackMsg }));
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Auto-upload cover image if user selected but forgot to upload
    if (coverFile) {
      try {
        setUploading(prev => ({ ...prev, cover: true }));
        setErrors(prev => ({ ...prev, cover: "" }));
        
        const coverUrl = await upload(coverFile);
        dispatch({ type: "CHANGE_INPUT", payload: { name: "cover", value: coverUrl } });
        
        // Clear selected file after upload and set preview to uploaded URL
        setCoverFile(null);
        setPreviewImages(prev => ({ ...prev, cover: coverUrl }));
        setUploading(prev => ({ ...prev, cover: false }));
        
        // Show brief success message
        setUploadSuccess(prev => ({ ...prev, cover: true }));
        setTimeout(() => setUploadSuccess(prev => ({ ...prev, cover: false })), 2000);
        
      } catch (err) {
        console.error(err);
        setUploading(prev => ({ ...prev, cover: false }));
        setErrors(prev => ({ ...prev, cover: "Cover upload failed. Please try again." }));
        return;
      }
    }

    // Auto-upload gallery images if user selected but forgot to upload
    if (galleryFiles.length > 0) {
      try {
        setUploading(prev => ({ ...prev, gallery: true }));
        setErrors(prev => ({ ...prev, gallery: "" }));
        
        const imageUrls = await Promise.all(galleryFiles.map((file) => upload(file)));
        dispatch({ type: "CHANGE_INPUT", payload: { name: "images", value: imageUrls } });
        
        // Clear selected files after upload and set preview to uploaded URLs
        setGalleryFiles([]);
        setPreviewImages(prev => ({ ...prev, gallery: imageUrls }));
        setUploading(prev => ({ ...prev, gallery: false }));
        
        // Show brief success message
        setUploadSuccess(prev => ({ ...prev, gallery: true }));
        setTimeout(() => setUploadSuccess(prev => ({ ...prev, gallery: false })), 2000);
        
      } catch (err) {
        console.error(err);
        setUploading(prev => ({ ...prev, gallery: false }));
        setErrors(prev => ({ ...prev, gallery: "Gallery upload failed. Please try again." }));
        return;
      }
    }

    // Check cover image requirement (more lenient in edit mode)
    if (!editMode && !state.cover) {
      setErrors(prev => ({ ...prev, cover: "Please upload at least a cover image" }));
      return;
    }

    // Build sanitized payload to prevent sending irrelevant 0 values
    const payload = { ...state };

    // Remove standard fields when using packages or milestones
    if (payload.hasPackages || payload.hasMilestones) {
      delete payload.deliveryTime;
      delete payload.revisionNumber;
    }

    // Normalize packages
    if (payload.hasPackages) {
      const tiers = ['basic', 'standard', 'premium'];
      const normalized = {};
      for (const tier of tiers) {
        const pkg = payload.packages?.[tier];
        if (pkg?.enabled) {
          normalized[tier] = {
            enabled: true,
            title: pkg.title || "",
            description: pkg.description || "",
            price: pkg.price != null ? Number(pkg.price) : pkg.price,
            deliveryTime: pkg.deliveryTime != null ? Number(pkg.deliveryTime) : pkg.deliveryTime,
            revisions: pkg.revisions != null ? Number(pkg.revisions) : pkg.revisions,
            features: Array.isArray(pkg.features) ? pkg.features : []
          };
        } else {
          normalized[tier] = { enabled: false };
        }
      }
      payload.packages = normalized;
    } else {
      delete payload.packages;
    }

    // Normalize milestones
    if (payload.hasMilestones) {
      payload.milestones = (payload.milestones || []).map((m, idx) => ({
        title: m.title?.trim() || m.title,
        description: m.description || "",
        price: m.price != null ? Number(m.price) : m.price,
        deliveryTime: m.deliveryTime != null ? Number(m.deliveryTime) : m.deliveryTime,
        order: idx + 1
      }));
    } else {
      delete payload.milestones;
    }

    // Standard mode: coerce top-level numbers
    if (!payload.hasPackages && !payload.hasMilestones) {
      payload.price = Number(payload.price);
      payload.deliveryTime = Number(payload.deliveryTime);
      payload.revisionNumber = Number(payload.revisionNumber);
    }

    mutation.mutate(payload);
  };

  const currentCategory = categories.find((c) => c.name === selectedCat);

  // Show loading state when fetching existing gig data
  if (editMode && isLoadingGig) {
    return (
      <div className="add">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading gig data...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not editing, block form when active gig cap reached
  if (!editMode) {
    if (isLoadingActiveCount) {
      return (
        <div className="add">
          <div className="container">
            <div className="loading-container" style={{ padding: "3rem", textAlign: "center" }}>
              <div className="spinner" style={{ margin: "0 auto 12px", width: 32, height: 32, border: "3px solid #e5e7eb", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
              <p>Checking your gig limits...</p>
            </div>
          </div>
        </div>
      );
    }
    if (!isLoadingActiveCount && activeGigCount >= 5) {
      return (
        <div className="add">
          <div className="container">
            <div className="cap-gate">
              <div className="icon">🚦</div>
              <h2>You've reached your active gig limit (5)</h2>
              <p>
                To keep quality high, sellers can have up to 5 active gigs. Pause one of your active gigs to create a new one.
              </p>
              <div className="actions">
                <Link to="/mygigs" className="btn btn-primary">Manage my gigs</Link>
                <Link to="/" className="btn btn-secondary">Go Home</Link>
              </div>
              {activeCountError && (
                <div className="cap-note">We couldn't verify your limits. Please refresh this page.</div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="add">
      <div className="container">
        <div className="header">
          <h1>{editMode ? "Edit Your Gig" : "Create a New Gig"}</h1>
          <p>{editMode ? "Update your service details" : "Tell us about the service you want to offer"}</p>
        </div>

        <form onSubmit={handleSubmit} className="gig-form">
          <div className="sections">
            {/* Left Section - Basic Information */}
            <div className="section left">
              <div className="section-header">
                <h2>Basic Information</h2>
                <span className="section-subtitle">Let's start with the basics</span>
              </div>

              <div className="form-group">
                <label htmlFor="title">
                  Gig Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={state.title}
                  placeholder="I will create a stunning logo design for your business"
                  onChange={handleChange}
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cat">
                    Category <span className="required">*</span>
                  </label>
                  <select
                    id="cat"
                    name="cat"
                    value={selectedCat}
                    onChange={handleCategoryChange}
                    className={errors.cat ? 'error' : ''}
                  >
                    <option value="">Choose a category</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.cat && <span className="error-message">{errors.cat}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="subcategory">Subcategory</label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={selectedSubcat}
                    onChange={handleSubcategoryChange}
                    disabled={!currentCategory}
                  >
                    <option value="">Choose subcategory</option>
                    {currentCategory?.subs.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="desc">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  value={state.desc}
                  rows="6"
                  placeholder="Describe your service in detail. What will you deliver? What makes your service unique?"
                  onChange={handleChange}
                  className={errors.desc ? 'error' : ''}
                />
                {errors.desc && <span className="error-message">{errors.desc}</span>}
              </div>

              {/* Cover Image Section */}
              <div className="image-upload-section">
                <h3>Cover Image</h3>
                <p className="section-subtitle">Upload a main image that represents your service (Required)</p>
                <div className="image-upload-group">
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="cover"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'cover')}
                    />
                    <div className="file-input-display">
                      {previewImages.cover ? (
                        <img src={previewImages.cover} alt="Cover preview" />
                      ) : state.cover ? (
                        <img src={state.cover} alt="Current cover" />
                      ) : (
                        <div className="placeholder">
                          <span>📷</span>
                          <p>Click to upload cover image</p>
                        </div>
                      )}
                      {uploading.cover && (
                        <div className="upload-overlay">
                          <div className="spinner"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="upload-controls">
                    <button
                      type="button"
                      onClick={handleCoverUpload}
                      disabled={uploading.cover || !coverFile}
                      className="upload-btn"
                    >
                      {uploading.cover ? (
                        <>
                          <span className="spinner"></span>
                          Uploading...
                        </>
                      ) : (
                        "Upload Cover"
                      )}
                    </button>
                    {errors.cover && <span className="error-message">{errors.cover}</span>}
                    {uploadSuccess.cover && (
                      <div className="success-message">
                        ✅ Cover image uploaded successfully!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Images Section */}
              <div className="image-upload-section">
                <h3>Gallery Images</h3>
                <p className="section-subtitle">Upload additional images to showcase your work (Optional)</p>
                <div className="image-upload-group">
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="gallery"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'gallery')}
                    />
                    <div className="file-input-display gallery">
                      {previewImages.gallery.length > 0 ? (
                        <div className="gallery-preview">
                          {previewImages.gallery.map((img, index) => (
                            <img key={index} src={img} alt={`Gallery ${index + 1}`} />
                          ))}
                        </div>
                      ) : state.images && state.images.length > 0 ? (
                        <div className="gallery-preview">
                          {state.images.map((img, index) => (
                            <img key={index} src={img} alt={`Gallery ${index + 1}`} />
                          ))}
                        </div>
                      ) : (
                        <div className="placeholder">
                          <span>🖼️</span>
                          <p>Click to upload gallery images</p>
                        </div>
                      )}
                      {uploading.gallery && (
                        <div className="upload-overlay">
                          <div className="spinner"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="upload-controls">
                    <button
                      type="button"
                      onClick={handleGalleryUpload}
                      disabled={uploading.gallery || galleryFiles.length === 0}
                      className="upload-btn secondary"
                    >
                      {uploading.gallery ? (
                        <>
                          <span className="spinner"></span>
                          Uploading...
                        </>
                      ) : (
                        "Upload Gallery"
                      )}
                    </button>
                    {errors.gallery && <span className="error-message">{errors.gallery}</span>}
                    {uploadSuccess.gallery && (
                      <div className="success-message">
                        ✅ Gallery images uploaded successfully!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Service Details */}
            <div className="section right">
              <div className="section-header">
                <h2>Service Details</h2>
                <span className="section-subtitle">Define your service package</span>
              </div>

              <div className="form-group">
                <label htmlFor="shortTitle">
                  Service Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="shortTitle"
                  name="shortTitle"
                  value={state.shortTitle}
                  placeholder="Professional Logo Design"
                  onChange={handleChange}
                  className={errors.shortTitle ? 'error' : ''}
                />
                {errors.shortTitle && <span className="error-message">{errors.shortTitle}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="shortDesc">
                  Package Description <span className="required">*</span>
                </label>
                <textarea
                  id="shortDesc"
                  name="shortDesc"
                  value={state.shortDesc}
                  rows="4"
                  placeholder="A brief summary of what's included in this package"
                  onChange={handleChange}
                  className={errors.shortDesc ? 'error' : ''}
                />
                {errors.shortDesc && <span className="error-message">{errors.shortDesc}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryTime">
                    Delivery Time <span className="required">*</span>
                  </label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      id="deliveryTime"
                      name="deliveryTime"
                      value={state.deliveryTime}
                      min="1"
                      placeholder="3"
                      onChange={handleChange}
                      disabled={state.hasPackages || state.hasMilestones}
                      className={errors.deliveryTime ? 'error' : ''}
                    />
                    <span className="unit">days</span>
                  </div>
                  {errors.deliveryTime && <span className="error-message">{errors.deliveryTime}</span>}
                  {(state.hasPackages || state.hasMilestones) && (
                    <div className="helper-text">Delivery time is controlled by your selected pricing mode.</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="revisionNumber">Revisions</label>
                  <input
                    type="number"
                    id="revisionNumber"
                    name="revisionNumber"
                    value={state.revisionNumber}
                    min="0"
                    max="10"
                    placeholder="2"
                    onChange={handleChange}
                    disabled={state.hasPackages || state.hasMilestones}
                  />
                  {errors.revisionNumber && <span className="error-message">{errors.revisionNumber}</span>}
                  {(state.hasPackages || state.hasMilestones) && (
                    <div className="helper-text">Revisions are defined per package or per milestone project scope.</div>
                  )}
                </div>
              </div>

              {/* Features Section */}
              <div className="features-section">
                <label>Features Included</label>
                <div className="form-group feature-input">
                  <input
                    type="text"
                    placeholder="e.g., High-resolution files, Source files included"
                    id="featureInput"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const input = document.getElementById('featureInput');
                      const feature = input.value.trim();
                      if (feature && !state.features.includes(feature)) {
                        dispatch({ type: "ADD_FEATURE", payload: feature });
                        input.value = "";
                      }
                    }}
                  >
                    Add
                  </button>
                </div>

                <div className="features-list">
                  {state?.features?.map((feature) => (
                    <div className="feature-tag" key={feature}>
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "REMOVE_FEATURE", payload: feature })}
                        className="remove-feature"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  Starting Price <b>₦</b> <span className="required">*</span>
                </label>
                <div className="input-with-unit">
                  {/* <span className="currency">$</span> */}
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={state.price}
                    min="1"
                    placeholder="25000"
                    onChange={handleChange}
                    disabled={state.hasPackages || state.hasMilestones}
                    className={errors.price ? 'error' : ''}
                  />
                </div>
                {errors.price && <span className="error-message">{errors.price}</span>}
                {(state.hasPackages || state.hasMilestones) && (
                  <div className="helper-text">Starting price will be set automatically from the lowest enabled package price or milestone price.</div>
                )}
              </div>

              {/* Package System Section */}
              <div className="form-group package-system">
                <div className="section-header">
                  <h3>Package Options</h3>
                  <span className="section-subtitle">Offer different service levels to your clients</span>
                </div>
                {errors.packages && <span className="error-message">{errors.packages}</span>}

                <div className="toggle-switch">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={state.hasPackages}
                      onChange={(e) => dispatch({ type: "TOGGLE_PACKAGES", payload: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className="toggle-label">Enable Package Options</span>
                </div>

                {state.hasPackages && (
                  <div className="packages-configuration">
                    {['basic', 'standard', 'premium'].map((packageType) => (
                      <div key={packageType} className="package-card">
                        <div className="package-header">
                          <div className="package-enable">
                            <input
                              type="checkbox"
                              id={`${packageType}-enabled`}
                              checked={state.packages[packageType].enabled}
                              onChange={(e) => dispatch({
                                type: "UPDATE_PACKAGE",
                                payload: { packageType, field: "enabled", value: e.target.checked }
                              })}
                            />
                            <label htmlFor={`${packageType}-enabled`} className="package-title">
                              {packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package
                            </label>
                          </div>
                        </div>

                        {state.packages[packageType].enabled && (
                          <div className="package-form">
                            <div className="form-row">
                              <div className="form-group">
                                <label>Package Title</label>
                                <input
                                  type="text"
                                  value={state.packages[packageType].title}
                                  placeholder={`${packageType.charAt(0).toUpperCase() + packageType.slice(1)} package title`}
                                  onChange={(e) => dispatch({
                                    type: "UPDATE_PACKAGE",
                                    payload: { packageType, field: "title", value: e.target.value }
                                  })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Price (₦)</label>
                                <input
                                  type="number"
                                  placeholder="25000"
                                  value={state.packages[packageType].price}
                                  min="1"
                                  onChange={(e) => dispatch({
                                    type: "UPDATE_PACKAGE",
                                    payload: { packageType, field: "price", value: Number(e.target.value) }
                                  })}
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>Delivery Time (days)</label>
                                <input
                                  type="number"
                                  placeholder="3"
                                  value={state.packages[packageType].deliveryTime}
                                  min="1"
                                  onChange={(e) => dispatch({
                                    type: "UPDATE_PACKAGE",
                                    payload: { packageType, field: "deliveryTime", value: Number(e.target.value) }
                                  })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Revisions</label>
                                <input
                                  type="number"
                                  placeholder="3"
                                  value={state.packages[packageType].revisions}
                                  min="0"
                                  max="10"
                                  onChange={(e) => dispatch({
                                    type: "UPDATE_PACKAGE",
                                    payload: { packageType, field: "revisions", value: Number(e.target.value) }
                                  })}
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Description</label>
                              <textarea
                                value={state.packages[packageType].description}
                                rows="3"
                                placeholder="Describe what's included in this package"
                                onChange={(e) => dispatch({
                                  type: "UPDATE_PACKAGE",
                                  payload: { packageType, field: "description", value: e.target.value }
                                })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Features</label>
                              <div className="feature-input">
                                <input
                                  type="text"
                                  placeholder="Add a feature"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const feature = e.target.value.trim();
                                      if (feature) {
                                        dispatch({
                                          type: "ADD_PACKAGE_FEATURE",
                                          payload: { packageType, feature }
                                        });
                                        e.target.value = "";
                                      }
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    const input = e.target.previousElementSibling;
                                    const feature = input.value.trim();
                                    if (feature) {
                                      dispatch({
                                        type: "ADD_PACKAGE_FEATURE",
                                        payload: { packageType, feature }
                                      });
                                      input.value = "";
                                    }
                                  }}
                                >
                                  Add
                                </button>
                              </div>
                              <div className="features-list">
                                {state.packages[packageType].features.map((feature, index) => (
                                  <div className="feature-tag" key={index}>
                                    <span>{feature}</span>
                                    <button
                                      type="button"
                                      onClick={() => dispatch({
                                        type: "REMOVE_PACKAGE_FEATURE",
                                        payload: { packageType, index }
                                      })}
                                      className="remove-feature"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Milestone System Section */}
              <div className="form-group milestone-system">
                <div className="section-header">
                  <h3>Milestone-Based Projects</h3>
                  <span className="section-subtitle">Break large projects into manageable milestones</span>
                </div>

                <div className="toggle-switch">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={state.hasMilestones}
                      onChange={(e) => dispatch({ type: "TOGGLE_MILESTONES", payload: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className="toggle-label">Enable Milestones</span>
                </div>

                {state.hasMilestones && (
                  <div className="milestones-configuration">
                    
                    {errors.milestones && <span className="error-message">{errors.milestones}</span>}

                    {state.milestones.map((milestone, index) => (
                      <div key={index} className="milestone-card">
                        <div className="milestone-header">
                          <h4>Milestone {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => dispatch({ type: "REMOVE_MILESTONE", payload: { index } })}
                            className="btn btn-danger-outline"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Milestone Title</label>
                            <input
                              type="text"
                              value={milestone.title}
                              placeholder="e.g., Initial Design Concepts"
                              onChange={(e) => dispatch({
                                type: "UPDATE_MILESTONE",
                                payload: { index, field: "title", value: e.target.value }
                              })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Price (₦)</label>
                            <input
                              type="number"
                              placeholder="25000"
                              value={milestone.price}
                              min="1"
                              onChange={(e) => dispatch({
                                type: "UPDATE_MILESTONE",
                                payload: { index, field: "price", value: Number(e.target.value) }
                              })}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Delivery Time (days)</label>
                            <input
                              type="number"
                              placeholder="3"
                              value={milestone.deliveryTime}
                              min="1"
                              onChange={(e) => dispatch({
                                type: "UPDATE_MILESTONE",
                                payload: { index, field: "deliveryTime", value: Number(e.target.value) }
                              })}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            value={milestone.description}
                            rows="3"
                            placeholder="Describe what will be delivered in this milestone"
                            onChange={(e) => dispatch({
                              type: "UPDATE_MILESTONE",
                              payload: { index, field: "description", value: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    ))}

<div className="milestones-header">
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "ADD_MILESTONE" })}
                        className="btn btn-outline"
                      >
                        + Add Milestone
                      </button>
                    </div>

                    {state.milestones.length === 0 && (
                      <div className="empty-state">
                        <p>No milestones added yet. Click "Add Milestone" to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="submit-section">
            {errors.submit && <div className="error-banner">{errors.submit}</div>}
            <div className="submit-actions">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isLoading || uploading.cover || uploading.gallery}
                className="btn btn-primary"
              >
                {uploading.cover ? (
                  <>
                    <span className="spinner"></span>
                    Uploading cover...
                  </>
                ) : uploading.gallery ? (
                  <>
                    <span className="spinner"></span>
                    Uploading gallery...
                  </>
                ) : mutation.isLoading ? (
                  <>
                    <span className="spinner"></span>
                    {editMode ? "Updating Gig..." : "Creating Gig..."}
                  </>
                ) : (
                  editMode ? "Update Gig" : "Create Gig"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;