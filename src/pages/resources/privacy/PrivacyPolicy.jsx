import React from 'react';
import { Link } from 'react-router-dom';
import './PrivacyPolicy.scss';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <div className="container">
        <div className="header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="content">
          <section className="intro">
            <p>
              At Nairalancers, we take your privacy seriously. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our platform. 
              By using our services, you consent to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2>1. Information We Collect</h2>
            
            <h3>1.1 Personal Information</h3>
            <p>When you create an account or use our services, we may collect:</p>
            <ul>
              <li>Name and contact information (email, phone number)</li>
              <li>Profile information (bio, skills, education, portfolio)</li>
              <li>Professional details (work history, certifications)</li>
              <li>Payment information (billing address, payment methods)</li>
              <li>Identity verification documents (when required)</li>
              <li>Communication preferences</li>
            </ul>

            <h3>1.2 Automatically Collected Information</h3>
            <p>We automatically collect certain information when you use our platform:</p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, clickstream data)</li>
              <li>Log files and cookies</li>
              <li>Location data (general geographic area)</li>
              <li>Performance and analytics data</li>
            </ul>

            <h3>1.3 Information from Third Parties</h3>
            <ul>
              <li>Social media platforms (when you connect your accounts)</li>
              <li>Payment processors</li>
              <li>Background check providers (when applicable)</li>
              <li>Marketing partners</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>

            <h3>2.1 Service Provision</h3>
            <ul>
              <li>Creating and managing your account</li>
              <li>Facilitating connections between clients and freelancers</li>
              <li>Processing payments and transactions</li>
              <li>Providing customer support</li>
              <li>Enabling communication between users</li>
            </ul>

            <h3>2.2 Platform Improvement</h3>
            <ul>
              <li>Analyzing usage patterns to improve our services</li>
              <li>Developing new features and functionality</li>
              <li>Personalizing your experience</li>
              <li>Conducting research and analytics</li>
            </ul>

            <h3>2.3 Safety and Security</h3>
            <ul>
              <li>Preventing fraud and abuse</li>
              <li>Verifying user identities</li>
              <li>Enforcing our Terms of Service</li>
              <li>Protecting against security threats</li>
            </ul>

            <h3>2.4 Marketing and Communication</h3>
            <ul>
              <li>Sending service-related notifications</li>
              <li>Providing promotional materials (with your consent)</li>
              <li>Responding to your inquiries</li>
              <li>Sending platform updates and announcements</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Sharing and Disclosure</h2>
            <p>We may share your information in the following circumstances:</p>

            <h3>3.1 With Other Users</h3>
            <ul>
              <li>Profile information visible to potential clients/freelancers</li>
              <li>Work samples and portfolio items</li>
              <li>Reviews and ratings</li>
              <li>Public messages and forum posts</li>
            </ul>

            <h3>3.2 With Service Providers</h3>
            <ul>
              <li>Payment processors for transaction handling</li>
              <li>Cloud storage providers for data hosting</li>
              <li>Analytics providers for platform insights</li>
              <li>Customer support tools</li>
              <li>Email service providers</li>
            </ul>

            <h3>3.3 Legal Requirements</h3>
            <p>We may disclose your information when required by law or to:</p>
            <ul>
              <li>Comply with legal obligations</li>
              <li>Protect our rights and property</li>
              <li>Prevent fraud or criminal activity</li>
              <li>Ensure user safety</li>
              <li>Respond to government requests</li>
            </ul>

            <h3>3.4 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information 
              may be transferred to the new entity, subject to the same privacy protections.
            </p>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>We implement comprehensive security measures to protect your information:</p>

            <h3>4.1 Technical Safeguards</h3>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Firewall protection</li>
            </ul>

            <h3>4.2 Organizational Measures</h3>
            <ul>
              <li>Employee training on data protection</li>
              <li>Limited access to personal information</li>
              <li>Background checks for staff with data access</li>
              <li>Incident response procedures</li>
            </ul>

            <h3>4.3 Important Notice</h3>
            <p>
              While we strive to protect your information, no method of transmission over 
              the internet is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2>5. Your Privacy Rights</h2>
            <p>You have the following rights regarding your personal information:</p>

            <h3>5.1 Access and Portability</h3>
            <ul>
              <li>Request a copy of your personal data</li>
              <li>Download your information in a portable format</li>
              <li>Verify the accuracy of your data</li>
            </ul>

            <h3>5.2 Correction and Updates</h3>
            <ul>
              <li>Update your profile information</li>
              <li>Correct inaccurate data</li>
              <li>Complete incomplete information</li>
            </ul>

            <h3>5.3 Deletion</h3>
            <ul>
              <li>Request deletion of your account</li>
              <li>Remove specific pieces of information</li>
              <li>Withdraw consent for data processing</li>
            </ul>

            <h3>5.4 Communication Preferences</h3>
            <ul>
              <li>Opt out of marketing communications</li>
              <li>Control notification settings</li>
              <li>Manage email preferences</li>
            </ul>
          </section>

          <section>
            <h2>6. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to enhance your experience:</p>

            <h3>6.1 Types of Cookies</h3>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements</li>
            </ul>

            <h3>6.2 Cookie Control</h3>
            <p>
              You can control cookie settings through your browser preferences. Note that 
              disabling certain cookies may affect platform functionality.
            </p>
          </section>

          <section>
            <h2>7. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than 
              your own. We ensure appropriate safeguards are in place for international transfers, 
              including:
            </p>
            <ul>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Standard contractual clauses</li>
              <li>Certification schemes</li>
              <li>Binding corporate rules</li>
            </ul>
          </section>

          <section>
            <h2>8. Data Retention</h2>
            <p>We retain your information for as long as necessary to:</p>
            <ul>
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
              <li>Protect against fraud</li>
            </ul>
            
            <p>
              After account deletion, we may retain certain information in anonymized 
              form for analytics and legal compliance purposes.
            </p>
          </section>

          <section>
            <h2>9. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. 
              We do not knowingly collect personal information from children. If we 
              become aware that we have collected information from a child, we will 
              take steps to delete such information.
            </p>
          </section>

          <section>
            <h2>10. Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites. We are not 
              responsible for the privacy practices of these external sites. We 
              encourage you to review their privacy policies before providing any 
              personal information.
            </p>
          </section>

          <section>
            <h2>11. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify 
              you of significant changes via:
            </p>
            <ul>
              <li>Email notification to your registered address</li>
              <li>Prominent notice on our platform</li>
              <li>In-app notifications</li>
            </ul>
            <p>
              Your continued use of our services after changes take effect constitutes 
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2>12. Contact Information</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, 
              please contact our Data Protection Officer:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@nairalancers.com</p>
              <p><strong>Address:</strong> [Your Business Address]</p>
              <p><strong>Phone:</strong> [Your Contact Number]</p>
            </div>
          </section>

          <section>
            <h2>13. Specific Regional Rights</h2>
            
            <h3>13.1 For EU Residents (GDPR)</h3>
            <p>If you are in the European Union, you have additional rights under GDPR:</p>
            <ul>
              <li>Right to object to processing</li>
              <li>Right to restrict processing</li>
              <li>Right to lodge a complaint with supervisory authorities</li>
              <li>Right to withdraw consent at any time</li>
            </ul>

            <h3>13.2 For California Residents (CCPA)</h3>
            <p>California residents have specific rights under the CCPA:</p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of sale of personal information</li>
              <li>Right to non-discrimination</li>
            </ul>
          </section>
        </div>

        <div className="footer">
          <div className="actions">
            <Link to="/terms-of-service" className="link-btn">
              View Terms of Service
            </Link>
            <Link to="/register" className="primary-btn">
              I Understand - Sign Up
            </Link>
          </div>
          <div className="back-home">
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;




