import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FreelancerGuide.scss';

const FreelancerGuide = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Getting Started",
      icon: "🚀",
      content: {
        overview: "Begin your freelancing journey on Nairalancers with confidence",
        topics: [
          "Creating your freelancer account",
          "Understanding platform basics",
          "Setting up your profile",
          "Choosing your niche"
        ]
      }
    },
    {
      id: 2,
      title: "Profile Optimization",
      icon: "✨",
      content: {
        overview: "Build a compelling profile that attracts clients",
        topics: [
          "Writing an effective bio",
          "Showcasing your skills",
          "Adding portfolio pieces",
          "Professional photography tips"
        ]
      }
    },
    {
      id: 3,
      title: "Creating Gigs",
      icon: "💼",
      content: {
        overview: "Learn to create gigs that stand out and convert",
        topics: [
          "Writing compelling titles",
          "Pricing your services",
          "Creating service packages",
          "Using keywords effectively"
        ]
      }
    },
    {
      id: 4,
      title: "Client Communication",
      icon: "💬",
      content: {
        overview: "Master the art of professional client communication",
        topics: [
          "Responding to inquiries",
          "Setting expectations",
          "Managing revisions",
          "Delivering feedback"
        ]
      }
    },
    {
      id: 5,
      title: "Growing Your Business",
      icon: "📈",
      content: {
        overview: "Scale your freelancing business for long-term success",
        topics: [
          "Building repeat clients",
          "Increasing your rates",
          "Expanding your services",
          "Time management tips"
        ]
      }
    }
  ];

  return (
    <div className="freelancer-guide">
      <div className="container">
        <div className="header">
          <h1>Complete Freelancer Guide</h1>
          <p className="subtitle">Your roadmap to freelancing success on Nairalancers</p>
        </div>

        <div className="progress-nav">
          {steps.map(step => (
            <button
              key={step.id}
              className={`step-btn ${activeStep === step.id ? 'active' : ''} ${activeStep > step.id ? 'completed' : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              <span className="step-icon">{step.icon}</span>
              <span className="step-title">{step.title}</span>
            </button>
          ))}
        </div>

        <div className="content">
          {/* Step 1: Getting Started */}
          {activeStep === 1 && (
            <div className="step-content">
              <h2>🚀 Getting Started on Nairalancers</h2>
              <p className="overview">Welcome to your freelancing journey! This guide will help you set up your foundation for success.</p>

              <div className="content-grid">
                <section className="content-block">
                  <h3>1. Creating Your Account</h3>
                  <ul>
                    <li>Choose a professional username</li>
                    <li>Use a professional email address</li>
                    <li>Complete email verification</li>
                    <li>Set up two-factor authentication</li>
                  </ul>
                  
                  <div className="tip-box">
                    <strong>💡 Pro Tip:</strong> Use your real name or a professional variation as your username. This builds trust with clients.
                  </div>
                </section>

                <section className="content-block">
                  <h3>2. Understanding the Platform</h3>
                  <ul>
                    <li>How gigs work on Nairalancers</li>
                    <li>Commission structure and fees</li>
                    <li>Payment processing timeline</li>
                    <li>Platform rules and guidelines</li>
                  </ul>
                  
                  <div className="info-box">
                    <strong>ℹ️ Important:</strong> Nairalancers takes a 20% commission on all completed orders. Factor this into your pricing.
                  </div>
                </section>

                <section className="content-block">
                  <h3>3. Finding Your Niche</h3>
                  <ul>
                    <li>Assess your skills and experience</li>
                    <li>Research market demand</li>
                    <li>Analyze competitor offerings</li>
                    <li>Start with 1-2 core services</li>
                  </ul>
                  
                  <div className="categories-grid">
                    <div className="category-item">
                      <h4>🎨 Creative Services</h4>
                      <p>Logo design, graphics, video editing</p>
                    </div>
                    <div className="category-item">
                      <h4>💻 Tech Services</h4>
                      <p>Web development, mobile apps, software</p>
                    </div>
                    <div className="category-item">
                      <h4>✍️ Writing Services</h4>
                      <p>Content writing, copywriting, translation</p>
                    </div>
                    <div className="category-item">
                      <h4>📊 Business Services</h4>
                      <p>Virtual assistance, data entry, consulting</p>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>4. Setting Realistic Goals</h3>
                  <div className="goals-timeline">
                    <div className="timeline-item">
                      <h4>Week 1-2</h4>
                      <p>Complete profile setup and create first gig</p>
                    </div>
                    <div className="timeline-item">
                      <h4>Month 1</h4>
                      <p>Get your first 5 orders and reviews</p>
                    </div>
                    <div className="timeline-item">
                      <h4>Month 3</h4>
                      <p>Establish regular client base</p>
                    </div>
                    <div className="timeline-item">
                      <h4>Month 6</h4>
                      <p>Scale to full-time income potential</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Step 2: Profile Optimization */}
          {activeStep === 2 && (
            <div className="step-content">
              <h2>✨ Profile Optimization</h2>
              <p className="overview">Your profile is your digital storefront. Make it compelling and professional to attract quality clients.</p>

              <div className="content-grid">
                <section className="content-block">
                  <h3>1. Professional Profile Photo</h3>
                  <div className="photo-tips">
                    <div className="do-dont">
                      <div className="do">
                        <h4>✅ Do</h4>
                        <ul>
                          <li>Use a clear, high-resolution headshot</li>
                          <li>Smile and look professional</li>
                          <li>Use good lighting</li>
                          <li>Dress appropriately for your field</li>
                        </ul>
                      </div>
                      <div className="dont">
                        <h4>❌ Don't</h4>
                        <ul>
                          <li>Use selfies or casual photos</li>
                          <li>Include other people in the photo</li>
                          <li>Use logos or graphics</li>
                          <li>Leave it blank</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>2. Writing Your Bio</h3>
                  <div className="bio-structure">
                    <div className="bio-section">
                      <h4>Opening Hook (1-2 sentences)</h4>
                      <p>Grab attention with your unique value proposition</p>
                      <div className="example">
                        <em>"I'm a certified digital marketer who has helped 50+ businesses increase their online revenue by an average of 40%."</em>
                      </div>
                    </div>
                    
                    <div className="bio-section">
                      <h4>Experience & Skills (2-3 sentences)</h4>
                      <p>Highlight relevant experience and key skills</p>
                      <div className="example">
                        <em>"With 5 years of experience in SEO and social media marketing, I specialize in creating data-driven campaigns that deliver measurable results."</em>
                      </div>
                    </div>
                    
                    <div className="bio-section">
                      <h4>Call to Action (1 sentence)</h4>
                      <p>Encourage clients to contact you</p>
                      <div className="example">
                        <em>"Let's discuss how I can help grow your business today!"</em>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>3. Skills & Certifications</h3>
                  <ul>
                    <li>Add 10-15 relevant skills</li>
                    <li>Use industry-standard terminology</li>
                    <li>Include both technical and soft skills</li>
                    <li>Upload certificates and credentials</li>
                  </ul>
                  
                  <div className="skills-examples">
                    <div className="skill-category">
                      <h4>Technical Skills</h4>
                      <div className="skill-tags">
                        <span>Adobe Photoshop</span>
                        <span>React.js</span>
                        <span>SEO</span>
                        <span>WordPress</span>
                      </div>
                    </div>
                    <div className="skill-category">
                      <h4>Soft Skills</h4>
                      <div className="skill-tags">
                        <span>Communication</span>
                        <span>Project Management</span>
                        <span>Problem Solving</span>
                        <span>Creativity</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>4. Portfolio Showcase</h3>
                  <ul>
                    <li>Upload 5-10 of your best work samples</li>
                    <li>Use high-quality images or demos</li>
                    <li>Include brief descriptions for each piece</li>
                    <li>Show variety within your expertise</li>
                  </ul>
                  
                  <div className="portfolio-tips">
                    <div className="tip-item">
                      <h4>🎨 For Designers</h4>
                      <p>Show before/after comparisons, different styles, and client testimonials</p>
                    </div>
                    <div className="tip-item">
                      <h4>💻 For Developers</h4>
                      <p>Include live demos, code snippets, and project specifications</p>
                    </div>
                    <div className="tip-item">
                      <h4>✍️ For Writers</h4>
                      <p>Showcase different writing styles, topics, and published work</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Step 3: Creating Gigs */}
          {activeStep === 3 && (
            <div className="step-content">
              <h2>💼 Creating Winning Gigs</h2>
              <p className="overview">Learn how to create gigs that attract clients and convert browsers into buyers.</p>

              <div className="content-grid">
                <section className="content-block">
                  <h3>1. Gig Title Best Practices</h3>
                  <div className="title-formula">
                    <h4>Winning Title Formula:</h4>
                    <div className="formula-box">
                      <strong>[Action Verb] + [Specific Service] + [Target Audience] + [Unique Benefit]</strong>
                    </div>
                    
                    <div className="title-examples">
                      <div className="example good">
                        <span className="label">✅ Good:</span>
                        <em>"I will design a professional logo for your startup in 24 hours"</em>
                      </div>
                      <div className="example bad">
                        <span className="label">❌ Bad:</span>
                        <em>"Logo design services"</em>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>2. Pricing Strategy</h3>
                  <div className="pricing-tiers">
                    <div className="tier">
                      <h4>Basic Package</h4>
                      <ul>
                        <li>Entry-level pricing</li>
                        <li>Core service only</li>
                        <li>Limited revisions</li>
                        <li>Standard delivery time</li>
                      </ul>
                      <div className="price-example">Starting at ₦5,000</div>
                    </div>
                    
                    <div className="tier">
                      <h4>Standard Package</h4>
                      <ul>
                        <li>Mid-range pricing</li>
                        <li>Additional features</li>
                        <li>More revisions</li>
                        <li>Faster delivery</li>
                      </ul>
                      <div className="price-example">Around ₦15,000</div>
                    </div>
                    
                    <div className="tier">
                      <h4>Premium Package</h4>
                      <ul>
                        <li>Premium pricing</li>
                        <li>Full service package</li>
                        <li>Unlimited revisions</li>
                        <li>Priority delivery</li>
                      </ul>
                      <div className="price-example">₦30,000+</div>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>3. Gig Description</h3>
                  <div className="description-structure">
                    <div className="section">
                      <h4>Hook (First 2-3 lines)</h4>
                      <p>Grab attention and state your value proposition clearly</p>
                    </div>
                    <div className="section">
                      <h4>What You'll Get</h4>
                      <p>List specific deliverables in bullet points</p>
                    </div>
                    <div className="section">
                      <h4>Why Choose Me</h4>
                      <p>Highlight your experience and unique advantages</p>
                    </div>
                    <div className="section">
                      <h4>Process</h4>
                      <p>Explain your workflow step-by-step</p>
                    </div>
                    <div className="section">
                      <h4>Call to Action</h4>
                      <p>Encourage clients to contact you before ordering</p>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>4. SEO Optimization</h3>
                  <ul>
                    <li>Research relevant keywords for your niche</li>
                    <li>Include keywords naturally in title and description</li>
                    <li>Use tags that clients search for</li>
                    <li>Optimize your gig images with alt text</li>
                  </ul>
                  
                  <div className="seo-tips">
                    <div className="tip">
                      <h4>Keyword Research Tools</h4>
                      <ul>
                        <li>Google Keyword Planner</li>
                        <li>Nairalancers search suggestions</li>
                        <li>Competitor analysis</li>
                        <li>Client feedback and questions</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Step 4: Client Communication */}
          {activeStep === 4 && (
            <div className="step-content">
              <h2>💬 Mastering Client Communication</h2>
              <p className="overview">Professional communication is key to building lasting client relationships and getting repeat business.</p>

              <div className="content-grid">
                <section className="content-block">
                  <h3>1. First Impressions Matter</h3>
                  <div className="response-template">
                    <h4>Sample Initial Response:</h4>
                    <div className="template-box">
                      <p>"Hi [Client Name],</p>
                      <p>Thank you for your interest in my [service type] services! I've reviewed your project requirements and I'm confident I can deliver exactly what you're looking for.</p>
                      <p>I have [X years] of experience in [relevant field] and have successfully completed [number] similar projects.</p>
                      <p>Before we proceed, I'd like to clarify a few details: [specific questions about the project]</p>
                      <p>I'm available to start immediately and can deliver your project within [timeframe].</p>
                      <p>Looking forward to working with you!</p>
                      <p>Best regards,<br/>[Your Name]"</p>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>2. Setting Clear Expectations</h3>
                  <div className="expectations-checklist">
                    <h4>Always Clarify:</h4>
                    <ul>
                      <li>Project scope and deliverables</li>
                      <li>Timeline and milestones</li>
                      <li>Number of revisions included</li>
                      <li>Communication schedule</li>
                      <li>File formats and delivery method</li>
                      <li>What's not included in the price</li>
                    </ul>
                  </div>
                </section>

                <section className="content-block">
                  <h3>3. Professional Communication Guidelines</h3>
                  <div className="communication-dos-donts">
                    <div className="dos">
                      <h4>✅ Do</h4>
                      <ul>
                        <li>Respond within 24 hours</li>
                        <li>Use proper grammar and spelling</li>
                        <li>Be polite and professional</li>
                        <li>Ask clarifying questions</li>
                        <li>Provide regular updates</li>
                        <li>Use client's name</li>
                      </ul>
                    </div>
                    <div className="donts">
                      <h4>❌ Don't</h4>
                      <ul>
                        <li>Use informal language or slang</li>
                        <li>Make promises you can't keep</li>
                        <li>Leave messages unread</li>
                        <li>Argue with difficult clients</li>
                        <li>Share personal information</li>
                        <li>Work outside the platform</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>4. Handling Difficult Situations</h3>
                  <div className="situation-handlers">
                    <div className="situation">
                      <h4>Scope Creep</h4>
                      <p><strong>Response:</strong> "I understand you'd like to add [new requirement]. This falls outside our original agreement, so I'll need to create a custom offer for the additional work."</p>
                    </div>
                    
                    <div className="situation">
                      <h4>Unrealistic Deadlines</h4>
                      <p><strong>Response:</strong> "I want to ensure I deliver quality work that meets your expectations. The standard timeline for this project is [X days]. I can offer rush delivery for an additional fee."</p>
                    </div>
                    
                    <div className="situation">
                      <h4>Difficult Client</h4>
                      <p><strong>Response:</strong> "I understand your concerns. Let me suggest we have a quick call to discuss your requirements in detail so I can better meet your expectations."</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Step 5: Growing Your Business */}
          {activeStep === 5 && (
            <div className="step-content">
              <h2>📈 Growing Your Freelance Business</h2>
              <p className="overview">Scale your freelancing business from side hustle to full-time income with these proven strategies.</p>

              <div className="content-grid">
                <section className="content-block">
                  <h3>1. Building Repeat Clients</h3>
                  <div className="retention-strategies">
                    <div className="strategy">
                      <h4>🎁 Exceed Expectations</h4>
                      <ul>
                        <li>Deliver ahead of schedule when possible</li>
                        <li>Include small bonuses or extras</li>
                        <li>Provide detailed explanations of your work</li>
                        <li>Follow up after project completion</li>
                      </ul>
                    </div>
                    
                    <div className="strategy">
                      <h4>🔄 Stay in Touch</h4>
                      <ul>
                        <li>Send holiday greetings</li>
                        <li>Share relevant industry updates</li>
                        <li>Offer new services that might interest them</li>
                        <li>Ask for feedback on completed projects</li>
                      </ul>
                    </div>
                    
                    <div className="strategy">
                      <h4>💡 Proactive Suggestions</h4>
                      <ul>
                        <li>Identify opportunities for improvement</li>
                        <li>Suggest complementary services</li>
                        <li>Share industry best practices</li>
                        <li>Offer package deals for ongoing work</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>2. Increasing Your Rates</h3>
                  <div className="rate-increase-guide">
                    <div className="when-to-increase">
                      <h4>When to Raise Your Rates:</h4>
                      <ul>
                        <li>After gaining 50+ positive reviews</li>
                        <li>When demand exceeds your availability</li>
                        <li>After developing new skills or certifications</li>
                        <li>At least every 6-12 months</li>
                      </ul>
                    </div>
                    
                    <div className="how-to-increase">
                      <h4>How to Raise Rates:</h4>
                      <ul>
                        <li>Research competitor pricing</li>
                        <li>Increase rates for new clients first</li>
                        <li>Offer grandfathered pricing to loyal clients</li>
                        <li>Provide advance notice (30 days)</li>
                        <li>Justify increases with added value</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>3. Time Management & Productivity</h3>
                  <div className="productivity-tips">
                    <div className="tip-category">
                      <h4>⏰ Time Blocking</h4>
                      <ul>
                        <li>Schedule specific hours for client work</li>
                        <li>Block time for admin tasks</li>
                        <li>Set aside time for learning new skills</li>
                        <li>Plan breaks to avoid burnout</li>
                      </ul>
                    </div>
                    
                    <div className="tip-category">
                      <h4>🔧 Tools & Systems</h4>
                      <ul>
                        <li>Use project management tools</li>
                        <li>Create templates for common tasks</li>
                        <li>Automate repetitive processes</li>
                        <li>Track time for accurate pricing</li>
                      </ul>
                    </div>
                    
                    <div className="tip-category">
                      <h4>🎯 Focus Strategies</h4>
                      <ul>
                        <li>Eliminate distractions during work hours</li>
                        <li>Use the Pomodoro Technique</li>
                        <li>Batch similar tasks together</li>
                        <li>Set daily and weekly goals</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>4. Expanding Your Services</h3>
                  <div className="expansion-strategies">
                    <div className="expansion-type">
                      <h4>🔄 Related Services</h4>
                      <p>Add complementary services to your existing offerings</p>
                      <div className="example">
                        <em>Example: Logo designer → Brand package (logo + business cards + letterhead)</em>
                      </div>
                    </div>
                    
                    <div className="expansion-type">
                      <h4>📦 Package Deals</h4>
                      <p>Bundle services for better value and higher order values</p>
                      <div className="example">
                        <em>Example: Website + SEO optimization + social media setup</em>
                      </div>
                    </div>
                    
                    <div className="expansion-type">
                      <h4>🎓 Skill Development</h4>
                      <p>Learn new skills to serve existing clients better</p>
                      <div className="example">
                        <em>Example: Web developer learning UX/UI design</em>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        <div className="navigation">
          <button 
            className="nav-btn prev" 
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
          >
            ← Previous Step
          </button>
          
          <div className="step-indicator">
            Step {activeStep} of {steps.length}
          </div>
          
          <button 
            className="nav-btn next" 
            onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
            disabled={activeStep === steps.length}
          >
            Next Step →
          </button>
        </div>

        <div className="footer">
          <div className="actions">
            <Link to="/resources/pricing-tips" className="link-btn">
              Pricing Tips Guide
            </Link>
            <Link to="/register" className="primary-btn">
              Start Your Journey
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

export default FreelancerGuide;
