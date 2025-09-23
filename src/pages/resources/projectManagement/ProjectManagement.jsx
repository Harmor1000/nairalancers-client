import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProjectManagement.scss';

const ProjectManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'planning', label: 'Project Planning', icon: '🎯' },
    { id: 'execution', label: 'Execution', icon: '⚡' },
    { id: 'communication', label: 'Communication', icon: '💬' },
    { id: 'delivery', label: 'Delivery & QA', icon: '✅' }
  ];

  const projectPhases = [
    {
      id: 'discovery',
      title: 'Discovery & Requirements',
      duration: '1-2 weeks',
      description: 'Understanding client needs and project scope',
      tasks: [
        'Client consultation and needs assessment',
        'Requirement gathering and documentation',
        'Scope definition and boundary setting',
        'Risk assessment and mitigation planning',
        'Timeline and budget estimation'
      ],
      deliverables: [
        'Project Requirements Document (PRD)',
        'Scope of Work (SOW)',
        'Project timeline and milestones',
        'Risk assessment report'
      ],
      tools: ['Zoom', 'Google Docs', 'Miro', 'Notion'],
      tips: [
        'Ask clarifying questions early to avoid scope creep',
        'Document everything in writing',
        'Set clear expectations about communication',
        'Identify potential challenges upfront'
      ]
    },
    {
      id: 'planning',
      title: 'Planning & Design',
      duration: '1-3 weeks',
      description: 'Creating detailed project plans and initial designs',
      tasks: [
        'Break down project into manageable tasks',
        'Create wireframes or mockups',
        'Develop project timeline with milestones',
        'Resource allocation and team coordination',
        'Client approval of designs and plans'
      ],
      deliverables: [
        'Detailed project plan',
        'Wireframes or design mockups',
        'Resource allocation chart',
        'Approved project timeline'
      ],
      tools: ['Figma', 'Sketch', 'Trello', 'Asana', 'Adobe Creative Suite'],
      tips: [
        'Allow buffer time for revisions',
        'Get written approval before proceeding',
        'Use collaborative tools for client feedback',
        'Plan for regular check-ins'
      ]
    },
    {
      id: 'development',
      title: 'Development & Implementation',
      duration: '2-8 weeks',
      description: 'Building and implementing the actual solution',
      tasks: [
        'Set up development environment',
        'Implement features according to specifications',
        'Regular progress updates to client',
        'Version control and backup management',
        'Testing and quality assurance'
      ],
      deliverables: [
        'Working prototype or beta version',
        'Progress reports and demos',
        'Source code with documentation',
        'Test reports and bug fixes'
      ],
      tools: ['GitHub', 'VS Code', 'Slack', 'Jira', 'Docker'],
      tips: [
        'Commit code regularly with clear messages',
        'Share progress frequently with clients',
        'Test thoroughly before showing demos',
        'Keep detailed development logs'
      ]
    },
    {
      id: 'review',
      title: 'Review & Refinement',
      duration: '1-2 weeks',
      description: 'Client feedback incorporation and final adjustments',
      tasks: [
        'Present completed work to client',
        'Gather and document feedback',
        'Implement requested changes',
        'Final testing and optimization',
        'Prepare for delivery'
      ],
      deliverables: [
        'Revised version based on feedback',
        'Change log and update documentation',
        'Final testing report',
        'Deployment preparation'
      ],
      tools: ['BrowserStack', 'Google Analytics', 'Hotjar', 'Loom'],
      tips: [
        'Be open to constructive feedback',
        'Explain technical constraints clearly',
        'Prioritize changes by impact',
        'Document all modifications'
      ]
    },
    {
      id: 'delivery',
      title: 'Delivery & Handover',
      duration: '3-5 days',
      description: 'Final delivery and knowledge transfer',
      tasks: [
        'Final quality assurance check',
        'Deploy to production environment',
        'Create comprehensive documentation',
        'Train client on system usage',
        'Set up ongoing support if needed'
      ],
      deliverables: [
        'Final product/service',
        'User documentation and guides',
        'Handover documentation',
        'Support and maintenance plan'
      ],
      tools: ['Loom', 'Confluence', 'AWS', 'Google Drive'],
      tips: [
        'Test everything one final time',
        'Provide clear documentation',
        'Offer post-launch support',
        'Request testimonials and feedback'
      ]
    }
  ];

  const bestPractices = {
    planning: [
      {
        title: 'Define Clear Objectives',
        description: 'Establish SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) for every project.',
        example: 'Instead of "improve website", use "increase website conversion rate by 25% within 3 months"'
      },
      {
        title: 'Create Detailed Timelines',
        description: 'Break projects into phases with specific milestones and deadlines.',
        example: 'Week 1: Research & Planning, Week 2-3: Design & Mockups, Week 4-6: Development, Week 7: Testing & Launch'
      },
      {
        title: 'Risk Management',
        description: 'Identify potential risks early and develop contingency plans.',
        example: 'If client approval is delayed, have alternative tasks ready to maintain momentum'
      }
    ],
    communication: [
      {
        title: 'Regular Check-ins',
        description: 'Schedule consistent communication touchpoints with clients.',
        example: 'Weekly 30-minute video calls every Tuesday at 2 PM'
      },
      {
        title: 'Progress Documentation',
        description: 'Keep detailed records of progress, decisions, and changes.',
        example: 'Daily work logs with screenshots, time spent, and completed tasks'
      },
      {
        title: 'Clear Escalation Process',
        description: 'Define how to handle urgent issues or major changes.',
        example: 'For urgent issues: WhatsApp message within 1 hour, email within 4 hours'
      }
    ],
    delivery: [
      {
        title: 'Quality Assurance',
        description: 'Implement thorough testing processes before delivery.',
        example: 'Cross-browser testing, mobile responsiveness check, performance optimization'
      },
      {
        title: 'Client Training',
        description: 'Provide comprehensive training and documentation.',
        example: 'Video tutorials, step-by-step guides, and FAQ documentation'
      },
      {
        title: 'Feedback Collection',
        description: 'Systematically gather client feedback for continuous improvement.',
        example: 'Post-project survey with ratings on communication, quality, and timeliness'
      }
    ]
  };

  const tools = [
    {
      category: 'Planning & Organization',
      items: [
        { name: 'Notion', description: 'All-in-one workspace for notes, tasks, and documentation', price: 'Free - $16/month' },
        { name: 'Trello', description: 'Visual project management with boards and cards', price: 'Free - $17/month' },
        { name: 'Asana', description: 'Team collaboration and project tracking', price: 'Free - $24/month' },
        { name: 'Monday.com', description: 'Work management platform with customizable workflows', price: '$8 - $16/month' }
      ]
    },
    {
      category: 'Communication',
      items: [
        { name: 'Slack', description: 'Team messaging and file sharing', price: 'Free - $15/month' },
        { name: 'Discord', description: 'Voice, video, and text communication', price: 'Free - $10/month' },
        { name: 'Zoom', description: 'Video conferencing and screen sharing', price: 'Free - $20/month' },
        { name: 'Loom', description: 'Quick video recordings for async communication', price: 'Free - $12/month' }
      ]
    },
    {
      category: 'Design & Development',
      items: [
        { name: 'Figma', description: 'Collaborative design and prototyping', price: 'Free - $15/month' },
        { name: 'GitHub', description: 'Version control and code collaboration', price: 'Free - $7/month' },
        { name: 'VS Code', description: 'Powerful code editor with extensions', price: 'Free' },
        { name: 'Adobe Creative Cloud', description: 'Professional design software suite', price: '$22 - $83/month' }
      ]
    },
    {
      category: 'Time & Productivity',
      items: [
        { name: 'Toggl', description: 'Time tracking and productivity analytics', price: 'Free - $18/month' },
        { name: 'RescueTime', description: 'Automatic time tracking and productivity insights', price: 'Free - $12/month' },
        { name: 'Forest', description: 'Focus timer using the Pomodoro technique', price: '$4 one-time' },
        { name: 'Calendly', description: 'Automated meeting scheduling', price: 'Free - $16/month' }
      ]
    }
  ];

  const ProjectPhaseCard = ({ phase }) => (
    <div className="phase-card">
      <div className="phase-header">
        <h3>{phase.title}</h3>
        <span className="duration">{phase.duration}</span>
      </div>
      <p className="phase-description">{phase.description}</p>
      
      <div className="phase-content">
        <div className="content-section">
          <h4>Key Tasks</h4>
          <ul>
            {phase.tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>

        <div className="content-section">
          <h4>Deliverables</h4>
          <ul className="deliverables">
            {phase.deliverables.map((deliverable, index) => (
              <li key={index}>{deliverable}</li>
            ))}
          </ul>
        </div>

        <div className="content-section">
          <h4>Recommended Tools</h4>
          <div className="tools-list">
            {phase.tools.map((tool, index) => (
              <span key={index} className="tool-tag">{tool}</span>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h4>Pro Tips</h4>
          <ul className="tips">
            {phase.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="project-management">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <nav className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Project Management</span>
          </nav>
          
          <div className="header-content">
            <h1>Project Management Excellence</h1>
            <p className="header-subtitle">
              Master the art of delivering successful projects on time and within budget. 
              Learn proven methodologies used by top Nigerian freelancers.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="intro-section">
                <h2>Why Project Management Matters</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-number">73%</div>
                    <div className="stat-label">Project Success Rate with PM</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">35%</div>
                    <div className="stat-label">Average Cost Savings</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">40%</div>
                    <div className="stat-label">Faster Delivery Time</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">92%</div>
                    <div className="stat-label">Client Satisfaction Rate</div>
                  </div>
                </div>
              </div>

              <div className="methodology-section">
                <h2>Our Project Management Methodology</h2>
                <div className="methodology-overview">
                  <div className="method-card">
                    <div className="method-icon">🎯</div>
                    <h3>Goal-Oriented Planning</h3>
                    <p>Every project starts with clear, measurable objectives that align with client business goals.</p>
                  </div>
                  <div className="method-card">
                    <div className="method-icon">⚡</div>
                    <h3>Agile Execution</h3>
                    <p>Flexible, iterative approach that adapts to changes while maintaining project momentum.</p>
                  </div>
                  <div className="method-card">
                    <div className="method-icon">💬</div>
                    <h3>Transparent Communication</h3>
                    <p>Regular updates, clear documentation, and proactive client engagement throughout the project.</p>
                  </div>
                  <div className="method-card">
                    <div className="method-icon">✅</div>
                    <h3>Quality Assurance</h3>
                    <p>Comprehensive testing and review processes ensure high-quality deliverables.</p>
                  </div>
                </div>
              </div>

              <div className="benefits-section">
                <h2>Benefits of Professional Project Management</h2>
                <div className="benefits-grid">
                  <div className="benefit-item">
                    <h4>For Clients</h4>
                    <ul>
                      <li>Predictable timelines and budgets</li>
                      <li>Regular progress visibility</li>
                      <li>Risk mitigation and issue resolution</li>
                      <li>Higher quality deliverables</li>
                      <li>Better ROI on project investments</li>
                    </ul>
                  </div>
                  <div className="benefit-item">
                    <h4>For Freelancers</h4>
                    <ul>
                      <li>Improved client satisfaction</li>
                      <li>Reduced project stress and confusion</li>
                      <li>More efficient resource utilization</li>
                      <li>Higher project success rates</li>
                      <li>Increased referrals and repeat business</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'planning' && (
            <div className="planning-content">
              <h2>Project Planning Essentials</h2>
              <div className="phases-grid">
                {projectPhases.map((phase, index) => (
                  <ProjectPhaseCard key={phase.id} phase={phase} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'execution' && (
            <div className="execution-content">
              <h2>Best Practices for Project Execution</h2>
              <div className="practices-sections">
                {Object.entries(bestPractices).map(([category, practices]) => (
                  <div key={category} className="practice-category">
                    <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Best Practices</h3>
                    <div className="practices-grid">
                      {practices.map((practice, index) => (
                        <div key={index} className="practice-card">
                          <h4>{practice.title}</h4>
                          <p>{practice.description}</p>
                          <div className="example">
                            <strong>Example:</strong> {practice.example}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="communication-content">
              <h2>Effective Project Communication</h2>
              
              <div className="communication-framework">
                <div className="framework-card">
                  <h3>Communication Planning Matrix</h3>
                  <div className="matrix-table">
                    <div className="matrix-header">
                      <span>Stakeholder</span>
                      <span>Method</span>
                      <span>Frequency</span>
                      <span>Content</span>
                    </div>
                    <div className="matrix-row">
                      <span>Project Sponsor</span>
                      <span>Email + Video Call</span>
                      <span>Weekly</span>
                      <span>Progress, Budget, Risks</span>
                    </div>
                    <div className="matrix-row">
                      <span>End Users</span>
                      <span>Demos + Documentation</span>
                      <span>Bi-weekly</span>
                      <span>Features, Training, Timeline</span>
                    </div>
                    <div className="matrix-row">
                      <span>Technical Team</span>
                      <span>Slack + Daily Standups</span>
                      <span>Daily</span>
                      <span>Tasks, Blockers, Updates</span>
                    </div>
                  </div>
                </div>

                <div className="framework-card">
                  <h3>Communication Best Practices</h3>
                  <div className="practices-list">
                    <div className="practice-item">
                      <h4>📱 Choose the Right Channel</h4>
                      <p>Use WhatsApp for urgent issues, email for formal updates, video calls for complex discussions.</p>
                    </div>
                    <div className="practice-item">
                      <h4>⏰ Set Response Expectations</h4>
                      <p>Define response times: Urgent (1 hour), Normal (24 hours), Non-urgent (48 hours).</p>
                    </div>
                    <div className="practice-item">
                      <h4>📝 Document Everything</h4>
                      <p>Keep written records of decisions, changes, and important conversations.</p>
                    </div>
                    <div className="practice-item">
                      <h4>🎯 Be Proactive</h4>
                      <p>Share updates before clients ask, address issues before they become problems.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="delivery-content">
              <h2>Quality Delivery & Project Closure</h2>
              
              <div className="delivery-process">
                <div className="process-steps">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Pre-Delivery Review</h4>
                      <p>Comprehensive quality check against original requirements</p>
                      <ul>
                        <li>Functionality testing</li>
                        <li>Performance optimization</li>
                        <li>Cross-platform compatibility</li>
                        <li>Security assessment</li>
                      </ul>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Client Presentation</h4>
                      <p>Professional presentation of completed work</p>
                      <ul>
                        <li>Live demonstration</li>
                        <li>Feature walkthrough</li>
                        <li>Performance metrics</li>
                        <li>Q&A session</li>
                      </ul>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Documentation & Training</h4>
                      <p>Comprehensive handover materials</p>
                      <ul>
                        <li>User manuals</li>
                        <li>Technical documentation</li>
                        <li>Video tutorials</li>
                        <li>Training sessions</li>
                      </ul>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>Project Closure</h4>
                      <p>Formal project completion and feedback</p>
                      <ul>
                        <li>Final deliverables handover</li>
                        <li>Client satisfaction survey</li>
                        <li>Lessons learned documentation</li>
                        <li>Maintenance planning</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="quality-checklist">
                <h3>Quality Assurance Checklist</h3>
                <div className="checklist-categories">
                  <div className="checklist-category">
                    <h4>Technical Quality</h4>
                    <div className="checklist-items">
                      <label><input type="checkbox" /> Code follows best practices</label>
                      <label><input type="checkbox" /> All features work as specified</label>
                      <label><input type="checkbox" /> Performance meets requirements</label>
                      <label><input type="checkbox" /> Security measures implemented</label>
                      <label><input type="checkbox" /> Cross-browser/device compatibility</label>
                    </div>
                  </div>
                  <div className="checklist-category">
                    <h4>Content Quality</h4>
                    <div className="checklist-items">
                      <label><input type="checkbox" /> Content is accurate and up-to-date</label>
                      <label><input type="checkbox" /> Grammar and spelling checked</label>
                      <label><input type="checkbox" /> Brand guidelines followed</label>
                      <label><input type="checkbox" /> Images optimized and appropriate</label>
                      <label><input type="checkbox" /> SEO best practices applied</label>
                    </div>
                  </div>
                  <div className="checklist-category">
                    <h4>User Experience</h4>
                    <div className="checklist-items">
                      <label><input type="checkbox" /> Intuitive navigation</label>
                      <label><input type="checkbox" /> Fast loading times</label>
                      <label><input type="checkbox" /> Mobile-responsive design</label>
                      <label><input type="checkbox" /> Accessibility standards met</label>
                      <label><input type="checkbox" /> User testing completed</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tools Section */}
        <div className="tools-section">
          <h2>Recommended Project Management Tools</h2>
          <div className="tools-categories">
            {tools.map((category, index) => (
              <div key={index} className="tool-category">
                <h3>{category.category}</h3>
                <div className="tools-grid">
                  {category.items.map((tool, toolIndex) => (
                    <div key={toolIndex} className="tool-card">
                      <h4>{tool.name}</h4>
                      <p>{tool.description}</p>
                      <div className="tool-price">{tool.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Elevate Your Project Management?</h2>
            <p>
              Join Nairalancers and connect with clients who value professional 
              project management and quality delivery.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">
                Start Managing Projects
              </Link>
              <Link to="/resources/pricing-tips" className="cta-btn secondary">
                Learn About Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
