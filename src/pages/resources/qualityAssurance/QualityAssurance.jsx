import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './QualityAssurance.scss';

const QualityAssurance = () => {
  const [activeCategory, setActiveCategory] = useState('overview');
  const [completedChecks, setCompletedChecks] = useState({});

  const categories = [
    { id: 'overview', label: 'QA Overview', icon: '🎯' },
    { id: 'testing', label: 'Testing Methods', icon: '🔍' },
    { id: 'standards', label: 'Quality Standards', icon: '⭐' },
    { id: 'tools', label: 'QA Tools', icon: '🛠️' },
    { id: 'processes', label: 'QA Processes', icon: '📋' }
  ];

  const testingMethods = [
    {
      id: 'functional',
      title: 'Functional Testing',
      description: 'Verify that all features work according to specifications',
      icon: '⚙️',
      techniques: [
        'Unit Testing - Test individual components',
        'Integration Testing - Test component interactions',
        'System Testing - Test complete functionality',
        'User Acceptance Testing - Client validation'
      ],
      tools: ['Jest', 'Cypress', 'Selenium', 'Postman'],
      example: 'Testing a login form: valid credentials should grant access, invalid should show error messages.'
    },
    {
      id: 'performance',
      title: 'Performance Testing',
      description: 'Ensure optimal speed, responsiveness, and resource usage',
      icon: '⚡',
      techniques: [
        'Load Testing - Normal expected usage',
        'Stress Testing - Beyond normal capacity', 
        'Volume Testing - Large amounts of data',
        'Endurance Testing - Extended periods'
      ],
      tools: ['Lighthouse', 'GTmetrix', 'LoadRunner', 'JMeter'],
      example: 'Website should load in under 3 seconds and handle 100 concurrent users without issues.'
    },
    {
      id: 'usability',
      title: 'Usability Testing',
      description: 'Evaluate user experience and interface design',
      icon: '👥',
      techniques: [
        'User Journey Testing - Complete task flows',
        'A/B Testing - Compare design variations',
        'Accessibility Testing - WCAG compliance',
        'Mobile Responsiveness - Cross-device testing'
      ],
      tools: ['Hotjar', 'UserTesting', 'Figma', 'BrowserStack'],
      example: 'Users should complete checkout process within 3 clicks and understand navigation intuitively.'
    },
    {
      id: 'security',
      title: 'Security Testing',
      description: 'Identify vulnerabilities and ensure data protection',
      icon: '🔒',
      techniques: [
        'Authentication Testing - Login security',
        'Authorization Testing - Access controls',
        'Data Protection - Encryption & privacy',
        'Input Validation - Prevent injections'
      ],
      tools: ['OWASP ZAP', 'Burp Suite', 'Nessus', 'SonarQube'],
      example: 'SQL injection attempts should be blocked, passwords encrypted, and user data protected.'
    },
    {
      id: 'compatibility',
      title: 'Compatibility Testing',
      description: 'Ensure consistent experience across platforms',
      icon: '🌐',
      techniques: [
        'Browser Testing - Chrome, Firefox, Safari',
        'Device Testing - Desktop, tablet, mobile',
        'OS Testing - Windows, macOS, Linux',
        'Version Testing - Backward compatibility'
      ],
      tools: ['BrowserStack', 'LambdaTest', 'CrossBrowserTesting', 'Sauce Labs'],
      example: 'Website functions identically on Chrome 90+ and Safari 14+ across Windows and macOS.'
    },
    {
      id: 'api',
      title: 'API Testing',
      description: 'Validate data exchange and integration points',
      icon: '🔗',
      techniques: [
        'Endpoint Testing - Request/response validation',
        'Data Format Testing - JSON/XML structure',
        'Error Handling - Invalid input responses',
        'Rate Limiting - Throttling behavior'
      ],
      tools: ['Postman', 'Insomnia', 'Newman', 'REST Assured'],
      example: 'API returns proper HTTP status codes, handles rate limiting, and validates input data.'
    }
  ];

  const qualityStandards = {
    webDevelopment: {
      title: 'Web Development Standards',
      icon: '💻',
      standards: [
        {
          category: 'Code Quality',
          requirements: [
            'Follow established coding conventions and style guides',
            'Maintain consistent indentation and naming patterns',
            'Include meaningful comments and documentation',
            'Remove unused code and optimize performance',
            'Implement proper error handling and validation'
          ]
        },
        {
          category: 'Performance',
          requirements: [
            'Page load time under 3 seconds on 3G connection',
            'First Contentful Paint (FCP) under 1.5 seconds',
            'Cumulative Layout Shift (CLS) under 0.1',
            'Images optimized and properly sized',
            'Minimize HTTP requests and file sizes'
          ]
        },
        {
          category: 'Accessibility',
          requirements: [
            'WCAG 2.1 AA compliance minimum',
            'Proper heading structure (H1-H6)',
            'Alt text for all images',
            'Keyboard navigation support',
            'Sufficient color contrast ratios'
          ]
        },
        {
          category: 'SEO',
          requirements: [
            'Proper meta tags and descriptions',
            'Semantic HTML structure',
            'Schema markup where applicable',
            'Mobile-first responsive design',
            'Fast loading and Core Web Vitals optimization'
          ]
        }
      ]
    },
    design: {
      title: 'Design Standards',
      icon: '🎨',
      standards: [
        {
          category: 'Visual Design',
          requirements: [
            'Consistent color palette and typography',
            'Proper hierarchy and white space usage',
            'High-quality, optimized graphics',
            'Brand guideline compliance',
            'Professional aesthetic appropriate to industry'
          ]
        },
        {
          category: 'User Experience',
          requirements: [
            'Intuitive navigation and user flows',
            'Clear call-to-action placement',
            'Consistent interactive elements',
            'Error prevention and helpful feedback',
            'Mobile-optimized touch interfaces'
          ]
        },
        {
          category: 'Technical Delivery',
          requirements: [
            'Files organized in logical folder structure',
            'Proper naming conventions for assets',
            'Multiple format delivery (PNG, SVG, etc.)',
            'Source files included for future edits',
            'Style guide documentation provided'
          ]
        }
      ]
    },
    content: {
      title: 'Content Standards',
      icon: '✍️',
      standards: [
        {
          category: 'Writing Quality',
          requirements: [
            'Grammar and spelling accuracy',
            'Consistent tone and voice',
            'Clear, concise communication',
            'Proper citation and attribution',
            'Plagiarism-free original content'
          ]
        },
        {
          category: 'SEO Optimization',
          requirements: [
            'Keyword research and strategic placement',
            'Proper heading tag structure',
            'Meta descriptions and title optimization',
            'Internal and external linking strategy',
            'Content length appropriate for topic'
          ]
        },
        {
          category: 'Audience Targeting',
          requirements: [
            'Content tailored to target demographic',
            'Appropriate reading level and complexity',
            'Cultural sensitivity and localization',
            'Value-driven and actionable information',
            'Engaging headlines and introductions'
          ]
        }
      ]
    }
  };

  const qaTools = [
    {
      category: 'Testing Automation',
      tools: [
        {
          name: 'Cypress',
          description: 'End-to-end testing framework for web applications',
          useCase: 'Automated UI testing and integration testing',
          pricing: 'Free (Open Source)',
          difficulty: 'Intermediate'
        },
        {
          name: 'Selenium',
          description: 'Web browser automation for testing web applications',
          useCase: 'Cross-browser automated testing',
          pricing: 'Free (Open Source)',
          difficulty: 'Advanced'
        },
        {
          name: 'Jest',
          description: 'JavaScript testing framework with built-in assertions',
          useCase: 'Unit testing for JavaScript applications',
          pricing: 'Free (Open Source)',
          difficulty: 'Beginner'
        },
        {
          name: 'Postman',
          description: 'API development and testing platform',
          useCase: 'API testing and documentation',
          pricing: 'Free - $20/month',
          difficulty: 'Beginner'
        }
      ]
    },
    {
      category: 'Performance Testing',
      tools: [
        {
          name: 'Google Lighthouse',
          description: 'Open-source tool for improving web page quality',
          useCase: 'Performance, accessibility, and SEO audits',
          pricing: 'Free',
          difficulty: 'Beginner'
        },
        {
          name: 'GTmetrix',
          description: 'Website speed and performance monitoring',
          useCase: 'Page speed analysis and optimization',
          pricing: 'Free - $14.95/month',
          difficulty: 'Beginner'
        },
        {
          name: 'WebPageTest',
          description: 'Website performance testing from multiple locations',
          useCase: 'Detailed performance analysis',
          pricing: 'Free',
          difficulty: 'Intermediate'
        },
        {
          name: 'LoadRunner',
          description: 'Load testing software for applications',
          useCase: 'Enterprise-level performance testing',
          pricing: 'Contact for pricing',
          difficulty: 'Advanced'
        }
      ]
    },
    {
      category: 'Cross-Browser Testing',
      tools: [
        {
          name: 'BrowserStack',
          description: 'Cloud-based cross-browser testing platform',
          useCase: 'Testing across multiple browsers and devices',
          pricing: '$29 - $199/month',
          difficulty: 'Beginner'
        },
        {
          name: 'LambdaTest',
          description: 'Cloud-based browser and app testing platform',
          useCase: 'Cross-browser and mobile testing',
          pricing: '$15 - $99/month',
          difficulty: 'Beginner'
        },
        {
          name: 'Sauce Labs',
          description: 'Continuous testing cloud for web and mobile',
          useCase: 'Automated cross-platform testing',
          pricing: '$39 - $449/month',
          difficulty: 'Intermediate'
        }
      ]
    },
    {
      category: 'Code Quality',
      tools: [
        {
          name: 'SonarQube',
          description: 'Code quality and security analysis platform',
          useCase: 'Static code analysis and vulnerability detection',
          pricing: 'Free - Enterprise pricing',
          difficulty: 'Intermediate'
        },
        {
          name: 'ESLint',
          description: 'JavaScript linting utility for code quality',
          useCase: 'JavaScript code quality and style checking',
          pricing: 'Free (Open Source)',
          difficulty: 'Beginner'
        },
        {
          name: 'Prettier',
          description: 'Code formatter for consistent styling',
          useCase: 'Automatic code formatting',
          pricing: 'Free (Open Source)',
          difficulty: 'Beginner'
        }
      ]
    }
  ];

  const qaProcesses = [
    {
      phase: 'Planning',
      title: 'QA Planning & Strategy',
      duration: '10-15% of project time',
      activities: [
        'Define quality objectives and success criteria',
        'Create comprehensive test plan documentation',
        'Identify testing scope, approach, and methodology',
        'Establish testing schedule and resource allocation',
        'Set up testing environments and data preparation'
      ],
      deliverables: [
        'Test Plan Document',
        'Test Strategy Document',
        'Testing Schedule',
        'Resource Allocation Plan'
      ]
    },
    {
      phase: 'Design',
      title: 'Test Case Design',
      duration: '15-20% of project time',
      activities: [
        'Analyze requirements and specifications',
        'Design detailed test cases and scenarios',
        'Create test data and environment setup',
        'Develop automated test scripts where applicable',
        'Review and validate test cases with stakeholders'
      ],
      deliverables: [
        'Test Cases Documentation',
        'Test Data Sets',
        'Automated Test Scripts',
        'Test Environment Setup Guide'
      ]
    },
    {
      phase: 'Execution',
      title: 'Test Execution',
      duration: '50-60% of project time',
      activities: [
        'Execute manual and automated test cases',
        'Document and track defects found',
        'Perform regression testing on fixes',
        'Conduct exploratory testing sessions',
        'Validate performance and security requirements'
      ],
      deliverables: [
        'Test Execution Reports',
        'Defect Reports and Tracking',
        'Test Results Documentation',
        'Performance Test Results'
      ]
    },
    {
      phase: 'Reporting',
      title: 'Results & Reporting',
      duration: '10-15% of project time',
      activities: [
        'Compile comprehensive test reports',
        'Analyze test coverage and results',
        'Document lessons learned and improvements',
        'Present findings to stakeholders',
        'Provide recommendations for production'
      ],
      deliverables: [
        'Final Test Report',
        'Test Coverage Analysis',
        'Quality Metrics Dashboard',
        'Go-Live Recommendations'
      ]
    }
  ];

  const handleCheckboxChange = (checkId) => {
    setCompletedChecks(prev => ({
      ...prev,
      [checkId]: !prev[checkId]
    }));
  };

  return (
    <div className="quality-assurance">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <nav className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Quality Assurance</span>
          </nav>
          
          <div className="header-content">
            <h1>Quality Assurance Excellence</h1>
            <p className="header-subtitle">
              Master quality assurance practices that ensure exceptional deliverables 
              and client satisfaction. Learn industry-standard QA methodologies and tools.
            </p>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="category-navigation">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="qa-content">
          {activeCategory === 'overview' && (
            <div className="overview-section">
              <div className="qa-importance">
                <h2>Why Quality Assurance Matters</h2>
                <div className="importance-grid">
                  <div className="importance-card">
                    <div className="card-icon">💰</div>
                    <h3>Cost Savings</h3>
                    <p>Fixing bugs early costs 10x less than fixing them after launch</p>
                    <div className="stat">Up to 90% cost reduction</div>
                  </div>
                  <div className="importance-card">
                    <div className="card-icon">👥</div>
                    <h3>Client Satisfaction</h3>
                    <p>Quality delivery leads to higher client satisfaction and retention</p>
                    <div className="stat">95% client retention rate</div>
                  </div>
                  <div className="importance-card">
                    <div className="card-icon">🚀</div>
                    <h3>Reputation</h3>
                    <p>Consistent quality builds trust and attracts premium clients</p>
                    <div className="stat">3x higher project rates</div>
                  </div>
                  <div className="importance-card">
                    <div className="card-icon">⏱️</div>
                    <h3>Time Efficiency</h3>
                    <p>Proper QA reduces rework and accelerates project delivery</p>
                    <div className="stat">40% faster delivery</div>
                  </div>
                </div>
              </div>

              <div className="qa-principles">
                <h2>Core QA Principles</h2>
                <div className="principles-grid">
                  <div className="principle-card">
                    <h3>🎯 Prevention over Detection</h3>
                    <p>Focus on preventing defects rather than just finding them. Build quality into the process from the start.</p>
                  </div>
                  <div className="principle-card">
                    <h3>📊 Continuous Improvement</h3>
                    <p>Regularly review and improve QA processes based on feedback and lessons learned.</p>
                  </div>
                  <div className="principle-card">
                    <h3>👤 Customer-Centric</h3>
                    <p>Always consider the end user experience and business value in quality decisions.</p>
                  </div>
                  <div className="principle-card">
                    <h3>🔍 Risk-Based Testing</h3>
                    <p>Prioritize testing efforts based on risk assessment and business impact.</p>
                  </div>
                  <div className="principle-card">
                    <h3>🤝 Collaborative Approach</h3>
                    <p>QA is a team responsibility, not just the tester's job. Everyone owns quality.</p>
                  </div>
                  <div className="principle-card">
                    <h3>📈 Measurable Quality</h3>
                    <p>Use metrics and data to track quality progress and make informed decisions.</p>
                  </div>
                </div>
              </div>

              <div className="qa-benefits">
                <h2>Benefits of Professional QA</h2>
                <div className="benefits-comparison">
                  <div className="benefit-column">
                    <h3>For Freelancers</h3>
                    <ul>
                      <li>Higher client satisfaction scores</li>
                      <li>Reduced revision requests</li>
                      <li>Premium pricing opportunities</li>
                      <li>Stronger portfolio and reputation</li>
                      <li>More referrals and repeat clients</li>
                      <li>Competitive advantage in marketplace</li>
                    </ul>
                  </div>
                  <div className="benefit-column">
                    <h3>For Clients</h3>
                    <ul>
                      <li>Predictable project outcomes</li>
                      <li>Reduced post-launch issues</li>
                      <li>Better return on investment</li>
                      <li>Faster time to market</li>
                      <li>Enhanced user experience</li>
                      <li>Lower maintenance costs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'testing' && (
            <div className="testing-section">
              <h2>Testing Methodologies</h2>
              <div className="testing-methods">
                {testingMethods.map(method => (
                  <div key={method.id} className="method-card">
                    <div className="method-header">
                      <div className="method-icon">{method.icon}</div>
                      <div className="method-info">
                        <h3>{method.title}</h3>
                        <p>{method.description}</p>
                      </div>
                    </div>

                    <div className="method-content">
                      <div className="method-section">
                        <h4>Testing Techniques</h4>
                        <ul>
                          {method.techniques.map((technique, index) => (
                            <li key={index}>{technique}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="method-section">
                        <h4>Recommended Tools</h4>
                        <div className="tools-tags">
                          {method.tools.map((tool, index) => (
                            <span key={index} className="tool-tag">{tool}</span>
                          ))}
                        </div>
                      </div>

                      <div className="method-section">
                        <h4>Example</h4>
                        <p className="example-text">{method.example}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'standards' && (
            <div className="standards-section">
              <h2>Quality Standards by Service Type</h2>
              <div className="standards-grid">
                {Object.entries(qualityStandards).map(([key, standard]) => (
                  <div key={key} className="standard-category">
                    <div className="category-header">
                      <span className="category-icon">{standard.icon}</span>
                      <h3>{standard.title}</h3>
                    </div>
                    
                    {standard.standards.map((section, index) => (
                      <div key={index} className="standard-section">
                        <h4>{section.category}</h4>
                        <div className="requirements-list">
                          {section.requirements.map((requirement, reqIndex) => (
                            <label key={reqIndex} className="requirement-item">
                              <input 
                                type="checkbox"
                                checked={completedChecks[`${key}-${index}-${reqIndex}`] || false}
                                onChange={() => handleCheckboxChange(`${key}-${index}-${reqIndex}`)}
                              />
                              <span className="requirement-text">{requirement}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'tools' && (
            <div className="tools-section">
              <h2>QA Tools & Resources</h2>
              <div className="tools-categories">
                {qaTools.map((category, index) => (
                  <div key={index} className="tool-category">
                    <h3>{category.category}</h3>
                    <div className="tools-grid">
                      {category.tools.map((tool, toolIndex) => (
                        <div key={toolIndex} className="tool-card">
                          <div className="tool-header">
                            <h4>{tool.name}</h4>
                            <span className={`difficulty-badge ${tool.difficulty.toLowerCase()}`}>
                              {tool.difficulty}
                            </span>
                          </div>
                          <p className="tool-description">{tool.description}</p>
                          <div className="tool-details">
                            <div className="tool-use-case">
                              <strong>Use Case:</strong> {tool.useCase}
                            </div>
                            <div className="tool-pricing">
                              <strong>Pricing:</strong> {tool.pricing}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'processes' && (
            <div className="processes-section">
              <h2>QA Process Framework</h2>
              <div className="process-timeline">
                {qaProcesses.map((process, index) => (
                  <div key={index} className="process-phase">
                    <div className="phase-marker">
                      <div className="phase-number">{index + 1}</div>
                      <div className="phase-line"></div>
                    </div>
                    <div className="phase-content">
                      <div className="phase-header">
                        <h3>{process.title}</h3>
                        <span className="phase-duration">{process.duration}</span>
                      </div>
                      
                      <div className="phase-details">
                        <div className="phase-activities">
                          <h4>Key Activities</h4>
                          <ul>
                            {process.activities.map((activity, actIndex) => (
                              <li key={actIndex}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="phase-deliverables">
                          <h4>Deliverables</h4>
                          <ul>
                            {process.deliverables.map((deliverable, delIndex) => (
                              <li key={delIndex}>{deliverable}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="qa-metrics">
                <h3>Key QA Metrics to Track</h3>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <h4>Defect Density</h4>
                    <p>Number of defects per lines of code or function points</p>
                    <div className="metric-formula">Defects Found / Size of Deliverable</div>
                  </div>
                  <div className="metric-card">
                    <h4>Test Coverage</h4>
                    <p>Percentage of code or requirements covered by tests</p>
                    <div className="metric-formula">Tested Items / Total Items × 100</div>
                  </div>
                  <div className="metric-card">
                    <h4>Defect Escape Rate</h4>
                    <p>Percentage of defects found after delivery</p>
                    <div className="metric-formula">Post-Release Defects / Total Defects × 100</div>
                  </div>
                  <div className="metric-card">
                    <h4>Test Execution Rate</h4>
                    <p>Percentage of planned tests actually executed</p>
                    <div className="metric-formula">Tests Executed / Tests Planned × 100</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Elevate Your Quality Standards</h2>
            <p>
              Join Nairalancers and showcase your commitment to quality. Clients value 
              freelancers who deliver exceptional work consistently.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">
                Start Delivering Quality
              </Link>
              <Link to="/resources/project-management" className="cta-btn secondary">
                Learn Project Management
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAssurance;
