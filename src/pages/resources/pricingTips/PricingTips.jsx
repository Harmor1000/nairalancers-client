import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PricingTips.scss';

const PricingTips = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  
  // Calculator states
  const [hourlyCalc, setHourlyCalc] = useState({
    annualIncome: '',
    hoursPerWeek: '',
    weeksPerYear: '',
    expenses: '',
    result: null
  });
  
  const [projectCalc, setProjectCalc] = useState({
    estimatedHours: '',
    hourlyRate: '',
    complexityMultiplier: '1',
    rushFee: '',
    result: null
  });

  // Calculator functions
  const calculateHourlyRate = () => {
    const { annualIncome, hoursPerWeek, weeksPerYear, expenses } = hourlyCalc;
    
    if (!annualIncome || !hoursPerWeek || !weeksPerYear) {
      alert('Please fill in all required fields');
      return;
    }

    const totalHours = parseFloat(hoursPerWeek) * parseFloat(weeksPerYear);
    const grossHourlyRate = parseFloat(annualIncome) / totalHours;
    const expensePercentage = parseFloat(expenses) || 0;
    const finalHourlyRate = grossHourlyRate / (1 - expensePercentage / 100);

    setHourlyCalc(prev => ({
      ...prev,
      result: {
        grossRate: Math.round(grossHourlyRate),
        finalRate: Math.round(finalHourlyRate),
        totalHours,
        monthlyGoal: Math.round(parseFloat(annualIncome) / 12)
      }
    }));
  };

  const calculateProjectPrice = () => {
    const { estimatedHours, hourlyRate, complexityMultiplier, rushFee } = projectCalc;
    
    if (!estimatedHours || !hourlyRate) {
      alert('Please fill in estimated hours and hourly rate');
      return;
    }

    const basePrice = parseFloat(estimatedHours) * parseFloat(hourlyRate);
    const complexityPrice = basePrice * parseFloat(complexityMultiplier);
    const rushFeeAmount = (parseFloat(rushFee) || 0) / 100;
    const finalPrice = complexityPrice * (1 + rushFeeAmount);

    setProjectCalc(prev => ({
      ...prev,
      result: {
        basePrice: Math.round(basePrice),
        complexityPrice: Math.round(complexityPrice),
        finalPrice: Math.round(finalPrice),
        breakdown: {
          hours: parseFloat(estimatedHours),
          rate: parseFloat(hourlyRate),
          complexity: parseFloat(complexityMultiplier),
          rush: parseFloat(rushFee) || 0
        }
      }
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const categories = [
    { id: 'general', name: 'General Pricing', icon: '💰' },
    { id: 'design', name: 'Design Services', icon: '🎨' },
    { id: 'development', name: 'Development', icon: '💻' },
    { id: 'writing', name: 'Writing Services', icon: '✍️' },
    { id: 'marketing', name: 'Digital Marketing', icon: '📈' },
    { id: 'business', name: 'Business Services', icon: '📊' }
  ];

  const pricingData = {
    general: {
      title: "General Pricing Strategies",
      content: [
        {
          type: "strategy",
          title: "Value-Based Pricing",
          description: "Price based on the value you provide to the client, not just time spent",
          tips: [
            "Research the client's business and potential ROI",
            "Calculate the value your work will bring",
            "Consider the client's budget and industry standards",
            "Factor in your expertise and unique skills"
          ],
          example: "A logo design that could increase brand recognition by 40% justifies higher pricing than just hourly rates"
        },
        {
          type: "strategy",
          title: "Competitive Pricing",
          description: "Research market rates and position yourself strategically",
          tips: [
            "Analyze competitor pricing in your niche",
            "Don't always compete on price - compete on value",
            "Consider your experience level and portfolio quality",
            "Price slightly below top-tier until you build reputation"
          ],
          example: "If competitors charge ₦50,000-₦100,000 for websites, price at ₦45,000 initially"
        },
        {
          type: "strategy",
          title: "Package Pricing",
          description: "Create tiered packages to increase average order value",
          tips: [
            "Offer 3 tiers: Basic, Standard, Premium",
            "Make the middle option most attractive",
            "Include add-ons and extras in higher tiers",
            "Bundle related services together"
          ],
          example: "Basic logo (₦15,000), Standard logo + business card (₦30,000), Premium brand package (₦60,000)"
        }
      ]
    },
    design: {
      title: "Design Services Pricing",
      content: [
        {
          type: "category",
          title: "Logo Design",
          rates: {
            beginner: "₦10,000 - ₦25,000",
            intermediate: "₦25,000 - ₦50,000",
            expert: "₦50,000 - ₦150,000+"
          },
          factors: [
            "Number of concepts provided",
            "Revisions included",
            "File formats delivered",
            "Brand guidelines included",
            "Trademark research"
          ]
        },
        {
          type: "category",
          title: "Web Design",
          rates: {
            beginner: "₦50,000 - ₦150,000",
            intermediate: "₦150,000 - ₦400,000",
            expert: "₦400,000 - ₦1,000,000+"
          },
          factors: [
            "Number of pages",
            "Custom vs template design",
            "Responsive design",
            "Content management system",
            "E-commerce functionality"
          ]
        },
        {
          type: "category",
          title: "Graphic Design",
          rates: {
            beginner: "₦5,000 - ₦15,000",
            intermediate: "₦15,000 - ₦40,000",
            expert: "₦40,000 - ₦100,000+"
          },
          factors: [
            "Complexity of design",
            "Print vs digital",
            "Usage rights",
            "Rush delivery",
            "Multiple variations"
          ]
        }
      ]
    },
    development: {
      title: "Development Services Pricing",
      content: [
        {
          type: "category",
          title: "Website Development",
          rates: {
            beginner: "₦100,000 - ₦300,000",
            intermediate: "₦300,000 - ₦800,000",
            expert: "₦800,000 - ₦2,000,000+"
          },
          factors: [
            "Technology stack complexity",
            "Custom functionality requirements",
            "Database integration",
            "Third-party API integrations",
            "Performance optimization"
          ]
        },
        {
          type: "category",
          title: "Mobile App Development",
          rates: {
            beginner: "₦200,000 - ₦500,000",
            intermediate: "₦500,000 - ₦1,500,000",
            expert: "₦1,500,000 - ₦5,000,000+"
          },
          factors: [
            "Platform (iOS, Android, or both)",
            "App complexity and features",
            "Backend development needs",
            "App store optimization",
            "Maintenance and updates"
          ]
        },
        {
          type: "category",
          title: "Custom Software",
          rates: {
            beginner: "₦150,000 - ₦500,000",
            intermediate: "₦500,000 - ₦1,500,000",
            expert: "₦1,500,000 - ₦10,000,000+"
          },
          factors: [
            "Project scope and complexity",
            "Number of user roles",
            "Integration requirements",
            "Security considerations",
            "Scalability needs"
          ]
        }
      ]
    },
    writing: {
      title: "Writing Services Pricing",
      content: [
        {
          type: "category",
          title: "Content Writing",
          rates: {
            beginner: "₦50 - ₦150 per word",
            intermediate: "₦150 - ₦400 per word",
            expert: "₦400 - ₦1,000+ per word"
          },
          factors: [
            "Industry expertise required",
            "Research depth needed",
            "Content length and complexity",
            "SEO optimization",
            "Turnaround time"
          ]
        },
        {
          type: "category",
          title: "Copywriting",
          rates: {
            beginner: "₦20,000 - ₦50,000 per project",
            intermediate: "₦50,000 - ₦150,000 per project",
            expert: "₦150,000 - ₦500,000+ per project"
          },
          factors: [
            "Type of copy (sales, email, ads)",
            "Target audience complexity",
            "Brand voice development",
            "A/B testing variations",
            "Performance guarantees"
          ]
        },
        {
          type: "category",
          title: "Technical Writing",
          rates: {
            beginner: "₦100 - ₦300 per word",
            intermediate: "₦300 - ₦600 per word",
            expert: "₦600 - ₦1,500+ per word"
          },
          factors: [
            "Technical complexity",
            "Industry specialization",
            "Documentation type",
            "Audience technical level",
            "Visual elements included"
          ]
        }
      ]
    },
    marketing: {
      title: "Digital Marketing Pricing",
      content: [
        {
          type: "category",
          title: "Social Media Management",
          rates: {
            beginner: "₦30,000 - ₦80,000 per month",
            intermediate: "₦80,000 - ₦200,000 per month",
            expert: "₦200,000 - ₦500,000+ per month"
          },
          factors: [
            "Number of platforms managed",
            "Content creation included",
            "Posting frequency",
            "Community management",
            "Analytics and reporting"
          ]
        },
        {
          type: "category",
          title: "SEO Services",
          rates: {
            beginner: "₦50,000 - ₦150,000 per month",
            intermediate: "₦150,000 - ₦400,000 per month",
            expert: "₦400,000 - ₦1,000,000+ per month"
          },
          factors: [
            "Website size and complexity",
            "Competition level",
            "Number of target keywords",
            "Technical SEO requirements",
            "Content creation needs"
          ]
        },
        {
          type: "category",
          title: "PPC Campaign Management",
          rates: {
            beginner: "10-15% of ad spend",
            intermediate: "15-20% of ad spend",
            expert: "20-30% of ad spend"
          },
          factors: [
            "Campaign complexity",
            "Number of platforms",
            "Ad creative development",
            "Landing page optimization",
            "Conversion tracking setup"
          ]
        }
      ]
    },
    business: {
      title: "Business Services Pricing",
      content: [
        {
          type: "category",
          title: "Virtual Assistant",
          rates: {
            beginner: "₦1,500 - ₦3,000 per hour",
            intermediate: "₦3,000 - ₦6,000 per hour",
            expert: "₦6,000 - ₦12,000+ per hour"
          },
          factors: [
            "Task complexity",
            "Industry experience",
            "Software proficiency",
            "Availability requirements",
            "Communication skills"
          ]
        },
        {
          type: "category",
          title: "Business Consulting",
          rates: {
            beginner: "₦5,000 - ₦15,000 per hour",
            intermediate: "₦15,000 - ₦40,000 per hour",
            expert: "₦40,000 - ₦100,000+ per hour"
          },
          factors: [
            "Specialized expertise",
            "Industry experience",
            "Project scope",
            "Implementation support",
            "Results measurement"
          ]
        },
        {
          type: "category",
          title: "Data Entry",
          rates: {
            beginner: "₦800 - ₦2,000 per hour",
            intermediate: "₦2,000 - ₦4,000 per hour",
            expert: "₦4,000 - ₦8,000+ per hour"
          },
          factors: [
            "Data complexity",
            "Accuracy requirements",
            "Volume of work",
            "Deadline constraints",
            "Software requirements"
          ]
        }
      ]
    }
  };

  return (
    <div className="pricing-tips">
      <div className="container">
        <div className="header">
          <h1>Pricing Tips & Guidelines</h1>
          <p className="subtitle">Master the art of pricing your freelance services for maximum profitability</p>
        </div>

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

        <div className="content">
          <div className="category-content">
            <h2>{pricingData[selectedCategory].title}</h2>
            
            {selectedCategory === 'general' ? (
              <div className="strategies-grid">
                {pricingData[selectedCategory].content.map((strategy, index) => (
                  <div key={index} className="strategy-card">
                    <h3>{strategy.title}</h3>
                    <p className="description">{strategy.description}</p>
                    
                    <div className="tips-section">
                      <h4>Key Tips:</h4>
                      <ul>
                        {strategy.tips.map((tip, tipIndex) => (
                          <li key={tipIndex}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="example-section">
                      <h4>Example:</h4>
                      <p className="example">{strategy.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rates-grid">
                {pricingData[selectedCategory].content.map((service, index) => (
                  <div key={index} className="service-card">
                    <h3>{service.title}</h3>
                    
                    <div className="rates-section">
                      <h4>💰 Pricing Ranges:</h4>
                      <div className="rates-list">
                        <div className="rate-item beginner">
                          <span className="level">Beginner</span>
                          <span className="rate">{service.rates.beginner}</span>
                        </div>
                        <div className="rate-item intermediate">
                          <span className="level">Intermediate</span>
                          <span className="rate">{service.rates.intermediate}</span>
                        </div>
                        <div className="rate-item expert">
                          <span className="level">Expert</span>
                          <span className="rate">{service.rates.expert}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="factors-section">
                      <h4>📊 Pricing Factors:</h4>
                      <ul>
                        {service.factors.map((factor, factorIndex) => (
                          <li key={factorIndex}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Universal Pricing Tips */}
          <div className="universal-tips">
            <h2>Universal Pricing Principles</h2>
            
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">🎯</div>
                <h3>Know Your Worth</h3>
                <p>Calculate your costs, desired profit margin, and market positioning. Don't undervalue your skills and experience.</p>
              </div>
              
              <div className="tip-card">
                <div className="tip-icon">📈</div>
                <h3>Start Conservative, Grow Gradually</h3>
                <p>Begin with competitive rates to build portfolio and reviews, then increase prices as you gain reputation.</p>
              </div>
              
              <div className="tip-card">
                <div className="tip-icon">🔍</div>
                <h3>Research Your Market</h3>
                <p>Study competitor pricing, client budgets, and industry standards before setting your rates.</p>
              </div>
              
              <div className="tip-card">
                <div className="tip-icon">💼</div>
                <h3>Consider Project Scope</h3>
                <p>Factor in complexity, timeline, revisions, and any additional requirements when pricing projects.</p>
              </div>
              
              <div className="tip-card">
                <div className="tip-icon">⏰</div>
                <h3>Value Your Time</h3>
                <p>Include time for communication, revisions, project management, and administrative tasks in your pricing.</p>
              </div>
              
              <div className="tip-card">
                <div className="tip-icon">🎁</div>
                <h3>Offer Package Deals</h3>
                <p>Create bundled services at different price points to increase average order value and client convenience.</p>
              </div>
            </div>
          </div>

          {/* Pricing Calculator */}
          <div className="pricing-calculator">
            <h2>Quick Pricing Calculator</h2>
            <div className="calculator-grid">
              <div className="calculator-section">
                <h3>Hourly Rate Calculator</h3>
                <div className="calc-form">
                  <div className="input-group">
                    <label>Desired Annual Income (₦)</label>
                    <input 
                      type="number" 
                      placeholder="6,000,000" 
                      value={hourlyCalc.annualIncome}
                      onChange={(e) => setHourlyCalc(prev => ({...prev, annualIncome: e.target.value}))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Working Hours per Week</label>
                    <input 
                      type="number" 
                      placeholder="40" 
                      value={hourlyCalc.hoursPerWeek}
                      onChange={(e) => setHourlyCalc(prev => ({...prev, hoursPerWeek: e.target.value}))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Working Weeks per Year</label>
                    <input 
                      type="number" 
                      placeholder="48" 
                      value={hourlyCalc.weeksPerYear}
                      onChange={(e) => setHourlyCalc(prev => ({...prev, weeksPerYear: e.target.value}))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Business Expenses (%)</label>
                    <input 
                      type="number" 
                      placeholder="30" 
                      value={hourlyCalc.expenses}
                      onChange={(e) => setHourlyCalc(prev => ({...prev, expenses: e.target.value}))}
                    />
                  </div>
                  <button className="calc-btn" onClick={calculateHourlyRate}>Calculate Rate</button>
                  
                  {hourlyCalc.result && (
                    <div className="calc-result">
                      <h4>Your Recommended Rates:</h4>
                      <div className="result-item">
                        <span>Gross Hourly Rate:</span>
                        <strong>{formatCurrency(hourlyCalc.result.grossRate)}/hour</strong>
                      </div>
                      <div className="result-item">
                        <span>Rate with Expenses:</span>
                        <strong>{formatCurrency(hourlyCalc.result.finalRate)}/hour</strong>
                      </div>
                      <div className="result-item">
                        <span>Monthly Goal:</span>
                        <strong>{formatCurrency(hourlyCalc.result.monthlyGoal)}</strong>
                      </div>
                      <div className="result-item">
                        <span>Total Working Hours/Year:</span>
                        <strong>{hourlyCalc.result.totalHours} hours</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="calculator-section">
                <h3>Project-Based Calculator</h3>
                <div className="calc-form">
                  <div className="input-group">
                    <label>Estimated Hours</label>
                    <input 
                      type="number" 
                      placeholder="40" 
                      value={projectCalc.estimatedHours}
                      onChange={(e) => setProjectCalc(prev => ({...prev, estimatedHours: e.target.value}))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Hourly Rate (₦)</label>
                    <input 
                      type="number" 
                      placeholder="5000" 
                      value={projectCalc.hourlyRate}
                      onChange={(e) => setProjectCalc(prev => ({...prev, hourlyRate: e.target.value}))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Complexity Multiplier</label>
                    <select 
                      value={projectCalc.complexityMultiplier}
                      onChange={(e) => setProjectCalc(prev => ({...prev, complexityMultiplier: e.target.value}))}
                    >
                      <option value="1">Simple (1x)</option>
                      <option value="1.2">Medium (1.2x)</option>
                      <option value="1.5">Complex (1.5x)</option>
                      <option value="2">Very Complex (2x)</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Rush Fee (%)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={projectCalc.rushFee}
                      onChange={(e) => setProjectCalc(prev => ({...prev, rushFee: e.target.value}))}
                    />
                  </div>
                  <button className="calc-btn" onClick={calculateProjectPrice}>Calculate Project Price</button>
                  
                  {projectCalc.result && (
                    <div className="calc-result">
                      <h4>Project Pricing Breakdown:</h4>
                      <div className="result-item">
                        <span>Base Price:</span>
                        <strong>{formatCurrency(projectCalc.result.basePrice)}</strong>
                      </div>
                      <div className="result-item">
                        <span>With Complexity ({projectCalc.result.breakdown.complexity}x):</span>
                        <strong>{formatCurrency(projectCalc.result.complexityPrice)}</strong>
                      </div>
                      <div className="result-item">
                        <span>Final Price:</span>
                        <strong className="final-price">{formatCurrency(projectCalc.result.finalPrice)}</strong>
                      </div>
                      <div className="breakdown-details">
                        <small>
                          {projectCalc.result.breakdown.hours} hours × {formatCurrency(projectCalc.result.breakdown.rate)}/hour
                          {projectCalc.result.breakdown.rush > 0 && ` + ${projectCalc.result.breakdown.rush}% rush fee`}
                        </small>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <div className="actions">
            <Link to="/resources/freelancer-guide" className="link-btn">
              Freelancer Guide
            </Link>
            <Link to="/resources/portfolio-tips" className="link-btn">
              Portfolio Tips
            </Link>
            <Link to="/register" className="primary-btn">
              Start Freelancing
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

export default PricingTips;
