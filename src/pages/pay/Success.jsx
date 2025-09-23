import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Success.scss";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const hasVerified = useRef(false); // Prevent multiple verification calls

  // Get Paystack reference from query params (?reference=xxxx)
  const queryParams = new URLSearchParams(location.search);
  const reference = queryParams.get("reference");

  useEffect(() => {
    // Prevent multiple verification calls (React StrictMode, navigation, etc.)
    if (hasVerified.current) return;
    
    const verifyPayment = async () => {
      if (!reference) {
        setStatus("error");
        setLoading(false);
        return;
      }

      // Mark as verified before making the API call
      hasVerified.current = true;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setStatus("error");
          setLoading(false);
          return;
        }

        console.log("🔍 Verifying payment with reference:", reference);
        const res = await newRequest.post(
          `orders/verify/${reference}`,
          {}, // no body needed
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        console.log("✅ Verification successful:", res.data);
        setPaymentData(res.data);
        setStatus("success");

      } catch (err) {
        console.error("❌ Verification error:", err.response?.data || err.message);
        
        // If it's a duplicate order error, treat it as success
        if (err.response?.status === 409 || 
            err.response?.data?.message?.includes("already exists") ||
            err.response?.data?.message?.includes("duplicate")) {
          console.log("🔄 Order already exists, treating as success");
          setStatus("success");
          setPaymentData({ 
            status: "success", 
            message: "Payment already verified",
            orderId: "existing"
          });
        } else {
          setStatus("error");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference]);

  const handleViewOrders = () => {
    navigate("/orders");
  };

  if (loading) {
    return (
      <div className="payment-success">
        <div className="container">
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <h2>🔐 Verifying Payment...</h2>
            <p>Please wait while we verify your payment and set up escrow protection</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="payment-success">
        <div className="container">
          <div className="error-section">
            <div className="error-icon">❌</div>
            <h2>Payment Verification Failed</h2>
            <p>We couldn't verify your payment. Please contact support if this persists.</p>
            <button className="btn primary" onClick={handleViewOrders}>
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success">
      <div className="container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h1>Payment Successful!</h1>
          <p className="success-subtitle">
            Your payment has been secured in our escrow system
          </p>
        </div>

        {/* Protection Status */}
        <div className="protection-status">
          <h2>🛡️ Your Payment is Protected</h2>
          <div className="protection-grid">
            <div className="protection-item">
              <div className="protection-icon">🔒</div>
              <h3>Escrow Protected</h3>
              <p>Your payment is held securely until work is completed and approved</p>
            </div>
            <div className="protection-item">
              <div className="protection-icon">📋</div>
              <h3>Work Guarantee</h3>
              <p>Freelancer must deliver work before payment is released</p>
            </div>
            <div className="protection-item">
              <div className="protection-icon">⏰</div>
              <h3>Auto-Release Protection</h3>
              <p>Payment automatically releases if you don't respond within the deadline</p>
            </div>
            <div className="protection-item">
              <div className="protection-icon">⚖️</div>
              <h3>Dispute Resolution</h3>
              <p>Professional mediation available if issues arise</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="payment-details">
          <h2>📄 Payment Details</h2>
          <div className="details-grid">
            <div className="detail-row">
              <span className="label">Status:</span>
              <span className="value success">Escrowed - Work in Progress</span>
            </div>
            <div className="detail-row">
              <span className="label">Protection Level:</span>
              <span className="value">🔒 Standard Escrow</span>
            </div>
            {paymentData?.autoReleaseDate && (
              <div className="detail-row">
                <span className="label">Auto-release Date:</span>
                <span className="value">{new Date(paymentData.autoReleaseDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h2>🎯 What Happens Next?</h2>
          <div className="steps-timeline">
            <div className="step completed">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Payment Secured</h3>
                <p>Your payment is now held safely in escrow</p>
              </div>
            </div>
            <div className="step current">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Freelancer Starts Work</h3>
                <p>The freelancer will begin working on your project</p>
              </div>
            </div>
            <div className="step pending">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Work Delivery</h3>
                <p>You'll receive deliverables for review and approval</p>
              </div>
            </div>
            <div className="step pending">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Payment Release</h3>
                <p>Payment is released once you approve the work</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="important-info">
          <h2>📢 Important Information</h2>
          <div className="info-cards">
            <div className="info-card">
              <div className="card-icon">💡</div>
              <h3>Review Deadline</h3>
              <p>
                Please review and respond to delivered work promptly. If no action is taken within 
                the deadline, payment will be automatically released to protect both parties.
              </p>
            </div>
            <div className="info-card">
              <div className="card-icon">💬</div>
              <h3>Communication</h3>
              <p>
                Keep all communication within the platform to ensure your transactions are 
                protected by our fraud prevention system.
              </p>
            </div>
            <div className="info-card">
              <div className="card-icon">🚫</div>
              <h3>Never Pay Outside</h3>
              <p>
                Never make additional payments outside the platform. All legitimate payments 
                go through our secure escrow system.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <button className="btn primary large" onClick={handleViewOrders}>
            📋 View Your Orders
          </button>
          <Link to="/disputes" className="btn secondary">
            ⚠️ Report an Issue
          </Link>
          <Link to="/verification" className="btn success">
            🔐 Increase Account Security
          </Link>
        </div>

        {/* Support Information */}
        <div className="support-info">
          <h3>Need Help?</h3>
          <p>
            Our support team is available 24/7 to help with any questions about your payment or project.
          </p>
          <div className="support-links">
            <Link to="/resources/helpCenter">Help Center</Link>
            <Link to="/resources/paymentProtection">Payment Protection Guide</Link>
            <Link to="/resources/contactUs">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
