import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ForgotPasswordForm = ({ userType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  
  // Add debugging for available routes
  const checkServerRoutes = async () => {
    try {
      // Check if server is running
      const rootResponse = await axios.get('http://localhost:8080/');
      console.log('Server root response:', rootResponse.status);
      
      // This is just for debugging
      return true;
    } catch (err) {
      console.error('Server connection error:', err);
      return false;
    }
  };
  
  // Check server on component mount
  useState(() => {
    checkServerRoutes();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        console.log('Submitting form with email:', values.email);
        
        // First check if server is accessible
        const serverAvailable = await checkServerRoutes();
        if (!serverAvailable) {
          throw new Error('Cannot connect to server');
        }
        
        // Use the full URL directly
        const endpoint = userType === 'admin' 
          ? 'http://localhost:8080/api/auth/forgotPasswordAdmin' 
          : 'http://localhost:8080/api/auth/forgotPasswordStaff';
        
        console.log(`Attempting to call endpoint: ${endpoint}`);
        
        // Add timeout and more detailed options
        const response = await axios({
          method: 'post',
          url: endpoint,
          data: { email: values.email },
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 second timeout
        });
        
        console.log('Response received:', response);
        
        if (response.status === 200) {
          setEmailSent(true);
        }
      } catch (err) {
        console.error('Error details:', err);
        
        // More detailed error message
        if (err.response) {
          // Server responded with an error status
          console.error('Server response error:', {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers
          });
          setError(err.response.data?.message || `Server error: ${err.response.status}`);
        } else if (err.request) {
          // Request was made but no response received
          console.error('No response received:', err.request);
          setError('No response from server. Please check if the server is running.');
        } else {
          // Error setting up the request
          console.error('Request error:', err.message);
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  });

  // If email sent successfully, show success message
  if (emailSent) {
    return (
      <div className="card shadow border-0">
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="bi bi-envelope-check text-success" style={{ fontSize: '3rem' }}></i>
            <h2 className="mt-3">Check Your Email</h2>
          </div>
          <div className="alert alert-success" role="alert">
            <p>
              A password reset link has been sent to {formik.values.email}. 
              Please check your email and follow the instructions to reset your password.
            </p>
            <p className="mb-0">
              The link will expire in 10 minutes.
            </p>
          </div>
          <div className="text-center mt-4">
            <Link to={userType === 'admin' ? '/admin-login' : '/login'} className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow border-0">
      <div className="card-header bg-primary text-white p-4">
        <h4 className="mb-0">
          <i className="bi bi-lock me-2"></i>
          Forgot Password
        </h4>
      </div>
      <div className="card-body p-4">
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-group mb-1">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">
                  {formik.errors.email}
                </div>
              )}
            </div>
            <small className="form-text text-muted">
              Enter the email address you used when you registered
            </small>
          </div>
          
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending Email...
                </>
              ) : (
                <>
                  <i className="bi bi-envelope me-2"></i>
                  Send Reset Link
                </>
              )}
            </button>
            
            <Link 
              to={userType === 'admin' ? '/admin-login' : '/login'} 
              className="btn btn-outline-secondary"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm; 