import { useLocation } from 'react-router-dom';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const ResetPasswordPage = () => {
  const location = useLocation();
  // Check if we're in admin route
  const isAdmin = location.pathname.includes('admin');
  
  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">
        {/* Left Side - Decorative */}
        <div className="col-lg-6 bg-primary d-none d-lg-flex flex-column align-items-center justify-content-center text-white p-5">
          <div className="text-center">
            <i className="bi bi-shield-lock display-1 mb-4"></i>
            <h1 className="display-4 fw-bold mb-4">Create New Password</h1>
            <p className="lead mb-5">
              {isAdmin 
                ? "Set a new secure password for your administrator account." 
                : "Set a new secure password for your staff account."}
            </p>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-4">
          <div className="w-100" style={{ maxWidth: '450px' }}>
            <div className="text-center mb-4 d-lg-none">
              <i className="bi bi-shield-lock text-primary display-4 mb-3"></i>
              <h2 className="fw-bold">Create New Password</h2>
            </div>
            
            <ResetPasswordForm userType={isAdmin ? 'admin' : 'staff'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 