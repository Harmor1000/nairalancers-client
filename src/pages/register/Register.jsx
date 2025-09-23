import React, { useState, useCallback, useEffect } from "react";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase"; // Adjust path as needed
import getCurrentUser from "../../utils/getCurrentUser";

const Register = () => {
  const currentUser = getCurrentUser();
  const location = useLocation();

  // Redirect logged-in users to home page
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "", // Added password confirmation
  });

  // Enhanced validation rules
  const validationRules = {
    firstname: {
      required: true,
      minLength: 2,
      message: "First name must be at least 2 characters"
    },
    lastname: {
      required: true,
      minLength: 2,
      message: "Last name must be at least 2 characters"
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address"
    },
    username: {
      required: true,
      minLength: 3,
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "Username must be 3+ characters (letters, numbers, underscore only)"
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: "Password must be 8+ characters with uppercase, lowercase, and number"
    },
    confirmPassword: {
      required: true,
      message: "Passwords do not match"
    }
  };

  // Load preserved data on component mount
  useEffect(() => {
    const preserveData = location.state?.preserveData;
    const registrationData = location.state?.registrationData;
    
    if (preserveData && registrationData) {
      // Restore from passed data
      setFormData({
        firstname: registrationData.firstname || "",
        lastname: registrationData.lastname || "",
        email: registrationData.email || "",
        username: registrationData.username || "",
        password: registrationData.password || "",
        confirmPassword: registrationData.confirmPassword || "",
      });
      setRole(registrationData.role || null);
      if (registrationData.role) {
        setStep(2);
      }
    } else {
      // Try to load from sessionStorage
      const savedData = sessionStorage.getItem('nairalancers_registration_data');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData.formData || formData);
          setRole(parsedData.role || null);
          setStep(parsedData.step || 1);
        } catch (error) {
          console.error('Error parsing saved registration data:', error);
          sessionStorage.removeItem('nairalancers_registration_data');
        }
      }
    }
  }, [location.state]);

  // Save data to sessionStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      formData,
      role,
      step,
      timestamp: Date.now()
    };
    sessionStorage.setItem('nairalancers_registration_data', JSON.stringify(dataToSave));
  }, [formData, role, step]);

  // Clear saved data on successful registration
  const clearSavedData = () => {
    sessionStorage.removeItem('nairalancers_registration_data');
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Real-time validation for better UX
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const handleRoleSelect = useCallback((selectedRole) => {
    setRole(selectedRole);
    setStep(2);
    // Clear role error if it exists
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: "" }));
    }
  }, [errors.role]);

  const validateField = (fieldName, value) => {
    const rule = validationRules[fieldName];
    if (!rule) return "";

    if (rule.required && !value?.toString().trim()) {
      return rule.message || `${fieldName} is required`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `${fieldName} must be at least ${rule.minLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `Invalid ${fieldName} format`;
    }

    if (rule.custom && !rule.custom(value)) {
      return rule.message || `Invalid ${fieldName}`;
    }

    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all form fields
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    // Special validation for password confirmation
    if (formData.confirmPassword && formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate role selection
    if (!role) {
      newErrors.role = "Please select your role";
    }

    return newErrors;
  };

  // Real-time field validation on blur
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    let error = validateField(name, value);
    
    // Special handling for password confirmation
    if (name === 'confirmPassword' && value !== formData.password) {
      error = "Passwords do not match";
    }
    
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [formData.password]);

  const handleGoogleSignUp = async () => {
    if (loading) return;
    
    // Check if role is selected
    if (!role) {
      setErrors({ general: "Please select your role first (Client or Freelancer)" });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Send the ID token and role to your backend
      const response = await newRequest.post("/auth/google", {
        idToken,
        role
      });

      // Store user data and token
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Navigate to home page
      navigate("/");
      
    } catch (error) {
      console.error("Google sign up error:", error);
      
      // Handle different types of errors
      if (error.code === 'auth/popup-closed-by-user') {
        setErrors({ general: "Sign-up was cancelled. Please try again." });
      } else if (error.code === 'auth/popup-blocked') {
        setErrors({ general: "Popup was blocked. Please enable popups for this site." });
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User cancelled - don't show error
        return;
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Google sign up failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first error field
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.focus();
      return;
    }

    if (loading) return;
    setLoading(true);
    setErrors({});

    const payload = {
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim().toLowerCase(),
      username: formData.username.trim().toLowerCase(),
      password: formData.password,
      isSeller: role === "freelancer",
    };

    try {
      // Send verification email with registration data (don't create user yet)
      await newRequest.post("/registration-verification/request", {
        email: payload.email,
        firstname: payload.firstname,
        registrationData: payload  // Send all registration data for later user creation
      });

      // Clear saved data on successful registration request
      clearSavedData();

      // Navigate to verification page with user info and registration data
      navigate("/verify-email", {
        state: {
          email: payload.email,
          firstname: payload.firstname,
          registrationData: {
            ...formData,
            role: role
          }
        }
      });
    } catch (err) {
      console.error("Registration error:", err);
      const backendError = err.response?.data;
      
      if (backendError?.field) {
        setErrors({ [backendError.field]: backendError.message });
      } else if (backendError?.errors) {
        // Handle multiple field errors from backend
        setErrors(backendError.errors);
      } else {
        setErrors({ 
          general: backendError?.message || "Registration failed. Please try again." 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const getRoleIcon = (roleType) => {
    return roleType === "client" ? "👤" : "🎨";
  };

  const getRoleDescription = (roleType) => {
    return roleType === "client" 
      ? "Looking to hire talented freelancers for your projects"
      : "Ready to showcase your skills and find exciting opportunities";
  };

  return (
    <div className="multi-register">
      {/* Progress indicator */}
      <div className="progress-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span>1</span>
          <label>Choose Role</label>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span>2</span>
          <label>Account Details</label>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            className="role-step"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <div className="step-header">
              <h1>Join Our Platform</h1>
              <p>Choose how you'll be using our platform to get started.</p>
            </div>

            {errors.role && <div className="error-message">{errors.role}</div>}

            <div className="roles">
              <div
                className={`role-card ${role === "client" ? "selected" : ""}`}
                onClick={() => handleRoleSelect("client")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleRoleSelect("client")}
              >
                <div className="role-icon">{getRoleIcon("client")}</div>
                {/* <img src="/images/client.svg" alt="Client" /> */}
                <h2>I'm a Client</h2>
                <p>{getRoleDescription("client")}</p>
              </div>
              
              <div
                className={`role-card ${role === "freelancer" ? "selected" : ""}`}
                onClick={() => handleRoleSelect("freelancer")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleRoleSelect("freelancer")}
              >
                <div className="role-icon">{getRoleIcon("freelancer")}</div>
                {/* <img src="/images/freelancer.svg" alt="Freelancer" /> */}
                <h2>I'm a Freelancer</h2>
                <p>{getRoleDescription("freelancer")}</p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.form
            key="step2"
            className="form-step"
            onSubmit={handleSubmit}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
            noValidate
          >
            <div className="step-header">
              <h1>Create Your Account</h1>
              <p className="role-label">
                Signing up as <strong>{role}</strong>
                <button 
                  type="button" 
                  className="change-role"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  title="Change role"
                >
                  Change
                </button>
              </p>
            </div>

            {errors.general && <div className="error-message">{errors.general}</div>}

            {/* Google Sign Up Button */}
            <button 
              type="button" 
              className="google-signup-btn"
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="divider">
              <span>or</span>
            </div>

            <div className="form-row">
              <div className="form-field">
                <input
                  name="firstname"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.firstname ? "error" : ""}
                  disabled={loading}
                  aria-invalid={!!errors.firstname}
                  aria-describedby={errors.firstname ? "firstname-error" : undefined}
                />
                {errors.firstname && (
                  <p id="firstname-error" className="field-error">{errors.firstname}</p>
                )}
              </div>

              <div className="form-field">
                <input
                  name="lastname"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.lastname ? "error" : ""}
                  disabled={loading}
                  aria-invalid={!!errors.lastname}
                  aria-describedby={errors.lastname ? "lastname-error" : undefined}
                />
                {errors.lastname && (
                  <p id="lastname-error" className="field-error">{errors.lastname}</p>
                )}
              </div>
            </div>

            <div className="form-field">
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email ? "error" : ""}
                disabled={loading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="field-error">{errors.email}</p>
              )}
            </div>

            <div className="form-field">
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.username ? "error" : ""}
                disabled={loading}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? "username-error" : undefined}
              />
              {errors.username && (
                <p id="username-error" className="field-error">{errors.username}</p>
              )}
            </div>

            <div className="form-field">
              <div className="password-input-wrapper">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password ? "error" : ""}
                  disabled={loading}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="field-error">{errors.password}</p>
              )}
            </div>

            <div className="form-field">
              <div className="password-input-wrapper">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.confirmPassword ? "error" : ""}
                  disabled={loading}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="field-error">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Privacy Agreement */}
            <div className="terms-agreement">
              <p>
                By creating an account, you agree to our{' '}
                <Link to="/terms-of-service" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Link>
              </p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="back"
                disabled={loading}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="next" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="login-link">
              Already have an account?{' '}
              <Link to="/login">Sign in here</Link>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;