import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminTransactions from './AdminTransactions';
import AdminNotifications from './AdminNotifications';
import AdminSettings from './AdminSettings';
import AdminDisputes from './AdminDisputes';
import AdminFraud from './AdminFraud';
import AdminGigs from './AdminGigs';
import AdminModeration from './AdminModeration';
import AdminAnalytics from './AdminAnalytics';
import AdminSystem from './AdminSystem';
import AdminVerification from './AdminVerification';
import AdminReports from './AdminReports';
import AdminOrders from './AdminOrders';
import AdminLogs from './AdminLogs';
import AdminRefunds from './AdminRefunds';
import AdminBackup from './AdminBackup';
import './AdminRouter.scss';

// Create placeholder components for remaining admin pages




// const AdminVerification = () => (
//   <AdminLayout>
//     <div className="admin-page">
//       <h1>✅ User Verification</h1>
//       <p>Manage user verification and KYC processes...</p>
//       <div className="coming-soon-features">
//         <h3>Verification tools:</h3>
//         <ul>
//           <li>📋 Review ID verification requests</li>
//           <li>📞 Manage phone verifications</li>
//           <li>📧 Email verification oversight</li>
//           <li>📄 Document verification workflow</li>
//           <li>⭐ Trust score management</li>
//         </ul>
//       </div>
//     </div>
//   </AdminLayout>
// );

const AdminRouter = () => {
  console.log('AdminRouter rendered'); // Debug log
  
  return (
    <Routes>
      {/* Default admin route */}
      <Route path="/" element={<AdminDashboard />} />
      
      {/* Analytics & Reports */}
      <Route path="/analytics" element={<AdminAnalytics />} />
      <Route path="/reports" element={<AdminReports />} />
      
      {/* User Management */}
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/users/:userId" element={<AdminUsers />} />
      <Route path="/admins" element={<AdminUsers />} />
      <Route path="/verification" element={<AdminVerification />} />
      <Route path="/verification/:userId" element={<AdminVerification />} />
      
      {/* Content Management */}
      <Route path="/gigs" element={<AdminGigs />} />
      <Route path="/gigs/:gigId" element={<AdminGigs />} />
      <Route path="/categories" element={<AdminGigs />} />
      <Route path="/reviews" element={<AdminModeration />} />
      <Route path="/moderation" element={<AdminModeration />} />
      
      {/* Order Management */}
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/orders/:orderId" element={<AdminOrders />} />
      <Route path="/disputes" element={<AdminDisputes />} />
      <Route path="/refunds" element={<AdminRefunds />} />
      
      {/* Financial */}
      <Route path="/withdrawals" element={<AdminTransactions />} />
      <Route path="/transactions" element={<AdminTransactions />} />
      <Route path="/revenue" element={<AdminTransactions />} />
      
      {/* Security & Fraud */}
      <Route path="/fraud" element={<AdminFraud />} />
      <Route path="/verification" element={<AdminVerification />} />
      <Route path="/banned" element={<AdminUsers />} />
      <Route path="/logs" element={<AdminLogs />} />
      
      {/* System & Settings */}
      <Route path="/settings" element={<AdminSettings />} />
      <Route path="/notifications" element={<AdminNotifications />} />
      <Route path="/system" element={<AdminSystem />} />
      <Route path="/backups" element={<AdminBackup />} />
      

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRouter;
