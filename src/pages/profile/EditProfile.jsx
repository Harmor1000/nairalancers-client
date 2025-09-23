import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import "./EditProfile.scss";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import upload from "../../utils/upload";
import AutocompleteInput from "../../components/autocomplete/AutocompleteInput";
import { EditProfileSkeleton } from "../../components/skeleton/Skeleton";
import { 
  searchUniversities, 
  searchFieldsOfStudy, 
  getDegreeTypes 
} from "../../data/educationData";
import { 
  skillSuggestions, 
  languageSuggestions, 
  languageLevels, 
  filterSuggestions 
} from "../../data/skillsData";

const EditProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    state: "",
    desc: "",
    professionalTitle: "",
    skills: [],
    languages: [],
    education: [],
    certifications: [],
    portfolio: [],
    socialLinks: {
      website: "",
      linkedin: "",
      twitter: "",
      github: "",
      behance: "",
      dribbble: "",
    },
    hourlyRate: "",
    responseTime: "Within 24 hours",
    availability: "Available",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  
  // Email verification states
  const [originalEmail, setOriginalEmail] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [emailVerificationSuccess, setEmailVerificationSuccess] = useState(false);
  
  // Phone verification states
  const [originalPhone, setOriginalPhone] = useState("");
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [phoneVerificationSent, setPhoneVerificationSent] = useState(false);
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] = useState(false);
  const [phoneVerificationSuccess, setPhoneVerificationSuccess] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Ensure buyers don't access seller-only sections
  useEffect(() => {
    if (!currentUser?.isSeller && (activeSection === "education" || activeSection === "portfolio" || activeSection === "seller")) {
      setActiveSection("basic");
    }
  }, [currentUser, activeSection]);

  // Temporary states for adding items
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState({ language: "", level: "Basic" });
  const [newEducation, setNewEducation] = useState({ institution: "", degree: "", field: "", year: "" });
  const [newCertification, setNewCertification] = useState({ name: "", issuer: "", year: "", credentialId: "" });
  const [newPortfolio, setNewPortfolio] = useState({ title: "", description: "", image: "", link: "", category: "" });

  // Fetch current user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: () => newRequest.get(`/users/${currentUser._id}`).then((res) => res.data),
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data) => {
      console.log("Making API call to /profiles/ with data:", data);
      return newRequest.put("/profiles/", data);
    },
    onSuccess: (response) => {
      console.log("Profile update successful:", response);
      queryClient.invalidateQueries(["currentUserProfile"]);
      queryClient.invalidateQueries(["profile", currentUser._id]);
      
      // Update localStorage with new user data if basic info was changed
      const data = response.data;
      if (data && (data.firstname || data.lastname || data.img)) {
        const updatedUser = {
          ...currentUser,
          ...(data.firstname && { firstname: data.firstname }),
          ...(data.lastname && { lastname: data.lastname }),
          ...(data.img && { img: data.img }),
          ...(data.phone && { phone: data.phone }),
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }
      
      alert("Profile updated successfully!");
      // navigate(`/${currentUser.isSeller ? 'seller' : 'buyer'}-profile/${currentUser._id}`);
    },
    onError: (error) => {
      console.error("Update failed:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
      alert(`Failed to update profile: ${errorMessage}`);
    },
  });

  // Email verification mutations
  const requestEmailVerificationMutation = useMutation({
    mutationFn: (newEmail) => newRequest.post("/email-verification/request", { newEmail }),
    onSuccess: () => {
      setVerificationSent(true);
      setShowVerificationModal(true);
      // Clear any previous email errors since request was successful
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
    },
    onError: (error) => {
      console.log("Error sending verification code:", error);
      const errorMessage = error.response?.data?.message || "Failed to send verification code";
      
      // Set email error for backend validation failures
      setErrors(prev => ({
        ...prev,
        email: errorMessage
      }));
      
      // Mark email field as touched to show the error
      setTouched(prev => ({
        ...prev,
        email: true
      }));
    },
  });

  // Phone verification mutations
  const requestPhoneVerificationMutation = useMutation({
    mutationFn: (phoneNumber) => newRequest.post("/verification/phone/request", { phoneNumber }),
    onSuccess: () => {
      setPhoneVerificationSent(true);
      setShowPhoneVerificationModal(true);
      // Clear any previous phone errors since request was successful
      const newErrors = { ...errors };
      delete newErrors.phone;
      setErrors(newErrors);
    },
    onError: (error) => {
      console.log("Error sending phone verification code:", error);
      const errorMessage = error.response?.data?.message || "Failed to send verification code";
      
      // Set phone error for backend validation failures
      setErrors(prev => ({
        ...prev,
        phone: errorMessage
      }));
      
      // Mark phone field as touched to show the error
      setTouched(prev => ({
        ...prev,
        phone: true
      }));
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (verificationCode) => newRequest.post("/email-verification/verify", { verificationCode }),
    onSuccess: (response) => {
      setShowVerificationModal(false);
      setEmailChanged(false);
      setVerificationSent(false);
      setVerificationCode("");
      setEmailVerificationSuccess(true);
      
      // Update user data with new email
      const updatedUser = { ...currentUser, email: response.data.user.email };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      queryClient.invalidateQueries(["currentUserProfile"]);
      // Show success message in UI instead of alert
      setOriginalEmail(response.data.user.email); // Update original email to prevent future warnings
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setEmailVerificationSuccess(false);
      }, 5000);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Verification failed";
      // Keep alert for errors since they're critical  
      alert(`Error: ${errorMessage}`);
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: (verificationCode) => newRequest.post("/verification/phone/verify", { verificationCode }),
    onSuccess: (response) => {
      setShowPhoneVerificationModal(false);
      setPhoneChanged(false);
      setPhoneVerificationSent(false);
      setPhoneVerificationCode("");
      setPhoneVerificationSuccess(true);
      
      // Update user data with new phone and verification status
      const updatedUser = { 
        ...currentUser, 
        phone: formData.phone,
        phoneVerified: true 
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      queryClient.invalidateQueries(["currentUserProfile"]);
      // Show success message in UI instead of alert
      setOriginalPhone(formData.phone); // Update original phone to prevent future warnings
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setPhoneVerificationSuccess(false);
      }, 5000);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Verification failed";
      // Keep alert for errors since they're critical  
      alert(`Error: ${errorMessage}`);
    },
  });

  // Populate form when user data loads
  useEffect(() => {
    if (userData) {
      setFormData({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        state: userData.state || "",
        desc: userData.desc || "",
        professionalTitle: userData.professionalTitle || "",
        skills: userData.skills || [],
        languages: userData.languages || [],
        education: userData.education || [],
        certifications: userData.certifications || [],
        portfolio: userData.portfolio || [],
        socialLinks: {
          website: userData.socialLinks?.website || "",
          linkedin: userData.socialLinks?.linkedin || "",
          twitter: userData.socialLinks?.twitter || "",
          github: userData.socialLinks?.github || "",
          behance: userData.socialLinks?.behance || "",
          dribbble: userData.socialLinks?.dribbble || "",
        },
        hourlyRate: userData.hourlyRate || "",
        responseTime: userData.responseTime || "Within 24 hours",
        availability: userData.availability || "Available",
      });
      setOriginalEmail(userData.email || "");
      setOriginalPhone(userData.phone || "");
      setProfileImagePreview(userData.img || "/img/noavatar.jpg");
    }
  }, [userData]);

  // Track email changes and check availability
  useEffect(() => {
    if (originalEmail && formData.email !== originalEmail) {
      setEmailChanged(true);
      
      // Debounced email availability check
      const timeoutId = setTimeout(() => {
        if (formData.email && formData.email !== originalEmail && validateField('email', formData.email)) {
          checkEmailAvailability(formData.email);
        }
      }, 1000); // Wait 1 second after user stops typing

      return () => clearTimeout(timeoutId);
    } else {
      setEmailChanged(false);
      setVerificationSent(false);
      setVerificationCode("");
      setCheckingEmail(false);
    }
  }, [formData.email, originalEmail]);

  // Track phone changes
  useEffect(() => {
    if (originalPhone && formData.phone !== originalPhone) {
      setPhoneChanged(true);
    } else {
      setPhoneChanged(false);
      setPhoneVerificationSent(false);
      setPhoneVerificationCode("");
      setPhoneVerificationSuccess(false);
    }
  }, [formData.phone, originalPhone]);

  // Email availability check function
  const checkEmailAvailability = async (email) => {
    // Don't check if email has validation errors or is invalid
    if (!email || !email.includes('@') || email === originalEmail) return;
    
    // Only check if email passes basic validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    
    setCheckingEmail(true);
    
    try {
      await newRequest.post("/email-verification/check", { email });
      
      // If successful, clear any existing email errors
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Email validation failed";
      
      // Set error for availability issues
      setErrors(prev => ({
        ...prev,
        email: errorMessage
      }));
    } finally {
      setCheckingEmail(false);
    }
  };

  // Validation functions
  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'firstname':
        if (!value.trim()) {
          newErrors.firstname = 'First name is required';
        } else if (value.trim().length < 2) {
          newErrors.firstname = 'First name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          newErrors.firstname = 'First name must be less than 50 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          newErrors.firstname = 'First name can only contain letters, spaces, hyphens and apostrophes';
        } else {
          delete newErrors.firstname;
        }
        break;

      case 'lastname':
        if (!value.trim()) {
          newErrors.lastname = 'Last name is required';
        } else if (value.trim().length < 2) {
          newErrors.lastname = 'Last name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          newErrors.lastname = 'Last name must be less than 50 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          newErrors.lastname = 'Last name can only contain letters, spaces, hyphens and apostrophes';
        } else {
          delete newErrors.lastname;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newErrors.email = 'Please enter a valid email address';
        } else if (value.trim().length > 100) {
          newErrors.email = 'Email must be less than 100 characters';
        } else {
          delete newErrors.email;
        }
        break;

      case 'phone':
        if (value.trim() && !/^(\+234|0)[789]\d{9}$/.test(value.trim().replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid Nigerian phone number (e.g., +2348012345678 or 08012345678)';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'desc':
        if (value.trim().length > 1000) {
          newErrors.desc = 'Description must be less than 1000 characters';
        } else {
          delete newErrors.desc;
        }
        break;

      case 'professionalTitle':
        if (value.trim().length > 100) {
          newErrors.professionalTitle = 'Professional title must be less than 100 characters';
        } else {
          delete newErrors.professionalTitle;
        }
        break;

      case 'hourlyRate':
        if (value && (isNaN(value) || parseFloat(value) < 100 || parseFloat(value) > 1000000)) {
          newErrors.hourlyRate = 'Hourly rate must be between ₦100 and ₦1,000,000';
        } else {
          delete newErrors.hourlyRate;
        }
        break;

      case 'verificationCode':
        if (!value.trim()) {
          newErrors.verificationCode = 'Verification code is required';
        } else if (!/^\d{6}$/.test(value.trim())) {
          newErrors.verificationCode = 'Verification code must be exactly 6 digits';
        } else {
          delete newErrors.verificationCode;
        }
        break;

      case 'phoneVerificationCode':
        if (!value.trim()) {
          newErrors.phoneVerificationCode = 'Verification code is required';
        } else if (!/^\d{6}$/.test(value.trim())) {
          newErrors.phoneVerificationCode = 'Verification code must be exactly 6 digits';
        } else {
          delete newErrors.phoneVerificationCode;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[field];
  };

  const validateSocialLink = (platform, url) => {
    if (!url.trim()) return true; // Optional field

    const patterns = {
      website: /^https?:\/\/.+\..+/,
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
      twitter: /^https?:\/\/(www\.)?x\.com\/.+/,
      github: /^https?:\/\/(www\.)?github\.com\/.+/,
      behance: /^https?:\/\/(www\.)?behance\.net\/.+/,
      dribbble: /^https?:\/\/(www\.)?dribbble\.com\/.+/
    };

    const newErrors = { ...errors };
    const errorKey = `socialLinks.${platform}`;

    if (!patterns[platform].test(url.trim())) {
      newErrors[errorKey] = `Please enter a valid ${platform} URL`;
    } else {
      delete newErrors[errorKey];
    }

    setErrors(newErrors);
    return !newErrors[errorKey];
  };

  const validateAllFields = () => {
    const fieldsToValidate = [
      'firstname', 'lastname', 'email', 'phone', 'desc', 'professionalTitle', 'hourlyRate'
    ];

    let isValid = true;
    fieldsToValidate.forEach(field => {
      const fieldValue = formData[field] || '';
      if (!validateField(field, fieldValue)) {
        isValid = false;
      }
    });

    // Validate social links
    Object.entries(formData.socialLinks || {}).forEach(([platform, url]) => {
      if (!validateSocialLink(platform, url)) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Validate field on change
    validateField(field, value);
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [`socialLinks.${platform}`]: true
    }));
    
    // Validate social link
    validateSocialLink(platform, value);
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    const fieldValue = formData[field] || '';
    validateField(field, fieldValue);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      
      // Create preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Array management functions
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.language.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, { ...newLanguage }]
      }));
      setNewLanguage({ language: "", level: "Basic" });
    }
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (newEducation.institution.trim() && newEducation.degree.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation }]
      }));
      setNewEducation({ institution: "", degree: "", field: "", year: "" });
    }
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.name.trim() && newCertification.issuer.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, { ...newCertification }]
      }));
      setNewCertification({ name: "", issuer: "", year: "", credentialId: "" });
    }
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addPortfolio = () => {
    if (newPortfolio.title.trim() && newPortfolio.description.trim()) {
      setFormData(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, { ...newPortfolio }]
      }));
      setNewPortfolio({ title: "", description: "", image: "", link: "", category: "" });
    }
  };

  const removePortfolio = (index) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
  };

  const handleEmailVerificationRequest = () => {
    // Validate email before sending verification
    if (!validateField('email', formData.email)) {
      return;
    }
    
    if (emailChanged && formData.email !== originalEmail) {
      requestEmailVerificationMutation.mutate(formData.email);
    }
  };

  const handleEmailVerification = () => {
    // Mark verification code field as touched
    setTouched(prev => ({ ...prev, verificationCode: true }));
    
    // Validate verification code
    if (!validateField('verificationCode', verificationCode)) {
      return;
    }
    
    verifyEmailMutation.mutate(verificationCode.trim());
  };

  const handlePhoneVerificationRequest = () => {
    // Validate phone before sending verification
    if (!validateField('phone', formData.phone)) {
      return;
    }
    
    if (phoneChanged && formData.phone !== originalPhone) {
      requestPhoneVerificationMutation.mutate(formData.phone);
    }
  };

  const handlePhoneVerification = () => {
    // Mark verification code field as touched
    setTouched(prev => ({ ...prev, phoneVerificationCode: true }));
    
    // Validate verification code
    if (!validateField('phoneVerificationCode', phoneVerificationCode)) {
      return;
    }
    
    verifyPhoneMutation.mutate(phoneVerificationCode.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    const allTouched = {
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      desc: true,
      professionalTitle: true,
      hourlyRate: true,
      state: true,
    };
    
    // Add social links to touched
    Object.keys(formData.socialLinks || {}).forEach(platform => {
      allTouched[`socialLinks.${platform}`] = true;
    });
    
    setTouched(allTouched);
    
    // Validate all fields
    if (!validateAllFields()) {
      alert("Please fix the validation errors before submitting.");
      return;
    }
    
    // Check if email has changed and needs verification (unless already successfully verified)
    if (emailChanged && !verificationSent && !emailVerificationSuccess) {
      alert("Please verify your new email address before saving your profile.");
      return;
    }

    // Check if phone has changed and needs verification (unless already successfully verified)
    if (phoneChanged && !phoneVerificationSent && !phoneVerificationSuccess) {
      alert("Please verify your new phone number before saving your profile.");
      return;
    }

    setUploading(true);

    try {
      let imageUrl = userData?.img;

      // Upload new profile image if selected
      if (profileImage) {
        console.log("Uploading profile image...");
        imageUrl = await upload(profileImage);
        console.log("Image uploaded:", imageUrl);
      }

      const updateData = {
        ...formData,
        img: imageUrl,
      };

      // Remove email from update data if it has changed (it will be updated via verification)
      if (emailChanged) {
        delete updateData.email;
      }

      // Remove phone from update data if it has changed (it will be updated via verification)
      if (phoneChanged) {
        delete updateData.phone;
      }

      // Don't remove empty fields for basic info - allow them to be cleared
      // Only remove completely empty objects and arrays
      Object.keys(updateData).forEach(key => {
        if (Array.isArray(updateData[key]) && updateData[key].length === 0) {
          delete updateData[key];
        } else if (typeof updateData[key] === 'object' && updateData[key] !== null && !Array.isArray(updateData[key])) {
          // For objects like socialLinks, only remove if all values are empty
          if (Object.values(updateData[key]).every(v => v === "")) {
            delete updateData[key];
          }
        }
      });

      console.log("Submitting update data:", updateData);
      updateMutation.mutate(updateData);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <EditProfileSkeleton />;
  }

  // Nigerian states list
  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Federal Capital Territory", 
    "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", 
    "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", 
    "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  const sections = [
    { id: "basic", label: "Basic Info", icon: "👤" },
    { id: "professional", label: "Professional", icon: "💼" },
    { id: "skills", label: "Skills & Languages", icon: "🎯" },
    ...(currentUser?.isSeller ? [
      { id: "education", label: "Education", icon: "🎓" },
      { id: "portfolio", label: "Portfolio", icon: "🎨" },
    ] : []),
    { id: "social", label: "Social Links", icon: "🔗" },
    ...(currentUser?.isSeller ? [{ id: "seller", label: "Seller Settings", icon: "⚙️" }] : [])
  ];

  // Helper component for error messages
  const ErrorMessage = ({ field, touched, errors }) => {
    // Show error if field has been touched OR if it's a backend validation error
    const shouldShow = (touched[field] || errors[field]) && errors[field];
    if (!shouldShow) return null;
    return <div className="error-message">{errors[field]}</div>;
  };

  return (
    <div className="edit-profile">
      <div className="container">
        <div className="edit-profile-header">
          <div className="header-top">
            <div className="header-content">
              <h1>Edit Profile</h1>
              <p>Update your profile information to help others find and connect with you</p>
            </div>
            <div className="header-actions">
              <Link 
                to={`/${currentUser?.isSeller ? 'seller' : 'buyer'}-profile/${currentUser?._id}`}
                className="back-to-profile-btn"
              >
                ← Back to Profile
              </Link>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-layout">
            {/* Sidebar Navigation */}
            <div className="form-sidebar">
              <nav className="section-nav">
                                 {sections.map((section) => (
                   <button
                     key={section.id}
                     type="button"
                     className={`nav-item ${activeSection === section.id ? "active" : ""}`}
                     onClick={() => setActiveSection(section.id)}
                   >
                     <span className="icon">{section.icon}</span>
                     <span className="label">{section.label}</span>
                   </button>
                 ))}
              </nav>
            </div>

            {/* Form Content */}
            <div className="form-content">
              {/* Basic Information */}
              {activeSection === "basic" && (
                <div className="form-section">
                  <div className="section-header">
                    <h2>Basic Information</h2>
                    <p>Your fundamental profile details</p>
                  </div>

                  {/* Profile Image */}
                  <div className="profile-image-section">
                    <div className="image-upload">
                      <div className="image-preview">
                        <img
                          src={profileImagePreview}
                          alt="Profile"
                          className="profile-img"
                        />
                        <div className="image-overlay">
                          <input
                            type="file"
                            id="profile-image"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />
                          <label htmlFor="profile-image" className="upload-btn">
                            📷 Change Photo
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-grid">
                                         <div className="form-group">
                       <label>First Name *</label>
                       <input
                         type="text"
                         value={formData.firstname}
                         onChange={(e) => handleInputChange("firstname", e.target.value)}
                         onBlur={() => handleBlur("firstname")}
                         className={touched.firstname && errors.firstname ? "error" : ""}
                         required
                       />
                       <ErrorMessage field="firstname" touched={touched} errors={errors} />
                     </div>

                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastname}
                        onChange={(e) => handleInputChange("lastname", e.target.value)}
                        onBlur={() => handleBlur("lastname")}
                        className={touched.lastname && errors.lastname ? "error" : ""}
                        required
                      />
                      <ErrorMessage field="lastname" touched={touched} errors={errors} />
                    </div>

                    <div className="form-group">
                      <label>Username *</label>
                      <input
                        type="text"
                        value={formData.username}
                        disabled
                        className="disabled-field"
                        title="Username cannot be changed for security reasons"
                      />
                      <small className="field-note">Username cannot be changed for security reasons</small>
                    </div>

                                         <div className="form-group">
                       <label>Email *</label>
                       <div className="input-with-indicator">
                         <input
                           type="email"
                           value={formData.email}
                           onChange={(e) => {
                             handleInputChange("email", e.target.value);
                             // Clear backend validation errors when user types
                             if (errors.email && !touched.email) {
                               const newErrors = { ...errors };
                               delete newErrors.email;
                               setErrors(newErrors);
                             }
                           }}
                           onBlur={() => handleBlur("email")}
                           required
                           className={`${emailChanged ? "email-changed" : ""} ${errors.email ? "error" : ""}`}
                         />
                         {checkingEmail && (
                           <div className="input-indicator">
                             <div className="spinner-small"></div>
                           </div>
                         )}
                         {emailChanged && !checkingEmail && !errors.email && (
                           <div className="input-indicator">
                             <span className="check-icon">✓</span>
                           </div>
                         )}
                       </div>
                       <ErrorMessage field="email" touched={touched} errors={errors} />
                       {emailVerificationSuccess && (
                         <div className="email-success-notice">
                           <div className="success-content">
                             <span className="success-icon">✅</span>
                             <span className="success-text">
                               Email successfully verified and updated!
                             </span>
                           </div>
                         </div>
                       )}
                       {emailChanged && !emailVerificationSuccess && (
                         <div className="email-verification-notice">
                           <div className="notice-content">
                             <span className="warning-icon">⚠️</span>
                             <span className="notice-text">
                               Email change requires verification
                             </span>
                             {!verificationSent && (
                               <button
                                 type="button"
                                 className="verify-btn"
                                 onClick={handleEmailVerificationRequest}
                                 disabled={requestEmailVerificationMutation.isLoading}
                               >
                                 {requestEmailVerificationMutation.isLoading ? "Sending..." : "Send Code"}
                               </button>
                             )}
                             {verificationSent && (
                               <span className="verification-sent">✅ Code sent!</span>
                             )}
                           </div>
                         </div>
                       )}
                     </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        placeholder="+234 xxx xxx xxxx"
                        className={touched.phone && errors.phone ? "error" : ""}
                      />
                      <ErrorMessage field="phone" touched={touched} errors={errors} />
                      
                      {/* Phone Verification Success */}
                      {phoneVerificationSuccess && (
                        <div className="verification-success">
                          <span className="success-icon">✅</span>
                          <span className="success-text">Phone number verified successfully!</span>
                        </div>
                      )}
                      
                      {/* Email Verification Requirement for Phone */}
                      {phoneChanged && !phoneVerificationSuccess && !userData?.emailVerified && (
                        <div className="verification-notice">
                          <div className="notice-content">
                            <span className="info-icon">ℹ️</span>
                            <span className="notice-text">
                              Please verify your email address first before changing your phone number
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Phone Verification Notice */}
                      {phoneChanged && !phoneVerificationSuccess && userData?.emailVerified && (
                        <div className="verification-notice">
                           <div className="notice-content">
                             <span className="warning-icon">⚠️</span>
                             <span className="notice-text">
                               Phone change requires verification
                             </span>
                             {!phoneVerificationSent && (
                               <button
                                 type="button"
                                 className="verify-btn"
                                 onClick={handlePhoneVerificationRequest}
                                 disabled={requestPhoneVerificationMutation.isLoading || !userData?.emailVerified}
                               >
                                 {requestPhoneVerificationMutation.isLoading ? "Sending..." : (!userData?.emailVerified ? "Email verification required" : "Send SMS Code")}
                               </button>
                             )}
                             {phoneVerificationSent && (
                               <span className="verification-sent">✅ Code sent!</span>
                             )}
                           </div>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Location (State)</label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                      >
                        <option value="">Select a state...</option>
                        {nigerianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                                         <div className="form-group full-width">
                       <label>Bio/Description</label>
                       <textarea
                         value={formData.desc}
                         onChange={(e) => handleInputChange("desc", e.target.value)}
                         onBlur={() => handleBlur("desc")}
                         placeholder="Tell us about yourself..."
                         rows="5"
                         maxLength="1000"
                         className={touched.desc && errors.desc ? "error" : ""}
                       />
                       <div className="char-count">{formData.desc.length}/1000</div>
                       <ErrorMessage field="desc" touched={touched} errors={errors} />
                     </div>
                  </div>
                </div>
              )}

              {/* Professional Information - Only for Sellers */}
              {activeSection === "professional" && currentUser?.isSeller && (
                <div className="form-section">
                  <div className="section-header">
                    <h2>Professional Information</h2>
                    <p>Your professional background and expertise</p>
                  </div>

                  <div className="form-grid">
                                         <div className="form-group full-width">
                       <label>Professional Title</label>
                       <input
                         type="text"
                         value={formData.professionalTitle}
                         onChange={(e) => handleInputChange("professionalTitle", e.target.value)}
                         onBlur={() => handleBlur("professionalTitle")}
                         placeholder="e.g., Full Stack Developer, Graphic Designer"
                         className={touched.professionalTitle && errors.professionalTitle ? "error" : ""}
                       />
                       <ErrorMessage field="professionalTitle" touched={touched} errors={errors} />
                     </div>
                  </div>
                </div>
              )}

              {/* Professional Information - For Buyers */}
              {activeSection === "professional" && !currentUser?.isSeller && (
                <div className="form-section">
                  <div className="section-header">
                    <h2>Professional Information</h2>
                    <p>Your professional background and interests</p>
                  </div>

                  <div className="form-grid">
                                         <div className="form-group full-width">
                       <label>Professional Title (Optional)</label>
                       <input
                         type="text"
                         value={formData.professionalTitle}
                         onChange={(e) => handleInputChange("professionalTitle", e.target.value)}
                         onBlur={() => handleBlur("professionalTitle")}
                         placeholder="e.g., Project Manager, Business Owner"
                         className={touched.professionalTitle && errors.professionalTitle ? "error" : ""}
                       />
                       <small className="field-note">This helps others understand your background and expertise areas.</small>
                       <ErrorMessage field="professionalTitle" touched={touched} errors={errors} />
                     </div>
                  </div>
                </div>
              )}

              {/* Skills & Languages */}
              {activeSection === "skills" && (
                <div className="form-section">
                  <div className="section-header">
                    <h2>Skills & Languages</h2>
                    <p>{currentUser?.isSeller 
                        ? "Showcase your skills and language proficiency" 
                        : "Share your interests and language proficiency"}</p>
                  </div>

                  {/* Skills */}
                  <div className="subsection">
                    <h3>{currentUser?.isSeller ? "Skills" : "Interests"}</h3>
                    <div className="array-input">
                      <div className="add-item">
                        <AutocompleteInput
                          value={newSkill}
                          onChange={setNewSkill}
                          onSelect={(value) => {
                            setNewSkill(value);
                            // Auto-add the skill when selected from suggestions
                            if (value.trim() && !formData.skills.includes(value.trim())) {
                              setFormData(prev => ({
                                ...prev,
                                skills: [...prev.skills, value.trim()]
                              }));
                              setNewSkill("");
                            }
                          }}
                          searchFunction={(query) => filterSuggestions(skillSuggestions, query)}
                          placeholder={currentUser?.isSeller ? "Add a skill..." : "Add an interest..."}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <button type="button" onClick={addSkill} disabled={!newSkill.trim()}>
                          Add
                        </button>
                      </div>
                      <div className="items-list">
                        {formData.skills.map((skill, index) => (
                          <span key={index} className="item-tag">
                            {skill}
                            <button type="button" onClick={() => removeSkill(index)}>×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="subsection">
                    <h3>Languages</h3>
                    <div className="array-input">
                      <div className="add-item language-add">
                        <AutocompleteInput
                          value={newLanguage.language}
                          onChange={(value) => setNewLanguage({...newLanguage, language: value})}
                          onSelect={(value) => {
                            setNewLanguage({...newLanguage, language: value});
                          }}
                          searchFunction={(query) => filterSuggestions(languageSuggestions, query)}
                          placeholder="Language name..."
                        />
                        <select
                          value={newLanguage.level}
                          onChange={(e) => setNewLanguage({...newLanguage, level: e.target.value})}
                        >
                          {languageLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                        <button type="button" onClick={addLanguage} disabled={!newLanguage.language.trim()}>
                          Add
                        </button>
                      </div>
                      <div className="items-list">
                        {formData.languages.map((lang, index) => (
                          <div key={index} className="language-item">
                            <span className="language-name">{lang.language}</span>
                            <span className="language-level">{lang.level}</span>
                            <button type="button" onClick={() => removeLanguage(index)}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Education - Only for Sellers */}
              {activeSection === "education" && currentUser?.isSeller && (
                <div className="form-section">
                  <div className="section-header">
                    <h2>Education & Certifications</h2>
                    <p>Your educational background and certifications</p>
                  </div>

                  {/* Education */}
                  <div className="subsection">
                    <h3>Education</h3>
                    <div className="complex-array-input">
                      <div className="add-complex-item">
                        <div className="form-row">
                          <AutocompleteInput
                            value={newEducation.institution}
                            onChange={(value) => setNewEducation({...newEducation, institution: value})}
                            onSelect={(value) => setNewEducation({...newEducation, institution: value})}
                            searchFunction={searchUniversities}
                            placeholder="Start typing institution name..."
                            className="institution-autocomplete"
                          />
                          <select
                            value={newEducation.degree}
                            onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                            className="degree-select"
                          >
                            <option value="">Select degree...</option>
                            {getDegreeTypes().map((degree) => (
                              <option key={degree} value={degree}>
                                {degree}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-row">
                          <AutocompleteInput
                            value={newEducation.field}
                            onChange={(value) => setNewEducation({...newEducation, field: value})}
                            onSelect={(value) => setNewEducation({...newEducation, field: value})}
                            searchFunction={searchFieldsOfStudy}
                            placeholder="Start typing field of study..."
                            className="field-autocomplete"
                          />
                          <input
                            type="number"
                            value={newEducation.year}
                            onChange={(e) => setNewEducation({...newEducation, year: e.target.value})}
                            placeholder="Year"
                            min="1950"
                            max="2030"
                            className="year-input"
                          />
                          <button type="button" onClick={addEducation} disabled={!newEducation.institution.trim() || !newEducation.degree.trim()}>
                            Add
                          </button>
                        </div>
                      </div>
                      <div className="complex-items-list">
                        {formData.education.map((edu, index) => (
                          <div key={index} className="complex-item">
                            <div className="item-content">
                              <h4>{edu.degree} in {edu.field}</h4>
                              <p>{edu.institution}</p>
                              <span className="year">{edu.year}</span>
                            </div>
                            <button type="button" onClick={() => removeEducation(index)}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="subsection">
                    <h3>Certifications</h3>
                    <div className="complex-array-input">
                      <div className="add-complex-item">
                        <div className="form-row">
                          <input
                            type="text"
                            value={newCertification.name}
                            onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                            placeholder="Certification name..."
                          />
                          <input
                            type="text"
                            value={newCertification.issuer}
                            onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
                            placeholder="Issuing organization..."
                          />
                        </div>
                        <div className="form-row">
                          <input
                            type="number"
                            value={newCertification.year}
                            onChange={(e) => setNewCertification({...newCertification, year: e.target.value})}
                            placeholder="Year"
                            min="1950"
                            max="2030"
                          />
                          <input
                            type="text"
                            value={newCertification.credentialId}
                            onChange={(e) => setNewCertification({...newCertification, credentialId: e.target.value})}
                            placeholder="Credential ID (optional)"
                          />
                          <button type="button" onClick={addCertification} disabled={!newCertification.name.trim() || !newCertification.issuer.trim()}>
                            Add
                          </button>
                        </div>
                      </div>
                      <div className="complex-items-list">
                        {formData.certifications.map((cert, index) => (
                          <div key={index} className="complex-item">
                            <div className="item-content">
                              <h4>{cert.name}</h4>
                              <p>{cert.issuer}</p>
                              <div className="cert-details">
                                <span className="year">{cert.year}</span>
                                {cert.credentialId && <span className="credential">ID: {cert.credentialId}</span>}
                              </div>
                            </div>
                            <button type="button" onClick={() => removeCertification(index)}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Portfolio - Only for Sellers */}
              {activeSection === "portfolio" && currentUser?.isSeller && (
                <div className="form-section">
                  <div className="section-header">
                    <h2>Portfolio</h2>
                    <p>Showcase your best work and projects</p>
                  </div>

                  <div className="subsection">
                    <div className="complex-array-input">
                      <div className="add-complex-item">
                        <div className="form-row">
                          <input
                            type="text"
                            value={newPortfolio.title}
                            onChange={(e) => setNewPortfolio({...newPortfolio, title: e.target.value})}
                            placeholder="Project title..."
                          />
                          <input
                            type="text"
                            value={newPortfolio.category}
                            onChange={(e) => setNewPortfolio({...newPortfolio, category: e.target.value})}
                            placeholder="Category..."
                          />
                        </div>
                        <div className="form-row">
                          <textarea
                            value={newPortfolio.description}
                            onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                            placeholder="Project description..."
                            rows="3"
                          />
                        </div>
                        <div className="form-row">
                          <input
                            type="url"
                            value={newPortfolio.image}
                            onChange={(e) => setNewPortfolio({...newPortfolio, image: e.target.value})}
                            placeholder="Image URL..."
                          />
                          <input
                            type="url"
                            value={newPortfolio.link}
                            onChange={(e) => setNewPortfolio({...newPortfolio, link: e.target.value})}
                            placeholder="Project URL..."
                          />
                          <button type="button" onClick={addPortfolio} disabled={!newPortfolio.title.trim() || !newPortfolio.description.trim()}>
                            Add
                          </button>
                        </div>
                      </div>
                      <div className="complex-items-list portfolio-list">
                        {formData.portfolio.map((item, index) => (
                          <div key={index} className="portfolio-item">
                            {item.image && (
                              <div className="portfolio-image">
                                <img src={item.image} alt={item.title} />
                              </div>
                            )}
                            <div className="portfolio-content">
                              <h4>{item.title}</h4>
                              <p>{item.description}</p>
                              <div className="portfolio-meta">
                                {item.category && <span className="category">{item.category}</span>}
                                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer">View Project</a>}
                              </div>
                            </div>
                            <button type="button" onClick={() => removePortfolio(index)}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {activeSection === "social" && (
                <div className="form-section">
                  <div className="section-header">
                    <h2>Social Links</h2>
                    <p>Connect your social media and professional profiles</p>
                  </div>

                  <div className="form-grid">
                                         <div className="form-group">
                       <label>🌐 Website</label>
                       <input
                         type="url"
                         value={formData.socialLinks.website}
                         onChange={(e) => handleSocialLinkChange("website", e.target.value)}
                         placeholder="https://yourwebsite.com"
                         className={touched['socialLinks.website'] && errors['socialLinks.website'] ? "error" : ""}
                       />
                       <ErrorMessage field="socialLinks.website" touched={touched} errors={errors} />
                     </div>

                     <div className="form-group">
                       <label>💼 LinkedIn</label>
                       <input
                         type="url"
                         value={formData.socialLinks.linkedin}
                         onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                         placeholder="https://linkedin.com/in/yourprofile"
                         className={touched['socialLinks.linkedin'] && errors['socialLinks.linkedin'] ? "error" : ""}
                       />
                       <ErrorMessage field="socialLinks.linkedin" touched={touched} errors={errors} />
                     </div>

                     <div className="form-group">
                       <label>𝕏 (formerly Twitter)</label>
                       <input
                         type="url"
                         value={formData.socialLinks.twitter}
                         onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                         placeholder="https://x.com/yourusername"
                         className={touched['socialLinks.twitter'] && errors['socialLinks.twitter'] ? "error" : ""}
                       />
                       <ErrorMessage field="socialLinks.twitter" touched={touched} errors={errors} />
                     </div>

                     <div className="form-group">
                       <label>💻 GitHub</label>
                       <input
                         type="url"
                         value={formData.socialLinks.github}
                         onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                         placeholder="https://github.com/yourusername"
                         className={touched['socialLinks.github'] && errors['socialLinks.github'] ? "error" : ""}
                       />
                       <ErrorMessage field="socialLinks.github" touched={touched} errors={errors} />
                     </div>

                     <div className="form-group">
                       <label>🎨 Behance</label>
                       <input
                         type="url"
                         value={formData.socialLinks.behance}
                         onChange={(e) => handleSocialLinkChange("behance", e.target.value)}
                         placeholder="https://behance.net/yourprofile"
                         className={touched['socialLinks.behance'] && errors['socialLinks.behance'] ? "error" : ""}
                       />
                       <ErrorMessage field="socialLinks.behance" touched={touched} errors={errors} />
                     </div>

                     <div className="form-group">
                       <label>🏀 Dribbble</label>
                       <input
                         type="url"
                         value={formData.socialLinks.dribbble}
                         onChange={(e) => handleSocialLinkChange("dribbble", e.target.value)}
                         placeholder="https://dribbble.com/yourusername"
                         className={touched['socialLinks.dribbble'] && errors['socialLinks.dribbble'] ? "error" : ""}
                       />
                       <ErrorMessage field="socialLinks.dribbble" touched={touched} errors={errors} />
                     </div>
                  </div>
                </div>
              )}

              {/* Seller Settings */}
              {activeSection === "seller" && currentUser?.isSeller && (
                <div className="form-section">
                  <div className="section-header">
                    <h2>Seller Settings</h2>
                    <p>Configure your seller preferences and availability</p>
                  </div>

                  <div className="form-grid">
                                         <div className="form-group">
                       <label>Hourly Rate (₦)</label>
                       <input
                         type="number"
                         value={formData.hourlyRate}
                         onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                         onBlur={() => handleBlur("hourlyRate")}
                         placeholder="5000"
                         min="100"
                         step="100"
                         className={touched.hourlyRate && errors.hourlyRate ? "error" : ""}
                       />
                       <ErrorMessage field="hourlyRate" touched={touched} errors={errors} />
                     </div>

                    <div className="form-group">
                      <label>Response Time</label>
                      <select
                        value={formData.responseTime}
                        onChange={(e) => handleInputChange("responseTime", e.target.value)}
                      >
                        <option value="Within 1 hour">Within 1 hour</option>
                        <option value="Within 6 hours">Within 6 hours</option>
                        <option value="Within 24 hours">Within 24 hours</option>
                        <option value="Within 3 days">Within 3 days</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Availability Status</label>
                      <select
                        value={formData.availability}
                        onChange={(e) => handleInputChange("availability", e.target.value)}
                      >
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                        <option value="Away">Away</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={uploading || updateMutation.isLoading}
            >
              {uploading ? "Uploading..." : updateMutation.isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Email Verification Modal */}
        {showVerificationModal && (
          <div className="verification-modal-overlay" onClick={() => setShowVerificationModal(false)}>
            <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Verify Your Email</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowVerificationModal(false)}
                >
                  ×
                </button>
              </div>
              
                             <div className="modal-content">
                 {requestEmailVerificationMutation.isLoading ? (
                   <div className="loading-state">
                     <div className="spinner-small"></div>
                     <p>Sending verification code...</p>
                   </div>
                 ) : (
                   <>
                     <div className="success-message">
                       {/* <span className="success-icon">✅</span> */}
                       <p>Verification code sent successfully!</p>
                     </div>
                     <p>We've sent a 6-digit verification code to:</p>
                     <div className="email-display">{formData.email}</div>
                     <p>Please enter the code below to verify your new email address:</p>
                     
                     <div className="verification-input">
                       <input
                         type="text"
                         value={verificationCode}
                         onChange={(e) => {
                           setVerificationCode(e.target.value);
                           // Clear verification code error when user types
                           if (errors.verificationCode) {
                             const newErrors = { ...errors };
                             delete newErrors.verificationCode;
                             setErrors(newErrors);
                           }
                         }}
                         placeholder="Enter 6-digit code"
                         maxLength={6}
                         className={`code-input ${touched.verificationCode && errors.verificationCode ? "error" : ""}`}
                         autoFocus
                       />
                       <ErrorMessage field="verificationCode" touched={touched} errors={errors} />
                     </div>
                   </>
                 )}
               </div>
              
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowVerificationModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="verify-btn"
                  onClick={handleEmailVerification}
                  disabled={verifyEmailMutation.isLoading || !verificationCode.trim()}
                >
                  {verifyEmailMutation.isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phone Verification Modal */}
        {showPhoneVerificationModal && (
          <div className="verification-modal-overlay" onClick={() => setShowPhoneVerificationModal(false)}>
            <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Verify Your Phone Number</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowPhoneVerificationModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                {requestPhoneVerificationMutation.isLoading ? (
                  <div className="loading-state">
                    <div className="spinner-small"></div>
                    <p>Sending verification code...</p>
                  </div>
                ) : (
                  <>
                    <div className="success-message">
                      <p>Verification code sent successfully!</p>
                    </div>
                    <p>We've sent a 6-digit verification code via SMS to:</p>
                    <div className="phone-display">{formData.phone}</div>
                    <p>Please enter the code below to verify your new phone number:</p>
                    
                    <div className="verification-input">
                      <input
                        type="text"
                        value={phoneVerificationCode}
                        onChange={(e) => {
                          setPhoneVerificationCode(e.target.value);
                          // Clear verification code error when user types
                          if (errors.phoneVerificationCode) {
                            const newErrors = { ...errors };
                            delete newErrors.phoneVerificationCode;
                            setErrors(newErrors);
                          }
                        }}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className={`code-input ${touched.phoneVerificationCode && errors.phoneVerificationCode ? "error" : ""}`}
                        autoFocus
                      />
                      <ErrorMessage field="phoneVerificationCode" touched={touched} errors={errors} />
                    </div>
                  </>
                )}
              </div>
              
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowPhoneVerificationModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="verify-btn"
                  onClick={handlePhoneVerification}
                  disabled={verifyPhoneMutation.isLoading || !phoneVerificationCode.trim()}
                >
                  {verifyPhoneMutation.isLoading ? 'Verifying...' : 'Verify Phone'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
