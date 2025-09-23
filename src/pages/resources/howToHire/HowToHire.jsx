import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HowToHire.scss';

const HowToHire = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Define Your Project",
      icon: "📝",
      content: {
        overview: "Clearly outline your project requirements and expectations",
        topics: [
          "Project scope and deliverables",
          "Timeline and milestones", 
          "Budget considerations",
          "Success criteria"
        ]
      }
    },
    {
      id: 2,
      title: "Find the Right Freelancer",
      icon: "🔍",
      content: {
        overview: "Search and evaluate freelancers to find the perfect match",
        topics: [
          "Using search filters effectively",
          "Evaluating portfolios and reviews",
          "Checking qualifications and experience",
          "Communication style assessment"
        ]
      }
    },
    {
      id: 3,
      title: "Communicate & Negotiate",
      icon: "💬",
      content: {
        overview: "Engage with freelancers to clarify requirements and terms",
        topics: [
          "Writing effective project briefs",
          "Asking the right questions",
          "Negotiating scope and pricing",
          "Setting clear expectations"
        ]
      }
    },
    {
      id: 4,
      title: "Manage Your Project",
      icon: "📊",
      content: {
        overview: "Effectively manage your project from start to completion",
        topics: [
          "Setting up milestones",
          "Regular check-ins and feedback",
          "Managing revisions",
          "Ensuring quality delivery"
        ]
      }
    },
    {
      id: 5,
      title: "Complete & Review",
      icon: "✅",
      content: {
        overview: "Finalize your project and build lasting relationships",
        topics: [
          "Final review and approval",
          "Providing constructive feedback",
          "Building long-term relationships",
          "Planning future collaborations"
        ]
      }
    }
  ];

  const hiringTips = [
    {
      category: "Budget Planning",
      tips: [
        "Research market rates for your type of project",
        "Factor in platform fees when setting your budget",
        "Consider paying slightly above average for quality work",
        "Use milestone payments for larger projects",
        "Budget for potential revisions and scope changes"
      ]
    },
    {
      category: "Freelancer Evaluation",
      tips: [
        "Check portfolio quality and relevance to your project",
        "Read recent reviews and client feedback carefully",
        "Look for freelancers who ask clarifying questions",
        "Verify their communication skills and responsiveness",
        "Consider their availability and workload"
      ]
    },
    {
      category: "Project Management",
      tips: [
        "Set clear deadlines with buffer time",
        "Provide detailed project briefs and resources",
        "Establish regular communication schedules",
        "Use project management tools when necessary",
        "Be available for questions and feedback"
      ]
    },
    {
      category: "Communication Best Practices",
      tips: [
        "Be clear and specific in your requirements",
        "Respond to messages promptly and professionally",
        "Provide constructive feedback during the process",
        "Document important decisions and changes",
        "Maintain a respectful and collaborative tone"
      ]
    }
  ];

  const commonMistakes = [
    {
      mistake: "Choosing Based on Price Alone",
      consequence: "Often leads to poor quality work and project delays",
      solution: "Evaluate the overall value including quality, experience, and communication"
    },
    {
      mistake: "Unclear Project Requirements",
      consequence: "Results in misunderstandings, revisions, and scope creep",
      solution: "Spend time creating detailed project briefs with examples and specifications"
    },
    {
      mistake: "Poor Communication",
      consequence: "Leads to missed deadlines, quality issues, and frustration",
      solution: "Establish clear communication channels and schedules from the start"
    },
    {
      mistake: "Unrealistic Timelines",
      consequence: "Rushed work, quality compromises, and freelancer stress",
      solution: "Discuss realistic timelines with freelancers and add buffer time"
    },
    {
      mistake: "Not Checking References",
      consequence: "Risk of hiring inexperienced or unreliable freelancers",
      solution: "Always review portfolios, ratings, and previous client feedback"
    }
  ];

  return (
    <div className="how-to-hire">
      <div className="container">
        <div className="header">
          <h1>How to Hire on Nairalancers</h1>
          <p className="subtitle">Your complete guide to finding and working with top Nigerian freelancers</p>
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
          {/* Step 1: Define Your Project */}
          {activeStep === 1 && (
            <div className="step-content">
              <h2>📝 Define Your Project Clearly</h2>
              <p className="overview">Success starts with a well-defined project. Clear requirements lead to better proposals and outcomes.</p>

              <div className="content-grid">
                <section className="content-block">
                  <h3>1. Project Scope Definition</h3>
                  <div className="scope-checklist">
                    <div className="checklist-item">
                      <h4>✅ What needs to be delivered?</h4>
                      <ul>
                        <li>Specific deliverables (files, documents, assets)</li>
                        <li>Format requirements (file types, dimensions)</li>
                        <li>Quality standards and specifications</li>
                        <li>Any brand guidelines or style requirements</li>
                      </ul>
                    </div>
                    <div className="checklist-item">
                      <h4>✅ What's included vs. excluded?</h4>
                      <ul>
                        <li>Number of revisions included</li>
                        <li>Additional services not covered</li>
                        <li>Ongoing maintenance or support</li>
                        <li>Future ownership and usage rights</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>2. Timeline Planning</h3>
                  <div className="timeline-planner">
                    <div className="timeline-section">
                      <h4>Project Phases</h4>
                      <div className="phase-list">
                        <div className="phase">
                          <strong>Research & Planning:</strong> 10-20% of timeline
                        </div>
                        <div className="phase">
                          <strong>Initial Development:</strong> 40-50% of timeline
                        </div>
                        <div className="phase">
                          <strong>Review & Revisions:</strong> 20-30% of timeline
                        </div>
                        <div className="phase">
                          <strong>Final Delivery:</strong> 10-15% of timeline
                        </div>
                      </div>
                    </div>
                    <div className="timeline-tips">
                      <h4>Timeline Best Practices</h4>
                      <ul>
                        <li>Add 25% buffer time for unexpected changes</li>
                        <li>Consider freelancer's other commitments</li>
                        <li>Account for your own review and feedback time</li>
                        <li>Plan for potential revisions and iterations</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>3. Budget Considerations</h3>
                  <div className="budget-guide">
                    <div className="budget-factors">
                      <h4>Factors Affecting Cost</h4>
                      <ul>
                        <li><strong>Project Complexity:</strong> Simple vs. complex requirements</li>
                        <li><strong>Freelancer Experience:</strong> Junior vs. senior level expertise</li>
                        <li><strong>Timeline:</strong> Standard vs. rush delivery</li>
                        <li><strong>Scope:</strong> Basic vs. comprehensive deliverables</li>
                        <li><strong>Quality Level:</strong> Good vs. exceptional standards</li>
                      </ul>
                    </div>
                    <div className="budget-calculator">
                      <h4>Budget Planning Template</h4>
                      <div className="budget-breakdown">
                        <div className="budget-item">
                          <span>Core Project Work:</span>
                          <span>70-80%</span>
                        </div>
                        <div className="budget-item">
                          <span>Revisions & Changes:</span>
                          <span>10-15%</span>
                        </div>
                        <div className="budget-item">
                          <span>Platform Fees:</span>
                          <span>5-8%</span>
                        </div>
                        <div className="budget-item">
                          <span>Contingency:</span>
                          <span>5-10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>4. Success Criteria</h3>
                  <div className="success-metrics">
                    <div className="metrics-section">
                      <h4>Define Success Metrics</h4>
                      <ul>
                        <li>Quality benchmarks and standards</li>
                        <li>Performance requirements (speed, functionality)</li>
                        <li>User experience goals</li>
                        <li>Business objectives and KPIs</li>
                      </ul>
                    </div>
                    <div className="acceptance-criteria">
                      <h4>Acceptance Criteria</h4>
                      <ul>
                        <li>Specific tests or validations</li>
                        <li>Review and approval process</li>
                        <li>Sign-off requirements</li>
                        <li>Launch or implementation criteria</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Step 2: Find the Right Freelancer */}
          {activeStep === 2 && (
            <div className="step-content">
              <h2>🔍 Find the Perfect Freelancer</h2>
              <p className="overview">Use our platform tools and evaluation criteria to identify the best freelancer for your project.</p>

              <div className="content-grid">
                <section className="content-block">
                  <h3>1. Search Strategy</h3>
                  <div className="search-guide">
                    <div className="search-filters">
                      <h4>Effective Search Filters</h4>
                      <ul>
                        <li><strong>Service Category:</strong> Narrow down by specific skills</li>
                        <li><strong>Budget Range:</strong> Set realistic price expectations</li>
                        <li><strong>Delivery Time:</strong> Match your timeline needs</li>
                        <li><strong>Seller Level:</strong> Choose based on experience needed</li>
                        <li><strong>Location:</strong> Consider timezone preferences</li>
                      </ul>
                    </div>
                    <div className="search-keywords">
                      <h4>Keyword Optimization</h4>
                      <ul>
                        <li>Use specific industry terms</li>
                        <li>Include technology or tool names</li>
                        <li>Add style or approach keywords</li>
                        <li>Try both broad and specific searches</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>2. Freelancer Evaluation</h3>
                  <div className="evaluation-criteria">
                    <div className="evaluation-category">
                      <h4>Portfolio Assessment</h4>
                      <ul>
                        <li>Relevance to your project type</li>
                        <li>Quality of previous work</li>
                        <li>Variety and creativity in examples</li>
                        <li>Technical skills demonstration</li>
                        <li>Professional presentation</li>
                      </ul>
                    </div>
                    <div className="evaluation-category">
                      <h4>Reviews & Ratings</h4>
                      <ul>
                        <li>Overall rating and number of reviews</li>
                        <li>Recent feedback and comments</li>
                        <li>Repeat client indicators</li>
                        <li>Response to negative feedback</li>
                        <li>Communication and delivery ratings</li>
                      </ul>
                    </div>
                    <div className="evaluation-category">
                      <h4>Professional Profile</h4>
                      <ul>
                        <li>Clear bio and expertise description</li>
                        <li>Professional photo and presentation</li>
                        <li>Certifications and credentials</li>
                        <li>Response time and availability</li>
                        <li>Languages and communication skills</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>3. Shortlisting Process</h3>
                  <div className="shortlist-guide">
                    <div className="shortlist-criteria">
                      <h4>Create Your Shortlist</h4>
                      <div className="criteria-matrix">
                        <div className="criteria-item">
                          <span className="criteria-name">Portfolio Quality</span>
                          <span className="criteria-weight">25%</span>
                        </div>
                        <div className="criteria-item">
                          <span className="criteria-name">Relevant Experience</span>
                          <span className="criteria-weight">25%</span>
                        </div>
                        <div className="criteria-item">
                          <span className="criteria-name">Client Reviews</span>
                          <span className="criteria-weight">20%</span>
                        </div>
                        <div className="criteria-item">
                          <span className="criteria-name">Communication</span>
                          <span className="criteria-weight">15%</span>
                        </div>
                        <div className="criteria-item">
                          <span className="criteria-name">Price/Value</span>
                          <span className="criteria-weight">15%</span>
                        </div>
                      </div>
                    </div>
                    <div className="shortlist-tips">
                      <h4>Shortlisting Tips</h4>
                      <ul>
                        <li>Aim for 3-5 qualified candidates</li>
                        <li>Balance experience with budget</li>
                        <li>Consider timezone compatibility</li>
                        <li>Look for specialists in your industry</li>
                        <li>Check availability for your timeline</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>4. Initial Contact</h3>
                  <div className="contact-template">
                    <h4>Effective Inquiry Template</h4>
                    <div className="template-box">
                      <p><strong>Subject:</strong> [Project Type] - [Brief Description]</p>
                      <p><strong>Greeting:</strong> Hello [Freelancer Name],</p>
                      <p><strong>Introduction:</strong> I'm looking for a [skill/service] expert for a [project type].</p>
                      <p><strong>Project Summary:</strong> Brief overview of requirements, timeline, and budget range.</p>
                      <p><strong>Questions:</strong> Specific questions about their experience and approach.</p>
                      <p><strong>Next Steps:</strong> How you'd like to proceed if interested.</p>
                      <p><strong>Closing:</strong> Professional sign-off with your name.</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}


          {activeStep === 3 && (
            <div className="step-content">
              <h2>💬 Communicate & Negotiate Effectively</h2>
              <p className="overview">Build trust and clarity through professional communication and fair negotiations.</p>

              <div className="content-grid">
                <section className="content-block">
                  <h3>1. Initial Communication</h3>
                  <div className="communication-guide">
                    <div className="communication-tips">
                      <h4>First Contact Best Practices</h4>
                      <ul>
                        <li><strong>Be Professional:</strong> Use proper greetings and clear language</li>
                        <li><strong>Be Specific:</strong> Clearly state your project requirements</li>
                        <li><strong>Be Respectful:</strong> Value the freelancer's time and expertise</li>
                        <li><strong>Be Responsive:</strong> Reply promptly to maintain momentum</li>
                        <li><strong>Be Open:</strong> Welcome questions and suggestions</li>
                      </ul>
                    </div>
                    <div className="red-flags">
                      <h4>Communication Red Flags</h4>
                      <ul>
                        <li>Poor grammar or unprofessional language</li>
                        <li>Unwillingness to discuss project details</li>
                        <li>Extremely low quotes without justification</li>
                        <li>Pushy or aggressive communication style</li>
                        <li>Inability to answer technical questions</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>2. Negotiation Strategies</h3>
                  <div className="negotiation-guide">
                    <div className="negotiation-areas">
                      <h4>What Can Be Negotiated</h4>
                      <div className="negotiation-item">
                        <span className="item-name">Price & Payment Terms</span>
                        <span className="item-note">Budget, milestones, payment schedule</span>
                      </div>
                      <div className="negotiation-item">
                        <span className="item-name">Scope & Deliverables</span>
                        <span className="item-note">Features, revisions, additional services</span>
                      </div>
                      <div className="negotiation-item">
                        <span className="item-name">Timeline & Deadlines</span>
                        <span className="item-note">Delivery dates, milestone schedules</span>
                      </div>
                      <div className="negotiation-item">
                        <span className="item-name">Communication & Updates</span>
                        <span className="item-note">Check-in frequency, reporting format</span>
                      </div>
                    </div>
                    <div className="negotiation-tips">
                      <h4>Negotiation Best Practices</h4>
                      <ul>
                        <li>Focus on value, not just price</li>
                        <li>Be willing to compromise on scope or timeline</li>
                        <li>Offer long-term partnership potential</li>
                        <li>Respect the freelancer's expertise and rates</li>
                        <li>Document all agreed terms clearly</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>3. Setting Clear Expectations</h3>
                  <div className="expectations-framework">
                    <div className="expectation-category">
                      <h4>Project Deliverables</h4>
                      <ul>
                        <li>Exact files and formats to be delivered</li>
                        <li>Quality standards and acceptance criteria</li>
                        <li>Number of revisions included</li>
                        <li>Intellectual property and usage rights</li>
                        <li>Documentation or training materials</li>
                      </ul>
                    </div>
                    <div className="expectation-category">
                      <h4>Communication Standards</h4>
                      <ul>
                        <li>Preferred communication channels</li>
                        <li>Response time expectations</li>
                        <li>Regular update schedule</li>
                        <li>Escalation process for issues</li>
                        <li>Meeting or call requirements</li>
                      </ul>
                    </div>
                    <div className="expectation-category">
                      <h4>Timeline & Milestones</h4>
                      <ul>
                        <li>Project start date and kickoff</li>
                        <li>Key milestone dates and deliverables</li>
                        <li>Review and feedback periods</li>
                        <li>Final delivery and acceptance date</li>
                        <li>Buffer time for unexpected delays</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>4. Contract & Agreement</h3>
                  <div className="contract-essentials">
                    <div className="contract-checklist">
                      <h4>Essential Contract Elements</h4>
                      <div className="checklist-item">
                        <input type="checkbox" /> <span>Project scope and deliverables clearly defined</span>
                      </div>
                      <div className="checklist-item">
                        <input type="checkbox" /> <span>Timeline with specific milestones and deadlines</span>
                      </div>
                      <div className="checklist-item">
                        <input type="checkbox" /> <span>Payment terms, amounts, and schedule</span>
                      </div>
                      <div className="checklist-item">
                        <input type="checkbox" /> <span>Revision policy and additional work terms</span>
                      </div>
                      <div className="checklist-item">
                        <input type="checkbox" /> <span>Intellectual property and confidentiality clauses</span>
                      </div>
                      <div className="checklist-item">
                        <input type="checkbox" /> <span>Cancellation and dispute resolution terms</span>
                      </div>
                    </div>
                    <div className="contract-tips">
                      <h4>Contract Protection Tips</h4>
                      <ul>
                        <li>Use Nairalancers' built-in contract system</li>
                        <li>Keep all communications documented</li>
                        <li>Clarify ownership of work and materials</li>
                        <li>Set clear payment milestones</li>
                        <li>Include change management process</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="step-content">
              <h2>📊 Manage Your Project Successfully</h2>
              <p className="overview">Keep your project on track with effective management and communication.</p>

              <div className="content-grid">
                <section className="content-block">
                  <h3>1. Project Kickoff</h3>
                  <div className="kickoff-guide">
                    <div className="kickoff-checklist">
                      <h4>Kickoff Meeting Agenda</h4>
                      <div className="agenda-item">
                        <span className="agenda-topic">Introductions & Roles</span>
                        <span className="agenda-time">10 mins</span>
                      </div>
                      <div className="agenda-item">
                        <span className="agenda-topic">Project Overview & Goals</span>
                        <span className="agenda-time">15 mins</span>
                      </div>
                      <div className="agenda-item">
                        <span className="agenda-topic">Timeline & Milestones Review</span>
                        <span className="agenda-time">15 mins</span>
                      </div>
                      <div className="agenda-item">
                        <span className="agenda-topic">Communication Plan</span>
                        <span className="agenda-time">10 mins</span>
                      </div>
                      <div className="agenda-item">
                        <span className="agenda-topic">Questions & Next Steps</span>
                        <span className="agenda-time">10 mins</span>
                      </div>
                    </div>
                    <div className="kickoff-deliverables">
                      <h4>Kickoff Deliverables</h4>
                      <ul>
                        <li>Shared project folder and resources</li>
                        <li>Communication channel setup</li>
                        <li>Access to necessary tools and accounts</li>
                        <li>Documented project requirements</li>
                        <li>Contact information and availability</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>2. Milestone Management</h3>
                  <div className="milestone-system">
                    <div className="milestone-structure">
                      <h4>Effective Milestone Planning</h4>
                      <div className="milestone-phase">
                        <strong>Phase 1: Research & Planning (20%)</strong>
                        <ul>
                          <li>Requirements analysis and research</li>
                          <li>Initial concepts or wireframes</li>
                          <li>Resource gathering and preparation</li>
                        </ul>
                      </div>
                      <div className="milestone-phase">
                        <strong>Phase 2: Development (50%)</strong>
                        <ul>
                          <li>Core development and creation</li>
                          <li>Initial testing and refinements</li>
                          <li>Progress reviews and adjustments</li>
                        </ul>
                      </div>
                      <div className="milestone-phase">
                        <strong>Phase 3: Review & Refinement (25%)</strong>
                        <ul>
                          <li>Client review and feedback</li>
                          <li>Revisions and improvements</li>
                          <li>Quality assurance and testing</li>
                        </ul>
                      </div>
                      <div className="milestone-phase">
                        <strong>Phase 4: Delivery (5%)</strong>
                        <ul>
                          <li>Final polishing and optimization</li>
                          <li>Documentation and handover</li>
                          <li>Project closure and evaluation</li>
                        </ul>
                      </div>
                    </div>
                    <div className="milestone-tips">
                      <h4>Milestone Best Practices</h4>
                      <ul>
                        <li>Set clear deliverables for each milestone</li>
                        <li>Review and approve before moving forward</li>
                        <li>Use milestones for payment releases</li>
                        <li>Allow flexibility for minor adjustments</li>
                        <li>Document progress and decisions</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>3. Communication & Feedback</h3>
                  <div className="communication-framework">
                    <div className="communication-schedule">
                      <h4>Regular Communication Plan</h4>
                      <div className="comm-type">
                        <span className="comm-name">Daily Updates</span>
                        <span className="comm-method">Chat/Message</span>
                        <span className="comm-purpose">Quick status and questions</span>
                      </div>
                      <div className="comm-type">
                        <span className="comm-name">Weekly Check-ins</span>
                        <span className="comm-method">Video/Voice Call</span>
                        <span className="comm-purpose">Progress review and planning</span>
                      </div>
                      <div className="comm-type">
                        <span className="comm-name">Milestone Reviews</span>
                        <span className="comm-method">Formal Meeting</span>
                        <span className="comm-purpose">Deliverable approval</span>
                      </div>
                    </div>
                    <div className="feedback-guidelines">
                      <h4>Effective Feedback Guidelines</h4>
                      <ul>
                        <li><strong>Be Specific:</strong> Point out exact areas needing changes</li>
                        <li><strong>Be Constructive:</strong> Explain the reasoning behind requests</li>
                        <li><strong>Be Timely:</strong> Provide feedback within agreed timeframes</li>
                        <li><strong>Be Organized:</strong> Use numbered lists or marked-up files</li>
                        <li><strong>Be Balanced:</strong> Highlight what works well too</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>4. Quality Assurance</h3>
                  <div className="qa-process">
                    <div className="qa-checklist">
                      <h4>Quality Review Checklist</h4>
                      <div className="qa-category">
                        <strong>Technical Quality</strong>
                        <ul>
                          <li>Functionality works as specified</li>
                          <li>Performance meets requirements</li>
                          <li>Compatibility across platforms/browsers</li>
                          <li>Security considerations addressed</li>
                        </ul>
                      </div>
                      <div className="qa-category">
                        <strong>Design Quality</strong>
                        <ul>
                          <li>Visual consistency and alignment</li>
                          <li>Brand guidelines compliance</li>
                          <li>User experience optimization</li>
                          <li>Responsive design implementation</li>
                        </ul>
                      </div>
                      <div className="qa-category">
                        <strong>Content Quality</strong>
                        <ul>
                          <li>Accuracy and completeness</li>
                          <li>Grammar and spelling</li>
                          <li>Appropriate tone and style</li>
                          <li>SEO optimization (if applicable)</li>
                        </ul>
                      </div>
                    </div>
                    <div className="qa-tools">
                      <h4>QA Tools & Resources</h4>
                      <ul>
                        <li>Screen recording for feedback</li>
                        <li>Collaborative review platforms</li>
                        <li>Version control and tracking</li>
                        <li>Testing checklists and templates</li>
                        <li>Performance monitoring tools</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className="step-content">
              <h2>✅ Complete & Build Relationships</h2>
              <p className="overview">Finalize your project professionally and build lasting partnerships.</p>

              <div className="content-grid">
                <section className="content-block">
                  <h3>1. Final Review & Acceptance</h3>
                  <div className="final-review-process">
                    <div className="review-stages">
                      <h4>Final Review Process</h4>
                      <div className="review-stage">
                        <span className="stage-number">1</span>
                        <div className="stage-content">
                          <strong>Technical Review</strong>
                          <p>Test all functionality, check performance, verify requirements</p>
                        </div>
                      </div>
                      <div className="review-stage">
                        <span className="stage-number">2</span>
                        <div className="stage-content">
                          <strong>Content Review</strong>
                          <p>Proofread text, verify accuracy, check branding consistency</p>
                        </div>
                      </div>
                      <div className="review-stage">
                        <span className="stage-number">3</span>
                        <div className="stage-content">
                          <strong>User Testing</strong>
                          <p>Test user flows, check usability, gather stakeholder feedback</p>
                        </div>
                      </div>
                      <div className="review-stage">
                        <span className="stage-number">4</span>
                        <div className="stage-content">
                          <strong>Final Approval</strong>
                          <p>Document acceptance, release final payment, confirm completion</p>
                        </div>
                      </div>
                    </div>
                    <div className="acceptance-criteria">
                      <h4>Acceptance Guidelines</h4>
                      <ul>
                        <li>All deliverables match original requirements</li>
                        <li>Quality meets agreed standards</li>
                        <li>Documentation is complete and clear</li>
                        <li>Any training or handover is completed</li>
                        <li>Source files and assets are provided</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>2. Feedback & Reviews</h3>
                  <div className="feedback-system">
                    <div className="review-components">
                      <h4>Comprehensive Review Elements</h4>
                      <div className="review-aspect">
                        <span className="aspect-name">Communication</span>
                        <span className="aspect-desc">Responsiveness, clarity, professionalism</span>
                      </div>
                      <div className="review-aspect">
                        <span className="aspect-name">Quality</span>
                        <span className="aspect-desc">Technical skill, attention to detail, standards</span>
                      </div>
                      <div className="review-aspect">
                        <span className="aspect-name">Timeliness</span>
                        <span className="aspect-desc">Meeting deadlines, milestone delivery</span>
                      </div>
                      <div className="review-aspect">
                        <span className="aspect-name">Value</span>
                        <span className="aspect-desc">Price fairness, added value, recommendations</span>
                      </div>
                      <div className="review-aspect">
                        <span className="aspect-name">Experience</span>
                        <span className="aspect-desc">Overall satisfaction, would hire again</span>
                      </div>
                    </div>
                    <div className="review-tips">
                      <h4>Writing Effective Reviews</h4>
                      <ul>
                        <li>Be honest but constructive in your feedback</li>
                        <li>Highlight specific strengths and achievements</li>
                        <li>Mention challenges and how they were handled</li>
                        <li>Provide context for future clients</li>
                        <li>Consider the freelancer's professional growth</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>3. Building Long-term Relationships</h3>
                  <div className="relationship-building">
                    <div className="relationship-benefits">
                      <h4>Benefits of Long-term Partnerships</h4>
                      <div className="benefit-item">
                        <span className="benefit-icon">💰</span>
                        <div className="benefit-content">
                          <strong>Cost Savings</strong>
                          <p>Reduced hiring time and onboarding costs</p>
                        </div>
                      </div>
                      <div className="benefit-item">
                        <span className="benefit-icon">⚡</span>
                        <div className="benefit-content">
                          <strong>Faster Delivery</strong>
                          <p>Freelancer knows your style and requirements</p>
                        </div>
                      </div>
                      <div className="benefit-item">
                        <span className="benefit-icon">🎯</span>
                        <div className="benefit-content">
                          <strong>Better Quality</strong>
                          <p>Understanding of your brand and standards</p>
                        </div>
                      </div>
                      <div className="benefit-item">
                        <span className="benefit-icon">🤝</span>
                        <div className="benefit-content">
                          <strong>Trust & Reliability</strong>
                          <p>Proven track record and working relationship</p>
                        </div>
                      </div>
                    </div>
                    <div className="relationship-strategies">
                      <h4>Relationship Building Strategies</h4>
                      <ul>
                        <li>Maintain regular communication between projects</li>
                        <li>Provide consistent work when available</li>
                        <li>Offer competitive rates for ongoing work</li>
                        <li>Include freelancers in strategic planning</li>
                        <li>Provide referrals and testimonials</li>
                        <li>Respect their professional growth and rates</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="content-block">
                  <h3>4. Future Planning</h3>
                  <div className="future-planning">
                    <div className="planning-areas">
                      <h4>Planning for Future Projects</h4>
                      <div className="planning-category">
                        <strong>Talent Pipeline</strong>
                        <ul>
                          <li>Maintain relationships with top performers</li>
                          <li>Build a roster of specialists by skill area</li>
                          <li>Keep updated contact information</li>
                          <li>Track availability and capacity</li>
                        </ul>
                      </div>
                      <div className="planning-category">
                        <strong>Process Improvement</strong>
                        <ul>
                          <li>Document what worked well</li>
                          <li>Identify areas for improvement</li>
                          <li>Update templates and checklists</li>
                          <li>Refine communication processes</li>
                        </ul>
                      </div>
                      <div className="planning-category">
                        <strong>Strategic Partnerships</strong>
                        <ul>
                          <li>Consider retainer arrangements</li>
                          <li>Explore exclusive partnerships</li>
                          <li>Discuss capacity and scaling</li>
                          <li>Plan for business growth together</li>
                        </ul>
                      </div>
                    </div>
                    <div className="success-metrics">
                      <h4>Measuring Hiring Success</h4>
                      <ul>
                        <li><strong>Project Success Rate:</strong> % of projects completed satisfactorily</li>
                        <li><strong>Time to Hire:</strong> Average time from posting to starting</li>
                        <li><strong>Repeat Hire Rate:</strong> % of freelancers hired multiple times</li>
                        <li><strong>Cost Efficiency:</strong> Budget vs. actual costs</li>
                        <li><strong>Quality Metrics:</strong> Review scores and client satisfaction</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <h2>Pro Tips for Successful Hiring</h2>
          <div className="tips-grid">
            {hiringTips.map((category, index) => (
              <div key={index} className="tip-category">
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

        {/* Common Mistakes */}
        <div className="mistakes-section">
          <h2>Avoid These Common Mistakes</h2>
          <div className="mistakes-grid">
            {commonMistakes.map((item, index) => (
              <div key={index} className="mistake-card">
                <h3>❌ {item.mistake}</h3>
                <div className="consequence">
                  <strong>Consequence:</strong> {item.consequence}
                </div>
                <div className="solution">
                  <strong>Solution:</strong> {item.solution}
                </div>
              </div>
            ))}
          </div>
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
            <Link to="/profiles" className="link-btn">
              Browse Freelancers
            </Link>
            <Link to="/payment-protection" className="link-btn">
              Payment Protection
            </Link>
            <Link to="/register" className="primary-btn">
              Start Hiring Now
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

export default HowToHire;
