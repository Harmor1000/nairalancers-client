import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactUs.scss';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    userType: 'freelancer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
        userType: 'freelancer'
      });
    }, 2000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      details: 'support@nairalancers.com',
      description: 'For general inquiries and support',
      availability: '24/7 response within 6 hours'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      details: 'Available on platform',
      description: 'Get instant help from our team',
      availability: 'Monday - Friday, 8AM - 8PM WAT'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      details: '+234 (0) 809 123 4567',
      description: 'Quick support via WhatsApp',
      availability: 'Monday - Friday, 9AM - 6PM WAT'
    },
    // {
    //   icon: '📍',
    //   title: 'Office Address',
    //   details: '15 Kofo Abayomi Street, Victoria Island, Lagos',
    //   description: 'Visit our headquarters',
    //   availability: 'Monday - Friday, 9AM - 5PM WAT'
    // }
  ];

  const departments = [
    {
      name: 'Technical Support',
      email: 'tech@nairalancers.com',
      description: 'Platform issues, bugs, technical difficulties'
    },
    {
      name: 'Business Development',
      email: 'business@nairalancers.com',
      description: 'Enterprise solutions, partnerships, bulk hiring'
    },
    {
      name: 'Trust & Safety',
      email: 'safety@nairalancers.com',
      description: 'Disputes, fraud reports, account security'
    },
    {
      name: 'Media & Press',
      email: 'press@nairalancers.com',
      description: 'Media inquiries, interviews, press releases'
    }
  ];

  const faqs = [
    {
      question: 'How long does it take to get a response?',
      answer: 'We typically respond to all inquiries within 6 hours during business hours. For urgent issues, please use our live chat feature.'
    },
    // {
    //   question: 'Can I visit your office?',
    //   answer: 'Yes! Our office is located in Victoria Island, Lagos. Please schedule an appointment by emailing us at least 24 hours in advance.'
    // },
    {
      question: 'Do you offer phone support?',
      answer: 'We primarily offer support through email, live chat, and WhatsApp. For complex issues, we can schedule a phone call.'
    },
    {
      question: 'How can I report a problem with another user?',
      answer: 'Please contact our Trust & Safety team at safety@nairalancers.com with detailed information about the issue.'
    }
  ];

  return (
    <div className="contact-us">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Get in Touch</h1>
          <p className="hero-subtitle">
            We're here to help you succeed. Reach out to us anytime!
          </p>
        </div>

        {/* Contact Methods */}
        <div className="contact-methods">
          <h2>How to Reach Us</h2>
          <div className="methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="method-card">
                <div className="method-icon">{method.icon}</div>
                <h3>{method.title}</h3>
                <div className="method-details">{method.details}</div>
                <p className="method-description">{method.description}</p>
                <div className="method-availability">{method.availability}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          <div className="form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="userType">I am a *</label>
                  <select
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="freelancer">Freelancer</option>
                    <option value="client">Client</option>
                    <option value="both">Both Freelancer & Client</option>
                    <option value="visitor">Just exploring</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="account">Account Issues</option>
                    <option value="business">Business Partnership</option>
                    <option value="media">Media & Press</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Please provide as much detail as possible about your inquiry..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div className="form-sidebar">
              <div className="response-time">
                <h3>📞 Response Times</h3>
                <ul>
                  <li><strong>Email:</strong> Within 6 hours</li>
                  <li><strong>Live Chat:</strong> 2-5 minutes</li>
                  <li><strong>WhatsApp:</strong> Within 30 minutes</li>
                  <li><strong>Complex Issues:</strong> 24-48 hours</li>
                </ul>
              </div>

              <div className="tips">
                <h3>💡 Tips for Faster Support</h3>
                <ul>
                  <li>Be specific about your issue</li>
                  <li>Include relevant screenshots</li>
                  <li>Mention your username if applicable</li>
                  <li>Use the correct category</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="departments-section">
          <h2>Specialized Departments</h2>
          <div className="departments-grid">
            {departments.map((dept, index) => (
              <div key={index} className="department-card">
                <h3>{dept.name}</h3>
                <div className="department-email">{dept.email}</div>
                <p>{dept.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Office Info */}
        {/* <div className="office-section">
          <h2>Visit Our Office</h2>
          <div className="office-content">
            <div className="office-details">
              <h3>Lagos Headquarters</h3>
              <div className="address">
                <p>📍 15 Kofo Abayomi Street</p>
                <p>Victoria Island, Lagos 101241</p>
                <p>Nigeria</p>
              </div>
              <div className="office-hours">
                <h4>Office Hours:</h4>
                <p>Monday - Friday: 9:00 AM - 5:00 PM WAT</p>
                <p>Saturday: 10:00 AM - 2:00 PM WAT</p>
                <p>Sunday: Closed</p>
              </div>
              <div className="directions">
                <h4>Getting Here:</h4>
                <ul>
                  <li>5 minutes walk from Tafawa Balewa Square BRT Station</li>
                  <li>Landmark: Near First Bank Tower</li>
                  <li>Parking available on-site</li>
                  <li>Accessible via Uber, Bolt, or public transport</li>
                </ul>
              </div>
            </div>
            <div className="office-map"> */}

              {/* Placeholder for map */}
              {/* <div className="map-placeholder">
                <p>🗺️ Interactive map coming soon</p>
                <a 
                  href="https://maps.google.com/?q=Victoria+Island+Lagos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="maps-link"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div> */}

        <div className="footer">
          <div className="actions">
            <Link to="/help" className="link-btn">
              Help Center
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

export default ContactUs;
