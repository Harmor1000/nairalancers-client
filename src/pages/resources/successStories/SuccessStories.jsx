import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SuccessStories.scss';

const SuccessStories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Stories', icon: '⭐' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'development', name: 'Development', icon: '💻' },
    { id: 'writing', name: 'Writing', icon: '✍️' },
    { id: 'marketing', name: 'Marketing', icon: '📈' },
    { id: 'business', name: 'Business', icon: '💼' }
  ];

  const stories = [
    {
      id: 1,
      category: 'design',
      name: 'Adebayo Olatunji',
      title: 'From Unemployed Graduate to Top-Rated Designer',
      location: 'Lagos, Nigeria',
      avatar: '/img/man.png',
      earning: '₦2.5M/month',
      timeframe: '18 months',
      rating: 4.9,
      orders: 450,
      story: 'After graduating with a degree in Fine Arts, I struggled to find employment. I joined Nairalancers with basic Photoshop skills and started offering simple logo designs for ₦5,000. Through consistent quality work and excellent customer service, I gradually increased my rates and expanded my services. Today, I run a full-service design agency through the platform.',
      achievements: [
        'Increased rates from ₦5,000 to ₦150,000 per project',
        'Built a team of 3 designers',
        'Served over 200 international clients',
        'Featured in Nigerian Business Magazine'
      ],
      testimonial: '"Nairalancers gave me the platform to showcase my talent globally. The key was staying consistent and always exceeding client expectations."',
      tags: ['Logo Design', 'Branding', 'Print Design']
    },
    {
      id: 2,
      category: 'development',
      name: 'Fatima Mohammed',
      title: 'Self-Taught Developer Building Million-Naira Apps',
      location: 'Abuja, Nigeria',
      avatar: '/img/man.png',
      earning: '₦4.2M/month',
      timeframe: '2 years',
      rating: 5.0,
      orders: 89,
      story: 'I taught myself coding through online resources while working as a banker. Starting with simple WordPress customizations for ₦10,000, I gradually learned React, Node.js, and mobile development. My breakthrough came when I built a fintech app that generated over ₦50M in revenue for a client.',
      achievements: [
        'Built 15+ mobile applications',
        'Developed fintech solutions for 3 banks',
        'Created educational platform with 10,000+ users',
        'Speaking at tech conferences across Africa'
      ],
      testimonial: '"The beauty of Nairalancers is that skills matter more than certificates. I proved my worth through quality code and timely delivery."',
      tags: ['Mobile Apps', 'Web Development', 'Fintech']
    },
    {
      id: 3,
      category: 'writing',
      name: 'Chinedu Okwu',
      title: 'Content Writer Earning More Than His Corporate Job',
      location: 'Port Harcourt, Nigeria',
      avatar: '/img/man.png',
      earning: '₦1.8M/month',
      timeframe: '14 months',
      rating: 4.8,
      orders: 623,
      story: 'I started freelance writing as a side hustle while working in oil & gas. My technical background helped me specialize in writing for tech and finance companies. What started as weekend work eventually replaced my corporate salary, giving me the freedom to work from anywhere.',
      achievements: [
        'Published 500+ articles for Fortune 500 companies',
        'Created content strategies for 50+ startups',
        'Built email list of 25,000 marketers',
        'Launched successful copywriting course'
      ],
      testimonial: '"Quality research and meeting deadlines consistently helped me build a reputation that speaks for itself."',
      tags: ['Content Writing', 'Copywriting', 'Technical Writing']
    },
    {
      id: 4,
      category: 'marketing',
      name: 'Blessing Adaora',
      title: 'Digital Marketing Expert Scaling Businesses Globally',
      location: 'Enugu, Nigeria',
      avatar: '/img/man.png',
      earning: '₦3.1M/month',
      timeframe: '20 months',
      rating: 4.9,
      orders: 234,
      story: 'After my marketing degree, I struggled with unemployment. I invested my last ₦50,000 in Google Ads certification and started offering social media management for small businesses. My data-driven approach and proven ROI helped me attract bigger clients and higher-paying projects.',
      achievements: [
        'Managed ₦500M+ in ad spend',
        'Helped 100+ businesses scale revenue',
        'Built team of 8 marketing specialists',
        'Created digital marketing framework used by 1000+ marketers'
      ],
      testimonial: '"Success came from treating every small project like a million-naira contract. Word-of-mouth is everything in this business."',
      tags: ['Social Media', 'Google Ads', 'SEO']
    },
    {
      id: 5,
      category: 'business',
      name: 'Ibrahim Hassan',
      title: 'Virtual Assistant Turned Business Operations Consultant',
      location: 'Kano, Nigeria',
      avatar: '/img/man.png',
      earning: '₦1.6M/month',
      timeframe: '16 months',
      rating: 4.7,
      orders: 312,
      story: 'I started as a virtual assistant handling basic administrative tasks for ₦2,000/hour. By continuously learning new tools and systems, I evolved into a business operations consultant helping companies streamline their processes and reduce costs by up to 40%.',
      achievements: [
        'Optimized operations for 80+ companies',
        'Saved clients over ₦200M in operational costs',
        'Built automation systems reducing manual work by 60%',
        'Trained 500+ virtual assistants across Nigeria'
      ],
      testimonial: '"I focused on solving problems, not just completing tasks. This mindset transformed me from an assistant to a strategic partner."',
      tags: ['Virtual Assistant', 'Process Optimization', 'Business Consulting']
    },
    {
      id: 6,
      category: 'design',
      name: 'Kemi Adebisi',
      title: 'UI/UX Designer Creating Award-Winning Interfaces',
      location: 'Ibadan, Nigeria',
      avatar: '/img/man.png',
      earning: '₦2.8M/month',
      timeframe: '22 months',
      rating: 5.0,
      orders: 156,
      story: 'Coming from a psychology background, I was fascinated by user behavior. I self-taught design principles and user research methods. My psychology knowledge gives me an edge in creating intuitive interfaces that convert visitors into customers.',
      achievements: [
        'Designed interfaces for 3 unicorn startups',
        'Won 2 international design awards',
        'Increased client conversion rates by average 35%',
        'Mentoring 50+ aspiring designers'
      ],
      testimonial: '"Understanding user psychology is my secret weapon. Design is not just about looking good—it\'s about creating experiences that work."',
      tags: ['UI/UX Design', 'User Research', 'Conversion Optimization']
    }
  ];

  const filteredStories = selectedCategory === 'all' 
    ? stories 
    : stories.filter(story => story.category === selectedCategory);

  const stats = {
    totalFreelancers: '50,000+',
    averageIncrease: '340%',
    monthlyEarnings: '₦2.8B+',
    successRate: '89%'
  };

  return (
    <div className="success-stories">
      <div className="container">
        <div className="header">
          <h1>Success Stories</h1>
          <p className="subtitle">Real freelancers, real results, real impact on Nigerian economy</p>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">{stats.totalFreelancers}</div>
            <div className="stat-label">Active Freelancers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.averageIncrease}</div>
            <div className="stat-label">Average Income Increase</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.monthlyEarnings}</div>
            <div className="stat-label">Monthly Platform Earnings</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.successRate}</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="filter-icon">{category.icon}</span>
              <span className="filter-name">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="stories-grid">
          {filteredStories.map(story => (
            <div key={story.id} className="story-card">
              <div className="story-header">
                <div className="avatar-section">
                  <img src={story.avatar} alt={story.name} className="avatar" />
                  <div className="rating">
                    <span className="rating-number">⭐ {story.rating}</span>
                    <span className="orders">({story.orders} orders)</span>
                  </div>
                </div>
                <div className="person-info">
                  <h3 className="name">{story.name}</h3>
                  <p className="title">{story.title}</p>
                  <p className="location">📍 {story.location}</p>
                  <div className="achievements-summary">
                    <span className="earning">{story.earning}</span>
                    <span className="timeframe">in {story.timeframe}</span>
                  </div>
                </div>
              </div>

              <div className="story-content">
                <p className="story-text">{story.story}</p>
                
                <div className="achievements">
                  <h4>Key Achievements:</h4>
                  <ul>
                    {story.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                <blockquote className="testimonial">
                  <p>{story.testimonial}</p>
                  <cite>— {story.name}</cite>
                </blockquote>

                <div className="tags">
                  {story.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Write Your Success Story?</h2>
          <p>Join thousands of Nigerians building successful freelance careers on our platform</p>
          <div className="cta-buttons">
            <Link to="/register" className="primary-btn">Start Your Journey</Link>
            <Link to="/resources/freelancer-guide" className="secondary-btn">Learn How to Succeed</Link>
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
            <Link to="/gigs" className="primary-btn">
              Browse Services
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

export default SuccessStories;
