import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./UserVerification.scss";
import newRequest from "../../utils/newRequest";
import { PulseLoader } from "react-spinners";
import getCurrentUser from "../../utils/getCurrentUser";

const UserVerification = () => {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [idForm, setIdForm] = useState({
    idType: '',
    idNumber: '',
    frontImage: null,
    backImage: null
  });
  const [uploadingImage, setUploadingImage] = useState({
    frontImage: false,
    backImage: false
  });

  // Fetch verification status
  const { data: verificationStatus, isLoading, error } = useQuery({
    queryKey: ["verification-status"],
    queryFn: () => newRequest.get("/verification/status").then((res) => res.data),
  });

  // Request phone verification
  const requestPhoneMutation = useMutation({
    mutationFn: (phoneData) => newRequest.post("/verification/phone/request", phoneData),
    onSuccess: (response) => {
      setIsCodeSent(true);
      alert(response.data.message || "Verification code sent to your phone!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to send verification code";
      alert(errorMessage);
    },
  });

  // Verify phone code
  const verifyPhoneMutation = useMutation({
    mutationFn: (codeData) => newRequest.post("/verification/phone/verify", codeData),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["verification-status"]);
      setShowPhoneModal(false);
      setIsCodeSent(false);
      setPhoneNumber("");
      setVerificationCode("");
      alert(response.data.message || "Phone number verified successfully!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to verify phone number";
      alert(errorMessage);
    },
  });

  // Submit ID verification
  const submitIdMutation = useMutation({
    mutationFn: (idData) => newRequest.post("/verification/id/submit", idData),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["verification-status"]);
      setShowIdModal(false);
      setIdForm({ idType: '', idNumber: '', frontImage: null, backImage: null });
      alert(response.data.message || "ID verification submitted successfully!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to submit ID verification";
      alert(errorMessage);
    },
  });

  // Manual email verification
  const manualEmailVerificationMutation = useMutation({
    mutationFn: () => newRequest.post("/verification/email/verify"),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["verification-status"]);
      alert(response.data.message || "Email verified successfully!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to verify email";
      alert(errorMessage);
    },
  });

  const handleRequestPhone = () => {
    if (!phoneNumber) return;
    requestPhoneMutation.mutate({ phoneNumber });
  };

  const handleVerifyPhone = () => {
    if (!verificationCode) return;
    verifyPhoneMutation.mutate({ verificationCode });
  };

  const handleImageUpload = async (field, file) => {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    setUploadingImage(prev => ({ ...prev, [field]: true }));
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('files', file);
      
      // Upload to server with verification folder
      const response = await newRequest.post('/upload/file?folder=verification-documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update form with the uploaded file URL
      setIdForm(prev => ({
        ...prev,
        [field]: response.data.file.fileUrl
      }));
      
    } catch (error) {
      console.error('Failed to upload image:', error);
      const errorMessage = error.response?.data?.error || 'Failed to upload image. Please try again.';
      alert(errorMessage);
    } finally {
      setUploadingImage(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmitId = () => {
    if (!idForm.idType || !idForm.idNumber || !idForm.frontImage || !idForm.backImage) return;
    
    submitIdMutation.mutate({
      idType: idForm.idType,
      idNumber: idForm.idNumber,
      frontImageUrl: idForm.frontImage,
      backImageUrl: idForm.backImage
    });
  };

  const handleManualEmailVerification = () => {
    manualEmailVerificationMutation.mutate();
  };

  const getVerificationLevelInfo = (level) => {
    const levels = {
      unverified: {
        color: "red",
        icon: "🔓",
        title: "Unverified",
        description: "Get started by verifying your email"
      },
      email_verified: {
        color: "orange",
        icon: "📧",
        title: "Email Verified",
        description: "Email verified. Add phone for better security."
      },
      phone_verified: {
        color: "blue",
        icon: "📱",
        title: "Phone Verified",
        description: "Phone and email verified. Submit ID for full verification."
      },
      id_verified: {
        color: "green",
        icon: "🆔",
        title: "ID Verified",
        description: "Fully verified account with maximum benefits."
      },
      enhanced: {
        color: "purple",
        icon: "⭐",
        title: "Enhanced Verification",
        description: "Premium verification with VIP status."
      }
    };
    return levels[level] || levels.unverified;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to format transaction limit
  const formatTransactionLimit = (limit, unlimited = false) => {
    if (unlimited || limit === null || limit === undefined) {
      return "Unlimited";
    }
    return formatCurrency(limit);
  };

  if (isLoading) {
    return (
      <div className="user-verification">
        <div className="loading-container">
          <PulseLoader color="#1dbf73" loading={true} size={20} />
          <div className="loading-text">Loading verification status...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-verification">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-message">Unable to load verification status</div>
          <div className="error-description">
            Please try refreshing the page or contact support if the problem persists.
          </div>
        </div>
      </div>
    );
  }

  const levelInfo = getVerificationLevelInfo(verificationStatus.currentLevel);

  return (
    <div className="user-verification">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>🔐 Account Verification</h1>
          <p className="subtitle">
            Increase your trust score and unlock higher transaction limits by verifying your account
          </p>
        </div>

        {/* Current Status */}
        <div className="current-status-card">
          <div className="status-header">
            <div className={`status-icon ${levelInfo.color}`}>
              {levelInfo.icon}
            </div>
            <div className="status-info">
              <h2>{levelInfo.title}</h2>
              <p>{levelInfo.description}</p>
            </div>
            <div className="trust-score">
              <div className="score-circle">
                <span className="score">{verificationStatus.trustScore}</span>
                <span className="label">Trust Score</span>
              </div>
            </div>
          </div>
          
          <div className="status-details">
            <div className="detail-item">
              <span className="label">Transaction Limit:</span>
              <span className="value">
                {formatTransactionLimit(verificationStatus.transactionLimit, verificationStatus.unlimitedTransactions)}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Account Status:</span>
              <span className={`value status-${levelInfo.color}`}>{levelInfo.title}</span>
            </div>
          </div>
        </div>

        {/* Verification Steps */}
        <div className="verification-steps">
          <h2>🔄 Verification Steps</h2>
          
          {/* Email Verification */}
          <div className={`step-card ${verificationStatus.emailVerified ? 'completed' : 'pending'}`}>
            <div className="step-header">
              <div className="step-icon">
                {verificationStatus.emailVerified ? '✅' : '📧'}
              </div>
              <div className="step-info">
                <h3>Email Verification</h3>
                <p>Verify your email address to secure your account</p>
              </div>
              <div className="step-status">
                {verificationStatus.emailVerified ? (
                  <span className="completed">Completed</span>
                ) : (
                  <span className="pending">Required</span>
                )}
              </div>
            </div>
            {!verificationStatus.emailVerified && (
              <div className="step-action">
                <p>If you cannot find the verification email, you can verify your email manually:</p>
                <button 
                  className="verify-btn primary"
                  onClick={handleManualEmailVerification}
                  disabled={manualEmailVerificationMutation.isLoading}
                >
                  {manualEmailVerificationMutation.isLoading ? 'Verifying...' : 'Verify Email Now'}
                </button>
                <p className="help-text">
                  <small>This will mark your email as verified and unlock additional features.</small>
                </p>
              </div>
            )}
          </div>

          {/* Phone Verification */}
          <div className={`step-card ${verificationStatus.phoneVerified ? 'completed' : 'available'}`}>
            <div className="step-header">
              <div className="step-icon">
                {verificationStatus.phoneVerified ? '✅' : '📱'}
              </div>
              <div className="step-info">
                <h3>Phone Verification</h3>
                <p>Add and verify your phone number for enhanced security</p>
                <div className="benefits">
                  <span className="benefit">🔒 Enhanced Security</span>
                  {verificationStatus.userType === 'client' && (
                    <span className="benefit">💰 Unlimited Transactions</span>
                  )}
                  {verificationStatus.userType === 'freelancer' && (
                    <span className="benefit">💰 ₦200,000 Transaction Limit</span>
                  )}
                  <span className="benefit">⚡ Priority Support</span>
                  <span className="benefit">🚀 Enhanced Profile Visibility</span>
                </div>
              </div>
              <div className="step-status">
                {verificationStatus.phoneVerified ? (
                  <span className="completed">Completed</span>
                ) : (
                  <button 
                    className="verify-btn primary"
                    onClick={() => setShowPhoneModal(true)}
                    disabled={!verificationStatus.emailVerified}
                  >
                    Verify Phone
                  </button>
                )}
              </div>
            </div>
            
            {/* Email verification requirement */}
            {!verificationStatus.emailVerified && (
              <div className="step-requirement">
                <p>📋 Complete email verification first</p>
              </div>
            )}
          </div>

          {/* ID Verification */}
          <div className={`step-card ${
            verificationStatus.idVerified ? 'completed' : 
            verificationStatus.idVerification?.status === 'pending' && verificationStatus.idVerification?.submittedAt ? 'pending' :
            verificationStatus.idVerification?.status === 'rejected' ? 'rejected' : 'available'
          }`}>
            <div className="step-header">
              <div className="step-icon">
                {verificationStatus.idVerified ? '✅' : 
                 verificationStatus.idVerification?.status === 'pending' && verificationStatus.idVerification?.submittedAt ? '⏳' :
                 verificationStatus.idVerification?.status === 'rejected' ? '❌' : '🆔'}
              </div>
              <div className="step-info">
                <h3>ID Verification</h3>
                <p>Submit government-issued ID for full account verification</p>
                <div className="benefits">
                  <span className="benefit">🏆 Verified Badge</span>
                  <span className="benefit">💰 Unlimited Transactions</span>
                  <span className="benefit">⭐ Premium Support</span>
                  <span className="benefit">🚀 Higher Search Ranking</span>
                  <span className="benefit">⚡ Reduced Escrow Hold Times</span>
                </div>
              </div>
              <div className="step-status">
                {verificationStatus.idVerified ? (
                  <span className="completed">Completed</span>
                ) : verificationStatus.idVerification?.status === 'pending' && verificationStatus.idVerification?.submittedAt ? (
                  <span className="pending">Under Review</span>
                ) : verificationStatus.idVerification?.status === 'rejected' ? (
                  <span className="rejected">Rejected</span>
                ) : (
                  <button 
                    className="verify-btn success"
                    onClick={() => setShowIdModal(true)}
                    disabled={!verificationStatus.phoneVerified}
                  >
                    Submit ID
                  </button>
                )}
              </div>
            </div>
            
            {/* Phone verification requirement */}
            {!verificationStatus.phoneVerified && (
              <div className="step-requirement">
                <p>📋 Complete phone verification first</p>
              </div>
            )}
            
            {/* ID verification status messages */}
            {verificationStatus.idVerified && (
              <div className="verification-complete">
                <div className="complete-icon">🎉</div>
                <span>ID verification completed! You now have full platform access.</span>
              </div>
            )}
            
            {verificationStatus.idVerification?.status === 'pending' && verificationStatus.idVerification?.submittedAt && (
              <div className="verification-pending">
                <div className="pending-icon">⏳</div>
                <span>Your documents are being reviewed. This usually takes 2-5 business days.</span>
              </div>
            )}
            
            {verificationStatus.idVerification?.status === 'rejected' && (
              <div className="verification-rejected">
                <div className="rejected-icon">❌</div>
                <span>Document was rejected. Please upload a clear, valid government-issued ID.</span>
                <button 
                  className="verify-btn primary"
                  onClick={() => setShowIdModal(true)}
                  style={{ marginTop: '12px' }}
                >
                  Resubmit ID
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Verification Tiers */}
        <div className="tiers-section">
          <h2>🏆 Verification Tiers & Transaction Limits</h2>
          <div className="tiers-grid">
            <div className={`tier-card ${
              verificationStatus.currentLevel === 'email_verified' ? 'current' :
              (verificationStatus.emailVerified || verificationStatus.phoneVerified || verificationStatus.idVerified) ? 'completed' : 'locked'
            }`}>
              <div className="tier-header">
                <span className="tier-icon">📧</span>
                <h3>Email Verified</h3>
              </div>
              {verificationStatus.userType === 'client' && (
                <div className="tier-limit">₦200,000</div>
              )}
              {verificationStatus.userType === 'freelancer' && (
                <div className="tier-limit">₦100,000</div>
              )}
              {/* <div className="tier-limit">₦100,000</div> */}
              <div className="tier-benefits">
                <span>• Email notifications</span>
                <span>• Basic trust score</span>
                <span>• Platform access</span>
              </div>
            </div>
            
            <div className={`tier-card ${
              verificationStatus.currentLevel === 'phone_verified' ? 'current' :
              verificationStatus.phoneVerified ? 'completed' : 
              verificationStatus.emailVerified ? 'available' : 'locked'
            }`}>
              <div className="tier-header">
                <span className="tier-icon">📱</span>
                <h3>Phone Verified</h3>
              </div>
              {verificationStatus.userType === 'client' && (
                <div className="tier-limit">Unlimited</div>
              )}
              {verificationStatus.userType === 'freelancer' && (
                <div className="tier-limit">₦200,000</div>
              )}
              {/* <div className="tier-limit">₦200,000</div> */}
              <div className="tier-benefits">
                <span>• Priority support</span>
                <span>• Enhanced visibility</span>
                <span>• Faster payments</span>
              </div>
            </div>
            
            <div className={`tier-card ${
              verificationStatus.currentLevel === 'id_verified' ? 'current' :
              verificationStatus.idVerified ? 'completed' : 
              verificationStatus.phoneVerified ? 'available' : 'locked'
            }`}>
              <div className="tier-header">
                <span className="tier-icon">🆔</span>
                <h3>ID Verified</h3>
              </div>
              <div className="tier-limit">Unlimited</div>
              <div className="tier-benefits">
                <span>• Verified badge</span>
                <span>• Premium support</span>
                <span>• Higher search ranking</span>
                <span>• Reduced escrow holds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Benefits */}
        <div className="benefits-section">
          <h2>✨ Your Current Benefits</h2>
          <div className="benefits-grid">
            {verificationStatus.benefits.current.map((benefit, index) => (
              <div key={index} className="benefit-card current">
                <span className="benefit-icon">✅</span>
                <span className="benefit-text">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Level Benefits */}
        {verificationStatus.benefits.next && (
          <div className="next-benefits-section">
            <h2>🎯 Unlock Next Level</h2>
            <div className="benefits-grid">
              {verificationStatus.benefits.next.map((benefit, index) => (
                <div key={index} className="benefit-card next">
                  <span className="benefit-icon">🔒</span>
                  <span className="benefit-text">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {verificationStatus.nextSteps && verificationStatus.nextSteps.length > 0 && (
          <div className="next-steps-section">
            <h2>🎯 Recommended Next Steps</h2>
            <div className="steps-list">
              {verificationStatus.nextSteps.map((step, index) => (
                <div key={index} className={`next-step-item ${step.priority}`}>
                  <div className="step-priority">
                    {step.priority === 'high' && '🔥'}
                    {step.priority === 'medium' && '⭐'}
                    {step.priority === 'low' && '💡'}
                  </div>
                  <div className="step-content">
                    <h4>{step.action}</h4>
                    <p>{step.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phone Verification Modal */}
        {showPhoneModal && (
          <div className="modal-overlay" onClick={() => setShowPhoneModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📱 Phone Verification</h2>
                <button className="close-btn" onClick={() => setShowPhoneModal(false)}>×</button>
              </div>
              
              <div className="modal-content">
                {!isCodeSent ? (
                  <div className="phone-input-step">
                    <div className="step-info">
                      <h3>Enter your phone number</h3>
                      <p>We'll send you a 6-digit verification code</p>
                    </div>
                    {/* {console.log(currentUser)} */}
                    <div className="form-group">
                      <label>Phone Number (visit your profile to update)</label>
                      <input
                        type="tel"
                        // value={phoneNumber}
                        value={currentUser?.phone || phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+234 xxx xxx xxxx"
                        className="phone-input"
                      />
                    </div>
                    
                    <div className="verification-info">
                      <div className="info-item">
                        <span className="icon">🔐</span>
                        <span>Your number will be kept secure and private</span>
                      </div>
                      <div className="info-item">
                        <span className="icon">💬</span>
                        <span>We'll only use it for account verification</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="code-input-step">
                    <div className="step-info">
                      <h3>Enter verification code</h3>
                      <p>We sent a 6-digit code to {phoneNumber}</p>
                    </div>
                    
                    <div className="form-group">
                      <label>Verification Code</label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="code-input"
                        maxLength={6}
                      />
                    </div>
                    
                    <div className="resend-info">
                      <p>Didn't receive the code? 
                        <button className="resend-btn" onClick={handleRequestPhone}>
                          Resend Code
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button 
                  className="btn secondary" 
                  onClick={() => setShowPhoneModal(false)}
                >
                  Cancel
                </button>
                {!isCodeSent ? (
                  <button 
                    className="btn primary"
                    onClick={handleRequestPhone}
                    disabled={requestPhoneMutation.isLoading || !phoneNumber}
                  >
                    {requestPhoneMutation.isLoading ? 'Sending...' : 'Send Code'}
                  </button>
                ) : (
                  <button 
                    className="btn primary"
                    onClick={handleVerifyPhone}
                    disabled={verifyPhoneMutation.isLoading || verificationCode.length !== 6}
                  >
                    {verifyPhoneMutation.isLoading ? 'Verifying...' : 'Verify Phone'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ID Verification Modal */}
        {showIdModal && (
          <div className="modal-overlay" onClick={() => setShowIdModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>🆔 ID Verification</h2>
                <button className="close-btn" onClick={() => setShowIdModal(false)}>×</button>
              </div>
              
              <div className="modal-content">
                <div className="id-verification-info">
                  <div className="info-box">
                    <h4>📋 Requirements:</h4>
                    <ul>
                      <li>Government-issued ID (National ID, Driver's License, Passport)</li>
                      <li>Clear, high-quality photos</li>
                      <li>All text must be readable</li>
                      <li>Photos must show full document</li>
                    </ul>
                  </div>
                </div>

                <div className="form-group">
                  <label>ID Type</label>
                  <select
                    value={idForm.idType}
                    onChange={(e) => setIdForm(prev => ({ ...prev, idType: e.target.value }))}
                  >
                    <option value="">Select ID type</option>
                    <option value="national_id">National ID</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="passport">International Passport</option>
                    <option value="voters_card">Voter's Card</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>ID Number</label>
                  <input
                    type="text"
                    value={idForm.idNumber}
                    onChange={(e) => setIdForm(prev => ({ ...prev, idNumber: e.target.value }))}
                    placeholder="Enter your ID number"
                  />
                </div>

                <div className="image-upload-section">
                  <div className="upload-group">
                    <label>Front of ID</label>
                    <div className="upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('frontImage', e.target.files[0])}
                        className="file-input"
                        disabled={uploadingImage.frontImage}
                      />
                      {uploadingImage.frontImage ? (
                        <div className="upload-loading">
                          <PulseLoader color="#1dbf73" loading={true} size={10} />
                          <span>Uploading front image...</span>
                        </div>
                      ) : idForm.frontImage ? (
                        <div className="preview">
                          <img src={idForm.frontImage} alt="Front ID" />
                          <span className="success">✅ Front uploaded</span>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          📷 Click to upload front of ID
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="upload-group">
                    <label>Back of ID</label>
                    <div className="upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('backImage', e.target.files[0])}
                        className="file-input"
                        disabled={uploadingImage.backImage}
                      />
                      {uploadingImage.backImage ? (
                        <div className="upload-loading">
                          <PulseLoader color="#1dbf73" loading={true} size={10} />
                          <span>Uploading back image...</span>
                        </div>
                      ) : idForm.backImage ? (
                        <div className="preview">
                          <img src={idForm.backImage} alt="Back ID" />
                          <span className="success">✅ Back uploaded</span>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          📷 Click to upload back of ID
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="verification-notice">
                  <h4>🔐 Security Notice:</h4>
                  <p>Your ID information is encrypted and stored securely. It will only be used for verification purposes and will not be shared with third parties.</p>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn secondary" 
                  onClick={() => setShowIdModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn primary"
                  onClick={handleSubmitId}
                  disabled={
                    submitIdMutation.isLoading || 
                    uploadingImage.frontImage ||
                    uploadingImage.backImage ||
                    !idForm.idType || 
                    !idForm.idNumber || 
                    !idForm.frontImage || 
                    !idForm.backImage
                  }
                >
                  {submitIdMutation.isLoading ? 'Submitting...' : 
                   uploadingImage.frontImage || uploadingImage.backImage ? 'Uploading Images...' : 
                   'Submit for Review'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVerification;
