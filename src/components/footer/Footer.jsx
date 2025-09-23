import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Company Info */}
          <div className="footer-section company-info">
            <div className="logo">
              {/* <h2>Nairalancers</h2> */}
              <Link to="/" className="link">
                <span className="text">naira</span>
                <span className="l">l</span>
                <span className="text">ancers</span>
                <span className="dot">.com</span>
              </Link>
              <br />
              <span className="tagline">Where Talent Meets Opportunity</span>
            </div>
            <p className="description">
              Nigeria's premier freelancing platform connecting talented
              professionals with clients seeking quality services. Build your
              career, grow your business.
            </p>
            <div className="social-links">
              <a
                href="https://facebook.com/nairalancers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/nairalancers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/nairalancers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on LinkedIn"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/nairalancers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3>Popular Services</h3>
            <ul>
              <li>
                <Link to="/gigs?cat=graphics-design">Graphics & Design</Link>
              </li>
              <li>
                <Link to="/gigs?category=writing-translation">
                  Writing & Translation
                </Link>
              </li>
              <li>
                <Link to="/gigs?category=programming-tech">
                  Programming & Tech
                </Link>
              </li>
              <li>
                <Link to="/gigs?category=digital-marketing">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link to="/gigs?category=video-animation">
                  Video & Animation
                </Link>
              </li>
              <li>
                <Link to="/gigs?category=business">Business</Link>
              </li>
              {/* <li>
                <Link to="/gigs?category=data">Data</Link>
              </li>
              <li>
                <Link to="/gigs?category=photography">Photography</Link>
              </li> */}
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="footer-section">
            <h3>For Freelancers</h3>
            <ul>
              <li>
                <Link to="/register">Become a Freelancer</Link>
              </li>
              <li>
                <Link to="/add">Create a Gig</Link>
              </li>
              <li>
                <Link to="/profiles">Browse Opportunities</Link>
              </li>
              <li>
                <Link to="/resources/freelancer-guide">Freelancer Guide</Link>
              </li>
              <li>
                <Link to="/resources/pricing-tips">Pricing Tips</Link>
              </li>
              <li>
                <Link to="/resources/portfolio-tips">Portfolio Tips</Link>
              </li>
              <li>
                <Link to="/resources/quality-assurance">Quality Assurance</Link>
              </li>
              {/* <li>
                <Link to="/community">Community Forum</Link>
              </li>
              <li>
                <Link to="/success-stories">Success Stories</Link>
              </li> */}
            </ul>
          </div>

          {/* For Clients */}
          <div className="footer-section">
            <h3>For Clients</h3>
            <ul>
              <li>
                <Link to="/gigs">Find Services</Link>
              </li>
              <li>
                <Link to="/profiles">Find Freelancers</Link>
              </li>
              <li>
                <Link to="/resources/hiring-guide">How to Hire</Link>
              </li>
              <li>
                <Link to="/resources/project-management">Project Management</Link>
              </li>
              <li>
                <Link to="/resources/case-studies">Success Stories</Link>
              </li>
              <li>
                <Link to="/resources/quality-assurance">Quality Assurance</Link>
              </li>
              <li>
                <Link to="/payment-protection">Payment Protection</Link>
              </li>
              {/* <li>
                <Link to="/enterprise">Enterprise Solutions</Link>
              </li> */}
              <li>
                <Link to="/resources/case-studies">Case Studies</Link>
              </li>
            </ul>
          </div>

          {/* Support & Company */}
          <div className="footer-section">
            <h3>Support & Company</h3>
            <ul>
              <li>
                <Link to="/help">Help Center</Link>
              </li>
              <li>
                <Link to="/faqs">FAQs</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              {/* <li>
                <Link to="/careers">Careers</Link>
              </li>
              <li>
                <Link to="/press">Press</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/partners">Partners</Link>
              </li> */}
              <li>
                <Link to="/affiliate">Affiliate Program</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Stay Updated</h3>
              <p>
                Get the latest updates, tips, and opportunities delivered to
                your inbox.
              </p>
            </div>
            <div className="newsletter-form">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    required
                    aria-label="Email address for newsletter"
                  />
                  <button type="submit">Subscribe</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>
                &copy; {new Date().getFullYear()} Nairalancers. All rights
                reserved.
              </p>
            </div>
            <div className="legal-links">
              <Link to="/terms-of-service">Terms of Service</Link>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/cookie-policy">Cookie Policy</Link>
              <Link to="/intellectual-property">IP Policy</Link>
            </div>
            <div className="footer-meta">
              <span>Made with ❤️ in Nigeria</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
