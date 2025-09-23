import React from 'react';
import { Link } from 'react-router-dom';
import './PaymentProtection.scss';

const PaymentProtection = () => {
  const protectionFeatures = [
    {
      icon: '🔒',
      title: 'Escrow System',
      description: 'Payments are held securely until work is completed and approved',
      details: [
        'Client funds held in secure escrow',
        'Released only after delivery approval',
        'Automatic dispute protection',
        'No payment without delivery guarantee'
      ]
    },
    {
      icon: '✅',
      title: 'Milestone Payments',
      description: 'Break large projects into secure, manageable payment milestones',
      details: [
        'Split payments into smaller chunks',
        'Pay as work progresses',
        'Reduce financial risk for both parties',
        'Clear progress tracking'
      ]
    },
    {
      icon: '🛡️',
      title: 'Dispute Resolution',
      description: 'Fair and professional resolution for payment disputes',
      details: [
        '24/7 dispute resolution team',
        'Evidence-based decision making',
        'Professional mediation process',
        'Quick resolution within 5-7 days'
      ]
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'Bank-level security for all transactions',
      details: [
        '256-bit SSL encryption',
        'PCI DSS compliant processing',
        'Fraud monitoring systems',
        'Multiple payment methods'
      ]
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Client Places Order',
      description: 'Payment is automatically held in our secure escrow system',
      icon: '💰'
    },
    {
      step: 2,
      title: 'Freelancer Delivers Work',
      description: 'Freelancer completes and submits the deliverables',
      icon: '📋'
    },
    {
      step: 3,
      title: 'Client Reviews & Approves',
      description: 'Client has time to review and request revisions if needed',
      icon: '✅'
    },
    {
      step: 4,
      title: 'Payment Released',
      description: 'Funds are automatically released to freelancer upon approval',
      icon: '🚀'
    }
  ];

  const guarantees = [
    {
      title: 'Money Back Guarantee',
      description: 'Full refund if work is not delivered as agreed',
      coverage: '100% of order value'
    },
    {
      title: 'Quality Assurance',
      description: 'Right to revisions until work meets requirements',
      coverage: 'Unlimited revisions within scope'
    },
    {
      title: 'Delivery Protection',
      description: 'Automatic refund if work is not delivered on time',
      coverage: 'Late delivery compensation'
    },
    {
      title: 'Fraud Protection',
      description: 'Protection against fraudulent activities',
      coverage: '24/7 monitoring and investigation'
    }
  ];

  const safetyTips = [
    {
      category: 'For Clients',
      tips: [
        'Always communicate through the platform',
        'Never pay outside the escrow system',
        'Clearly define project requirements',
        'Use milestone payments for large projects',
        'Review portfolios and ratings before hiring'
      ]
    },
    {
      category: 'For Freelancers',
      tips: [
        'Deliver work through the platform only',
        'Keep detailed project documentation',
        'Communicate progress regularly',
        'Never share personal payment details',
        'Use contracts for complex projects'
      ]
    }
  ];

  const stats = [
    { number: '₦2.8B+', label: 'Secure Transactions' },
    { number: '99.8%', label: 'Successful Payments' },
    { number: '<0.1%', label: 'Dispute Rate' },
    { number: '24/7', label: 'Fraud Monitoring' }
  ];

  return (
    <div className="payment-protection">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Payment Protection</h1>
          <p className="hero-subtitle">
            Your money is safe with our comprehensive payment protection system
          </p>
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Protection Features */}
        <div className="features-section">
          <h2>How We Protect Your Payments</h2>
          <div className="features-grid">
            {protectionFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-details">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="how-it-works">
          <h2>How Our Escrow System Works</h2>
          <div className="steps-container">
            {howItWorks.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < howItWorks.length - 1 && <div className="step-connector">→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="guarantees-section">
          <h2>Our Protection Guarantees</h2>
          <div className="guarantees-grid">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="guarantee-card">
                <h3>{guarantee.title}</h3>
                <p className="guarantee-description">{guarantee.description}</p>
                <div className="guarantee-coverage">
                  <strong>Coverage: </strong>{guarantee.coverage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="safety-tips">
          <h2>Stay Safe: Best Practices</h2>
          <div className="tips-grid">
            {safetyTips.map((category, index) => (
              <div key={index} className="tips-category">
                <h3>{category.category}</h3>
                <ul>
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Dispute Process */}
        <div className="dispute-process">
          <h2>Dispute Resolution Process</h2>
          <div className="process-content">
            <div className="process-steps">
              <div className="process-step">
                <h3>1. Report the Issue</h3>
                <p>Contact our support team with detailed information about the dispute</p>
              </div>
              <div className="process-step">
                <h3>2. Investigation</h3>
                <p>Our team reviews all evidence, communications, and project details</p>
              </div>
              <div className="process-step">
                <h3>3. Mediation</h3>
                <p>We facilitate communication between parties to reach a fair resolution</p>
              </div>
              <div className="process-step">
                <h3>4. Final Decision</h3>
                <p>If needed, our expert team makes a final binding decision</p>
              </div>
            </div>
            <div className="process-info">
              <div className="info-card">
                <h4>⏱️ Resolution Time</h4>
                <p>Most disputes resolved within 5-7 business days</p>
              </div>
              <div className="info-card">
                <h4>📊 Success Rate</h4>
                <p>95% of disputes resolved to mutual satisfaction</p>
              </div>
              <div className="info-card">
                <h4>💼 Expert Team</h4>
                <p>Handled by experienced dispute resolution specialists</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Measures */}
        <div className="security-section">
          <h2>Advanced Security Measures</h2>
          <div className="security-grid">
            <div className="security-item">
              <h3>🔐 Data Encryption</h3>
              <p>All payment data encrypted with 256-bit SSL technology</p>
            </div>
            <div className="security-item">
              <h3>🏦 Banking Partners</h3>
              <p>Partnered with top Nigerian banks for secure transactions</p>
            </div>
            <div className="security-item">
              <h3>🛡️ Fraud Detection</h3>
              <p>AI-powered systems monitor for suspicious activities 24/7</p>
            </div>
            <div className="security-item">
              <h3>✅ Identity Verification</h3>
              <p>Multi-level verification for all users and transactions</p>
            </div>
            <div className="security-item">
              <h3>📱 Two-Factor Authentication</h3>
              <p>Optional 2FA for additional account security</p>
            </div>
            <div className="security-item">
              <h3>🔄 Regular Audits</h3>
              <p>Quarterly security audits by independent cybersecurity firms</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>When are payments released to freelancers?</h3>
              <p>Payments are released automatically when clients approve the delivered work, or after 7 days if no action is taken by the client (for orders under ₦50,000).</p>
            </div>
            <div className="faq-item">
              <h3>What happens if I'm not satisfied with the work?</h3>
              <p>You can request revisions within the agreed scope, or if the work doesn't meet requirements, you can initiate a dispute for a full or partial refund.</p>
            </div>
            <div className="faq-item">
              <h3>How long does dispute resolution take?</h3>
              <p>Most disputes are resolved within 5-7 business days. Complex cases may take up to 14 days for thorough investigation.</p>
            </div>
            <div className="faq-item">
              <h3>Are there any fees for using payment protection?</h3>
              <p>Payment protection is included free with all transactions. Standard platform fees apply, but there are no additional charges for security features.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Start Protected Trading?</h2>
          <p>Join thousands of users who trust our payment protection system</p>
          <div className="cta-buttons">
            <Link to="/register" className="primary-btn">Get Started Now</Link>
            <Link to="/contact" className="secondary-btn">Contact Support</Link>
          </div>
        </div>

        <div className="footer">
          <div className="actions">
            <Link to="/help" className="link-btn">
              Help Center
            </Link>
            <Link to="/contact" className="link-btn">
              Contact Support
            </Link>
            <Link to="/terms-of-service" className="primary-btn">
              Terms of Service
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

export default PaymentProtection;
