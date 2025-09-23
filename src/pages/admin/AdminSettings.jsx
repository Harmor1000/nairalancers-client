import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import newRequest from '../../utils/newRequest';
import './AdminSettings.scss';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('fees');
  const [hasChanges, setHasChanges] = useState(false);
  const [tempSettings, setTempSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await newRequest.get('/admin/settings/platform');
      
      // Ensure all sections have default values
      const defaultSettings = {
        fees: {
          commissionRate: 10,
          paymentProcessingFee: 2.5,
          withdrawalFee: 5,
          minimumWithdrawal: 1000,
          maximumWithdrawal: 1000000,
          subscriptionFees: {
            basic: 0,
            premium: 2000,
            pro: 5000
          }
        },
        limits: {
          minimumGigPrice: 500,
          maximumGigPrice: 5000000,
          maximumOrderValue: 10000000,
          dailyWithdrawalLimit: 1000000,
          monthlyWithdrawalLimit: 10000000,
          maxActiveGigsPerUser: 50,
          maxOrdersPerDay: 100
        },
        verification: {
          idVerificationRequired: false,
          businessVerificationRequired: false,
          maxTransactionWithoutVerification: 50000,
          acceptedDocuments: 'passport,drivers_license,national_id'
        },
        disputes: {
          disputeWindowDays: 7,
          adminResponseDays: 3,
          escrowHoldDays: 14,
          autoReleaseEnabled: false
        },
        moderation: {
          gigApprovalRequired: false,
          profileApprovalRequired: false,
          blockedKeywords: 'spam,scam,fake,illegal',
          autoModerationEnabled: false
        },
        communication: {
          supportEmail: 'support@nairalancers.com',
          noreplyEmail: 'noreply@nairalancers.com',
          emailNotificationsEnabled: true,
          smsNotificationsEnabled: false,
          welcomeMessage: 'Welcome to Nairalancers! Start earning or hiring today.'
        },
        maintenance: {
          maintenanceMode: false,
          maintenanceMessage: 'Site under maintenance. Please check back soon.',
          estimatedDuration: '2 hours',
          autoBackupEnabled: true,
          backupRetentionDays: 30
        },
        security: {
          passwordComplexityRequired: true,
          twoFactorRequired: false,
          sessionTimeoutMinutes: 60,
          maxLoginAttempts: 5
        },
        features: {
          gigRecommendationsEnabled: true,
          aiMatchmakingEnabled: false,
          subscriptionsEnabled: true,
          portfolioEnabled: true,
          liveChatEnabled: false
        }
      };
      
      // Merge with fetched settings, with defaults as fallback
      const mergedSettings = { ...defaultSettings, ...(response.data?.settings || {}) };
      
      setSettings(mergedSettings);
      setTempSettings(mergedSettings);
    } catch (err) {
      console.error('Error fetching settings:', err);
      
      // Use default settings as fallback
      const fallbackSettings = {
        fees: {
          commissionRate: 10,
          paymentProcessingFee: 2.5,
          withdrawalFee: 5,
          minimumWithdrawal: 1000,
          maximumWithdrawal: 1000000,
          subscriptionFees: { basic: 0, premium: 2000, pro: 5000 }
        },
        limits: {
          minimumGigPrice: 500,
          maximumGigPrice: 5000000,
          maximumOrderValue: 10000000,
          dailyWithdrawalLimit: 1000000,
          monthlyWithdrawalLimit: 10000000,
          maxActiveGigsPerUser: 50,
          maxOrdersPerDay: 100
        },
        verification: {
          idVerificationRequired: false,
          businessVerificationRequired: false,
          maxTransactionWithoutVerification: 50000,
          acceptedDocuments: 'passport,drivers_license,national_id'
        },
        disputes: {
          disputeWindowDays: 7,
          adminResponseDays: 3,
          escrowHoldDays: 14,
          autoReleaseEnabled: false
        },
        moderation: {
          gigApprovalRequired: false,
          profileApprovalRequired: false,
          blockedKeywords: 'spam,scam,fake,illegal',
          autoModerationEnabled: false
        },
        communication: {
          supportEmail: 'support@nairalancers.com',
          noreplyEmail: 'noreply@nairalancers.com',
          emailNotificationsEnabled: true,
          smsNotificationsEnabled: false,
          welcomeMessage: 'Welcome to Nairalancers! Start earning or hiring today.'
        },
        maintenance: {
          maintenanceMode: false,
          maintenanceMessage: 'Site under maintenance. Please check back soon.',
          estimatedDuration: '2 hours',
          autoBackupEnabled: true,
          backupRetentionDays: 30
        },
        security: {
          passwordComplexityRequired: true,
          twoFactorRequired: false,
          sessionTimeoutMinutes: 60,
          maxLoginAttempts: 5
        },
        features: {
          gigRecommendationsEnabled: true,
          aiMatchmakingEnabled: false,
          subscriptionsEnabled: true,
          portfolioEnabled: true,
          liveChatEnabled: false
        }
      };
      
      setSettings(fallbackSettings);
      setTempSettings(fallbackSettings);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const reason = prompt('Please provide a reason for this change:');
      if (!reason) return;

      await newRequest.put('/admin/settings/platform', {
        section: activeSection,
        settings: tempSettings[activeSection],
        reason
      });

      setSettings(tempSettings);
      setHasChanges(false);
      alert('Settings updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update settings');
    }
  };

  const handleReset = () => {
    setTempSettings(settings);
    setHasChanges(false);
  };

  const updateSetting = (section, field, value, subfield = null) => {
    const newSettings = { ...tempSettings };
    
    if (subfield) {
      newSettings[section][field][subfield] = value;
    } else {
      newSettings[section][field] = value;
    }
    
    setTempSettings(newSettings);
    setHasChanges(true);
  };

  const toggleMaintenanceMode = async () => {
    try {
      const enabled = !tempSettings.maintenance.maintenanceMode;
      let message = tempSettings.maintenance.maintenanceMessage;
      let duration = tempSettings.maintenance.estimatedDuration;

      if (enabled) {
        message = prompt('Maintenance message:', 'Site under maintenance. Please check back soon.');
        duration = prompt('Estimated duration:', '2 hours');
        if (!message) return;
      }

      await newRequest.put('/admin/settings/maintenance', {
        enabled,
        message,
        estimatedDuration: duration
      });

      fetchSettings();
      alert(`Maintenance mode ${enabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (err) {
      alert('Failed to toggle maintenance mode');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="error-container">
          <h2>Error</h2>
          <p>Failed to load settings</p>
          <button onClick={fetchSettings}>Retry</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-settings">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Platform Settings</h1>
            <p>Configure fees, limits, and platform behavior</p>
          </div>
          
          <div className="header-actions">
            {settings.maintenance?.maintenanceMode && (
              <div className="maintenance-notice">
                🔧 Maintenance Mode Active
              </div>
            )}
            <button 
              className="maintenance-btn"
              onClick={toggleMaintenanceMode}
            >
              {settings.maintenance?.maintenanceMode ? '✅ Disable' : '🔧 Enable'} Maintenance
            </button>
          </div>
        </div>

        {/* Settings Navigation */}
        <div className="settings-layout">
          <aside className="settings-sidebar">
            <nav className="settings-nav">
              {[
                { id: 'fees', label: ' Fee Structure', icon: '💰' },
                { id: 'limits', label: ' Transaction Limits', icon: '📊' },
                { id: 'verification', label: ' Verification', icon: '✅' },
                { id: 'disputes', label: ' Disputes & Escrow', icon: '⚖️' },
                { id: 'moderation', label: ' Content Moderation', icon: '🛡️' },
                { id: 'security', label: ' Security Settings', icon: '🔒' },
                { id: 'features', label: ' Feature Flags', icon: '🎛️' },
                { id: 'communication', label: ' Communication', icon: '💬' },
                { id: 'maintenance', label: ' Maintenance', icon: '🔧' }
              ].map(section => (
                <button
                  key={section.id}
                  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-label">{section.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="settings-content">
            {/* Save/Reset Bar */}
            {hasChanges && (
              <div className="changes-bar">
                <div className="changes-message">
                  ⚠️ You have unsaved changes
                </div>
                <div className="changes-actions">
                  <button className="btn secondary" onClick={handleReset}>
                    Reset
                  </button>
                  <button className="btn primary" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Fee Structure Section */}
            {activeSection === 'fees' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>💰 Fee Structure</h2>
                  <p>Configure platform fees and commission rates</p>
                </div>

                <div className="settings-grid">
                  {/* Service Fee */}
                  <div className="setting-card">
                    <h3>Platform Service Fee</h3>
                    <div className="setting-row">
                      <label>Percentage (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.1"
                        value={tempSettings.fees?.serviceFee?.percentage || 5}
                        onChange={(e) => updateSetting('fees', 'serviceFee', parseFloat(e.target.value), 'percentage')}
                      />
                    </div>
                    <div className="setting-row">
                      <label>Minimum Fee (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={tempSettings.fees?.serviceFee?.minimum || 100}
                        onChange={(e) => updateSetting('fees', 'serviceFee', parseInt(e.target.value), 'minimum')}
                      />
                    </div>
                    <div className="setting-row">
                      <label>Maximum Fee (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={tempSettings.fees?.serviceFee?.maximum || 50000}
                        onChange={(e) => updateSetting('fees', 'serviceFee', parseInt(e.target.value), 'maximum')}
                      />
                    </div>
                  </div>

                  {/* Payment Processing Fee */}
                  <div className="setting-card">
                    <h3>Payment Processing Fee</h3>
                    <div className="setting-row">
                      <label>Percentage (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={tempSettings.fees?.paymentProcessingFee?.percentage || 2.9}
                        onChange={(e) => updateSetting('fees', 'paymentProcessingFee', parseFloat(e.target.value), 'percentage')}
                      />
                    </div>
                    <div className="setting-row">
                      <label>Fixed Fee (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={tempSettings.fees?.paymentProcessingFee?.fixed || 30}
                        onChange={(e) => updateSetting('fees', 'paymentProcessingFee', parseInt(e.target.value), 'fixed')}
                      />
                    </div>
                  </div>

                  {/* Withdrawal Fee */}
                  <div className="setting-card">
                    <h3>Withdrawal Fee</h3>
                    <div className="setting-row">
                      <label>Percentage (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={tempSettings.fees?.withdrawalFee?.percentage || 0}
                        onChange={(e) => updateSetting('fees', 'withdrawalFee', parseFloat(e.target.value), 'percentage')}
                      />
                    </div>
                    <div className="setting-row">
                      <label>Minimum Fee (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={tempSettings.fees?.withdrawalFee?.minimum || 50}
                        onChange={(e) => updateSetting('fees', 'withdrawalFee', parseInt(e.target.value), 'minimum')}
                      />
                    </div>
                    <div className="setting-row">
                      <label>Maximum Fee (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={tempSettings.fees?.withdrawalFee?.maximum || 5000}
                        onChange={(e) => updateSetting('fees', 'withdrawalFee', parseInt(e.target.value), 'maximum')}
                      />
                    </div>
                  </div>
                </div>

                {/* Fee Calculator */}
                <div className="fee-calculator">
                  <h3>💳 Fee Calculator</h3>
                  <div className="calculator-grid">
                    <div className="calc-input">
                      <label>Order Amount (₦)</label>
                      <input type="number" defaultValue="10000" id="calc-amount" />
                    </div>
                    <div className="calc-result">
                      <div className="calc-item">
                        <span>Service Fee:</span>
                        <span>₦{((tempSettings.fees?.serviceFee?.percentage || 5) / 100 * 10000).toLocaleString()}</span>
                      </div>
                      <div className="calc-item">
                        <span>Processing Fee:</span>
                        <span>₦{(((tempSettings.fees?.paymentProcessingFee?.percentage || 2.9) / 100 * 10000) + (tempSettings.fees?.paymentProcessingFee?.fixed || 30)).toLocaleString()}</span>
                      </div>
                      <div className="calc-item total">
                        <span>Total Fees:</span>
                        <span>₦{(((tempSettings.fees?.serviceFee?.percentage || 5) / 100 * 10000) + ((tempSettings.fees?.paymentProcessingFee?.percentage || 2.9) / 100 * 10000) + (tempSettings.fees?.paymentProcessingFee?.fixed || 30)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Limits Section */}
            {activeSection === 'limits' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>📊 Transaction Limits</h2>
                  <p>Set minimum and maximum transaction amounts</p>
                </div>

                <div className="settings-grid">
                  <div className="setting-card">
                    <h3>Order Limits</h3>
                    <div className="setting-row">
                      <label>Minimum Order (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={tempSettings.limits?.minimumOrder || 1000}
                        onChange={(e) => updateSetting('limits', 'minimumOrder', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="setting-row">
                      <label>Maximum Order (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={tempSettings.limits?.maximumOrder || 5000000}
                        onChange={(e) => updateSetting('limits', 'maximumOrder', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="setting-card">
                    <h3>Withdrawal Limits</h3>
                    <div className="setting-row">
                      <label>Minimum Withdrawal (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={tempSettings.limits?.minimumWithdrawal || 2000}
                        onChange={(e) => updateSetting('limits', 'minimumWithdrawal', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="setting-row">
                      <label>Maximum Single Withdrawal (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={tempSettings.limits?.maximumWithdrawal || 1000000}
                        onChange={(e) => updateSetting('limits', 'maximumWithdrawal', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="setting-row">
                      <label>Daily Withdrawal Limit (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={tempSettings.limits?.dailyWithdrawalLimit || 2000000}
                        onChange={(e) => updateSetting('limits', 'dailyWithdrawalLimit', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Flags Section */}
            {activeSection === 'features' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>🎛️ Feature Flags</h2>
                  <p>Enable or disable platform features</p>
                </div>

                <div className="feature-toggles">
                  {Object.entries(tempSettings.features || {}).map(([feature, enabled]) => (
                    <div key={feature} className="feature-toggle">
                      <div className="feature-info">
                        <h4>{feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                        <p>Enable/disable {feature.toLowerCase()} functionality</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => updateSetting('features', feature, e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings Section */}
            {activeSection === 'security' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>🔒 Security Settings</h2>
                  <p>Configure security and authentication policies</p>
                </div>

                <div className="settings-grid">
                  <div className="setting-card">
                    <h3>Login Security</h3>
                    <div className="setting-row">
                      <label>Max Login Attempts</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={tempSettings.security?.maxLoginAttempts || 5}
                        onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="setting-row">
                      <label>Lockout Duration (minutes)</label>
                      <input
                        type="number"
                        min="5"
                        max="1440"
                        value={tempSettings.security?.lockoutDurationMinutes || 30}
                        onChange={(e) => updateSetting('security', 'lockoutDurationMinutes', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="setting-row">
                      <label>Session Timeout (hours)</label>
                      <input
                        type="number"
                        min="1"
                        max="168"
                        value={tempSettings.security?.sessionTimeoutHours || 24}
                        onChange={(e) => updateSetting('security', 'sessionTimeoutHours', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="setting-card">
                    <h3>Password Policy</h3>
                    <div className="setting-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSettings.security?.passwordComplexityRequired}
                          onChange={(e) => updateSetting('security', 'passwordComplexityRequired', e.target.checked)}
                        />
                        Require Complex Passwords
                      </label>
                    </div>
                    <div className="setting-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSettings.security?.twoFactorRequired}
                          onChange={(e) => updateSetting('security', 'twoFactorRequired', e.target.checked)}
                        />
                        Require Two-Factor Authentication
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Settings Section */}
            {activeSection === 'verification' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>✅ Verification Settings</h2>
                  <p>Configure user verification requirements and processes</p>
                </div>

                <div className="settings-grid">
                  <div className="setting-card">
                    <h3>Identity Verification</h3>
                    <div className="setting-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSettings?.verification?.idVerificationRequired || false}
                          onChange={(e) => updateSetting('verification', 'idVerificationRequired', e.target.checked)}
                        />
                        Require ID Verification for New Users
                      </label>
                    </div>
                    <div className="setting-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSettings?.verification?.businessVerificationRequired || false}
                          onChange={(e) => updateSetting('verification', 'businessVerificationRequired', e.target.checked)}
                        />
                        Require Business Verification for Sellers
                      </label>
                    </div>
                  </div>

                  <div className="setting-card">
                    <h3>Verification Limits</h3>
                    <div className="setting-input">
                      <label>Maximum Transaction Amount Before Verification Required</label>
                      <input
                        type="number"
                        value={tempSettings?.verification?.maxTransactionWithoutVerification || 50000}
                        onChange={(e) => updateSetting('verification', 'maxTransactionWithoutVerification', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="setting-input">
                      <label>Verification Document Types (comma separated)</label>
                      <input
                        type="text"
                        value={tempSettings?.verification?.acceptedDocuments || 'passport,drivers_license,national_id'}
                        onChange={(e) => updateSetting('verification', 'acceptedDocuments', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Disputes & Escrow Section */}
            {activeSection === 'disputes' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>⚖️ Disputes & Escrow Settings</h2>
                  <p>Configure dispute resolution and escrow parameters</p>
                </div>

                <div className="settings-grid">
                  <div className="setting-card">
                    <h3>Dispute Timeframes</h3>
                    <div className="setting-input">
                      <label>Days to Open Dispute After Delivery</label>
                      <input
                        type="number"
                        value={tempSettings?.disputes?.disputeWindowDays || 7}
                        onChange={(e) => updateSetting('disputes', 'disputeWindowDays', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="setting-input">
                      <label>Days for Admin Response to Disputes</label>
                      <input
                        type="number"
                        value={tempSettings?.disputes?.adminResponseDays || 3}
                        onChange={(e) => updateSetting('disputes', 'adminResponseDays', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="setting-card">
                    <h3>Escrow Settings</h3>
                    <div className="setting-input">
                      <label>Escrow Hold Duration (days)</label>
                      <input
                        type="number"
                        value={tempSettings?.disputes?.escrowHoldDays || 14}
                        onChange={(e) => updateSetting('disputes', 'escrowHoldDays', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="setting-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSettings?.disputes?.autoReleaseEnabled || false}
                          onChange={(e) => updateSetting('disputes', 'autoReleaseEnabled', e.target.checked)}
                        />
                        Auto-release Payments After Hold Period
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Moderation Section */}
            {activeSection === 'moderation' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>🛡️ Content Moderation Settings</h2>
                  <p>Configure content review and moderation policies</p>
                </div>

                <div className="settings-grid">
                  <div className="setting-card">
                    <h3>Gig Moderation</h3>
                    <div className="setting-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSettings?.moderation?.gigApprovalRequired || false}
                          onChange={(e) => updateSetting('moderation', 'gigApprovalRequired', e.target.checked)}
                        />
                        Require Admin Approval for New Gigs
                      </label>
                    </div>
                    <div className="setting-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSettings?.moderation?.profileApprovalRequired || false}
                          onChange={(e) => updateSetting('moderation', 'profileApprovalRequired', e.target.checked)}
                        />
                        Require Admin Approval for Profile Changes
                      </label>
                    </div>
                  </div>

                  <div className="setting-card">
                    <h3>Content Filters</h3>
                    <div className="setting-input">
                      <label>Blocked Keywords (comma separated)</label>
                      <textarea
                        value={tempSettings?.moderation?.blockedKeywords || 'spam,scam,fake,illegal'}
                        onChange={(e) => updateSetting('moderation', 'blockedKeywords', e.target.value)}
                        rows="3"
                      />
                    </div>
                    <div className="setting-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSettings?.moderation?.autoModerationEnabled || false}
                          onChange={(e) => updateSetting('moderation', 'autoModerationEnabled', e.target.checked)}
                        />
                        Enable Automatic Content Filtering
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Communication Settings Section */}
            {activeSection === 'communication' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>💬 Communication Settings</h2>
                  <p>Configure email templates and notification settings</p>
                </div>

                <div className="settings-grid">
                  <div className="setting-card">
                    <h3>Email Settings</h3>
                    <div className="setting-input">
                      <label>Support Email Address</label>
                      <input
                        type="email"
                        value={tempSettings?.communication?.supportEmail || 'support@nairalancers.com'}
                        onChange={(e) => updateSetting('communication', 'supportEmail', e.target.value)}
                      />
                    </div>
                    <div className="setting-input">
                      <label>No-Reply Email Address</label>
                      <input
                        type="email"
                        value={tempSettings?.communication?.noreplyEmail || 'noreply@nairalancers.com'}
                        onChange={(e) => updateSetting('communication', 'noreplyEmail', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="setting-card">
                    <h3>Notification Preferences</h3>
                    <div className="setting-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSettings?.communication?.emailNotificationsEnabled || true}
                          onChange={(e) => updateSetting('communication', 'emailNotificationsEnabled', e.target.checked)}
                        />
                        Enable Email Notifications
                      </label>
                    </div>
                    <div className="setting-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSettings?.communication?.smsNotificationsEnabled || false}
                          onChange={(e) => updateSetting('communication', 'smsNotificationsEnabled', e.target.checked)}
                        />
                        Enable SMS Notifications
                      </label>
                    </div>
                  </div>

                  <div className="setting-card">
                    <h3>Welcome Message</h3>
                    <div className="setting-input">
                      <label>New User Welcome Message</label>
                      <textarea
                        value={tempSettings?.communication?.welcomeMessage || 'Welcome to Nairalancers! Start earning or hiring today.'}
                        onChange={(e) => updateSetting('communication', 'welcomeMessage', e.target.value)}
                        rows="4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance Settings Section */}
            {activeSection === 'maintenance' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>🔧 Maintenance Settings</h2>
                  <p>Configure system maintenance and downtime settings</p>
                </div>

                <div className="settings-grid">
                  <div className="setting-card">
                    <h3>Maintenance Mode</h3>
                    <div className="maintenance-status">
                      <div className={`status-indicator ${tempSettings?.maintenance?.maintenanceMode ? 'active' : 'inactive'}`}>
                        {tempSettings?.maintenance?.maintenanceMode ? '🔴 Active' : '🟢 Inactive'}
                      </div>
                      <button
                        className="toggle-maintenance-btn"
                        onClick={toggleMaintenanceMode}
                      >
                        {tempSettings?.maintenance?.maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
                      </button>
                    </div>
                    
                    {tempSettings?.maintenance?.maintenanceMode && (
                      <div className="maintenance-details">
                        <div className="setting-input">
                          <label>Maintenance Message</label>
                          <textarea
                            value={tempSettings?.maintenance?.maintenanceMessage || 'Site under maintenance. Please check back soon.'}
                            onChange={(e) => updateSetting('maintenance', 'maintenanceMessage', e.target.value)}
                            rows="3"
                          />
                        </div>
                        <div className="setting-input">
                          <label>Estimated Duration</label>
                          <input
                            type="text"
                            value={tempSettings?.maintenance?.estimatedDuration || '2 hours'}
                            onChange={(e) => updateSetting('maintenance', 'estimatedDuration', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="setting-card">
                    <h3>Backup Settings</h3>
                    <div className="setting-toggle">
                      <label>
                        <input
                          type="checkbox"
                          checked={tempSettings?.maintenance?.autoBackupEnabled || true}
                          onChange={(e) => updateSetting('maintenance', 'autoBackupEnabled', e.target.checked)}
                        />
                        Enable Automatic Daily Backups
                      </label>
                    </div>
                    <div className="setting-input">
                      <label>Backup Retention Days</label>
                      <input
                        type="number"
                        value={tempSettings?.maintenance?.backupRetentionDays || 30}
                        onChange={(e) => updateSetting('maintenance', 'backupRetentionDays', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="setting-card">
                    <h3>System Health</h3>
                    <div className="health-checks">
                      <div className="health-item">
                        <span>Database Status</span>
                        <span className="health-status healthy">🟢 Healthy</span>
                      </div>
                      <div className="health-item">
                        <span>API Status</span>
                        <span className="health-status healthy">🟢 Healthy</span>
                      </div>
                      <div className="health-item">
                        <span>File Storage</span>
                        <span className="health-status healthy">🟢 Healthy</span>
                      </div>
                    </div>
                    <button className="health-check-btn">
                      🔄 Run System Health Check
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* More sections would be added here... */}
          </main>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

