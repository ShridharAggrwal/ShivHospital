import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../../api/axios';

const ResetPasswordForm = ({ userType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password')], 'Passwords must match')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        const endpoint = userType === 'admin' ? '/resetPasswordAdmin' : '/resetPasswordStaff';
        const response = await axios.post(endpoint, {
          token,
          password: values.password
        });
        
        if (response.status === 200) {
          setResetSuccess(true);
          setTimeout(() => {
            navigate(userType === 'admin' ? '/admin-login' : '/login');
          }, 3000);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    }
  });

  if (resetSuccess) {
    return (
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white p-4">
          <h4 className="mb-0">
            <i className="bi bi-check-circle me-2"></i>
            Password Reset Successful
          </h4>
        </div>
        <div className="card-body p-4">
          <div className="alert alert-success" role="alert">
            <i className="bi bi-check-circle me-2"></i>
            Your password has been reset successfully. You will be redirected to the login page shortly.
          </div>
          <div className="text-center mt-3">
            <Link 
              to={userType === 'admin' ? '/admin-login' : '/login'} 
              className="btn btn-primary"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Go to Login
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
          Reset Password
        </h4>
      </div>
      <div className="card-body p-4">
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
        
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              New Password
            </label>
            <div className="input-group mb-1">
              <span className="input-group-text">
                <i className="bi bi-key"></i>
              </span>
              <input
                id="password"
                name="password"
                type="password"
                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter new password"
              />
            </div>
            <small className="form-text text-muted">
              Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
            </small>
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-shield-lock"></i>
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Confirm new password"
              />
            </div>
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
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  Reset Password
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

export default ResetPasswordForm; 