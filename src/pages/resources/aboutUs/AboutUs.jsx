import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.scss';

const AboutUs = () => {
  const stats = [
    { number: '50,000+', label: 'Active Freelancers' },
    { number: '25,000+', label: 'Happy Clients' },
    { number: '₦2.8B+', label: 'Total Earnings' },
    { number: '17+', label: 'States Served' }
  ];

  const team = [
    {
      name: 'Adebayo Ogundimu',
      role: 'Co-Founder & CEO',
      bio: 'Former tech lead at Paystack with 8+ years building scalable platforms',
      image: '/img/man.png'
    },
    {
      name: 'Fatima Al-Hassan',
      role: 'Co-Founder & CTO',
      bio: 'Ex-Google engineer passionate about democratizing access to global opportunities',
      image: '/img/man.png'
    },
    {
      name: 'Chuka Emeka',
      role: 'Head of Operations',
      bio: 'McKinsey alum focused on building sustainable marketplace ecosystems',
      image: '/img/man.png'
    },
    {
      name: 'Amina Zubair',
      role: 'Head of Community',
      bio: 'Community building expert helping freelancers succeed across Africa',
      image: '/img/man.png'
    }
  ];

  const values = [
    {
      icon: '🌍',
      title: 'Global Opportunities',
      description: 'We believe every Nigerian deserves access to global work opportunities regardless of their location or background.'
    },
    {
      icon: '🤝',
      title: 'Trust & Transparency',
      description: 'We build trust through transparent processes, fair dispute resolution, and secure payment systems.'
    },
    {
      icon: '🚀',
      title: 'Continuous Growth',
      description: 'We empower freelancers and clients to grow their skills, businesses, and impact through our platform.'
    },
    {
      icon: '💪',
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from platform quality to customer support.'
    }
  ];

  return (
    <div className="about-us">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>About Nairalancers</h1>
          <p className="hero-subtitle">
            Empowering Nigerian talent to thrive in the global digital economy
          </p>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p className="mission-text">
              To democratize access to global work opportunities for Nigerian freelancers while 
              connecting businesses worldwide with Africa's most talented professionals. We believe 
              that talent is universal, but opportunity is not—and we're here to change that.
            </p>
          </div>
          <div className="mission-visual">
            <div className="mission-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="story-section">
          <h2>Our Story</h2>
          <div className="story-content">
            <div className="story-text">
              <p>
                Nairalancers was born from a simple observation: Nigeria has incredible talent, 
                but limited opportunities. In 2021, our founders—experienced tech professionals 
                who had worked at global companies—saw talented Nigerians struggling to access 
                international markets despite having world-class skills.
              </p>
              <p>
                Traditional freelancing platforms often had barriers: complex payment systems 
                that didn't work with Nigerian banks, customer support that didn't understand 
                local challenges, and algorithms that favored established markets over emerging ones.
              </p>
              <p>
                We decided to build something different—a platform designed specifically for 
                Nigerian freelancers, with local payment integration, naira-based pricing, 
                and deep understanding of the unique challenges and opportunities in our market.
              </p>
              <p>
                Today, Nairalancers is Nigeria's fastest-growing freelancing platform, having 
                facilitated over ₦2.8 billion in transactions and helped thousands of Nigerians 
                build sustainable freelance careers. We're just getting started.
              </p>
            </div>
            <div className="story-visual">
              <div className="journey-timeline">
                <div className="timeline-item">
                  <div className="year">2021</div>
                  <div className="milestone">Platform launched with 100 beta users</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2022</div>
                  <div className="milestone">Reached 10,000 active freelancers</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2023</div>
                  <div className="milestone">₁B+ in total transactions</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2024</div>
                  <div className="milestone">50,000+ freelancers, expanding to Ghana</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2>Meet Our Team</h2>
          <p className="team-intro">
            We're a diverse team of entrepreneurs, engineers, and community builders 
            united by our mission to unlock Nigerian talent.
          </p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-member">
                <img src={member.image} alt={member.name} className="member-photo" />
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="impact-section">
          <h2>Our Impact</h2>
          <div className="impact-grid">
            <div className="impact-item">
              <h3>Economic Empowerment</h3>
              <p>
                We've helped over 50,000 Nigerians earn a combined ₦2.8+ billion, 
                contributing significantly to household incomes and economic growth across the country.
              </p>
            </div>
            <div className="impact-item">
              <h3>Skills Development</h3>
              <p>
                Through our platform and educational resources, we've helped thousands of 
                Nigerians develop in-demand digital skills and build sustainable careers.
              </p>
            </div>
            <div className="impact-item">
              <h3>Global Recognition</h3>
              <p>
                Nigerian freelancers on our platform have delivered projects for Fortune 500 
                companies, showcasing our talent on the global stage.
              </p>
            </div>
            <div className="impact-item">
              <h3>Youth Employment</h3>
              <p>
                Over 70% of our freelancers are under 35, providing crucial employment 
                opportunities for Nigeria's youth population.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Join Our Mission</h2>
          <p>
            Whether you're a freelancer looking to unlock global opportunities or a business 
            seeking top-tier Nigerian talent, we invite you to be part of our story.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="primary-btn">
              Start Your Journey
            </Link>
            <Link to="/contact" className="secondary-btn">
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="footer">
          <div className="actions">
            <Link to="/contact" className="link-btn">
              Contact Us
            </Link>
            <Link to="/success-stories" className="link-btn">
              Success Stories
            </Link>
            <Link to="/careers" className="primary-btn">
              Join Our Team
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

export default AboutUs;
