import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HelpCenter.scss';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account Management', icon: '👤' },
    { id: 'gigs', name: 'Gigs & Services', icon: '💼' },
    { id: 'payments', name: 'Payments & Billing', icon: '💳' },
    { id: 'communication', name: 'Communication', icon: '💬' },
    { id: 'disputes', name: 'Disputes & Issues', icon: '⚖️' },
    { id: 'safety', name: 'Safety & Security', icon: '🔒' }
  ];

  const articles = [
    // Getting Started Articles
    {
      id: 1,
      title: 'How to Create Your First Gig on Nairalancers',
      category: 'getting-started',
      views: 15430,
      helpful: 98,
      content: 'Complete step-by-step guide to creating and optimizing your first service listing on Nairalancers, including title optimization, pricing strategies, and portfolio presentation...',
      tags: ['gig creation', 'beginner', 'freelancer', 'optimization']
    },
    {
      id: 6,
      title: 'Setting Up Your Professional Freelancer Profile',
      category: 'getting-started',
      views: 11200,
      helpful: 96,
      content: 'Learn how to create a compelling profile that attracts Nigerian clients, showcases your skills effectively, and builds trust in the local market...',
      tags: ['profile', 'optimization', 'freelancer', 'portfolio']
    },
    {
      id: 9,
      title: 'Getting Your First Order: A Beginner\'s Guide',
      category: 'getting-started',
      views: 8920,
      helpful: 94,
      content: 'Proven strategies to land your first client on Nairalancers, including competitive pricing, effective marketing, and building initial credibility...',
      tags: ['first order', 'marketing', 'pricing', 'credibility']
    },
    {
      id: 10,
      title: 'Understanding the Nigerian Freelance Market',
      category: 'getting-started',
      views: 7340,
      helpful: 92,
      content: 'Comprehensive overview of the Nigerian freelance landscape, client expectations, popular services, and cultural considerations for success...',
      tags: ['market research', 'nigeria', 'client expectations', 'culture']
    },

    // Payments & Billing Articles
    {
      id: 2,
      title: 'Understanding Nairalancers Fees and Charges',
      category: 'payments',
      views: 12650,
      helpful: 95,
      content: 'Complete breakdown of platform fees, processing charges, when they apply, and how to calculate your actual earnings from projects...',
      tags: ['fees', 'payments', 'earnings', 'calculations']
    },
    {
      id: 8,
      title: 'How to Withdraw Your Earnings in Nigeria',
      category: 'payments',
      views: 14200,
      helpful: 97,
      content: 'Step-by-step instructions for withdrawing money to Nigerian bank accounts, mobile money services, and international payment methods...',
      tags: ['withdrawal', 'bank transfer', 'mobile money', 'earnings']
    },
    {
      id: 11,
      title: 'Payment Methods and Security for Nigerian Users',
      category: 'payments',
      views: 6780,
      helpful: 91,
      content: 'Guide to available payment options in Nigeria, security best practices, and protecting your financial information on the platform...',
      tags: ['payment methods', 'security', 'nigeria', 'financial safety']
    },
    {
      id: 12,
      title: 'Handling Invoices and Tax Considerations',
      category: 'payments',
      views: 5430,
      helpful: 89,
      content: 'Understanding invoicing requirements, VAT implications for Nigerian freelancers, and basic tax considerations for freelance income...',
      tags: ['invoicing', 'tax', 'vat', 'legal compliance']
    },

    // Communication Articles
    {
      id: 3,
      title: 'How to Communicate Effectively with Clients',
      category: 'communication',
      views: 9870,
      helpful: 97,
      content: 'Best practices for professional communication, building client relationships, managing expectations, and handling difficult conversations...',
      tags: ['communication', 'clients', 'professional', 'relationships']
    },
    {
      id: 13,
      title: 'Managing Client Expectations and Project Scope',
      category: 'communication',
      views: 7650,
      helpful: 93,
      content: 'How to set clear boundaries, document project requirements, handle scope changes, and maintain professional relationships...',
      tags: ['expectations', 'scope management', 'boundaries', 'documentation']
    },
    {
      id: 14,
      title: 'Cultural Communication Tips for Nigerian Freelancers',
      category: 'communication',
      views: 5890,
      helpful: 95,
      content: 'Navigate cultural differences when working with international clients while leveraging your Nigerian business acumen...',
      tags: ['cultural communication', 'international clients', 'nigeria', 'business etiquette']
    },

    // Gigs & Services Articles
    {
      id: 7,
      title: 'Understanding Order Statuses and Workflow',
      category: 'gigs',
      views: 6450,
      helpful: 93,
      content: 'Complete guide to order lifecycle, status meanings, delivery expectations, and managing the entire project workflow effectively...',
      tags: ['orders', 'workflow', 'status', 'delivery']
    },
    {
      id: 15,
      title: 'Optimizing Your Gigs for Better Visibility',
      category: 'gigs',
      views: 8320,
      helpful: 96,
      content: 'SEO strategies, keyword optimization, pricing tactics, and marketing techniques to improve your gig rankings and attract more clients...',
      tags: ['seo', 'optimization', 'visibility', 'marketing']
    },
    {
      id: 16,
      title: 'Managing Multiple Orders and Time Efficiently',
      category: 'gigs',
      views: 5670,
      helpful: 88,
      content: 'Time management strategies, project prioritization, workflow optimization, and tools to handle multiple client projects successfully...',
      tags: ['time management', 'multiple orders', 'productivity', 'workflow']
    },
    {
      id: 17,
      title: 'Pricing Your Services Competitively in Nigeria',
      category: 'gigs',
      views: 9840,
      helpful: 94,
      content: 'Market research techniques, competitive pricing strategies, value-based pricing, and adjusting rates for the Nigerian market...',
      tags: ['pricing', 'market research', 'competition', 'value pricing']
    },

    // Account Management Articles
    {
      id: 18,
      title: 'Account Verification and Building Trust',
      category: 'account',
      views: 7920,
      helpful: 96,
      content: 'Complete guide to account verification process, building credibility badges, and establishing trust with potential clients...',
      tags: ['verification', 'trust', 'credibility', 'badges']
    },
    {
      id: 19,
      title: 'Privacy Settings and Profile Visibility',
      category: 'account',
      views: 4560,
      helpful: 87,
      content: 'Managing your privacy settings, controlling profile visibility, and balancing discoverability with personal security...',
      tags: ['privacy', 'settings', 'visibility', 'security']
    },
    {
      id: 20,
      title: 'Building Your Portfolio and Showcasing Work',
      category: 'account',
      views: 8750,
      helpful: 95,
      content: 'Creating an impressive portfolio, selecting best work samples, writing compelling descriptions, and showcasing your expertise...',
      tags: ['portfolio', 'showcase', 'work samples', 'descriptions']
    },

    // Safety & Security Articles
    {
      id: 4,
      title: 'Protecting Your Account from Fraud and Scams',
      category: 'safety',
      views: 8540,
      helpful: 99,
      content: 'Essential security tips, common scam patterns, two-factor authentication setup, and keeping your account and earnings safe...',
      tags: ['security', 'fraud prevention', 'scams', '2fa']
    },
    {
      id: 21,
      title: 'Safe Payment Practices and Red Flags',
      category: 'safety',
      views: 6340,
      helpful: 92,
      content: 'Identifying legitimate clients, avoiding payment scams, understanding escrow protection, and recognizing warning signs...',
      tags: ['payment safety', 'scam prevention', 'red flags', 'escrow']
    },
    {
      id: 22,
      title: 'Data Protection and Privacy Best Practices',
      category: 'safety',
      views: 3890,
      helpful: 90,
      content: 'Protecting client data, secure file sharing, privacy compliance, and maintaining professional data handling standards...',
      tags: ['data protection', 'privacy', 'file sharing', 'compliance']
    },

    // Disputes & Issues Articles
    {
      id: 5,
      title: 'How to Handle Disputes and Conflicts Professionally',
      category: 'disputes',
      views: 7620,
      helpful: 94,
      content: 'Guide to resolving conflicts professionally, using the dispute resolution system, mediation processes, and maintaining relationships...',
      tags: ['disputes', 'conflict resolution', 'mediation', 'professional']
    },
    {
      id: 23,
      title: 'Understanding Refund Policies and Procedures',
      category: 'disputes',
      views: 5210,
      helpful: 88,
      content: 'When refunds apply, how to request or issue refunds, partial refunds, and protecting both client and freelancer interests...',
      tags: ['refunds', 'policies', 'procedures', 'protection']
    },
    {
      id: 24,
      title: 'Escalating Issues to Nairalancers Support',
      category: 'disputes',
      views: 3450,
      helpful: 93,
      content: 'When and how to contact support, documenting issues properly, escalation procedures, and resolution timelines...',
      tags: ['support', 'escalation', 'documentation', 'resolution']
    }
  ];

  const quickActions = [
    {
      title: 'Submit a Support Ticket',
      description: 'Get personalized help from our support team',
      icon: '🎫',
      action: '/contact'
    },
    {
      title: 'Report a Problem',
      description: 'Report technical issues or user violations',
      icon: '🚨',
      action: '/contact'
    },
    {
      title: 'Live Chat Support',
      description: 'Chat with our support team in real-time',
      icon: '💬',
      action: '#'
    },
    {
      title: 'Community Forum',
      description: 'Get help from other users and experts',
      icon: '👥',
      action: '/community'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="help-center">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Help Center</h1>
          <p className="hero-subtitle">Find answers, get support, and learn how to succeed</p>
          
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for help articles, guides, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>
            <p className="search-suggestions">
              Popular searches: <span>payments</span>, <span>gig creation</span>, <span>profile setup</span>, <span>disputes</span>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.action} className="action-card">
                <div className="action-icon">{action.icon}</div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories Filter */}
        <div className="categories-section">
          <h2>Browse by Category</h2>
          <div className="categories-filter">
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
        </div>

        {/* Articles */}
        <div className="articles-section">
          <div className="articles-header">
            <h2>Help Articles</h2>
            <div className="results-count">
              {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div className="articles-grid">
            {filteredArticles.map(article => (
              <div key={article.id} className="article-card">
                <div className="article-header">
                  <h3>{article.title}</h3>
                  <div className="article-meta">
                    <span className="views">👁️ {article.views.toLocaleString()} views</span>
                    <span className="helpful">👍 {article.helpful}% helpful</span>
                  </div>
                </div>
                
                <p className="article-excerpt">{article.content}</p>
                
                <div className="article-tags">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
                
                <Link to={`/help/article/${article.id}`} className="read-more">
                  Read Full Article →
                </Link>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No articles found</h3>
              <p>Try adjusting your search terms or browse different categories</p>
              <button onClick={() => {setSearchQuery(''); setSelectedCategory('all');}} className="reset-btn">
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="contact-section">
          <h2>Still Need Help?</h2>
          <p>Can't find what you're looking for? Our support team is here to help.</p>
          <div className="contact-options">
            <Link to="/contact" className="contact-btn primary">
              Contact Support
            </Link>
            <button className="contact-btn secondary">
              Start Live Chat
            </button>
          </div>
        </div>

        <div className="footer">
          <div className="actions">
            <Link to="/contact" className="link-btn">
              Contact Support
            </Link>
            <Link to="/about" className="link-btn">
              About Us
            </Link>
            <Link to="/register" className="primary-btn">
              Join Platform
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

export default HelpCenter;
