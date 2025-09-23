import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PortfolioTips.scss';

const PortfolioTips = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = [
    { id: 'general', name: 'General Tips', icon: '📝' },
    { id: 'design', name: 'Design Portfolio', icon: '🎨' },
    { id: 'development', name: 'Development Portfolio', icon: '💻' },
    { id: 'writing', name: 'Writing Portfolio', icon: '✍️' },
    { id: 'marketing', name: 'Marketing Portfolio', icon: '📈' },
    { id: 'photography', name: 'Photography Portfolio', icon: '📸' }
  ];

  const portfolioData = {
    general: {
      title: "Essential Portfolio Principles",
      tips: [
        {
          icon: "🎯",
          title: "Quality Over Quantity",
          description: "Showcase 5-10 of your absolute best pieces rather than overwhelming viewers with mediocre work",
          examples: [
            "Choose work that demonstrates different skills",
            "Include projects that show problem-solving ability",
            "Display pieces that generated real results for clients",
            "Remove outdated or low-quality work regularly"
          ]
        },
        {
          icon: "📖",
          title: "Tell the Story Behind Each Project",
          description: "Context and process are as important as the final result",
          examples: [
            "Explain the client's challenge or brief",
            "Describe your approach and methodology",
            "Highlight obstacles overcome and solutions found",
            "Share measurable results and client feedback"
          ]
        },
        {
          icon: "🎨",
          title: "Professional Presentation",
          description: "How you present your work reflects your professionalism",
          examples: [
            "Use consistent formatting and styling",
            "Include high-quality images and screenshots",
            "Write clear, error-free descriptions",
            "Organize work in logical categories"
          ]
        },
        {
          icon: "📊",
          title: "Show Results and Impact",
          description: "Demonstrate the value you bring to clients through measurable outcomes",
          examples: [
            "Include metrics like increased sales or traffic",
            "Show before/after comparisons",
            "Share client testimonials and feedback",
            "Highlight awards or recognition received"
          ]
        }
      ]
    },
    design: {
      title: "Design Portfolio Excellence",
      tips: [
        {
          icon: "🖼️",
          title: "Visual Impact First",
          description: "Your portfolio itself should demonstrate your design skills",
          examples: [
            "Use a clean, modern layout that showcases your aesthetic",
            "Ensure fast loading times for all images",
            "Make your portfolio mobile-responsive",
            "Choose a cohesive color scheme and typography"
          ]
        },
        {
          icon: "🎭",
          title: "Show Design Process",
          description: "Clients want to understand how you think and work",
          examples: [
            "Include sketches, wireframes, and iterations",
            "Show user research and mood boards",
            "Explain design decisions and rationale",
            "Document client feedback and revisions"
          ]
        },
        {
          icon: "🌈",
          title: "Demonstrate Versatility",
          description: "Show you can adapt to different styles and requirements",
          examples: [
            "Include work from various industries",
            "Show different design styles and approaches",
            "Display both print and digital work",
            "Include personal projects alongside client work"
          ]
        },
        {
          icon: "💡",
          title: "Highlight Problem-Solving",
          description: "Show how your designs solve real business problems",
          examples: [
            "Explain the business challenge each design addressed",
            "Show how design improved user experience",
            "Include conversion rate improvements",
            "Highlight brand recognition or engagement metrics"
          ]
        }
      ]
    },
    development: {
      title: "Development Portfolio Mastery",
      tips: [
        {
          icon: "⚡",
          title: "Live Demos Are Essential",
          description: "Nothing beats showing working code in action",
          examples: [
            "Host projects on platforms like Netlify or Vercel",
            "Include links to GitHub repositories",
            "Show responsive design on different devices",
            "Demonstrate interactive features and functionality"
          ]
        },
        {
          icon: "🔧",
          title: "Showcase Technical Skills",
          description: "Clearly demonstrate your technical competencies",
          examples: [
            "List technologies and frameworks used",
            "Show code quality through clean repositories",
            "Include API integrations and database work",
            "Demonstrate testing and deployment processes"
          ]
        },
        {
          icon: "📱",
          title: "Show Full Stack Capabilities",
          description: "Demonstrate your ability to work across the technology stack",
          examples: [
            "Include both frontend and backend projects",
            "Show database design and management",
            "Demonstrate DevOps and deployment skills",
            "Include mobile app development if applicable"
          ]
        },
        {
          icon: "🚀",
          title: "Performance and Scalability",
          description: "Show you understand production-ready development",
          examples: [
            "Include performance metrics and optimization",
            "Show scalable architecture decisions",
            "Demonstrate security best practices",
            "Include monitoring and analytics implementation"
          ]
        }
      ]
    },
    writing: {
      title: "Writing Portfolio Success",
      tips: [
        {
          icon: "📚",
          title: "Diverse Writing Samples",
          description: "Show your range across different formats and industries",
          examples: [
            "Include blog posts, articles, and copywriting",
            "Show work from different industries or niches",
            "Display various content lengths and formats",
            "Include both technical and creative writing"
          ]
        },
        {
          icon: "📈",
          title: "Results-Driven Content",
          description: "Highlight the impact of your writing on business goals",
          examples: [
            "Include traffic increases from your content",
            "Show conversion rates for sales copy",
            "Display engagement metrics (shares, comments)",
            "Include client testimonials about results"
          ]
        },
        {
          icon: "🎯",
          title: "Target Audience Awareness",
          description: "Demonstrate your ability to write for specific audiences",
          examples: [
            "Show how you adapt tone for different audiences",
            "Include B2B and B2C writing samples",
            "Display technical writing for experts",
            "Show simplified explanations for general audiences"
          ]
        },
        {
          icon: "🔍",
          title: "Research and Expertise",
          description: "Show your ability to research and understand complex topics",
          examples: [
            "Include well-researched industry pieces",
            "Show data-driven content with statistics",
            "Display interview-based articles",
            "Include fact-checked and sourced content"
          ]
        }
      ]
    },
    marketing: {
      title: "Marketing Portfolio Power",
      tips: [
        {
          icon: "📊",
          title: "Data-Driven Results",
          description: "Marketing is about measurable outcomes - show them",
          examples: [
            "Include ROI improvements from campaigns",
            "Show lead generation and conversion metrics",
            "Display social media growth statistics",
            "Include email marketing performance data"
          ]
        },
        {
          icon: "🎯",
          title: "Campaign Strategy Documentation",
          description: "Show your strategic thinking behind successful campaigns",
          examples: [
            "Include target audience research and personas",
            "Show campaign planning and execution timelines",
            "Display A/B testing results and optimizations",
            "Include budget allocation and spend optimization"
          ]
        },
        {
          icon: "📱",
          title: "Multi-Channel Expertise",
          description: "Demonstrate your ability across various marketing channels",
          examples: [
            "Show social media, email, and PPC campaigns",
            "Include content marketing and SEO results",
            "Display influencer and partnership campaigns",
            "Show traditional and digital marketing integration"
          ]
        },
        {
          icon: "🚀",
          title: "Growth Hacking Examples",
          description: "Show creative solutions that drove exceptional growth",
          examples: [
            "Include viral campaigns or content",
            "Show creative problem-solving approaches",
            "Display innovative use of marketing tools",
            "Include case studies of rapid growth achievements"
          ]
        }
      ]
    },
    photography: {
      title: "Photography Portfolio Brilliance",
      tips: [
        {
          icon: "📸",
          title: "Image Quality Is Everything",
          description: "Your technical skills should be evident in every shot",
          examples: [
            "Use high-resolution images optimized for web",
            "Show mastery of lighting and composition",
            "Display consistent editing style and quality",
            "Include both natural and studio lighting work"
          ]
        },
        {
          icon: "🎨",
          title: "Show Your Unique Style",
          description: "Develop and showcase a distinctive photographic voice",
          examples: [
            "Maintain consistent color grading and editing",
            "Show signature composition techniques",
            "Display your preferred subjects and themes",
            "Include personal projects that define your style"
          ]
        },
        {
          icon: "🌟",
          title: "Versatility Within Specialization",
          description: "Show range while maintaining your specialty focus",
          examples: [
            "Include different types within your specialty (e.g., wedding ceremony, reception, portraits)",
            "Show various lighting conditions and environments",
            "Display different client types and project scales",
            "Include both staged and candid photography"
          ]
        },
        {
          icon: "💼",
          title: "Professional Context",
          description: "Show the commercial viability of your photography",
          examples: [
            "Include client testimonials and success stories",
            "Show how your photos were used in marketing",
            "Display published work in magazines or online",
            "Include before/after editing examples"
          ]
        }
      ]
    }
  };

  const commonMistakes = [
    {
      mistake: "Including Too Much Work",
      description: "Overwhelming viewers with quantity instead of focusing on quality",
      solution: "Curate ruthlessly - 8-12 pieces maximum, each serving a specific purpose"
    },
    {
      mistake: "Poor Image Quality",
      description: "Low-resolution, poorly lit, or amateur-looking presentation images",
      solution: "Invest in professional photography or learn proper screenshot techniques"
    },
    {
      mistake: "No Context or Explanation",
      description: "Showing work without explaining the problem solved or process used",
      solution: "Write compelling case studies that tell the story behind each project"
    },
    {
      mistake: "Outdated Work",
      description: "Including projects that no longer represent your current skill level",
      solution: "Regularly audit and update your portfolio, removing outdated pieces"
    },
    {
      mistake: "Generic Descriptions",
      description: "Using vague or clichéd descriptions that don't add value",
      solution: "Write specific, results-focused descriptions that highlight your unique contribution"
    }
  ];

  return (
    <div className="portfolio-tips">
      <div className="container">
        <div className="header">
          <h1>Portfolio Tips & Best Practices</h1>
          <p className="subtitle">Build a portfolio that wins clients and showcases your expertise</p>
        </div>

        {/* Category Navigation */}
        <div className="category-nav">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Category Content */}
        <div className="category-content">
          <h2>{portfolioData[selectedCategory].title}</h2>
          
          <div className="tips-grid">
            {portfolioData[selectedCategory].tips.map((tip, index) => (
              <div key={index} className="tip-card">
                <div className="tip-header">
                  <span className="tip-icon">{tip.icon}</span>
                  <h3>{tip.title}</h3>
                </div>
                <p className="tip-description">{tip.description}</p>
                <div className="tip-examples">
                  <h4>Key Points:</h4>
                  <ul>
                    {tip.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Checklist */}
        <div className="checklist-section">
          <h2>Portfolio Checklist</h2>
          <div className="checklist-grid">
            <div className="checklist-category">
              <h3>📋 Content Essentials</h3>
              <div className="checklist-items">
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>5-10 high-quality project samples</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Detailed case studies for key projects</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Professional bio and photo</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Clear contact information</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Skills and services list</span>
                </label>
              </div>
            </div>

            <div className="checklist-category">
              <h3>🎨 Design & Presentation</h3>
              <div className="checklist-items">
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Clean, professional layout</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Mobile-responsive design</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Fast loading times</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Consistent visual branding</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Easy navigation</span>
                </label>
              </div>
            </div>

            <div className="checklist-category">
              <h3>🔗 Technical Setup</h3>
              <div className="checklist-items">
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Professional domain name</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>SEO optimization</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Analytics tracking</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Contact form functionality</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>SSL certificate</span>
                </label>
              </div>
            </div>

            <div className="checklist-category">
              <h3>📈 Optimization</h3>
              <div className="checklist-items">
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Regular content updates</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Client testimonials</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Social media integration</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Blog or insights section</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Clear call-to-action</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="mistakes-section">
          <h2>Avoid These Common Mistakes</h2>
          <div className="mistakes-grid">
            {commonMistakes.map((item, index) => (
              <div key={index} className="mistake-card">
                <h3>❌ {item.mistake}</h3>
                <p className="mistake-description">{item.description}</p>
                <div className="mistake-solution">
                  <strong>Solution:</strong> {item.solution}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Integration */}
        <div className="integration-section">
          <h2>Integrating with Nairalancers</h2>
          <div className="integration-content">
            <div className="integration-tips">
              <h3>Optimize Your Nairalancers Profile</h3>
              <ul>
                <li>Link to your external portfolio website</li>
                <li>Upload your best 3-5 samples directly to the platform</li>
                <li>Write compelling gig descriptions that reference your portfolio</li>
                <li>Use consistent branding across your profile and external portfolio</li>
                <li>Include portfolio pieces that demonstrate the services you offer</li>
              </ul>
            </div>
            <div className="integration-benefits">
              <h3>Benefits of a Strong Portfolio</h3>
              <ul>
                <li>Higher conversion rates from inquiries to orders</li>
                <li>Ability to charge premium rates for your services</li>
                <li>Attraction of higher-quality, long-term clients</li>
                <li>Increased trust and credibility with potential clients</li>
                <li>Better search ranking on the Nairalancers platform</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tools and Resources */}
        <div className="resources-section">
          <h2>Recommended Tools & Resources</h2>
          <div className="resources-grid">
            <div className="resource-category">
              <h3>🌐 Portfolio Platforms</h3>
              <ul>
                <li>Behance (Creative work)</li>
                <li>Dribbble (Design)</li>
                <li>GitHub Pages (Development)</li>
                <li>WordPress/Webflow (Custom sites)</li>
                <li>Adobe Portfolio (Integrated with Creative Cloud)</li>
              </ul>
            </div>
            
            <div className="resource-category">
              <h3>📸 Image Optimization</h3>
              <ul>
                <li>TinyPNG (Image compression)</li>
                <li>Canva (Graphics creation)</li>
                <li>Figma (Design presentation)</li>
                <li>Photoshop (Image editing)</li>
                <li>Unsplash (Stock photos)</li>
              </ul>
            </div>
            
            <div className="resource-category">
              <h3>📊 Analytics & SEO</h3>
              <ul>
                <li>Google Analytics (Traffic analysis)</li>
                <li>Google Search Console (SEO monitoring)</li>
                <li>Hotjar (User behavior)</li>
                <li>SEMrush (SEO optimization)</li>
                <li>PageSpeed Insights (Performance)</li>
              </ul>
            </div>
            
            <div className="resource-category">
              <h3>✍️ Content Creation</h3>
              <ul>
                <li>Grammarly (Writing assistance)</li>
                <li>Notion (Documentation)</li>
                <li>Loom (Video explanations)</li>
                <li>Typeform (Contact forms)</li>
                <li>Calendly (Meeting scheduling)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer">
          <div className="actions">
            <Link to="/resources/freelancer-guide" className="link-btn">
              Freelancer Guide
            </Link>
            <Link to="/resources/pricing-tips" className="link-btn">
              Pricing Tips
            </Link>
            <Link to="/register" className="primary-btn">
              Build Your Profile
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

export default PortfolioTips;
