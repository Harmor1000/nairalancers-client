import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AffiliateProgram.scss';

const AffiliateProgram = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const commissionStructure = [
    {
      tier: 'Bronze',
      referrals: '1-10',
      commission: '15%',
      bonus: 'Welcome bonus: ₦5,000',
      color: '#cd7f32'
    },
    {
      tier: 'Silver',
      referrals: '11-25',
      commission: '20%',
      bonus: 'Monthly bonus: ₦10,000',
      color: '#c0c0c0'
    },
    {
      tier: 'Gold',
      referrals: '26-50',
      commission: '25%',
      bonus: 'Quarterly bonus: ₦50,000',
      color: '#ffd700'
    },
    {
      tier: 'Platinum',
      referrals: '51+',
      commission: '30%',
      bonus: 'Annual bonus: ₦200,000',
      color: '#e5e4e2'
    }
  ];

  const earnings = {
    perFreelancer: '₦2,000 - ₦10,000',
    perClient: '₦1,000 - ₦5,000',
    monthlyPotential: '₦50,000 - ₦500,000+',
    topEarner: '₦1.2M in 2023'
  };

  return (
    <div className="affiliate-program">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Affiliate Program</h1>
          <p className="hero-subtitle">
            Earn money by referring talented freelancers and businesses to Nairalancers
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">₦2.8M+</span>
              <span className="stat-label">Paid to Affiliates</span>
            </div>
            <div className="stat">
              <span className="stat-number">1,200+</span>
              <span className="stat-label">Active Affiliates</span>
            </div>
            <div className="stat">
              <span className="stat-number">30%</span>
              <span className="stat-label">Max Commission</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'how-it-works' ? 'active' : ''}`}
            onClick={() => setActiveTab('how-it-works')}
          >
            How It Works
          </button>
          <button 
            className={`tab-btn ${activeTab === 'commission' ? 'active' : ''}`}
            onClick={() => setActiveTab('commission')}
          >
            Commission Structure
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            Marketing Tools
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-content">
              <h2>Why Join Our Affiliate Program?</h2>
              
              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon">💰</div>
                  <h3>High Commissions</h3>
                  <p>Earn up to 30% commission on every successful referral with our tiered reward system.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">🔄</div>
                  <h3>Recurring Income</h3>
                  <p>Earn from repeat transactions as your referrals continue using our platform.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">📊</div>
                  <h3>Real-time Tracking</h3>
                  <p>Monitor your referrals, earnings, and performance with our comprehensive dashboard.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">🎯</div>
                  <h3>Marketing Support</h3>
                  <p>Access professional marketing materials, banners, and promotional content.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">💳</div>
                  <h3>Fast Payments</h3>
                  <p>Get paid weekly via bank transfer with minimum payout of just ₦5,000.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">🏆</div>
                  <h3>Performance Bonuses</h3>
                  <p>Unlock additional bonuses and rewards as you reach higher referral tiers.</p>
                </div>
              </div>

              <div className="earnings-potential">
                <h3>Earnings Potential</h3>
                <div className="earnings-grid">
                  <div className="earning-item">
                    <span className="earning-label">Per Freelancer Referral</span>
                    <span className="earning-amount">{earnings.perFreelancer}</span>
                  </div>
                  <div className="earning-item">
                    <span className="earning-label">Per Client Referral</span>
                    <span className="earning-amount">{earnings.perClient}</span>
                  </div>
                  <div className="earning-item">
                    <span className="earning-label">Monthly Potential</span>
                    <span className="earning-amount">{earnings.monthlyPotential}</span>
                  </div>
                  <div className="earning-item">
                    <span className="earning-label">Top Earner 2023</span>
                    <span className="earning-amount">{earnings.topEarner}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* How It Works Tab */}
          {activeTab === 'how-it-works' && (
            <div className="how-it-works-content">
              <h2>Simple 4-Step Process</h2>
              
              <div className="steps-container">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Sign Up</h3>
                    <p>Create your affiliate account and get approved within 24 hours. No fees or upfront costs.</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Get Your Links</h3>
                    <p>Receive unique referral links and marketing materials from your affiliate dashboard.</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Promote & Refer</h3>
                    <p>Share your links through social media, websites, or direct referrals to earn commissions.</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Get Paid</h3>
                    <p>Earn commissions on successful sign-ups and transactions. Get paid weekly via bank transfer.</p>
                  </div>
                </div>
              </div>

              <div className="referral-types">
                <h3>Types of Referrals</h3>
                <div className="referral-grid">
                  <div className="referral-type">
                    <h4>🎨 Freelancer Referrals</h4>
                    <p>Refer skilled professionals looking to offer their services</p>
                    <ul>
                      <li>One-time signup bonus: ₦2,000</li>
                      <li>Commission on first 3 orders: 15-30%</li>
                      <li>Ongoing revenue share for active freelancers</li>
                    </ul>
                  </div>
                  
                  <div className="referral-type">
                    <h4>💼 Client Referrals</h4>
                    <p>Refer businesses and individuals who need freelance services</p>
                    <ul>
                      <li>Commission on all orders: 10-25%</li>
                      <li>Higher rates for enterprise clients</li>
                      <li>Long-term earning potential</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Commission Structure Tab */}
          {activeTab === 'commission' && (
            <div className="commission-content">
              <h2>Tiered Commission Structure</h2>
              <p>Earn more as you refer more people to our platform</p>
              
              <div className="commission-tiers">
                {commissionStructure.map((tier, index) => (
                  <div key={index} className="tier-card" style={{'--tier-color': tier.color}}>
                    <div className="tier-header">
                      <h3>{tier.tier}</h3>
                      <div className="tier-badge">{tier.commission}</div>
                    </div>
                    <div className="tier-details">
                      <div className="tier-referrals">
                        <span className="label">Referrals:</span>
                        <span className="value">{tier.referrals}</span>
                      </div>
                      <div className="tier-bonus">
                        <span className="bonus-text">{tier.bonus}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="commission-calculation">
                <h3>Commission Calculator</h3>
                <div className="calculator">
                  <div className="calc-row">
                    <label>Monthly Referrals:</label>
                    <input type="number" placeholder="10" />
                  </div>
                  <div className="calc-row">
                    <label>Average Order Value:</label>
                    <input type="number" placeholder="50000" />
                  </div>
                  <div className="calc-row">
                    <label>Commission Rate:</label>
                    <select>
                      <option value="15">15% (Bronze)</option>
                      <option value="20">20% (Silver)</option>
                      <option value="25">25% (Gold)</option>
                      <option value="30">30% (Platinum)</option>
                    </select>
                  </div>
                  <div className="calc-result">
                    <span>Estimated Monthly Earnings: ₦75,000</span>
                  </div>
                </div>
              </div>

              <div className="payment-info">
                <h3>Payment Information</h3>
                <div className="payment-details">
                  <div className="payment-item">
                    <strong>Payment Frequency:</strong> Weekly (Every Friday)
                  </div>
                  <div className="payment-item">
                    <strong>Minimum Payout:</strong> ₦5,000
                  </div>
                  <div className="payment-item">
                    <strong>Payment Method:</strong> Nigerian Bank Transfer
                  </div>
                  <div className="payment-item">
                    <strong>Cookie Duration:</strong> 90 days
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Marketing Tools Tab */}
          {activeTab === 'tools' && (
            <div className="tools-content">
              <h2>Marketing Tools & Resources</h2>
              
              <div className="tools-grid">
                <div className="tool-category">
                  <h3>🖼️ Banner Ads</h3>
                  <p>Professional banner ads in various sizes for your website or blog</p>
                  <div className="tool-list">
                    <span>728x90 Leaderboard</span>
                    <span>300x250 Medium Rectangle</span>
                    <span>320x50 Mobile Banner</span>
                    <span>250x250 Square</span>
                  </div>
                </div>
                
                <div className="tool-category">
                  <h3>📱 Social Media Kit</h3>
                  <p>Ready-to-use social media posts and graphics</p>
                  <div className="tool-list">
                    <span>Facebook Posts</span>
                    <span>Instagram Stories</span>
                    <span>Twitter Graphics</span>
                    <span>LinkedIn Content</span>
                  </div>
                </div>
                
                <div className="tool-category">
                  <h3>📧 Email Templates</h3>
                  <p>Professional email templates for direct outreach</p>
                  <div className="tool-list">
                    <span>Freelancer Recruitment</span>
                    <span>Client Acquisition</span>
                    <span>Newsletter Content</span>
                    <span>Follow-up Sequences</span>
                  </div>
                </div>
                
                <div className="tool-category">
                  <h3>📊 Analytics Dashboard</h3>
                  <p>Track your performance with detailed analytics</p>
                  <div className="tool-list">
                    <span>Click Tracking</span>
                    <span>Conversion Rates</span>
                    <span>Earnings Reports</span>
                    <span>Referral History</span>
                  </div>
                </div>
              </div>

              <div className="sample-links">
                <h3>Sample Promotional Content</h3>
                <div className="content-samples">
                  <div className="sample">
                    <h4>Social Media Post</h4>
                    <div className="sample-text">
                      "🚀 Looking to start freelancing or hire top Nigerian talent? Join Nairalancers - Nigeria's fastest-growing freelance platform! Over 50,000 skilled professionals ready to help your business grow. Sign up now: [Your Referral Link]"
                    </div>
                  </div>
                  
                  <div className="sample">
                    <h4>Blog Post Snippet</h4>
                    <div className="sample-text">
                      "If you're looking for quality freelance services from Nigerian professionals, I highly recommend Nairalancers. They offer comprehensive payment protection, excellent customer support, and a wide range of services from design to development."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success Stories */}
        <div className="success-stories">
          <h2>Affiliate Success Stories</h2>
          <div className="stories-grid">
            <div className="story-card">
              <div className="story-avatar">👨‍💼</div>
              <h3>Tunde Adebayo</h3>
              <p className="story-title">Tech Blogger, Lagos</p>
              <p className="story-earnings">₦180,000/month</p>
              <p className="story-text">
                "I started promoting Nairalancers to my blog readers and social media followers. 
                Within 6 months, I was earning more from affiliates than my day job!"
              </p>
            </div>
            
            <div className="story-card">
              <div className="story-avatar">👩‍💻</div>
              <h3>Sarah Ibrahim</h3>
              <p className="story-title">Digital Marketer, Abuja</p>
              <p className="story-earnings">₦320,000/month</p>
              <p className="story-text">
                "The recurring commission model is amazing. I refer clients once, and they keep 
                using the platform, which means I keep earning. It's truly passive income."
              </p>
            </div>
            
            <div className="story-card">
              <div className="story-avatar">👨‍🎓</div>
              <h3>Emeka Okafor</h3>
              <p className="story-title">University Student, Enugu</p>
              <p className="story-earnings">₦85,000/month</p>
              <p className="story-text">
                "As a student, this affiliate program helps me pay my fees. I refer classmates 
                who need freelance work and businesses that need services."
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How much can I earn?</h3>
              <p>Earnings vary based on your referral volume and tier level. Top affiliates earn ₦200,000+ monthly. Our commission structure ranges from 15% to 30%.</p>
            </div>
            
            <div className="faq-item">
              <h3>When do I get paid?</h3>
              <p>Payments are made weekly every Friday via bank transfer. Minimum payout is ₦5,000. Commissions are tracked in real-time on your dashboard.</p>
            </div>
            
            <div className="faq-item">
              <h3>How long do referrals last?</h3>
              <p>Our cookie duration is 90 days. This means if someone clicks your link and signs up within 90 days, you'll get credit for the referral.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I refer myself or family?</h3>
              <p>Self-referrals are not allowed. Family referrals are permitted but must be genuine users who will actively use the platform.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Start Earning?</h2>
          <p>Join our affiliate program today and start earning money by promoting Nigeria's top freelance platform</p>
          <div className="cta-buttons">
            <Link to="/register" className="primary-btn">
              Join Affiliate Program
            </Link>
            <Link to="/contact" className="secondary-btn">
              Contact Affiliate Team
            </Link>
          </div>
        </div>

        <div className="footer">
          <div className="actions">
            <Link to="/success-stories" className="link-btn">
              Success Stories
            </Link>
            <Link to="/contact" className="link-btn">
              Contact Us
            </Link>
            <Link to="/register" className="primary-btn">
              Get Started
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

export default AffiliateProgram;
