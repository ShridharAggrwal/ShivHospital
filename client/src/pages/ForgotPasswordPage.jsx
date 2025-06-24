import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  const location = useLocation();
  // Check if we're in admin route
  const isAdmin = location.pathname.includes('admin');
  
  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">
        {/* Left Side - Decorative */}
        <div className="col-lg-6 bg-primary d-none d-lg-flex flex-column align-items-center justify-content-center text-white p-5">
          <div className="text-center">
            <i className="bi bi-hospital display-1 mb-4"></i>
            <h1 className="display-4 fw-bold mb-4">Patient Registration System</h1>
            <p className="lead mb-5">
              {isAdmin 
                ? "Admin access - Reset your password to regain access to your administrative account." 
                : "Staff access - Reset your password to regain access to your staff account."}
            </p>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-4">
          <div className="w-100" style={{ maxWidth: '450px' }}>
            <div className="text-center mb-4 d-lg-none">
              <i className="bi bi-hospital text-primary display-4 mb-3"></i>
              <h2 className="fw-bold">{isAdmin ? 'Admin Password Recovery' : 'Staff Password Recovery'}</h2>
            </div>
            
            <ForgotPasswordForm userType={isAdmin ? 'admin' : 'staff'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 