import React from 'react';
import { Link } from 'react-router-dom';
import './TermsOfService.scss';

const TermsOfService = () => {
  return (
    <div className="terms-of-service">
      <div className="container">
        <div className="header">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="content">
          <section className="intro">
            <p>
              Welcome to Nairalancers! These Terms of Service ("Terms") govern your use of our platform 
              that connects clients with freelancers. By accessing or using our services, you agree to 
              be bound by these Terms.
            </p>
          </section>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Nairalancers, you accept and agree to be bound by these Terms 
              and our Privacy Policy. If you do not agree to abide by these Terms, do not use this service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Nairalancers is an online marketplace that connects clients seeking services with 
              freelancers offering those services. We provide the platform but are not party to 
              the actual contractual relationship between clients and freelancers.
            </p>
            <ul>
              <li>Posting and browsing service listings (gigs)</li>
              <li>Communication tools between clients and freelancers</li>
              <li>Payment processing and escrow services</li>
              <li>Dispute resolution assistance</li>
              <li>Profile and portfolio management</li>
            </ul>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <h3>3.1 Account Creation</h3>
            <p>
              To use our services, you must create an account. You agree to provide accurate, 
              current, and complete information and to update such information to keep it accurate.
            </p>
            
            <h3>3.2 Account Security</h3>
            <p>
              You are responsible for safeguarding your account credentials and for all activities 
              that occur under your account. Notify us immediately of any unauthorized use.
            </p>

            <h3>3.3 User Types</h3>
            <ul>
              <li><strong>Clients:</strong> Users who purchase services from freelancers</li>
              <li><strong>Freelancers:</strong> Users who offer and provide services to clients</li>
            </ul>
          </section>

          <section>
            <h2>4. User Responsibilities</h2>
            <h3>4.1 General Conduct</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious content or viruses</li>
              <li>Engage in fraudulent activities</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Spam or send unsolicited communications</li>
              <li>Create false or misleading profiles</li>
            </ul>

            <h3>4.2 Freelancer Responsibilities</h3>
            <ul>
              <li>Deliver services as described in your gig</li>
              <li>Communicate professionally with clients</li>
              <li>Meet agreed-upon deadlines</li>
              <li>Provide original work unless otherwise specified</li>
              <li>Maintain confidentiality of client information</li>
            </ul>

            <h3>4.3 Client Responsibilities</h3>
            <ul>
              <li>Provide clear project requirements</li>
              <li>Make timely payments</li>
              <li>Communicate respectfully with freelancers</li>
              <li>Review and approve work in a timely manner</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2>5. Payments and Fees</h2>
            <h3>5.1 Payment Processing</h3>
            <p>
              All payments are processed through our secure payment system. We use third-party 
              payment processors and may hold funds in escrow until work is completed.
            </p>

            <h3>5.2 Service Fees</h3>
            <p>
              Nairalancers charges a service fee on transactions. Current fee structure:
            </p>
            <ul>
              <li>Freelancer service fee: 5% of the transaction amount</li>
              <li>Payment processing fees may apply</li>
              <li>Withdrawal fees may apply depending on payment method</li>
            </ul>

            <h3>5.3 Refunds and Disputes</h3>
            <p>
              Refund eligibility depends on the circumstances of each case. We provide dispute 
              resolution services to help resolve conflicts between clients and freelancers.
            </p>
          </section>

          <section>
            <h2>6. Intellectual Property</h2>
            <h3>6.1 User Content</h3>
            <p>
              You retain ownership of content you create, but grant us a license to use, 
              display, and distribute your content on our platform for the purpose of 
              providing our services.
            </p>

            <h3>6.2 Work Product</h3>
            <p>
              Unless otherwise agreed upon between client and freelancer, completed work 
              belongs to the client upon full payment.
            </p>

            <h3>6.3 Platform Content</h3>
            <p>
              All content on the Nairalancers platform, including design, text, graphics, 
              and software, is owned by us or our licensors and is protected by copyright laws.
            </p>
          </section>

          <section>
            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand 
              how we collect, use, and protect your information. By using our services, you 
              consent to the collection and use of information as outlined in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2>8. Prohibited Content and Activities</h2>
            <p>The following are strictly prohibited on our platform:</p>
            <ul>
              <li>Adult content or services</li>
              <li>Illegal goods or services</li>
              <li>Gambling or betting services</li>
              <li>Academic dishonesty (writing assignments for students)</li>
              <li>Pyramid schemes or multi-level marketing</li>
              <li>Fake reviews or testimonials</li>
              <li>Copyright infringement</li>
              <li>Identity theft or impersonation</li>
            </ul>
          </section>

          <section>
            <h2>9. Account Suspension and Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms. 
              Reasons for suspension or termination include but are not limited to:
            </p>
            <ul>
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent activity</li>
              <li>Multiple complaints from other users</li>
              <li>Inactivity for extended periods</li>
              <li>Failure to complete transactions</li>
            </ul>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>
              Nairalancers provides a platform for connecting clients and freelancers but is not 
              responsible for the quality, safety, or legality of services provided. Our liability 
              is limited to the maximum extent permitted by law.
            </p>
            <p>
              We are not liable for any indirect, incidental, special, consequential, or punitive 
              damages arising from your use of our services.
            </p>
          </section>

          <section>
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Nairalancers, its officers, employees, and 
              agents from any claims, damages, or expenses arising from your use of our services 
              or violation of these Terms.
            </p>
          </section>

          <section>
            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of 
              significant changes via email or platform notification. Continued use of our 
              services after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2>13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Nigeria. Any disputes arising from these 
              Terms or your use of our services will be resolved in Nigerian courts.
            </p>
          </section>

          <section>
            <h2>14. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> legal@nairalancers.com</p>
              <p><strong>Address:</strong> [Your Business Address]</p>
              <p><strong>Phone:</strong> [Your Contact Number]</p>
            </div>
          </section>

          <section>
            <h2>15. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining 
              provisions will continue to be valid and enforceable.
            </p>
          </section>

          <section>
            <h2>16. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement 
              between you and Nairalancers regarding the use of our services.
            </p>
          </section>
        </div>

        <div className="footer">
          <div className="actions">
            <Link to="/privacy-policy" className="link-btn">
              View Privacy Policy
            </Link>
            <Link to="/register" className="primary-btn">
              I Agree - Sign Up
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

export default TermsOfService;




