import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import ChangePasswordModal from "../../components/changePassword/ChangePasswordModal";
import { SettingsSkeleton } from "../../components/skeleton/Skeleton";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState({});
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();



  // Fetch settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: () => newRequest.get("/settings").then((res) => res.data),
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: (data) => {
      const endpoint = data.section ? `/settings/${data.section}` : "/settings";
      return newRequest.put(endpoint, data.values);
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries(["settings"]);
      queryClient.invalidateQueries(["user-settings"]); // For freelancer dashboard
      setUnsavedChanges(false);
      setLoading(false);
      // Show success message for bank details
      if (variables.section === "bankDetails") {
        alert("Bank details saved successfully!");
      }
    },
    onError: (err) => {
      console.error("Failed to update settings:", err);
      setLoading(false);
      // Show user-friendly error message
      const errorMessage = err.response?.data?.message || "Failed to save settings. Please try again.";
      alert(errorMessage);
    },
  });

  // Add skill mutation
  const addSkillMutation = useMutation({
    mutationFn: (skill) => newRequest.post("/settings/skills", { skill }),
    onSuccess: (data) => {
      setSkills(data.data);
      setNewSkill("");
      queryClient.invalidateQueries(["settings"]);
    },
  });

  // Remove skill mutation
  const removeSkillMutation = useMutation({
    mutationFn: (skill) => newRequest.delete("/settings/skills", { data: { skill } }),
    onSuccess: (data) => {
      setSkills(data.data);
      queryClient.invalidateQueries(["settings"]);
    },
  });



  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setSkills(settings.profile?.skills || []);
    }
  }, [settings]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section]?.[subsection],
          [field]: value
        }
      }
    }));
    setUnsavedChanges(true);
  };

  const handleSave = (section) => {
    setLoading(true);
    updateMutation.mutate({
      section,
      values: formData[section]
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      addSkillMutation.mutate(newSkill.trim());
    }
  };

  const handleRemoveSkill = (skill) => {
    removeSkillMutation.mutate(skill);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };



  const tabs = [
    { id: "account", label: "Account", icon: "⚙️" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "verification", label: "Verification", icon: "✅" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    ...(currentUser?.isSeller ? [
      { id: "seller", label: "Seller", icon: "💼" },
      { id: "banking", label: "Banking", icon: "🏦" }
    ] : [])
  ];

  if (isLoading) return <SettingsSkeleton />;
  if (error) return <div className="settings-error">Failed to load settings</div>;

  return (
    <div className="settings">
      <div className="container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="settings-content">
          {/* Sidebar Navigation */}
          <div className="settings-sidebar">
            <nav className="settings-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="icon">{tab.icon}</span>
                  <span className="label">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="settings-main">
            {/* Profile Tab */}
            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Account Preferences</h2>
                  <p>Manage your account settings and privacy</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Profile Visibility</label>
                    <select
                      value={formData.account?.profileVisibility || "public"}
                      onChange={(e) => handleInputChange("account", "profileVisibility", e.target.value)}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="toggle-group">
                    <div className="toggle-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.account?.emailNotifications || false}
                          onChange={(e) => handleInputChange("account", "emailNotifications", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        Email Notifications
                      </label>
                      <p>Receive important updates via email</p>
                    </div>

                    <div className="toggle-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.account?.marketingEmails || false}
                          onChange={(e) => handleInputChange("account", "marketingEmails", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        Marketing Emails
                      </label>
                      <p>Receive promotional offers and newsletters</p>
                    </div>

                    <div className="toggle-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.account?.onlineStatus || false}
                          onChange={(e) => handleInputChange("account", "onlineStatus", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        Show Online Status
                      </label>
                      <p>Let others see when you're online</p>
                    </div>
                  </div>
                </div>

                <div className="section-actions">
                  <button 
                    className="save-btn"
                    onClick={() => handleSave("account")}
                    disabled={loading || !unsavedChanges}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Security Settings</h2>
                  <p>Keep your account secure</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Session Timeout (minutes)</label>
                    <select
                      value={formData.security?.sessionTimeout || 30}
                      onChange={(e) => handleInputChange("security", "sessionTimeout", parseInt(e.target.value))}
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>

                  <div className="toggle-group">
                    <div className="toggle-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.account?.twoFactorAuth || false}
                          onChange={(e) => handleInputChange("account", "twoFactorAuth", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        Two-Factor Authentication
                      </label>
                      <p>Add an extra layer of security to your account</p>
                    </div>

                    <div className="toggle-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.security?.loginNotifications || false}
                          onChange={(e) => handleInputChange("security", "loginNotifications", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        Login Notifications
                      </label>
                      <p>Get notified of new login attempts</p>
                    </div>
                  </div>

                  <div className="security-info">
                    <div className="info-item">
                      <strong>Last Password Change:</strong>
                      <span>{formData.security?.lastPasswordChange ? new Date(formData.security.lastPasswordChange).toLocaleDateString() : "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="section-actions">
                  <button 
                    className="save-btn"
                    onClick={() => handleSave("security")}
                    disabled={loading || !unsavedChanges}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button 
                    className="change-password-btn"
                    onClick={() => setShowChangePasswordModal(true)}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {/* Verification Tab */}
            {activeTab === "verification" && (
              <div className="settings-section">
                <div className="verification-redirect">
                  <div className="redirect-card">
                    <div className="redirect-icon">🔐</div>
                    <div className="redirect-content">
                      <h2>Account Verification</h2>
                      <p>Complete your account verification to unlock premium features, increase transaction limits, and build trust with clients on Nairalancers.</p>
                      <button 
                        className="redirect-btn"
                        onClick={() => navigate('/verification')}
                      >
                        <span className="btn-text">Go to Verification Center</span>
                        <span className="btn-arrow">→</span>
                      </button>
                      
                      <div className="verification-benefits">
                        <div className="benefit-item">
                          <div className="benefit-icon">🔓</div>
                          <div className="benefit-text">
                            <h4>Higher Limits</h4>
                            <p>Increase your transaction and withdrawal limits</p>
                          </div>
                        </div>
                        <div className="benefit-item">
                          <div className="benefit-icon">⭐</div>
                          <div className="benefit-text">
                            <h4>Trust Badge</h4>
                            <p>Display verified status on your profile</p>
                          </div>
                        </div>
                        <div className="benefit-item">
                          <div className="benefit-icon">🚀</div>
                          <div className="benefit-text">
                            <h4>Priority Support</h4>
                            <p>Get faster response from customer service</p>
                          </div>
                        </div>
                        <div className="benefit-item">
                          <div className="benefit-icon">🛡️</div>
                          <div className="benefit-text">
                            <h4>Enhanced Security</h4>
                            <p>Better protection for your account and funds</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="quick-status">
                    <h3>Verification Status</h3>
                    <div className="status-items">
                      <div className={`status-item ${currentUser?.emailVerified ? 'verified' : 'unverified'}`}>
                        <span className="status-icon">{currentUser?.emailVerified ? '✅' : '❌'}</span>
                        <span className="status-text">Email {currentUser?.emailVerified ? 'Verified' : 'Unverified'}</span>
                      </div>
                      <div className={`status-item ${currentUser?.phoneVerified ? 'verified' : 'unverified'}`}>
                        <span className="status-icon">{currentUser?.phoneVerified ? '✅' : '❌'}</span>
                        <span className="status-text">Phone {currentUser?.phoneVerified ? 'Verified' : 'Unverified'}</span>
                      </div>
                      <div className={`status-item ${currentUser?.idVerification?.status === 'approved' ? 'verified' : 'unverified'}`}>
                        <span className="status-icon">
                          {currentUser?.idVerification?.status === 'approved' ? '✅' : 
                           currentUser?.idVerification?.status === 'pending' && currentUser?.idVerification?.submittedAt ? '⏳' : '❌'}
                        </span>
                        <span className="status-text">
                          ID {currentUser?.idVerification?.status === 'approved' ? 'Verified' : 
                              currentUser?.idVerification?.status === 'pending' && currentUser?.idVerification?.submittedAt ? 'Under Review' : 'Unverified'}
                        </span>
                      </div>
                    </div>

                    <div className="verification-progress">
                      <div className="progress-header">
                        <h4>Verification Progress</h4>
                        <span className="progress-percentage">
                          {Math.round(
                            ((currentUser?.emailVerified ? 1 : 0) + 
                             (currentUser?.phoneVerified ? 1 : 0) + 
                             (currentUser?.idVerification?.status === 'approved' ? 1 : 0)) / 3 * 100
                          )}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{
                            width: `${((currentUser?.emailVerified ? 1 : 0) + 
                                      (currentUser?.phoneVerified ? 1 : 0) + 
                                      (currentUser?.idVerification?.status === 'approved' ? 1 : 0)) / 3 * 100}%`
                          }}
                        ></div>
                      </div>
                      <p className="progress-text">
                        {((currentUser?.emailVerified ? 1 : 0) + 
                          (currentUser?.phoneVerified ? 1 : 0) + 
                          (currentUser?.idVerification?.status === 'approved' ? 1 : 0)) === 3 
                          ? "Congratulations! Your account is fully verified." 
                          : `Complete ${3 - ((currentUser?.emailVerified ? 1 : 0) + 
                                          (currentUser?.phoneVerified ? 1 : 0) + 
                                          (currentUser?.idVerification?.status === 'approved' ? 1 : 0))} more verification${
                                          3 - ((currentUser?.emailVerified ? 1 : 0) + 
                                               (currentUser?.phoneVerified ? 1 : 0) + 
                                               (currentUser?.idVerification?.status === 'approved' ? 1 : 0)) !== 1 ? 's' : ''
                                        } to unlock all benefits.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Notification Preferences</h2>
                  <p>Choose what notifications you want to receive</p>
                </div>

                <div className="notification-groups">
                  <div className="notification-group">
                    <h3>Order & Business</h3>
                    <div className="toggle-group">
                      <div className="toggle-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.notifications?.orderUpdates || false}
                            onChange={(e) => handleInputChange("notifications", "orderUpdates", e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                          Order Updates
                        </label>
                        <p>Get notified about order status changes</p>
                      </div>

                      <div className="toggle-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.notifications?.reviewNotifications || false}
                            onChange={(e) => handleInputChange("notifications", "reviewNotifications", e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                          Review Notifications
                        </label>
                        <p>Be notified when you receive new reviews</p>
                      </div>
                    </div>
                  </div>

                  <div className="notification-group">
                    <h3>Communication</h3>
                    <div className="toggle-group">
                      <div className="toggle-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.notifications?.messageNotifications || false}
                            onChange={(e) => handleInputChange("notifications", "messageNotifications", e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                          Message Notifications
                        </label>
                        <p>Get notified of new messages</p>
                      </div>
                    </div>
                  </div>

                  <div className="notification-group">
                    <h3>Marketing & Updates</h3>
                    <div className="toggle-group">
                      <div className="toggle-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.notifications?.promotionalOffers || false}
                            onChange={(e) => handleInputChange("notifications", "promotionalOffers", e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                          Promotional Offers
                        </label>
                        <p>Receive special offers and discounts</p>
                      </div>

                      <div className="toggle-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.notifications?.weeklyDigest || false}
                            onChange={(e) => handleInputChange("notifications", "weeklyDigest", e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                          Weekly Digest
                        </label>
                        <p>Get a weekly summary of your activity</p>
                      </div>
                    </div>
                  </div>

                  <div className="notification-group">
                    <h3>Push Notifications</h3>
                    <div className="toggle-group">
                      <div className="toggle-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.notifications?.push?.enabled || false}
                            onChange={(e) => handleNestedInputChange("notifications", "push", "enabled", e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                          Enable Push Notifications
                        </label>
                        <p>Receive push notifications on your device</p>
                      </div>

                      {formData.notifications?.push?.enabled && (
                        <>
                          <div className="toggle-item sub-toggle">
                            <label>
                              <input
                                type="checkbox"
                                checked={formData.notifications?.push?.orders || false}
                                onChange={(e) => handleNestedInputChange("notifications", "push", "orders", e.target.checked)}
                              />
                              <span className="toggle-slider"></span>
                              Order Push Notifications
                            </label>
                          </div>

                          <div className="toggle-item sub-toggle">
                            <label>
                              <input
                                type="checkbox"
                                checked={formData.notifications?.push?.messages || false}
                                onChange={(e) => handleNestedInputChange("notifications", "push", "messages", e.target.checked)}
                              />
                              <span className="toggle-slider"></span>
                              Message Push Notifications
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="section-actions">
                  <button 
                    className="save-btn"
                    onClick={() => handleSave("notifications")}
                    disabled={loading || !unsavedChanges}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* Seller Tab */}
            {activeTab === "seller" && currentUser?.isSeller && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Seller Settings</h2>
                  <p>Manage your seller preferences and business settings</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Response Time</label>
                    <select
                      value={formData.seller?.responseTime || "within_24_hours"}
                      onChange={(e) => handleInputChange("seller", "responseTime", e.target.value)}
                    >
                      <option value="within_1_hour">Within 1 hour</option>
                      <option value="within_6_hours">Within 6 hours</option>
                      <option value="within_24_hours">Within 24 hours</option>
                    </select>
                  </div>

                  <div className="toggle-group">
                    <div className="toggle-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.seller?.autoAcceptOrders || false}
                          onChange={(e) => handleInputChange("seller", "autoAcceptOrders", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        Auto-Accept Orders
                      </label>
                      <p>Automatically accept new orders</p>
                    </div>

                    <div className="toggle-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.seller?.vacationMode?.enabled || false}
                          onChange={(e) => handleNestedInputChange("seller", "vacationMode", "enabled", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        Vacation Mode
                      </label>
                      <p>Temporarily pause your gigs</p>
                    </div>
                  </div>

                  {formData.seller?.vacationMode?.enabled && (
                    <div className="vacation-settings">
                      <div className="form-group">
                        <label>Vacation Message</label>
                        <textarea
                          value={formData.seller?.vacationMode?.message || ""}
                          onChange={(e) => handleNestedInputChange("seller", "vacationMode", "message", e.target.value)}
                          placeholder="Let buyers know when you'll be back..."
                          rows="3"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Start Date</label>
                          <input
                            type="date"
                            value={formData.seller?.vacationMode?.startDate ? new Date(formData.seller.vacationMode.startDate).toISOString().split('T')[0] : ""}
                            onChange={(e) => handleNestedInputChange("seller", "vacationMode", "startDate", e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>End Date</label>
                          <input
                            type="date"
                            value={formData.seller?.vacationMode?.endDate ? new Date(formData.seller.vacationMode.endDate).toISOString().split('T')[0] : ""}
                            onChange={(e) => handleNestedInputChange("seller", "vacationMode", "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="section-actions">
                  <button 
                    className="save-btn"
                    onClick={() => handleSave("seller")}
                    disabled={loading || !unsavedChanges}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* Banking Tab - For Freelancers */}
            {activeTab === "banking" && currentUser?.isSeller && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Banking Information</h2>
                  <p>Save your bank details for easy withdrawals</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      value={formData.bankDetails?.accountNumber || ""}
                      onChange={(e) => handleInputChange("bankDetails", "accountNumber", e.target.value)}
                      placeholder="Enter your 10-digit account number"
                      maxLength="10"
                      pattern="[0-9]{10}"
                    />
                    <small>Must be a 10-digit Nigerian bank account number</small>
                  </div>

                  <div className="form-group">
                    <label>Bank Name</label>
                    <select
                      value={formData.bankDetails?.bankName || ""}
                      onChange={(e) => handleInputChange("bankDetails", "bankName", e.target.value)}
                    >
                      <option value="">Select your bank</option>
                      <option value="Access Bank">Access Bank</option>
                      <option value="GTBank">Guaranty Trust Bank (GTBank)</option>
                      <option value="First Bank">First Bank of Nigeria</option>
                      <option value="UBA">United Bank for Africa (UBA)</option>
                      <option value="Zenith Bank">Zenith Bank</option>
                      <option value="Fidelity Bank">Fidelity Bank</option>
                      <option value="FCMB">First City Monument Bank (FCMB)</option>
                      <option value="Sterling Bank">Sterling Bank</option>
                      <option value="Union Bank">Union Bank</option>
                      <option value="Keystone Bank">Keystone Bank</option>
                      <option value="Wema Bank">Wema Bank</option>
                      <option value="Polaris Bank">Polaris Bank</option>
                      <option value="Stanbic IBTC">Stanbic IBTC Bank</option>
                      <option value="Ecobank">Ecobank Nigeria</option>
                      <option value="Heritage Bank">Heritage Bank</option>
                      <option value="Standard Chartered">Standard Chartered Bank</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Account Name</label>
                    <input
                      type="text"
                      value={formData.bankDetails?.accountName || ""}
                      onChange={(e) => handleInputChange("bankDetails", "accountName", e.target.value)}
                      placeholder="Enter the account holder's name"
                    />
                    <small>Must match the name on your bank account</small>
                  </div>
                </div>

                <div className="banking-info">
                  <div className="info-box">
                    <h4>💡 Why save your bank details?</h4>
                    <ul>
                      <li>Quick and easy withdrawals without re-entering details</li>
                      <li>Secure storage with encryption</li>
                      <li>Used automatically for future withdrawal requests</li>
                      <li>You can still provide different details if needed</li>
                    </ul>
                  </div>
                </div>

                <div className="section-actions">
                  <button 
                    className="save-btn"
                    onClick={() => handleSave("bankDetails")} 
                    disabled={loading || !unsavedChanges}
                  >
                    {loading ? "Saving..." : "Save Bank Details"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />


    </div>
  );
};

export default Settings;
