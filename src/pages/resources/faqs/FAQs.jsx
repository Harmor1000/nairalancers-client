import React, { useState } from "react";
import "./FAQs.scss";

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account on Nairalancers?",
          answer: "Creating an account is simple! Click the 'Join' button at the top of our homepage, choose whether you want to be a freelancer or client, fill in your details, and verify your email address. You'll be ready to start in minutes."
        },
        {
          question: "What's the difference between a buyer and seller account?",
          answer: "A seller (freelancer) account allows you to offer services and create gigs, while a buyer (client) account lets you hire freelancers and purchase services. You can switch your account type in your settings if needed."
        },
        {
          question: "Is Nairalancers free to use?",
          answer: "Yes! Joining Nairalancers is completely free. We only charge a small service fee when you successfully complete a transaction, ensuring our platform remains high-quality and secure."
        },
        {
          question: "How do I verify my account?",
          answer: "Account verification involves confirming your email address, phone number, and optionally your ID for enhanced security. Go to your profile settings and follow the verification steps to increase your credibility on the platform."
        }
      ]
    },
    {
      category: "For Freelancers",
      questions: [
        {
          question: "How do I create my first gig?",
          answer: "Once you've set up your seller account, click 'Add New Gig' from your dashboard. Include a compelling title, detailed description, competitive pricing, and attractive images. Make sure to highlight your unique skills and what makes your service special."
        },
        {
          question: "How do I set the right price for my services?",
          answer: "Research similar services on our platform, consider your experience level, and factor in the time required. Start competitive and gradually increase prices as you build reviews and reputation. Our pricing tips guide can help you optimize your rates."
        },
        {
          question: "When and how do I get paid?",
          answer: "Payment is released to your account after successful order completion and client approval. You can withdraw your earnings through bank transfer, mobile money, or other supported payment methods in Nigeria."
        },
        {
          question: "How can I improve my gig visibility?",
          answer: "Use relevant keywords in your title and tags, upload high-quality images, respond quickly to messages, maintain good ratings, and stay active on the platform. Consider offering competitive intro prices to build initial reviews."
        },
        {
          question: "What should I do if a client cancels an order?",
          answer: "If a client cancels, contact our support team if you believe the cancellation was unfair. We investigate each case and ensure freelancers are protected from unjustified cancellations that affect their ratings."
        }
      ]
    },
    {
      category: "For Clients",
      questions: [
        {
          question: "How do I find the right freelancer for my project?",
          answer: "Use our search filters to narrow down by category, budget, location, and delivery time. Read freelancer profiles, check their portfolios, and review past client feedback. Don't hesitate to message multiple freelancers to discuss your project before deciding."
        },
        {
          question: "How do I communicate my project requirements clearly?",
          answer: "Be specific about your needs, timeline, budget, and expected deliverables. Provide examples, reference materials, and detailed briefs. Clear communication upfront prevents misunderstandings and ensures better results."
        },
        {
          question: "What if I'm not satisfied with the work delivered?",
          answer: "Contact the freelancer first to discuss revisions - most are happy to make adjustments. If you can't reach an agreement, you can request a revision or escalate to our dispute resolution team for mediation."
        },
        {
          question: "How do payments work on Nairalancers?",
          answer: "Payments are held securely by Nairalancers until you approve the completed work. This protects both parties - freelancers are guaranteed payment for approved work, and clients only pay for satisfactory results."
        },
        {
          question: "Can I hire the same freelancer for multiple projects?",
          answer: "Absolutely! Building long-term relationships with skilled freelancers is encouraged. You can favorite freelancers you've worked with and easily contact them for future projects."
        }
      ]
    },
    {
      category: "Payments & Security",
      questions: [
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use bank-level encryption and work with trusted payment processors to ensure your financial information is completely secure. We never store your full payment details on our servers."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept bank transfers, debit cards, credit cards, and mobile money payments popular in Nigeria. We're constantly adding new payment options to make transactions convenient for everyone."
        },
        {
          question: "What are your service fees?",
          answer: "Our service fees are competitive and transparent. Clients pay a small processing fee on purchases, while freelancers pay a percentage of their earnings. All fees are clearly displayed before any transaction."
        },
        {
          question: "How do refunds work?",
          answer: "Refunds are processed case-by-case through our dispute resolution system. If work wasn't delivered as agreed or meets legitimate cancellation criteria, refunds are typically processed within 5-10 business days."
        },
        {
          question: "What should I do if I suspect fraudulent activity?",
          answer: "Report any suspicious activity immediately to our support team. We have robust fraud detection systems and take security seriously. We'll investigate promptly and take appropriate action to protect our community."
        }
      ]
    },
    {
      category: "Platform Features",
      questions: [
        {
          question: "How does the messaging system work?",
          answer: "Our built-in messaging system allows secure communication between clients and freelancers. All conversations are tracked for security and dispute resolution. You'll receive notifications for new messages."
        },
        {
          question: "What is the dispute resolution process?",
          answer: "If issues arise, our dispute resolution team mediates between parties. We review all communications, deliverables, and order details to reach fair solutions. Most disputes are resolved within 2-3 business days."
        },
        {
          question: "How do reviews and ratings work?",
          answer: "After order completion, both parties can leave reviews and ratings. These are public and help build trust in our community. Only clients who have actually purchased services can leave reviews for freelancers."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account anytime from your settings. Note that some information may be retained for legal and security purposes. Outstanding orders must be completed before account deletion."
        },
        {
          question: "Do you have a mobile app?",
          answer: "Currently, Nairalancers is optimized for mobile browsers. We're working on dedicated mobile apps for iOS and Android to be released soon. The web platform works seamlessly on all devices."
        }
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          question: "I'm having trouble logging in. What should I do?",
          answer: "First, check that you're using the correct email and password. Try resetting your password using the 'Forgot Password' link. Clear your browser cache or try a different browser. If issues persist, contact our support team."
        },
        {
          question: "Why isn't my gig appearing in search results?",
          answer: "Ensure your gig is published and active. Use relevant keywords in your title and description. New gigs may take a few hours to appear in search results. Check that you've completed all required fields and added quality images."
        },
        {
          question: "I'm not receiving email notifications. How can I fix this?",
          answer: "Check your spam/junk folder and add nairalancers.com to your safe senders list. Verify your email settings in your account preferences. Some email providers may delay notifications."
        },
        {
          question: "How do I report a user or inappropriate content?",
          answer: "Use the 'Report' button on user profiles or gigs, or contact our support team directly. We take violations of our community guidelines seriously and investigate all reports promptly."
        },
        {
          question: "I need to contact customer support. How do I reach you?",
          answer: "You can reach our support team through the Contact Us page, live chat feature, or email support@nairalancers.com. We aim to respond within 24 hours and provide comprehensive assistance."
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faqs">
      <div className="container">
        <div className="faqs-header">
          <h1>Frequently Asked Questions</h1>
          <p>
            Find answers to common questions about using Nairalancers. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        <div className="faqs-content">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="faq-list">
                {category.questions.map((faq, questionIndex) => {
                  const isOpen = openIndex === `${categoryIndex}-${questionIndex}`;
                  return (
                    <div 
                      key={questionIndex} 
                      className={`faq-item ${isOpen ? 'open' : ''}`}
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <span className={`faq-icon ${isOpen ? 'open' : ''}`}>
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="faqs-footer">
          <div className="still-need-help">
            <h3>Still need help?</h3>
            <p>Our support team is here to assist you with any questions not covered above.</p>
            <div className="help-actions">
              <a href="/contact" className="contact-btn">Contact Support</a>
              <a href="/help" className="help-center-btn">Visit Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
