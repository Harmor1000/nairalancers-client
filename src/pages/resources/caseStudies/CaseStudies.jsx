import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CaseStudies.scss';

const CaseStudies = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📊' },
    { id: 'design', name: 'Design & Branding', icon: '🎨' },
    { id: 'development', name: 'Web Development', icon: '💻' },
    { id: 'marketing', name: 'Digital Marketing', icon: '📈' },
    { id: 'business', name: 'Business Solutions', icon: '📋' },
    { id: 'writing', name: 'Content & Writing', icon: '✍️' }
  ];

  const caseStudies = [
    {
      id: 1,
      category: 'design',
      title: 'Rebranding Lagos Fashion Startup',
      client: 'Afrocentric Styles',
      industry: 'Fashion & Retail',
      duration: '6 weeks',
      budget: '₦850,000',
      freelancer: 'Adebayo Olusegun',
      freelancerAvatar: '/img/avatars/designer1.jpg',
      results: {
        improvement: '340% increase in brand recognition',
        metrics: [
          'Social media engagement up 240%',
          'Website traffic increased by 180%',
          'Sales conversion up 85%',
          'Customer retention improved by 65%'
        ]
      },
      challenge: "Afrocentric Styles was a growing Lagos-based fashion startup struggling with brand identity. Their existing logo and marketing materials didn't reflect their African heritage and premium positioning. They needed a complete rebrand to stand out in Nigeria's competitive fashion market.",
      solution: "We partnered with Adebayo, a top-rated brand designer, who created a comprehensive brand identity system. This included a new logo incorporating traditional African patterns, color palette inspired by Nigerian textiles, and brand guidelines for consistent application across all touchpoints.",
      outcome: "The rebrand launched with a stunning website and social media campaign. Within 3 months, Afrocentric Styles became one of Lagos's most recognizable fashion brands, leading to partnerships with major retailers and fashion weeks.",
      testimonial: "Adebayo transformed our entire brand perception. The new identity perfectly captures our African heritage while appealing to modern consumers. Our sales have tripled since the rebrand!",
      clientAvatar: '/img/avatars/client1.jpg',
      clientName: 'Funmi Adebayo, Founder',
      tags: ['Branding', 'Logo Design', 'Brand Strategy', 'Visual Identity'],
      images: [
        '/img/case-studies/fashion-brand-before.jpg',
        '/img/case-studies/fashion-brand-after.jpg',
        '/img/case-studies/fashion-brand-applications.jpg'
      ]
    },
    {
      id: 2,
      category: 'development',
      title: 'E-commerce Platform for Nigerian Farmers',
      client: 'FarmConnect Nigeria',
      industry: 'Agriculture & Technology',
      duration: '12 weeks',
      budget: '₦2,800,000',
      freelancer: 'Chukwuma Okafor',
      freelancerAvatar: '/img/avatars/developer1.jpg',
      results: {
        improvement: '500% increase in farmer income',
        metrics: [
          '2,000+ farmers onboarded in first month',
          '₦15M+ in transactions processed',
          '98% platform uptime achieved',
          'Mobile-first design with 95% mobile usage'
        ]
      },
      challenge: "Nigerian farmers struggled to connect directly with buyers, often selling through multiple middlemen and receiving low prices for their produce. FarmConnect needed a robust platform to enable direct farmer-to-buyer transactions.",
      solution: "Chukwuma developed a comprehensive e-commerce platform with multi-language support (English, Hausa, Yoruba, Igbo), mobile money integration, and real-time inventory management. The platform included features for quality verification, logistics coordination, and farmer education.",
      outcome: "The platform successfully connected over 2,000 farmers with buyers across Nigeria. Farmers now receive 40-60% higher prices for their produce, while buyers get fresher products at competitive rates.",
      testimonial: "This platform has revolutionized how we sell our crops. Instead of selling to middlemen for ₦200 per bag, we now sell directly to buyers for ₦350. Chukwuma built exactly what Nigerian agriculture needed!",
      clientAvatar: '/img/avatars/client2.jpg',
      clientName: 'Musa Ibrahim, Partner Farmer',
      tags: ['Full-Stack Development', 'E-commerce', 'Mobile App', 'Payment Integration'],
      images: [
        '/img/case-studies/farmconnect-dashboard.jpg',
        '/img/case-studies/farmconnect-mobile.jpg',
        '/img/case-studies/farmconnect-farmers.jpg'
      ]
    },
    {
      id: 3,
      category: 'marketing',
      title: 'Digital Transformation for Traditional Bank',
      client: 'Heritage Bank Digital',
      industry: 'Banking & Finance',
      duration: '16 weeks',
      budget: '₦4,200,000',
      freelancer: 'Kemi Adeyemi',
      freelancerAvatar: '/img/avatars/marketer1.jpg',
      results: {
        improvement: '280% increase in digital customer acquisition',
        metrics: [
          'Mobile banking adoption up 450%',
          'Social media following grew by 320%',
          'Cost per acquisition reduced by 60%',
          'Customer satisfaction improved to 4.8/5'
        ]
      },
      challenge: "Heritage Bank needed to compete with digital-first banks and fintechs. Their traditional marketing approach wasn't reaching younger, tech-savvy customers who preferred mobile banking solutions.",
      solution: "Kemi developed a comprehensive digital marketing strategy including social media campaigns, influencer partnerships, content marketing, and targeted ads. She also optimized their mobile app onboarding process and created educational content about digital banking.",
      outcome: "The campaign successfully repositioned Heritage Bank as a modern, customer-centric institution. They gained over 100,000 new digital customers and significantly improved their market position among millennials and Gen Z.",
      testimonial: "Kemi's digital strategy transformed our bank's image. We went from being seen as 'old-fashioned' to leading digital innovation in Nigerian banking. Our young customer base has grown exponentially!",
      clientAvatar: '/img/avatars/client3.jpg',
      clientName: 'Dele Ogundipe, Digital Marketing Head',
      tags: ['Digital Marketing', 'Social Media', 'Content Strategy', 'Brand Positioning'],
      images: [
        '/img/case-studies/bank-campaign.jpg',
        '/img/case-studies/bank-social.jpg',
        '/img/case-studies/bank-mobile.jpg'
      ]
    },
    {
      id: 4,
      category: 'business',
      title: 'Operations Optimization for Logistics Company',
      client: 'Swift Delivery Nigeria',
      industry: 'Logistics & Supply Chain',
      duration: '10 weeks',
      budget: '₦1,650,000',
      freelancer: 'Fatima Al-Hassan',
      freelancerAvatar: '/img/avatars/consultant1.jpg',
      results: {
        improvement: '65% reduction in delivery time',
        metrics: [
          'Operational costs reduced by 35%',
          'Customer complaints down 80%',
          'Driver efficiency up 45%',
          'Fuel costs optimized by 28%'
        ]
      },
      challenge: "Swift Delivery was struggling with inefficient routes, high operational costs, and customer complaints about delayed deliveries. They needed to optimize their entire logistics operation to remain competitive.",
      solution: "Fatima conducted a comprehensive operational audit and implemented route optimization software, driver training programs, and performance tracking systems. She also redesigned their customer communication processes and inventory management.",
      outcome: "The company achieved significant improvements in efficiency and customer satisfaction. They've since expanded operations to 3 new states and increased their delivery capacity by 200%.",
      testimonial: "Fatima's expertise saved our business. Her systematic approach to optimization reduced our costs while dramatically improving service quality. We're now the fastest delivery service in Lagos!",
      clientAvatar: '/img/avatars/client4.jpg',
      clientName: 'Ahmed Bello, Operations Director',
      tags: ['Business Consulting', 'Operations Management', 'Process Optimization', 'Performance Analytics'],
      images: [
        '/img/case-studies/logistics-dashboard.jpg',
        '/img/case-studies/logistics-routes.jpg',
        '/img/case-studies/logistics-team.jpg'
      ]
    },
    {
      id: 5,
      category: 'writing',
      title: 'Content Strategy for EdTech Startup',
      client: 'LearnAfrica',
      industry: 'Education Technology',
      duration: '8 weeks',
      budget: '₦720,000',
      freelancer: 'Ngozi Okwu',
      freelancerAvatar: '/img/avatars/writer1.jpg',
      results: {
        improvement: '400% increase in organic traffic',
        metrics: [
          'Blog readership up 350%',
          'Email subscribers increased by 250%',
          'Course enrollments up 180%',
          'Social shares improved by 300%'
        ]
      },
      challenge: "LearnAfrica's online courses weren't gaining traction due to poor content marketing. They needed engaging, educational content that would attract students and establish thought leadership in African education.",
      solution: "Ngozi developed a comprehensive content strategy including blog posts about African education, study guides, career advice, and success stories. She also created email campaigns and social media content that resonated with African students and professionals.",
      outcome: "The content strategy positioned LearnAfrica as the leading voice in African online education. Their blog became a go-to resource for students across the continent, driving significant course enrollments.",
      testimonial: "Ngozi's content transformed our brand from unknown to industry leader. Her deep understanding of African education and engaging writing style helped us connect with students across 15 countries!",
      clientAvatar: '/img/avatars/client5.jpg',
      clientName: 'Dr. Emeka Nwankwo, Founder',
      tags: ['Content Writing', 'Content Strategy', 'SEO', 'Educational Content'],
      images: [
        '/img/case-studies/edtech-blog.jpg',
        '/img/case-studies/edtech-content.jpg',
        '/img/case-studies/edtech-growth.jpg'
      ]
    }
  ];

  const filteredCases = selectedCategory === 'all' 
    ? caseStudies 
    : caseStudies.filter(cs => cs.category === selectedCategory);

  const CaseStudyModal = ({ caseStudy, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{caseStudy.title}</h2>
          <div className="case-meta">
            <span className="industry">{caseStudy.industry}</span>
            <span className="duration">{caseStudy.duration}</span>
            <span className="budget">{caseStudy.budget}</span>
          </div>
        </div>

        <div className="modal-body">
          <div className="case-section">
            <h3>The Challenge</h3>
            <p>{caseStudy.challenge}</p>
          </div>

          <div className="case-section">
            <h3>Our Solution</h3>
            <p>{caseStudy.solution}</p>
          </div>

          <div className="case-section">
            <h3>Results Achieved</h3>
            <div className="results-grid">
              <div className="main-result">
                <span className="result-number">{caseStudy.results.improvement}</span>
              </div>
              <div className="metrics-list">
                {caseStudy.results.metrics.map((metric, index) => (
                  <div key={index} className="metric-item">
                    <span className="metric-icon">✓</span>
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="case-section">
            <h3>Client Testimonial</h3>
            <div className="testimonial">
              <p>"{caseStudy.testimonial}"</p>
              <div className="testimonial-author">
                <img src={caseStudy.clientAvatar || '/img/noavatar.jpg'} alt={caseStudy.clientName} />
                <div>
                  <strong>{caseStudy.clientName}</strong>
                  <span>{caseStudy.client}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="case-section">
            <h3>Freelancer</h3>
            <div className="freelancer-info">
              <img src={caseStudy.freelancerAvatar || '/img/noavatar.jpg'} alt={caseStudy.freelancer} />
              <div>
                <strong>{caseStudy.freelancer}</strong>
                <Link to={`/seller-profile/1`} className="view-profile">View Profile</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="case-studies">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <nav className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Case Studies</span>
          </nav>
          
          <div className="header-content">
            <h1>Success Stories</h1>
            <p className="header-subtitle">
              Real projects, real results. Discover how Nigerian businesses and freelancers 
              are achieving remarkable success through Nairalancers.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">₦2.8B+</div>
              <div className="stat-label">Total Project Value</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15,000+</div>
              <div className="stat-label">Successful Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24hrs</div>
              <div className="stat-label">Average Response Time</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-section">
          <h2>Explore by Category</h2>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="cases-section">
          <div className="cases-grid">
            {filteredCases.map(caseStudy => (
              <div key={caseStudy.id} className="case-card">
                <div className="case-header">
                  <div className="case-category">{categories.find(c => c.id === caseStudy.category)?.name}</div>
                  <h3>{caseStudy.title}</h3>
                  <p className="case-client">{caseStudy.client} • {caseStudy.industry}</p>
                </div>

                <div className="case-metrics">
                  <div className="main-metric">
                    <span className="metric-value">{caseStudy.results.improvement}</span>
                    <span className="metric-label">Main Result</span>
                  </div>
                  <div className="sub-metrics">
                    {caseStudy.results.metrics.slice(0, 2).map((metric, index) => (
                      <div key={index} className="sub-metric">
                        <span className="check-icon">✓</span>
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="case-footer">
                  <div className="freelancer">
                    <img src={caseStudy.freelancerAvatar || '/img/noavatar.jpg'} alt={caseStudy.freelancer} />
                    <div>
                      <strong>{caseStudy.freelancer}</strong>
                      <span className="budget">{caseStudy.budget}</span>
                    </div>
                  </div>
                  <button 
                    className="view-case-btn"
                    onClick={() => setSelectedCase(caseStudy)}
                  >
                    View Full Case Study
                  </button>
                </div>

                <div className="case-tags">
                  {caseStudy.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Create Your Success Story?</h2>
            <p>
              Join thousands of Nigerian businesses and freelancers who are achieving 
              remarkable results on our platform.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">
                Start Your Project
              </Link>
              <Link to="/gigs" className="cta-btn secondary">
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedCase && (
        <CaseStudyModal 
          caseStudy={selectedCase} 
          onClose={() => setSelectedCase(null)} 
        />
      )}
    </div>
  );
};

export default CaseStudies;
