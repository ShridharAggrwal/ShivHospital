import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuth from '../../context/useAuth';
import { Link } from 'react-router-dom';

const LoginForm = ({ role = 'staff' }) => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            
            try {
                const result = await login(values, role);
                
                if (!result.success) {
                    setError(result.message || 'Login failed');
                }
            } catch (err) {
                setError('An error occurred during login');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    });
    
    // Determine error message and style based on the content
    const getErrorAlert = () => {
        if (!error) return null;
        
        // Check if the error is an approval-related message
        const isApprovalMessage = 
            error.includes('pending approval') || 
            error.includes('blocked') || 
            error.includes('rejected');
        
        const alertClass = isApprovalMessage ? 'alert-warning' : 'alert-danger';
        const icon = isApprovalMessage ? 'bi-exclamation-triangle' : 'bi-x-circle';
        
        return (
            <div className={`alert ${alertClass}`} role="alert">
                <div className="d-flex align-items-center">
                    <i className={`bi ${icon} me-2 fs-5`}></i>
                    <div>{error}</div>
                </div>
            </div>
        );
    };
    
    return (
        <div className="card shadow w-100">
            <div className="card-header bg-primary text-white">
                <h3 className="text-center mb-0 fw-bold">
                    {role === 'admin' ? 'Admin Login' : 'Staff Login'}
                </h3>
            </div>
            <div className="card-body px-3 px-md-4 py-4">
                {getErrorAlert()}
                
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label">
                            <i className="bi bi-envelope me-2"></i>Email Address
                        </label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-envelope"></i>
                            </span>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                placeholder="Enter your email"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="invalid-feedback">{formik.errors.email}</div>
                            )}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">
                            <i className="bi bi-lock me-2"></i>Password
                        </label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-lock"></i>
                            </span>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                placeholder="Enter your password"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="invalid-feedback">{formik.errors.password}</div>
                            )}
                        </div>
                        <div className="text-end mt-1">
                            <Link 
                                to={role === 'admin' ? '/forgot-password/admin' : '/forgot-password'} 
                                className="text-decoration-none small"
                            >
                                <i className="bi bi-question-circle me-1"></i>
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                    
                    <div className="d-grid gap-2 mt-4">
                        <button 
                            type="submit" 
                            className="btn btn-primary py-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Logging in...
                                </>
                            ) : (
                                <>Sign In <i className="bi bi-arrow-right ms-2"></i></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm; 