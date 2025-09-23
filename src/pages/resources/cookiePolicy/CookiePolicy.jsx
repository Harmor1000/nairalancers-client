import React from 'react';
import { Link } from 'react-router-dom';
import './CookiePolicy.scss';

const CookiePolicy = () => {
  return (
    <div className="cookie-policy">
      <div className="container">
        <div className="header">
          <h1>Cookie Policy</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="content">
          <section className="intro">
            <p>
              This Cookie Policy explains how Nairalancers uses cookies and similar technologies 
              when you visit our platform. We want to help you understand what cookies are, how we 
              use them, and your choices regarding their use.
            </p>
          </section>

          <section>
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit a website. 
              They are widely used to make websites work more efficiently and provide a better user experience.
            </p>
            
            <h3>1.1 Types of Cookies</h3>
            <ul>
              <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
              <li><strong>First-Party Cookies:</strong> Set by our website directly</li>
              <li><strong>Third-Party Cookies:</strong> Set by external services we use</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Cookies</h2>
            <p>We use cookies for several purposes to enhance your experience on our platform:</p>

            <h3>2.1 Essential Cookies</h3>
            <p>These cookies are necessary for our website to function properly. They cannot be disabled.</p>
            <ul>
              <li>Authentication and login functionality</li>
              <li>Security features and fraud prevention</li>
              <li>Shopping cart and payment processing</li>
              <li>Language and region preferences</li>
              <li>Form submission and data validation</li>
            </ul>

            <h3>2.2 Performance and Analytics Cookies</h3>
            <p>These cookies help us understand how users interact with our website.</p>
            <ul>
              <li>Page view tracking and user behavior analysis</li>
              <li>Performance monitoring and error reporting</li>
              <li>A/B testing and feature optimization</li>
              <li>Traffic source identification</li>
              <li>Site speed and performance metrics</li>
            </ul>

            <h3>2.3 Functional Cookies</h3>
            <p>These cookies enable enhanced functionality and personalization.</p>
            <ul>
              <li>Remembering your preferences and settings</li>
              <li>Customizing content based on your interests</li>
              <li>Social media integration</li>
              <li>Chat and customer support features</li>
              <li>Video playback and multimedia content</li>
            </ul>

            <h3>2.4 Marketing and Advertising Cookies</h3>
            <p>These cookies are used to deliver relevant advertisements and marketing content.</p>
            <ul>
              <li>Targeted advertising based on browsing behavior</li>
              <li>Retargeting campaigns</li>
              <li>Affiliate program tracking</li>
              <li>Marketing campaign effectiveness measurement</li>
              <li>Cross-platform advertising</li>
            </ul>
          </section>

          <section>
            <h2>3. Specific Cookies We Use</h2>
            
            <div className="cookie-table">
              <div className="cookie-category">
                <h3>Essential Cookies</h3>
                <div className="cookie-item">
                  <h4>Authentication Token</h4>
                  <p><strong>Purpose:</strong> Keeps you logged in</p>
                  <p><strong>Duration:</strong> Session</p>
                  <p><strong>Type:</strong> First-party</p>
                </div>
                
                <div className="cookie-item">
                  <h4>CSRF Protection</h4>
                  <p><strong>Purpose:</strong> Prevents cross-site request forgery</p>
                  <p><strong>Duration:</strong> Session</p>
                  <p><strong>Type:</strong> First-party</p>
                </div>
                
                <div className="cookie-item">
                  <h4>User Preferences</h4>
                  <p><strong>Purpose:</strong> Stores language and display settings</p>
                  <p><strong>Duration:</strong> 1 year</p>
                  <p><strong>Type:</strong> First-party</p>
                </div>
              </div>

              <div className="cookie-category">
                <h3>Analytics Cookies</h3>
                <div className="cookie-item">
                  <h4>Google Analytics</h4>
                  <p><strong>Purpose:</strong> Website usage analytics</p>
                  <p><strong>Duration:</strong> 2 years</p>
                  <p><strong>Type:</strong> Third-party</p>
                </div>
                
                <div className="cookie-item">
                  <h4>Performance Monitoring</h4>
                  <p><strong>Purpose:</strong> Tracks site performance and errors</p>
                  <p><strong>Duration:</strong> 30 days</p>
                  <p><strong>Type:</strong> First-party</p>
                </div>
              </div>

              <div className="cookie-category">
                <h3>Marketing Cookies</h3>
                <div className="cookie-item">
                  <h4>Facebook Pixel</h4>
                  <p><strong>Purpose:</strong> Targeted advertising on Facebook</p>
                  <p><strong>Duration:</strong> 90 days</p>
                  <p><strong>Type:</strong> Third-party</p>
                </div>
                
                <div className="cookie-item">
                  <h4>Google Ads</h4>
                  <p><strong>Purpose:</strong> Conversion tracking and remarketing</p>
                  <p><strong>Duration:</strong> 90 days</p>
                  <p><strong>Type:</strong> Third-party</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2>4. Your Cookie Choices</h2>
            <p>You have several options for managing cookies:</p>

            <h3>4.1 Browser Settings</h3>
            <p>Most browsers allow you to:</p>
            <ul>
              <li>View and delete existing cookies</li>
              <li>Block all cookies or specific types</li>
              <li>Set notifications when cookies are created</li>
              <li>Configure privacy settings</li>
            </ul>

            <h3>4.2 Cookie Preference Center</h3>
            <p>
              You can manage your cookie preferences through our Cookie Preference Center, 
              accessible through the banner when you first visit our site or via your account settings.
            </p>

            <h3>4.3 Third-Party Opt-Outs</h3>
            <p>For third-party cookies, you can opt out directly with the providers:</p>
            <ul>
              <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
              <li><a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener noreferrer">Facebook Ad Preferences</a></li>
              <li><a href="http://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">NAI Opt-out Tool</a></li>
              <li><a href="http://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">DAA Opt-out Tool</a></li>
            </ul>
          </section>

          <section>
            <h2>5. Impact of Disabling Cookies</h2>
            <p>
              While you can disable cookies, please note that doing so may affect your ability 
              to use certain features of our platform:
            </p>
            
            <div className="impact-grid">
              <div className="impact-item essential">
                <h4>Essential Cookies Disabled</h4>
                <ul>
                  <li>Cannot log in or access account</li>
                  <li>Lost shopping cart contents</li>
                  <li>Security features may not work</li>
                  <li>Form submissions may fail</li>
                </ul>
              </div>
              
              <div className="impact-item functional">
                <h4>Functional Cookies Disabled</h4>
                <ul>
                  <li>Settings not remembered</li>
                  <li>Reduced personalization</li>
                  <li>Limited social features</li>
                  <li>Preferences reset each visit</li>
                </ul>
              </div>
              
              <div className="impact-item analytics">
                <h4>Analytics Cookies Disabled</h4>
                <ul>
                  <li>Limited ability to improve services</li>
                  <li>Reduced performance optimization</li>
                  <li>Less effective feature development</li>
                  <li>No impact on core functionality</li>
                </ul>
              </div>
              
              <div className="impact-item marketing">
                <h4>Marketing Cookies Disabled</h4>
                <ul>
                  <li>Less relevant advertisements</li>
                  <li>More generic content</li>
                  <li>No impact on core functionality</li>
                  <li>May see more irrelevant ads</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2>6. Mobile Apps and Other Technologies</h2>
            <p>
              In addition to cookies, we may use other tracking technologies:
            </p>
            
            <h3>6.1 Mobile App Identifiers</h3>
            <ul>
              <li>Device identifiers for mobile apps</li>
              <li>Push notification tokens</li>
              <li>App usage analytics</li>
              <li>Crash reporting data</li>
            </ul>

            <h3>6.2 Local Storage</h3>
            <ul>
              <li>HTML5 local storage</li>
              <li>Session storage</li>
              <li>Web SQL databases</li>
              <li>IndexedDB</li>
            </ul>

            <h3>6.3 Other Technologies</h3>
            <ul>
              <li>Web beacons and pixel tags</li>
              <li>JavaScript tracking</li>
              <li>Server logs</li>
              <li>Fingerprinting techniques</li>
            </ul>
          </section>

          <section>
            <h2>7. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our 
              practices or for legal, operational, or regulatory reasons. We will notify you 
              of significant changes by:
            </p>
            <ul>
              <li>Posting the updated policy on our website</li>
              <li>Sending email notifications to registered users</li>
              <li>Displaying prominent notices on our platform</li>
              <li>Updating the "last modified" date at the top of this policy</li>
            </ul>
          </section>

          <section>
            <h2>8. Contact Us</h2>
            <p>
              If you have questions about our use of cookies or this Cookie Policy, 
              please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@nairalancers.com</p>
              <p><strong>Subject Line:</strong> Cookie Policy Inquiry</p>
              <p><strong>Data Protection Officer:</strong> dpo@nairalancers.com</p>
              <p><strong>Address:</strong> [Your Business Address]</p>
            </div>
          </section>
        </div>

        <div className="footer">
          <div className="actions">
            <Link to="/privacy-policy" className="link-btn">
              View Privacy Policy
            </Link>
            <button className="primary-btn" onClick={() => window.location.reload()}>
              Accept All Cookies
            </button>
          </div>
          <div className="back-home">
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
