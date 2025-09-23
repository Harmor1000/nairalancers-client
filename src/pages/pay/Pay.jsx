import React, { useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { PulseLoader } from "react-spinners";

const Pay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializePayment = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = localStorage.getItem("token");
        console.log('token:', token);

        // Capture selected package from query string if present (basic|standard|premium)
        const params = new URLSearchParams(location.search);
        const selectedPackage = params.get('package');

        const res = await newRequest.post(
          `/orders/transaction/initialize/${id}`,
          { email: currentUser.email, selectedPackage },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        window.location.href = res.data.data.authorization_url;
      } catch (err) {
        console.error(err);
        
        // Extract error message from response
        let errorMessage = "Error initializing payment";
        let errorDetails = null;
        
        if (err.response?.data) {
          const errorData = err.response.data;
          
          // Handle structured error responses (like transaction limit errors)
          if (errorData.error && errorData.message) {
            errorMessage = errorData.message;
            errorDetails = errorData;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        }
        
        // Store error details for display on orders page
        if (errorDetails) {
          localStorage.setItem('paymentError', JSON.stringify({
            error: errorDetails,
            timestamp: new Date().toISOString()
          }));
        }
        
        // Show detailed error message
        alert(errorMessage);
        navigate("/orders");
      }
    };

    initializePayment();
  }, [id, navigate, location.search]);

  return (
    <div className="pay" style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Redirecting to Paystack...</h2>
      <PulseLoader color="green" loading={true} size={12} />
    </div>
  );
};

export default Pay;
