import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ArticleDetail.scss';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isHelpful, setIsHelpful] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const articles = {
    1: {
      id: 1,
      title: 'How to Create Your First Gig on Nairalancers',
      category: 'getting-started',
      views: 15430,
      helpful: 98,
      lastUpdated: '2024-01-15',
      readTime: '8 min read',
      tags: ['gig creation', 'beginner', 'freelancer'],
      content: `
        <div class="article-intro">
          <p>Creating your first gig on Nairalancers is an exciting step towards building your freelance career in Nigeria. This comprehensive guide will walk you through every step of the process, from choosing the right service to optimizing your gig for maximum visibility.</p>
        </div>

        <h2>Step 1: Plan Your Gig Strategy</h2>
        <p>Before creating your gig, it's important to plan your approach:</p>
        <ul>
          <li><strong>Research the market:</strong> Browse existing gigs in your category to understand pricing and competition</li>
          <li><strong>Identify your unique value:</strong> What makes your service different from others?</li>
          <li><strong>Define your target audience:</strong> Who are your ideal clients in Nigeria?</li>
          <li><strong>Set realistic pricing:</strong> Consider your experience level and market rates</li>
        </ul>

        <div class="pro-tip">
          <h4>💡 Pro Tip</h4>
          <p>Start with competitive pricing to build your reputation, then gradually increase rates as you gain positive reviews and experience.</p>
        </div>

        <h2>Step 2: Access the Gig Creation Page</h2>
        <ol>
          <li>Log into your Nairalancers account</li>
          <li>Click on your profile menu in the top right corner</li>
          <li>Select "Add New Gig" or navigate to the "Create Gig" section</li>
          <li>You'll be redirected to the gig creation form</li>
        </ol>

        <h2>Step 3: Write a Compelling Gig Title</h2>
        <p>Your gig title is the first thing potential clients see. Make it count:</p>
        <ul>
          <li><strong>Be specific:</strong> "I will design a professional logo for your Nigerian business"</li>
          <li><strong>Include keywords:</strong> Use terms your target clients would search for</li>
          <li><strong>Keep it under 80 characters:</strong> Ensure it displays fully on all devices</li>
          <li><strong>Mention your location advantage:</strong> "Nigerian graphic designer" can attract local clients</li>
        </ul>

        <div class="example-box">
          <h4>✅ Good Title Examples</h4>
          <ul>
            <li>"I will design a modern website for your Nigerian business with mobile optimization"</li>
            <li>"I will write SEO content in English and Pidgin for Nigerian audiences"</li>
            <li>"I will create social media graphics that connect with Nigerian consumers"</li>
          </ul>
        </div>

        <h2>Step 4: Choose Your Category and Subcategory</h2>
        <p>Selecting the right category helps clients find your gig:</p>
        <ul>
          <li><strong>Graphics & Design:</strong> Logos, flyers, social media graphics</li>
          <li><strong>Digital Marketing:</strong> Social media management, SEO, content marketing</li>
          <li><strong>Writing & Translation:</strong> Content writing, copywriting, translation</li>
          <li><strong>Programming & Tech:</strong> Web development, mobile apps, technical support</li>
          <li><strong>Business:</strong> Business plans, market research, virtual assistance</li>
        </ul>

        <h2>Step 5: Craft Your Gig Description</h2>
        <p>Your description should be detailed but scannable:</p>

        <h3>Structure Your Description:</h3>
        <ol>
          <li><strong>Opening Hook:</strong> Grab attention immediately</li>
          <li><strong>What You Offer:</strong> Be specific about deliverables</li>
          <li><strong>Your Process:</strong> Explain how you work</li>
          <li><strong>Why Choose You:</strong> Highlight your unique advantages</li>
          <li><strong>Call to Action:</strong> Encourage clients to contact you</li>
        </ol>

        <div class="template-box">
          <h4>📝 Description Template</h4>
          <p><strong>Opening:</strong> "Are you looking for a professional [service] that understands the Nigerian market?"</p>
          <p><strong>What I Offer:</strong> "I will provide you with: [specific deliverables]"</p>
          <p><strong>Process:</strong> "My approach includes: [your methodology]"</p>
          <p><strong>Experience:</strong> "With [X] years of experience serving Nigerian businesses..."</p>
          <p><strong>CTA:</strong> "Message me before ordering to discuss your specific needs!"</p>
        </div>

        <h2>Step 6: Set Your Pricing Structure</h2>
        <p>Nairalancers allows you to create multiple service packages:</p>

        <h3>Basic Package (₦5,000 - ₦15,000)</h3>
        <ul>
          <li>Essential deliverables only</li>
          <li>Standard timeline</li>
          <li>Limited revisions (1-2)</li>
        </ul>

        <h3>Standard Package (₦15,000 - ₦35,000)</h3>
        <ul>
          <li>All basic deliverables plus extras</li>
          <li>Faster delivery</li>
          <li>More revisions (3-5)</li>
          <li>Additional formats or features</li>
        </ul>

        <h3>Premium Package (₦35,000+)</h3>
        <ul>
          <li>Complete service package</li>
          <li>Priority delivery</li>
          <li>Unlimited revisions</li>
          <li>Extended support or consultation</li>
        </ul>

        <h2>Step 7: Upload High-Quality Gig Images</h2>
        <p>Visual presentation is crucial for attracting clients:</p>
        <ul>
          <li><strong>Main Image:</strong> Should be eye-catching and professional (1280x720px)</li>
          <li><strong>Portfolio Images:</strong> Show examples of your previous work</li>
          <li><strong>Process Images:</strong> Demonstrate your workflow</li>
          <li><strong>Local Context:</strong> Include images relevant to Nigerian businesses if applicable</li>
        </ul>

        <div class="warning-box">
          <h4>⚠️ Important Guidelines</h4>
          <ul>
            <li>Use original images or properly licensed stock photos</li>
            <li>Avoid copyrighted material</li>
            <li>Ensure images are high resolution and professional</li>
            <li>Include text overlay sparingly and make it readable</li>
          </ul>
        </div>

        <h2>Step 8: Add Gig Extras (Optional)</h2>
        <p>Extras allow clients to customize their orders:</p>
        <ul>
          <li><strong>Fast Delivery:</strong> +₦2,000 for 24-hour delivery</li>
          <li><strong>Additional Revisions:</strong> +₦1,500 for 2 extra revisions</li>
          <li><strong>Source Files:</strong> +₦3,000 for editable source files</li>
          <li><strong>Copyright Transfer:</strong> +₦5,000 for full commercial rights</li>
        </ul>

        <h2>Step 9: Set Requirements for Buyers</h2>
        <p>Specify what information you need from clients:</p>
        <ul>
          <li>Detailed project description</li>
          <li>Brand guidelines or style preferences</li>
          <li>Target audience information</li>
          <li>Deadline requirements</li>
          <li>Reference materials or examples</li>
        </ul>

        <h2>Step 10: Publish and Optimize</h2>
        <p>After publishing your gig:</p>
        <ol>
          <li><strong>Share on social media:</strong> Promote to your network</li>
          <li><strong>Optimize based on performance:</strong> Monitor views and conversion rates</li>
          <li><strong>Update regularly:</strong> Keep pricing and descriptions current</li>
          <li><strong>Respond quickly:</strong> Fast response times improve your ranking</li>
        </ol>

        <h2>Common Mistakes to Avoid</h2>
        <ul>
          <li><strong>Copying other gigs:</strong> Create original content</li>
          <li><strong>Unrealistic pricing:</strong> Research market rates</li>
          <li><strong>Poor image quality:</strong> Invest in good visuals</li>
          <li><strong>Vague descriptions:</strong> Be specific about deliverables</li>
          <li><strong>Ignoring SEO:</strong> Use relevant keywords naturally</li>
        </ul>

        <h2>Success Tips for Nigerian Freelancers</h2>
        <div class="success-tips">
          <ul>
            <li><strong>Leverage local knowledge:</strong> Understanding Nigerian business culture is valuable</li>
            <li><strong>Offer bilingual services:</strong> English and local languages when applicable</li>
            <li><strong>Understand payment preferences:</strong> Many clients prefer bank transfers</li>
            <li><strong>Be responsive during business hours:</strong> Nigerian time zone awareness matters</li>
            <li><strong>Build portfolio with local work:</strong> Nigerian businesses prefer proven local experience</li>
          </ul>
        </div>

        <h2>Next Steps</h2>
        <p>After creating your first gig:</p>
        <ol>
          <li>Monitor your gig analytics to understand performance</li>
          <li>Actively promote your services on social media</li>
          <li>Engage with potential clients through the messaging system</li>
          <li>Continuously improve based on client feedback</li>
          <li>Consider creating additional gigs in complementary services</li>
        </ol>

        <div class="final-tip">
          <h4>🎯 Final Thoughts</h4>
          <p>Creating a successful gig takes time and iteration. Don't be discouraged if you don't get orders immediately. Focus on providing excellent service, building positive reviews, and continuously improving your offerings. The Nigerian freelance market is growing rapidly, and there's room for quality service providers who understand local needs.</p>
        </div>
      `,
      relatedArticles: [2, 6, 7]
    },
    2: {
      id: 2,
      title: 'Understanding Nairalancers Fees and Charges',
      category: 'payments',
      views: 12650,
      helpful: 95,
      lastUpdated: '2024-01-10',
      readTime: '6 min read',
      tags: ['fees', 'payments', 'earnings'],
      content: `
        <div class="article-intro">
          <p>Understanding the fee structure on Nairalancers is crucial for both freelancers and clients. This guide breaks down all charges, when they apply, and how to calculate your actual earnings or project costs.</p>
        </div>

        <h2>Freelancer Fees</h2>
        
        <h3>Service Fee Structure</h3>
        <p>Nairalancers charges freelancers a service fee on completed orders:</p>
        <ul>
          <li><strong>Orders up to ₦50,000:</strong> 20% service fee</li>
          <li><strong>Orders ₦50,001 - ₦100,000:</strong> 10% service fee</li>
          <li><strong>Orders above ₦100,000:</strong> 5% service fee</li>
        </ul>

        <div class="calculation-example">
          <h4>💰 Calculation Examples</h4>
          <p><strong>Example 1:</strong> ₦25,000 order</p>
          <p>Service fee: ₦25,000 × 20% = ₦5,000</p>
          <p>Your earnings: ₦25,000 - ₦5,000 = ₦20,000</p>
          
          <p><strong>Example 2:</strong> ₦75,000 order</p>
          <p>Service fee: ₦75,000 × 10% = ₦7,500</p>
          <p>Your earnings: ₦75,000 - ₦7,500 = ₦67,500</p>
        </div>

        <h3>When Fees Are Charged</h3>
        <ul>
          <li>Fees are deducted only when an order is marked as complete</li>
          <li>No fees on cancelled orders</li>
          <li>Fees apply to the total order amount including any extras</li>
          <li>Tips from clients are not subject to service fees</li>
        </ul>

        <h2>Client Fees</h2>
        
        <h3>Payment Processing Fee</h3>
        <p>Clients pay a small processing fee on top of the gig price:</p>
        <ul>
          <li><strong>Nigerian bank cards:</strong> 1.4% + ₦100 processing fee</li>
          <li><strong>International cards:</strong> 3.9% + ₦200 processing fee</li>
          <li><strong>Bank transfer:</strong> ₦50 flat fee</li>
        </ul>

        <h3>Currency Conversion</h3>
        <p>For international clients:</p>
        <ul>
          <li>Prices are displayed in Naira (₦)</li>
          <li>Real-time conversion rates apply</li>
          <li>Small currency conversion fee may apply (0.5%)</li>
        </ul>

        <h2>Withdrawal Fees</h2>
        
        <h3>For Nigerian Freelancers</h3>
        <ul>
          <li><strong>Bank transfer:</strong> ₦50 per withdrawal</li>
          <li><strong>Mobile money:</strong> ₦25 per withdrawal</li>
          <li><strong>Minimum withdrawal:</strong> ₦1,000</li>
          <li><strong>Processing time:</strong> 1-3 business days</li>
        </ul>

        <h3>For International Freelancers</h3>
        <ul>
          <li><strong>PayPal:</strong> $2 + 2% conversion fee</li>
          <li><strong>Wire transfer:</strong> $15 flat fee</li>
          <li><strong>Cryptocurrency:</strong> Network fees apply</li>
          <li><strong>Minimum withdrawal:</strong> $50 equivalent</li>
        </ul>

        <h2>Fee Optimization Tips</h2>
        
        <h3>For Freelancers</h3>
        <div class="tips-section">
          <ul>
            <li><strong>Target higher-value orders:</strong> Lower fee percentages on larger orders</li>
            <li><strong>Bundle services:</strong> Combine multiple small services into one larger package</li>
            <li><strong>Use gig extras strategically:</strong> Add value without creating separate orders</li>
            <li><strong>Build long-term relationships:</strong> Repeat clients often place larger orders</li>
          </ul>
        </div>

        <h3>For Clients</h3>
        <div class="tips-section">
          <ul>
            <li><strong>Use bank transfer:</strong> Lowest processing fees for Nigerian clients</li>
            <li><strong>Bundle multiple services:</strong> Reduce per-transaction fees</li>
            <li><strong>Plan larger projects:</strong> Better value on comprehensive packages</li>
          </ul>
        </div>

        <h2>Fee Transparency</h2>
        <p>All fees are clearly displayed:</p>
        <ul>
          <li>Processing fees shown at checkout</li>
          <li>Service fees detailed in freelancer dashboard</li>
          <li>No hidden charges or surprise fees</li>
          <li>Full breakdown available in invoices</li>
        </ul>

        <h2>Promotions and Fee Waivers</h2>
        <p>Nairalancers occasionally offers:</p>
        <ul>
          <li>Reduced fees for new freelancers (first 30 days)</li>
          <li>Processing fee waivers during promotional periods</li>
          <li>Loyalty rewards for high-volume users</li>
          <li>Special rates for verified Nigerian businesses</li>
        </ul>

        <div class="important-note">
          <h4>📋 Important Notes</h4>
          <ul>
            <li>All fees are subject to change with 30 days notice</li>
            <li>VAT may apply for registered Nigerian businesses</li>
            <li>Refund policies may affect fee calculations</li>
            <li>Contact support for fee-related questions</li>
          </ul>
        </div>
      `,
      relatedArticles: [8, 1, 4]
    },
    3: {
      id: 3,
      title: 'How to Communicate Effectively with Clients',
      category: 'communication',
      views: 9870,
      helpful: 97,
      lastUpdated: '2024-01-12',
      readTime: '7 min read',
      tags: ['communication', 'clients', 'professional'],
      content: `
        <div class="article-intro">
          <p>Effective communication is the foundation of successful freelance relationships. This guide covers best practices for professional communication that builds trust, prevents misunderstandings, and leads to better project outcomes and repeat business.</p>
        </div>

        <h2>Communication Fundamentals</h2>
        
        <h3>The CLEAR Method</h3>
        <ul>
          <li><strong>C</strong>oncise: Get to the point quickly</li>
          <li><strong>L</strong>ogical: Organize your thoughts</li>
          <li><strong>E</strong>mpathetic: Understand client needs</li>
          <li><strong>A</strong>ctionable: Provide clear next steps</li>
          <li><strong>R</strong>esponsive: Reply promptly</li>
        </ul>

        <h2>Initial Client Contact</h2>
        
        <h3>Responding to Inquiries</h3>
        <div class="template-box">
          <h4>📧 Response Template</h4>
          <p>"Hi [Client Name],</p>
          <p>Thank you for your interest in my [service type] services. I'd be happy to help you with [specific project].</p>
          <p>To provide you with the most accurate proposal, I have a few questions:</p>
          <ul>
            <li>[Specific question about requirements]</li>
            <li>[Timeline question]</li>
            <li>[Budget consideration]</li>
          </ul>
          <p>I typically respond within [timeframe] and can start your project as early as [date].</p>
          <p>Looking forward to working with you!</p>
          <p>Best regards,<br>[Your Name]"</p>
        </div>

        <h3>Key Elements of First Contact</h3>
        <ul>
          <li><strong>Professional greeting:</strong> Use proper salutation</li>
          <li><strong>Acknowledge their project:</strong> Show you read their requirements</li>
          <li><strong>Ask clarifying questions:</strong> Demonstrate thoroughness</li>
          <li><strong>Set expectations:</strong> Response time and availability</li>
          <li><strong>Professional closing:</strong> Thank them for their consideration</li>
        </ul>

        <h2>Project Communication</h2>
        
        <h3>Regular Updates</h3>
        <p>Keep clients informed throughout the project:</p>
        <ul>
          <li><strong>Daily updates for short projects (1-3 days)</strong></li>
          <li><strong>Every 2-3 days for medium projects (1-2 weeks)</strong></li>
          <li><strong>Weekly updates for long projects (1+ months)</strong></li>
          <li><strong>Immediate updates for any delays or issues</strong></li>
        </ul>

        <div class="update-template">
          <h4>📊 Progress Update Template</h4>
          <p>"Hi [Client Name],</p>
          <p>Quick update on your [project name]:</p>
          <p><strong>Completed:</strong> [Specific tasks finished]</p>
          <p><strong>In Progress:</strong> [Current work]</p>
          <p><strong>Next Steps:</strong> [Upcoming tasks]</p>
          <p><strong>Timeline:</strong> Still on track for [delivery date]</p>
          <p>Let me know if you have any questions or feedback!</p>
          <p>Best regards,<br>[Your Name]"</p>
        </div>

        <h2>Managing Client Expectations</h2>
        
        <h3>Setting Clear Boundaries</h3>
        <ul>
          <li><strong>Working hours:</strong> "I'm available Monday-Friday, 9 AM - 6 PM WAT"</li>
          <li><strong>Response time:</strong> "I respond to messages within 4 hours during business days"</li>
          <li><strong>Revision policy:</strong> "Package includes 3 rounds of revisions"</li>
          <li><strong>Scope clarity:</strong> Document what's included and excluded</li>
        </ul>

        <h3>Handling Scope Changes</h3>
        <div class="scope-template">
          <h4>🔄 Scope Change Response</h4>
          <p>"Hi [Client Name],</p>
          <p>I understand you'd like to add [new requirement] to the project.</p>
          <p>This would be considered outside the original scope and would require:</p>
          <ul>
            <li>Additional time: [X hours/days]</li>
            <li>Additional cost: [Amount]</li>
            <li>Revised timeline: [New delivery date]</li>
          </ul>
          <p>Would you like me to create a separate order for this addition?</p>
          <p>Best regards,<br>[Your Name]"</p>
        </div>

        <h2>Cultural Considerations for Nigerian Market</h2>
        
        <h3>Communication Styles</h3>
        <ul>
          <li><strong>Respectful tone:</strong> Use "Sir" or "Ma" when appropriate</li>
          <li><strong>Relationship building:</strong> Invest time in getting to know clients</li>
          <li><strong>Patience with processes:</strong> Allow extra time for approvals</li>
          <li><strong>Flexible scheduling:</strong> Accommodate different time zones</li>
        </ul>

        <h3>Local Business Practices</h3>
        <ul>
          <li><strong>Payment discussions:</strong> Be clear but tactful about fees</li>
          <li><strong>Timeline flexibility:</strong> Build in buffer time for local holidays</li>
          <li><strong>Reference understanding:</strong> Familiarity with Nigerian business culture is valuable</li>
        </ul>

        <h2>Difficult Conversations</h2>
        
        <h3>Addressing Delays</h3>
        <div class="delay-template">
          <h4>⏰ Delay Notification</h4>
          <p>"Hi [Client Name],</p>
          <p>I need to inform you of a delay in your project delivery.</p>
          <p><strong>Original timeline:</strong> [Date]</p>
          <p><strong>New timeline:</strong> [Date]</p>
          <p><strong>Reason:</strong> [Brief explanation]</p>
          <p><strong>What I'm doing:</strong> [Steps to prevent future delays]</p>
          <p>I sincerely apologize for any inconvenience and appreciate your understanding.</p>
          <p>Best regards,<br>[Your Name]"</p>
        </div>

        <h3>Handling Unhappy Clients</h3>
        <ul>
          <li><strong>Listen actively:</strong> Let them express their concerns fully</li>
          <li><strong>Acknowledge feelings:</strong> "I understand your frustration"</li>
          <li><strong>Take responsibility:</strong> Own up to any mistakes</li>
          <li><strong>Offer solutions:</strong> Provide concrete steps to resolve issues</li>
          <li><strong>Follow up:</strong> Ensure satisfaction after resolution</li>
        </ul>

        <h2>Building Long-term Relationships</h2>
        
        <h3>Going Above and Beyond</h3>
        <ul>
          <li><strong>Proactive suggestions:</strong> Offer improvements or optimizations</li>
          <li><strong>Educational value:</strong> Explain your decisions and processes</li>
          <li><strong>Follow-up care:</strong> Check in after project completion</li>
          <li><strong>Future planning:</strong> Discuss ongoing needs</li>
        </ul>

        <h3>Maintaining Contact</h3>
        <ul>
          <li><strong>Seasonal check-ins:</strong> Holiday greetings and business updates</li>
          <li><strong>Value-added content:</strong> Share relevant industry insights</li>
          <li><strong>Referral appreciation:</strong> Thank clients who refer new business</li>
          <li><strong>Portfolio updates:</strong> Show how you've grown and improved</li>
        </ul>

        <h2>Communication Tools and Platforms</h2>
        
        <h3>Nairalancers Messaging</h3>
        <ul>
          <li><strong>Primary communication:</strong> Keep all project communication on-platform</li>
          <li><strong>File sharing:</strong> Use built-in file transfer for deliverables</li>
          <li><strong>Order management:</strong> Link messages to specific orders</li>
        </ul>

        <h3>External Tools (When Appropriate)</h3>
        <ul>
          <li><strong>WhatsApp:</strong> For quick updates (with client permission)</li>
          <li><strong>Email:</strong> For formal communications and invoices</li>
          <li><strong>Video calls:</strong> For complex project discussions</li>
          <li><strong>Screen sharing:</strong> For demonstrations and training</li>
        </ul>

        <div class="communication-checklist">
          <h4>✅ Communication Checklist</h4>
          <ul>
            <li>Respond to messages within 4 hours during business days</li>
            <li>Use proper grammar and spelling</li>
            <li>Keep communication professional but friendly</li>
            <li>Document important decisions and changes</li>
            <li>Set clear expectations upfront</li>
            <li>Provide regular project updates</li>
            <li>Be honest about challenges or delays</li>
            <li>Thank clients for their business</li>
          </ul>
        </div>
      `,
      relatedArticles: [1, 5, 6]
    },
    4: {
      id: 4,
      title: 'Protecting Your Account from Fraud and Scams',
      category: 'safety',
      views: 8540,
      helpful: 99,
      lastUpdated: '2024-01-08',
      readTime: '10 min read',
      tags: ['security', 'fraud prevention', 'scams', '2fa'],
      content: `
        <div class="article-intro">
          <p>Account security is paramount in the digital freelancing world. This comprehensive guide covers essential security measures, common threats in Nigeria, and practical steps to protect your Nairalancers account and earnings from fraud and scams.</p>
        </div>

        <h2>Understanding Common Threats</h2>
        
        <h3>Phishing Attempts</h3>
        <p>Fraudsters often impersonate Nairalancers through fake emails or websites:</p>
        <ul>
          <li><strong>Fake login pages:</strong> Always check the URL before entering credentials</li>
          <li><strong>Suspicious emails:</strong> Nairalancers will never ask for passwords via email</li>
          <li><strong>Urgent account warnings:</strong> Verify directly through the official website</li>
          <li><strong>Too-good-to-be-true offers:</strong> Be skeptical of unrealistic opportunities</li>
        </ul>

        <div class="warning-box">
          <h4>🚨 Red Flags to Watch For</h4>
          <ul>
            <li>URLs that don't match nairalancers.com exactly</li>
            <li>Emails with poor grammar or urgent language</li>
            <li>Requests for sensitive information via email or message</li>
            <li>Offers that seem too good to be true</li>
            <li>Pressure to act immediately without time to verify</li>
          </ul>
        </div>

        <h3>Client-Related Scams</h3>
        <p>Common scams targeting Nigerian freelancers:</p>
        <ul>
          <li><strong>Advance fee scams:</strong> Clients asking for upfront payments</li>
          <li><strong>Overpayment scams:</strong> Sending more money then asking for refunds</li>
          <li><strong>Fake check scams:</strong> Using fraudulent payment methods</li>
          <li><strong>Work-for-free schemes:</strong> Promising future payment for immediate work</li>
        </ul>

        <h2>Essential Security Measures</h2>
        
        <h3>Strong Password Creation</h3>
        <div class="template-box">
          <h4>🔐 Password Best Practices</h4>
          <ul>
            <li><strong>Length:</strong> Minimum 12 characters, preferably 16+</li>
            <li><strong>Complexity:</strong> Mix of uppercase, lowercase, numbers, symbols</li>
            <li><strong>Uniqueness:</strong> Different password for each online account</li>
            <li><strong>Avoid:</strong> Personal information, dictionary words, common patterns</li>
          </ul>
          <p><strong>Example strong password:</strong> MyN@ir@L@nc3r$2024!</p>
        </div>

        <h3>Two-Factor Authentication (2FA)</h3>
        <p>Enable 2FA to add an extra security layer:</p>
        <ol>
          <li>Go to Account Settings → Security</li>
          <li>Click "Enable Two-Factor Authentication"</li>
          <li>Choose SMS or Authenticator App method</li>
          <li>Follow the setup instructions carefully</li>
          <li>Save backup codes in a secure location</li>
        </ol>

        <div class="pro-tip">
          <h4>💡 Pro Tip</h4>
          <p>Use Google Authenticator or Authy apps instead of SMS when possible - they're more secure against SIM swap attacks.</p>
        </div>

        <h3>Email Security</h3>
        <ul>
          <li><strong>Use a secure email provider:</strong> Gmail, Outlook, or ProtonMail</li>
          <li><strong>Enable 2FA on email:</strong> Protect the account used for Nairalancers</li>
          <li><strong>Regular monitoring:</strong> Check for unauthorized access regularly</li>
          <li><strong>Separate business email:</strong> Use dedicated email for freelancing</li>
        </ul>

        <h2>Safe Communication Practices</h2>
        
        <h3>On-Platform Communication</h3>
        <ul>
          <li><strong>Keep communications on Nairalancers:</strong> Use the platform's messaging system</li>
          <li><strong>Document agreements:</strong> Save important conversations</li>
          <li><strong>Report suspicious behavior:</strong> Flag unusual client requests</li>
          <li><strong>Verify client identity:</strong> Check profiles and reviews</li>
        </ul>

        <h3>Off-Platform Requests</h3>
        <div class="warning-box">
          <h4>⚠️ Never Share These Details</h4>
          <ul>
            <li>Banking information or account numbers</li>
            <li>Credit/debit card details</li>
            <li>BVN or other government ID numbers</li>
            <li>Personal addresses or phone numbers initially</li>
            <li>Login credentials for any accounts</li>
          </ul>
        </div>

        <h2>Financial Protection Strategies</h2>
        
        <h3>Payment Security</h3>
        <ul>
          <li><strong>Use platform escrow:</strong> Ensure payments go through Nairalancers</li>
          <li><strong>Verify payment methods:</strong> Confirm client payment verification</li>
          <li><strong>Document all transactions:</strong> Keep records of payments and work</li>
          <li><strong>Gradual trust building:</strong> Start with smaller projects for new clients</li>
        </ul>

        <h3>Bank Account Safety</h3>
        <ul>
          <li><strong>Separate business account:</strong> Use dedicated account for freelancing</li>
          <li><strong>Regular monitoring:</strong> Check statements frequently</li>
          <li><strong>Mobile banking alerts:</strong> Enable transaction notifications</li>
          <li><strong>Secure withdrawal practices:</strong> Only withdraw to verified accounts</li>
        </ul>

        <h2>Identifying Legitimate Clients</h2>
        
        <h3>Green Flags</h3>
        <div class="example-box">
          <h4>✅ Signs of Legitimate Clients</h4>
          <ul>
            <li>Complete profile with verified payment method</li>
            <li>Clear project description with realistic timeline</li>
            <li>Reasonable budget for the scope of work</li>
            <li>Professional communication style</li>
            <li>Willingness to use platform's payment system</li>
            <li>Previous positive reviews from freelancers</li>
          </ul>
        </div>

        <h3>Red Flags</h3>
        <div class="warning-box">
          <h4>🚩 Warning Signs</h4>
          <ul>
            <li>Requests to communicate off-platform immediately</li>
            <li>Vague project descriptions or unrealistic deadlines</li>
            <li>Asks for upfront payments or fees</li>
            <li>Poor grammar or communication skills</li>
            <li>Unwillingness to provide project details</li>
            <li>Pressure to start work before payment is secured</li>
          </ul>
        </div>

        <h2>Responding to Security Incidents</h2>
        
        <h3>If Your Account is Compromised</h3>
        <ol>
          <li><strong>Change password immediately:</strong> Use a completely new, strong password</li>
          <li><strong>Enable 2FA:</strong> If not already activated</li>
          <li><strong>Review account activity:</strong> Check for unauthorized changes</li>
          <li><strong>Contact Nairalancers support:</strong> Report the incident immediately</li>
          <li><strong>Monitor financial accounts:</strong> Watch for suspicious transactions</li>
        </ol>

        <h3>Reporting Scams</h3>
        <ul>
          <li><strong>Document everything:</strong> Screenshots, messages, profile information</li>
          <li><strong>Report to Nairalancers:</strong> Use the reporting system</li>
          <li><strong>Contact banks:</strong> If financial information was compromised</li>
          <li><strong>Report to authorities:</strong> Nigerian cybercrime agencies if applicable</li>
        </ul>

        <h2>Nigeria-Specific Security Considerations</h2>
        
        <h3>Local Threat Landscape</h3>
        <ul>
          <li><strong>419 scams:</strong> Be aware of advance fee fraud variations</li>
          <li><strong>SIM swap attacks:</strong> Protect your phone number and accounts</li>
          <li><strong>Cybercafe security:</strong> Avoid logging in from public computers</li>
          <li><strong>Mobile money safety:</strong> Secure your mobile payment accounts</li>
        </ul>

        <h3>Legal Resources</h3>
        <ul>
          <li><strong>EFCC:</strong> Economic and Financial Crimes Commission</li>
          <li><strong>Nigeria Police Cybercrime Unit:</strong> For serious cybercrimes</li>
          <li><strong>Bank fraud departments:</strong> Report financial fraud immediately</li>
          <li><strong>Consumer protection agencies:</strong> For platform-related issues</li>
        </ul>

        <h2>Security Tools and Resources</h2>
        
        <h3>Recommended Security Software</h3>
        <ul>
          <li><strong>Antivirus:</strong> Avast, Kaspersky, or Windows Defender</li>
          <li><strong>Password Managers:</strong> Bitwarden, 1Password, or LastPass</li>
          <li><strong>VPN Services:</strong> For secure internet browsing</li>
          <li><strong>Browser Security:</strong> Keep browsers updated with security extensions</li>
        </ul>

        <h3>Regular Security Checklist</h3>
        <div class="communication-checklist">
          <h4>🔍 Monthly Security Review</h4>
          <ul>
            <li>Review recent login activity on all accounts</li>
            <li>Update passwords for critical accounts</li>
            <li>Check credit reports and bank statements</li>
            <li>Review privacy settings on all platforms</li>
            <li>Update software and security applications</li>
            <li>Backup important data securely</li>
            <li>Review and update recovery information</li>
          </ul>
        </div>

        <h2>Building Security Habits</h2>
        
        <h3>Daily Practices</h3>
        <ul>
          <li><strong>Verify before clicking:</strong> Check URLs and sender authenticity</li>
          <li><strong>Use secure networks:</strong> Avoid public WiFi for sensitive activities</li>
          <li><strong>Log out properly:</strong> Close sessions when finished</li>
          <li><strong>Stay informed:</strong> Keep up with latest security threats</li>
        </ul>

        <div class="final-tip">
          <h4>🛡️ Remember</h4>
          <p>Security is an ongoing process, not a one-time setup. Stay vigilant, trust your instincts, and don't hesitate to report suspicious activity. Your security awareness protects not just your account, but the entire Nairalancers community.</p>
        </div>
      `,
      relatedArticles: [21, 22, 11]
    },
    6: {
      id: 6,
      title: 'Setting Up Your Professional Freelancer Profile',
      category: 'getting-started',
      views: 11200,
      helpful: 96,
      lastUpdated: '2024-01-14',
      readTime: '12 min read',
      tags: ['profile', 'optimization', 'freelancer', 'portfolio'],
      content: `
        <div class="article-intro">
          <p>Your Nairalancers profile is your digital storefront - it's often the first impression potential clients have of your services. This comprehensive guide will help you create a compelling profile that attracts Nigerian clients, showcases your expertise, and builds trust in the competitive freelance marketplace.</p>
        </div>

        <h2>Profile Foundation</h2>
        
        <h3>Professional Profile Photo</h3>
        <p>Your profile photo is crucial for building trust with Nigerian clients:</p>
        <ul>
          <li><strong>Use a clear, high-quality headshot:</strong> Professional appearance matters</li>
          <li><strong>Face should be visible:</strong> Avoid sunglasses, hats, or group photos</li>
          <li><strong>Dress professionally:</strong> Match your industry standards</li>
          <li><strong>Good lighting:</strong> Natural lighting works best</li>
          <li><strong>Friendly expression:</strong> Smile naturally to appear approachable</li>
        </ul>

        <div class="pro-tip">
          <h4>📸 Photo Tips for Nigerian Freelancers</h4>
          <p>Consider having a professional headshot taken. Many photography studios in Lagos, Abuja, and Port Harcourt offer affordable business portrait packages. This investment can significantly improve your profile's professional appearance.</p>
        </div>

        <h3>Username and Display Name</h3>
        <ul>
          <li><strong>Professional username:</strong> Use your real name or professional brand</li>
          <li><strong>Consistency:</strong> Match your other professional profiles</li>
          <li><strong>Easy to remember:</strong> Avoid complex numbers or special characters</li>
          <li><strong>Spell check:</strong> Ensure correct spelling of your name</li>
        </ul>

        <h2>Crafting Your Profile Title</h2>
        
        <h3>Title Formula</h3>
        <div class="template-box">
          <h4>📝 Effective Title Structure</h4>
          <p>[Expertise Level] [Service Type] | [Specialization] | [Geographic Advantage]</p>
          <p><strong>Examples:</strong></p>
          <ul>
            <li>"Expert Web Developer | E-commerce Specialist | Serving Nigerian Businesses"</li>
            <li>"Professional Graphic Designer | Brand Identity Expert | Lagos-Based Creative"</li>
            <li>"Certified Digital Marketer | Social Media Growth | Nigerian Market Specialist"</li>
          </ul>
        </div>

        <h3>Title Best Practices</h3>
        <ul>
          <li><strong>Include keywords:</strong> Terms clients search for</li>
          <li><strong>Highlight specialization:</strong> What makes you unique</li>
          <li><strong>Local advantage:</strong> Mention Nigerian market knowledge</li>
          <li><strong>Keep it under 80 characters:</strong> Ensure full visibility</li>
          <li><strong>Avoid jargon:</strong> Use terms clients understand</li>
        </ul>

        <h2>Writing Your Bio/Description</h2>
        
        <h3>Bio Structure</h3>
        <ol>
          <li><strong>Hook (50 words):</strong> Grab attention immediately</li>
          <li><strong>Experience (100 words):</strong> Relevant background and expertise</li>
          <li><strong>Services (75 words):</strong> What you offer specifically</li>
          <li><strong>Nigerian context (50 words):</strong> Local market understanding</li>
          <li><strong>Call to action (25 words):</strong> Encourage contact</li>
        </ol>

        <div class="template-box">
          <h4>📄 Bio Template</h4>
          <p><strong>Hook:</strong> "Are you looking for a [service type] who truly understands the Nigerian market and delivers exceptional results?"</p>
          
          <p><strong>Experience:</strong> "With [X] years of experience serving Nigerian businesses, I've helped over [number] clients achieve [specific results]. My background in [relevant experience] gives me unique insights into what works in our local market."</p>
          
          <p><strong>Services:</strong> "I specialize in:
          • [Service 1] - [Brief description]
          • [Service 2] - [Brief description]  
          • [Service 3] - [Brief description]"</p>
          
          <p><strong>Nigerian Context:</strong> "I understand the unique challenges facing Nigerian businesses and have experience working with local payment systems, cultural preferences, and market dynamics."</p>
          
          <p><strong>CTA:</strong> "Ready to take your business to the next level? Let's discuss your project requirements and create something amazing together!"</p>
        </div>

        <h3>Bio Writing Tips</h3>
        <ul>
          <li><strong>Write in first person:</strong> "I" statements feel more personal</li>
          <li><strong>Focus on benefits:</strong> What clients gain from working with you</li>
          <li><strong>Include specific numbers:</strong> Years of experience, projects completed</li>
          <li><strong>Use active voice:</strong> More engaging than passive voice</li>
          <li><strong>Proofread carefully:</strong> Grammar errors hurt credibility</li>
        </ul>

        <h2>Skills and Expertise</h2>
        
        <h3>Skill Selection Strategy</h3>
        <ul>
          <li><strong>Prioritize in-demand skills:</strong> Research what Nigerian clients need</li>
          <li><strong>Match your gigs:</strong> Align skills with your service offerings</li>
          <li><strong>Include technical and soft skills:</strong> Balance both types</li>
          <li><strong>Local market skills:</strong> Nigerian business practices, local languages</li>
          <li><strong>Update regularly:</strong> Add new skills as you learn them</li>
        </ul>

        <h3>Popular Skills for Nigerian Market</h3>
        <div class="example-box">
          <h4>🇳🇬 High-Demand Skills in Nigeria</h4>
          <ul>
            <li><strong>Digital Marketing:</strong> Social media, SEO, content marketing</li>
            <li><strong>Web Development:</strong> WordPress, e-commerce, mobile-responsive</li>
            <li><strong>Content Creation:</strong> Nigerian English, Pidgin, local languages</li>
            <li><strong>Business Services:</strong> Business registration, tax preparation</li>
            <li><strong>Design:</strong> Brand identity, print design, packaging</li>
            <li><strong>Mobile:</strong> Android apps, mobile-first design</li>
          </ul>
        </div>

        <h2>Portfolio Development</h2>
        
        <h3>Portfolio Strategy</h3>
        <ul>
          <li><strong>Quality over quantity:</strong> 5-8 excellent samples</li>
          <li><strong>Diverse examples:</strong> Show range within your specialty</li>
          <li><strong>Nigerian context:</strong> Include local business examples</li>
          <li><strong>Before/after cases:</strong> Show transformation results</li>
          <li><strong>Process documentation:</strong> Explain your methodology</li>
        </ul>

        <h3>Portfolio Presentation</h3>
        <div class="template-box">
          <h4>📁 Portfolio Item Structure</h4>
          <p><strong>Title:</strong> "Brand Identity Design for Lagos Fashion Startup"</p>
          <p><strong>Description:</strong> "Challenge: Client needed a modern brand identity that would appeal to young Nigerian professionals while honoring traditional African aesthetics."</p>
          <p><strong>Solution:</strong> "I created a versatile logo system incorporating Adinkra symbols with contemporary typography, developed a color palette inspired by Nigerian textiles, and designed brand guidelines for consistent application."</p>
          <p><strong>Results:</strong> "The new brand helped increase social media engagement by 200% and contributed to a successful product launch that exceeded sales targets by 150%."</p>
        </div>

        <h2>Certifications and Education</h2>
        
        <h3>Relevant Certifications</h3>
        <ul>
          <li><strong>Industry certifications:</strong> Google, Microsoft, Adobe credentials</li>
          <li><strong>Nigerian institutions:</strong> Degree from recognized universities</li>
          <li><strong>Professional bodies:</strong> Memberships in Nigerian professional associations</li>
          <li><strong>Online courses:</strong> Coursera, Udemy, LinkedIn Learning certificates</li>
          <li><strong>Local training:</strong> Nigerian tech hubs, incubators, boot camps</li>
        </ul>

        <h3>Education Presentation</h3>
        <ul>
          <li><strong>Include relevant degrees:</strong> Don't list every certificate</li>
          <li><strong>Highlight prestigious institutions:</strong> UI, UNILAG, Covenant, etc.</li>
          <li><strong>Mention honors:</strong> First class, awards, scholarships</li>
          <li><strong>Ongoing learning:</strong> Show commitment to skill development</li>
        </ul>

        <h2>Language and Communication</h2>
        
        <h3>Language Proficiency</h3>
        <ul>
          <li><strong>English:</strong> Essential for most clients</li>
          <li><strong>Nigerian languages:</strong> Hausa, Yoruba, Igbo advantage</li>
          <li><strong>International languages:</strong> French, Arabic if relevant</li>
          <li><strong>Technical communication:</strong> Industry-specific terminology</li>
        </ul>

        <div class="success-tips">
          <h4>🗣️ Communication Advantages</h4>
          <ul>
            <li><strong>Nigerian Pidgin:</strong> Connects with local audience</li>
            <li><strong>Cultural understanding:</strong> Nigerian business etiquette</li>
            <li><strong>Local context:</strong> Understanding of Nigerian challenges</li>
            <li><strong>Time zone alignment:</strong> Available during Nigerian business hours</li>
          </ul>
        </div>

        <h2>Pricing and Packages</h2>
        
        <h3>Rate Setting Strategy</h3>
        <ul>
          <li><strong>Research market rates:</strong> Check competitor pricing</li>
          <li><strong>Consider local purchasing power:</strong> Price appropriately for Nigerian market</li>
          <li><strong>Value-based pricing:</strong> Price based on client results</li>
          <li><strong>Gradual increases:</strong> Raise rates as you gain experience</li>
          <li><strong>Package deals:</strong> Offer bundled services for better value</li>
        </ul>

        <h3>Nigerian Market Pricing Considerations</h3>
        <ul>
          <li><strong>Exchange rate awareness:</strong> Consider Naira fluctuations</li>
          <li><strong>Local competition:</strong> Price competitively with local providers</li>
          <li><strong>Value proposition:</strong> Justify pricing with quality and expertise</li>
          <li><strong>Payment methods:</strong> Offer convenient local payment options</li>
        </ul>

        <h2>Profile Optimization</h2>
        
        <h3>SEO for Your Profile</h3>
        <ul>
          <li><strong>Keyword research:</strong> Use terms Nigerian clients search for</li>
          <li><strong>Natural integration:</strong> Include keywords naturally in content</li>
          <li><strong>Local SEO:</strong> Mention Nigerian cities and regions</li>
          <li><strong>Industry terms:</strong> Use terminology clients understand</li>
          <li><strong>Regular updates:</strong> Keep content fresh and relevant</li>
        </ul>

        <h3>Profile Completion</h3>
        <div class="communication-checklist">
          <h4>✅ Profile Completion Checklist</h4>
          <ul>
            <li>Professional profile photo uploaded</li>
            <li>Compelling title with keywords</li>
            <li>Detailed bio (300+ words)</li>
            <li>Skills section completed (minimum 10 relevant skills)</li>
            <li>Portfolio with 5-8 quality samples</li>
            <li>Education and certifications added</li>
            <li>Languages and proficiency levels set</li>
            <li>Contact information verified</li>
            <li>Gigs created and optimized</li>
            <li>Profile reviewed for errors</li>
          </ul>
        </div>

        <h2>Ongoing Profile Management</h2>
        
        <h3>Regular Updates</h3>
        <ul>
          <li><strong>Monthly review:</strong> Check for outdated information</li>
          <li><strong>New portfolio pieces:</strong> Add recent best work</li>
          <li><strong>Skill updates:</strong> Add newly acquired skills</li>
          <li><strong>Bio refresh:</strong> Update experience and achievements</li>
          <li><strong>Seasonal adjustments:</strong> Adapt for current market trends</li>
        </ul>

        <h3>Performance Monitoring</h3>
        <ul>
          <li><strong>Profile views:</strong> Track visitor engagement</li>
          <li><strong>Conversion rates:</strong> Views to contact ratio</li>
          <li><strong>Client feedback:</strong> What attracts or deters clients</li>
          <li><strong>Competitor analysis:</strong> Learn from successful profiles</li>
        </ul>

        <div class="final-tip">
          <h4>🌟 Success Secret</h4>
          <p>Your profile is never truly "finished" - it's a living document that should evolve with your skills, experience, and market changes. The most successful Nigerian freelancers on Nairalancers are those who continuously refine and improve their profiles based on client feedback and market demands.</p>
        </div>
      `,
      relatedArticles: [1, 9, 20]
    }
  };

  const article = articles[id];

  useEffect(() => {
    if (!article) {
      navigate('/help');
    }
  }, [article, navigate]);

  const handleHelpfulVote = (helpful) => {
    setIsHelpful(helpful);
    setFeedbackSubmitted(true);
    // Here you would typically send the feedback to your backend
  };

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="article-detail">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/help">Help Center</Link>
          <span>›</span>
          <span>{article.title}</span>
        </nav>

        {/* Article Header */}
        <div className="article-header">
          <div className="header-content">
            <h1>{article.title}</h1>
            <div className="article-meta">
              <span className="read-time">📖 {article.readTime}</span>
              <span className="views">👁️ {article.views.toLocaleString()} views</span>
              <span className="helpful">👍 {article.helpful}% found this helpful</span>
              <span className="updated">🔄 Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
            </div>
            <div className="article-tags">
              {article.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="article-content">
          <div className="content-wrapper">
            <aside className="table-of-contents">
              <h3>Table of Contents</h3>
              <div className="toc-list">
                {/* This would be dynamically generated from article headings in a real implementation */}
                <a href="#step1">Step 1: Plan Your Strategy</a>
                <a href="#step2">Step 2: Access Gig Creation</a>
                <a href="#step3">Step 3: Write Compelling Title</a>
                <a href="#optimization">Optimization Tips</a>
                <a href="#mistakes">Common Mistakes</a>
              </div>
            </aside>

            {/* Article Content */}
            <main className="article-body">
              <div 
                className="content"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Was this helpful section */}
              <div className="feedback-section">
                <h3>Was this article helpful?</h3>
                {!feedbackSubmitted ? (
                  <div className="feedback-buttons">
                    <button 
                      className="helpful-btn yes"
                      onClick={() => handleHelpfulVote(true)}
                    >
                      👍 Yes, it was helpful
                    </button>
                    <button 
                      className="helpful-btn no"
                      onClick={() => handleHelpfulVote(false)}
                    >
                      👎 No, it wasn't helpful
                    </button>
                  </div>
                ) : (
                  <div className="feedback-thanks">
                    <p>Thank you for your feedback! {isHelpful ? '😊' : 'We\'ll work on improving this article.'}</p>
                  </div>
                )}
              </div>

              {/* Related Articles */}
              <div className="related-articles">
                <h3>Related Articles</h3>
                <div className="related-grid">
                  {article.relatedArticles.map(relatedId => {
                    const relatedArticle = articles[relatedId];
                    if (!relatedArticle) return null;
                    
                    return (
                      <Link 
                        key={relatedId} 
                        to={`/help/article/${relatedId}`}
                        className="related-card"
                      >
                        <h4>{relatedArticle.title}</h4>
                        <p className="related-meta">
                          📖 {relatedArticle.readTime} • 👁️ {relatedArticle.views.toLocaleString()} views
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Still need help */}
              <div className="still-need-help">
                <h3>Still need help?</h3>
                <p>If this article didn't answer your question, our support team is here to help.</p>
                <div className="help-actions">
                  <Link to="/contact" className="contact-btn">Contact Support</Link>
                  <Link to="/help" className="help-center-btn">Browse More Articles</Link>
                </div>
              </div>
              </main>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ArticleDetail;
