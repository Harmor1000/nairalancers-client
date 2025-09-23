import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './VerifyEmail.scss';
import newRequest from '../../utils/newRequest';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email and registration data from location state (passed from registration)
  const initialEmail = location.state?.email || '';
  const firstname = location.state?.firstname || '';
  const registrationData = location.state?.registrationData || null;
  
  const [email, setEmail] = useState(initialEmail);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [changingEmail, setChangingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await newRequest.post('/registration-verification/verify', {
        email: email,
        verificationCode: verificationCode.trim()
      });

      setMessage(response.data.message);
      
      // If user was created and token provided, log them in automatically
      if (response.data.user && response.data.token) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Success - redirect to dashboard after a short delay
        setTimeout(() => {
          navigate(response.data.user.isSeller ? '/freelancer-dashboard' : '/', { 
            replace: true
          });
        }, 2000);
      } else {
        // Fallback - redirect to login after a short delay
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Email verified successfully! You can now log in.',
              email: email
            }
          });
        }, 2000);
      }

    } catch (err) {
      console.error('Verification error:', err);
      const errorMessage = err.response?.data?.message || 
                          'Verification failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending || timeLeft > 540) return; // Don't allow resend if less than 1 minute passed

    setResending(true);
    setError('');
    setMessage('');

    try {
      const response = await newRequest.post('/registration-verification/resend', {
        email: email
      });

      setMessage(response.data.message);
      setTimeLeft(600); // Reset timer

    } catch (err) {
      console.error('Resend error:', err);
      const errorMessage = err.response?.data?.message || 
                          'Failed to resend code. Please try again.';
      setError(errorMessage);
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      if (error) setError('');
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    
    if (!newEmail.trim()) {
      setError('Please enter a new email address');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (newEmail === email) {
      setError('New email must be different from current email');
      return;
    }

    setChangingEmail(true);
    setError('');
    setMessage('');

    try {
      // Send verification to new email
      const response = await newRequest.post('/registration-verification/change-email', {
        oldEmail: email,
        newEmail: newEmail,
        registrationData: registrationData
      });

      setMessage(response.data.message);
      setEmail(newEmail);
      setShowChangeEmail(false);
      setNewEmail('');
      setVerificationCode('');
      setTimeLeft(600); // Reset timer

    } catch (err) {
      console.error('Change email error:', err);
      const errorMessage = err.response?.data?.message || 
                          'Failed to change email. Please try again.';
      setError(errorMessage);
    } finally {
      setChangingEmail(false);
    }
  };

  const handleBackToRegistration = () => {
    // Preserve registration data when going back
    navigate('/register', {
      state: {
        preserveData: true,
        registrationData: registrationData
      }
    });
  };

  return (
    <div className="verify-email">
      <div className="verify-email-container">
        <div className="header">
          <div className="icon">📧</div>
          <h1>Verify Your Email</h1>
          <p>
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </p>
          <p className="sub-text">
            Hi {firstname}! Please check your email and enter the code below to complete your registration.
          </p>
          <button 
            type="button" 
            className="change-email-link"
            onClick={() => setShowChangeEmail(!showChangeEmail)}
          >
            Wrong email? Click here to change it
          </button>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message" role="alert">
            {message}
          </div>
        )}

        {showChangeEmail && (
          <div className="change-email-form">
            <h3>Change Email Address</h3>
            <form onSubmit={handleChangeEmail}>
              <div className="form-field">
                <label htmlFor="newEmail">New Email Address</label>
                <input
                  id="newEmail"
                  type="email"
                  placeholder="Enter new email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={changingEmail}
                  required
                />
              </div>
              <div className="change-email-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowChangeEmail(false);
                    setNewEmail('');
                    setError('');
                  }}
                  disabled={changingEmail}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="change-btn"
                  disabled={changingEmail || !newEmail.trim()}
                >
                  {changingEmail ? 'Changing...' : 'Change Email'}
                </button>
              </div>
            </form>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              id="verificationCode"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={handleCodeChange}
              disabled={loading}
              maxLength={6}
              className={`code-input ${error ? 'error' : ''}`}
              autoComplete="one-time-code"
              required
            />
            <div className="input-helper">
              {verificationCode.length}/6 digits
            </div>
          </div>

          <button type="submit" disabled={loading || verificationCode.length !== 6}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        <div className="resend-section">
          <p>Didn't receive the code?</p>
          <div className="resend-actions">
            {timeLeft > 540 ? (
              <span className="countdown">
                Resend available in {formatTime(timeLeft - 540)}
              </span>
            ) : (
              <button 
                type="button" 
                className="resend-btn"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
          
          <div className="timer">
            Code expires in: <span className={timeLeft < 60 ? 'warning' : ''}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="help-section">
          <h3>Having trouble?</h3>
          <ul>
            <li>Check your spam/junk folder</li>
            <li>Make sure you entered the correct email address</li>
            <li>Wait a few minutes for the email to arrive</li>
          </ul>
          
          <div className="contact-support">
            Need help? <a href="mailto:support@nairalancers.com">Contact Support</a>
          </div>
        </div>

        <div className="back-actions">
          <button 
            type="button" 
            className="back-btn"
            onClick={handleBackToRegistration}
          >
            ← Back to Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
