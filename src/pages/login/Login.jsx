import React, { useState, useCallback, useEffect } from 'react';
import "./Login.scss";
import newRequest from '../../utils/newRequest';
import { useNavigate, Link, useLocation, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider } from "../../firebase"; // Adjust path as needed
import getCurrentUser from '../../utils/getCurrentUser';

function Login() {
  const currentUser = getCurrentUser();

  // Redirect logged-in users to home page
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from email verification
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      if (location.state?.email) {
        setUsername(location.state.email);
      }
      // Clear the state to prevent message from persisting on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle Google sign-in redirect result (fallback when popup is blocked)
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          setIsLoading(true);
          setError(null);
          try {
            const idToken = await result.user.getIdToken();
            const response = await newRequest.post("/auth/google", {
              idToken,
            });

            // Store user data and token
            localStorage.setItem("currentUser", JSON.stringify(response.data));
            if (response.data.token) {
              localStorage.setItem("token", response.data.token);
            }

            // Navigate based on role
            if (response.data.isSeller) {
              navigate("/freelancer-dashboard");
            } else {
              navigate("/");
            }
          } catch (err) {
            console.error("Google redirect sign in error:", err);
            setError(
              err.response?.data?.message ||
                "Google sign in failed. Please try again."
            );
          } finally {
            setIsLoading(false);
          }
        }
      })
      .catch((err) => {
        console.error("Google redirect result error:", err);
      });
  }, [navigate]);

  // Real-time field validation
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'username':
        if (!value.trim()) return "Email or username is required";
        if (value.includes('@')) {
          // Email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return "Please enter a valid email address";
        } else {
          // Username validation
          if (value.length < 3) return "Username must be at least 3 characters";
        }
        return "";
      case 'password':
        if (!value.trim()) return "Password is required";
        // if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    
    // Clear field error if it exists
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Clear general error
    if (error) {
      setError(null);
    }
  }, [fieldErrors, error]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  }, []);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setFieldErrors({});

      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Send the ID token to your backend
      const response = await newRequest.post("/auth/google", {
        idToken
      });

      // Check if email is verified
      if (!response.data.emailVerified) {
        // Redirect to email verification page
        navigate("/verify-email", {
          state: {
            email: response.data.email,
            firstname: response.data.firstname,
            message: "Please verify your email address to access all platform features.",
            isExistingUser: true
          }
        });
        return;
      }

      // Store user data and token
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Navigate to appropriate dashboard based on user type
      if (response.data.isSeller) {
        navigate("/freelancer-dashboard");
      } else {
        navigate("/");
      }
      
    } catch (error) {
      console.error("Google sign in error:", error);
      
      // Handle different types of errors
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Sign-in was cancelled. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        try {
          // Fall back to redirect if popup is blocked
          await signInWithRedirect(auth, googleProvider);
          return; // Flow will continue in getRedirectResult useEffect after redirect
        } catch (redirectErr) {
          console.error("Google sign in redirect fallback error:", redirectErr);
          setError("Popup was blocked and redirect failed. Please try again.");
        }
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User cancelled - don't show error
        return;
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Google sign in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate all fields
    const usernameError = validateField('username', username);
    const passwordError = validateField('password', password);
    
    const newFieldErrors = {};
    if (usernameError) newFieldErrors.username = usernameError;
    if (passwordError) newFieldErrors.password = passwordError;
    
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      // Focus first error field
      const firstErrorField = Object.keys(newFieldErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.focus();
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await newRequest.post("/auth/login", { 
        username: username.trim(), 
        password 
      });
      
      // Check if email is verified
      if (!res.data.emailVerified) {
        // Redirect to email verification page
        navigate("/verify-email", {
          state: {
            email: res.data.email,
            firstname: res.data.firstname,
            message: "Please verify your email address to access all platform features.",
            isExistingUser: true
          }
        });
        return;
      }
      
      // Store user data and token
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      // Navigate to appropriate dashboard based on user type
      if (res.data.isSeller) {
        navigate("/freelancer-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Better error handling
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        <p>Sign in to your account to continue</p>
        
        {/* Google Sign In Button */}
        <button 
          type="button" 
          className="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
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

        {/* Success Message */}
        {successMessage && (
          <div className="success-message" role="alert">
            {successMessage}
          </div>
        )}

        {/* General Error Message */}
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {/* Email/Username Field */}
        <div className="form-field">
          <label htmlFor="username">Email or Username</label> 
          <input 
            id="username"
            name="username" 
            type="text" 
            placeholder="Enter your email or username" 
            value={username}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={fieldErrors.username ? "error" : ""}
            required
            aria-invalid={!!fieldErrors.username}
            aria-describedby={fieldErrors.username ? "username-error" : undefined}
          />
          {fieldErrors.username && (
            <p id="username-error" className="field-error">{fieldErrors.username}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input 
              id="password"
              name="password" 
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={fieldErrors.password ? "error" : ""}
              required
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p id="password-error" className="field-error">{fieldErrors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Forgot Password Link */}
        {/* <div className="forgot-password"> */}
          <Link to="/forgot-password">Forgot your password?</Link>
        {/* </div> */}

        {/* Sign Up Link */}
        <div className="signup-link">
          Don't have an account?
          <Link to="/register">Sign up here</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;