import React, { useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import "./utils/testWebSocket.js"; // Import WebSocket test
import WebSocketDebugger from "./components/WebSocketDebugger";
import NotificationSystem from "./components/NotificationSystem";
import { ToastProvider } from "./components/toast/ToastProvider";
import socketService from "./services/socketService";
import activityTracker from "./services/activityTracker";
import getCurrentUser from "./utils/getCurrentUser";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import OrderDetails from "./pages/orders/OrderDetails";
import DisputeManagement from "./pages/disputes/DisputeManagement";
import UserVerification from "./pages/verification/UserVerification";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import Settings from "./pages/settings/Settings";
import SellerProfile from "./pages/profile/SellerProfile";
import BuyerProfile from "./pages/profile/BuyerProfile";
import EditProfile from "./pages/profile/EditProfile";
import Profiles from "./pages/profiles/Profiles";
import Favorites from "./pages/favorites/Favorites";

import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import TermsOfService from "./pages/resources/terms/TermsOfService";
import PrivacyPolicy from "./pages/resources/privacy/PrivacyPolicy";

// New pages
import CookiePolicy from "./pages/resources/cookiePolicy/CookiePolicy";
import FreelancerGuide from "./pages/resources/freelancerGuide/FreelancerGuide";
import PricingTips from "./pages/resources/pricingTips/PricingTips";
import HowToHire from "./pages/resources/howToHire/HowToHire";
import PortfolioTips from "./pages/resources/portfolioTips/PortfolioTips";
import SuccessStories from "./pages/resources/successStories/SuccessStories";
import PaymentProtection from "./pages/resources/paymentProtection/PaymentProtection";
import HelpCenter from "./pages/resources/helpCenter/HelpCenter";
import ContactUs from "./pages/resources/contactUs/ContactUs";
import AboutUs from "./pages/resources/aboutUs/AboutUs";
import AffiliateProgram from "./pages/resources/affiliateProgram/AffiliateProgram";
import FAQs from "./pages/resources/faqs/FAQs";
import CaseStudies from "./pages/resources/caseStudies/CaseStudies";
import ProjectManagement from "./pages/resources/projectManagement/ProjectManagement";
import QualityAssurance from "./pages/resources/qualityAssurance/QualityAssurance";
import ArticleDetail from "./pages/resources/helpCenter/ArticleDetail";

import Pay from "./pages/pay/Pay";
import Success from "./pages/pay/Success";
import Failure from "./pages/pay/Failure";

// Admin Panel Components
import AdminRouter from "./pages/admin/AdminRouter";


import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import "./App.scss";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
function App() {

  const queryClient = new QueryClient()

  const Layout = () => {
    useEffect(() => {
      // Initialize activity tracker for logged-in users
      const currentUser = getCurrentUser();
      
      if (currentUser) {
        activityTracker.init();
        console.log('Activity tracker started for user:', currentUser.username);
        // Ensure WebSocket is connected for real-time notifications
        try {
          socketService.connect(currentUser);
        } catch (e) {
          // silent
        }
      }
      
      // Cleanup on unmount
      return () => {
        activityTracker.stop();
        try { socketService.disconnect(); } catch {}
      };
    }, []); // Run once on mount

    // Monitor login state changes
    useEffect(() => {
      const handleStorageChange = (e) => {
        if (e.key === 'currentUser') {
          const newUser = getCurrentUser();
          
          if (newUser) {
            // User logged in
            activityTracker.init();
            console.log('Activity tracker started for user:', newUser.username);
            try { socketService.connect(newUser); } catch {}
          } else {
            // User logged out
            activityTracker.stop();
            console.log('Activity tracker stopped - user logged out');
            try { socketService.disconnect(); } catch {}
          }
        }
      };

      // Listen for localStorage changes (login/logout)
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }, []);

    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <Navbar></Navbar>
            <Outlet></Outlet>
            {/* Global in-app notification toasts */}
            <NotificationSystem currentUser={getCurrentUser()} />
            <Footer></Footer>
          </ToastProvider>
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout></Layout>,
      children: [
        {
          path: "/",
          element: <Home></Home>,
        },
        {
          path: "/gigs",
          element: <Gigs></Gigs>,
        },
        {
          path: "/profiles",
          element: <Profiles></Profiles>,
        },
        {
          path: "/gig/:id",
          element: <Gig></Gig>,
        },
        {
          path: "/mygigs",
          element: <MyGigs></MyGigs>,
        },
        {
          path: "/add",
          element: <Add></Add>,
        },
        {
          path: "/edit-gig/:id",
          element: <Add editMode={true}></Add>,
        },
        {
          path: "/orders",
          element: <Orders></Orders>,
        },
        {
          path: "/orders/:orderId",
          element: <OrderDetails></OrderDetails>,
        },
        {
          path: "/disputes",
          element: <DisputeManagement></DisputeManagement>,
        },
        {
          path: "/verification",
          element: <UserVerification></UserVerification>,
        },
        {
          path: "/freelancer-dashboard",
          element: <FreelancerDashboard></FreelancerDashboard>,
        },
        {
          path: "/messages",
          element: <Messages></Messages>,
        },
        {
          path: "/message/:id",
          element: <Message></Message>,
        },
        {
          path: "/settings",
          element: <Settings></Settings>,
        },
        {
          path: "/seller-profile/:id",
          element: <SellerProfile></SellerProfile>,
        },
        {
          path: "/buyer-profile/:id",
          element: <BuyerProfile></BuyerProfile>,
        },
        {
          path: "/edit-profile",
          element: <EditProfile></EditProfile>,
        },
        {
          path: "/favorites",
          element: <Favorites></Favorites>,
        },

        {
          path: "/login",
          element: <Login></Login>,
        },
        {
          path: "/register",
          element: <Register></Register>,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword></ForgotPassword>,
        },
        {
          path: "/reset-password",
          element: <ResetPassword></ResetPassword>,
        },
        {
          path: "/verify-email",
          element: <VerifyEmail></VerifyEmail>,
        },
        {
          path: "/terms-of-service",
          element: <TermsOfService></TermsOfService>,
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy></PrivacyPolicy>,
        },
        {
          path: "/cookie-policy",
          element: <CookiePolicy></CookiePolicy>,
        },
        {
          path: "/resources/freelancer-guide",
          element: <FreelancerGuide></FreelancerGuide>,
        },
        {
          path: "/resources/pricing-tips",
          element: <PricingTips></PricingTips>,
        },
        {
          path: "/resources/hiring-guide",
          element: <HowToHire></HowToHire>,
        },
        {
          path: "/resources/case-studies",
          element: <CaseStudies></CaseStudies>,
        },
        {
          path: "/resources/project-management",
          element: <ProjectManagement></ProjectManagement>,
        },
        {
          path: "/resources/quality-assurance",
          element: <QualityAssurance></QualityAssurance>,
        },
        {
          path: "/resources/portfolio-tips",
          element: <PortfolioTips></PortfolioTips>,
        },
        {
          path: "/success-stories",
          element: <SuccessStories></SuccessStories>,
        },
        {
          path: "/payment-protection",
          element: <PaymentProtection></PaymentProtection>,
        },
        {
          path: "/help",
          element: <HelpCenter></HelpCenter>,
        },
        {
          path: "/help/article/:id",
          element: <ArticleDetail></ArticleDetail>,
        },
        {
          path: "/contact",
          element: <ContactUs></ContactUs>,
        },
        {
          path: "/about",
          element: <AboutUs></AboutUs>,
        },
        {
          path: "/affiliate",
          element: <AffiliateProgram></AffiliateProgram>,
        },
        {
          path: "/faqs",
          element: <FAQs></FAQs>,
        },
        {
          path: "/pay/:id",
          element: <Pay />,
        },
        {
          path: "/payment/success",
          element: <Success />,
        },
        {
          path: "/payment/failure",
          element: <Failure />,
        },
      ],
    },
    // Admin Routes (separate layout)
    {
      path: "/admin/*",
      element: <AdminRouter />,
    },
  ]);


  // Get current user for WebSocket debugging
  const getCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const token = localStorage.getItem("token");
      
      // Make sure we have both user data and token
      if (user && token) {
        return { ...user, token }; // Ensure token is available
      }
      return null;
    } catch {
      return null;
    }
  };

  return (
    <div>
      <RouterProvider router={router} />
      <WebSocketDebugger currentUser={getCurrentUser()} />
    </div>
  );
}

export default App;