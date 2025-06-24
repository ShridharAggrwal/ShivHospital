import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import useAuth from '../../context/useAuth';

const RegisterForm = () => {
    const { register } = useAuth();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                )
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm password is required')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            setSuccess('');
            
            try {
                // Remove confirmPassword before sending to API
                const { confirmPassword, ...userData } = values;
                
                const result = await register(userData, 'staff');
                
                if (result.success) {
                    setSuccess(result.message || 'Registration successful! Your account is pending approval by admin.');
                    formik.resetForm();
                } else {
                    setError(result.message || 'Registration failed');
                }
            } catch (err) {
                setError('An error occurred during registration');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    });
    
    return (
        <div className="card shadow">
            <div className="card-header bg-primary text-white">
                <h3 className="text-center mb-0 fw-bold">Staff Registration</h3>
            </div>
            <div className="card-body">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-x-circle me-2"></i>
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="alert alert-success" role="alert">
                        <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                            <strong>Registration Successful!</strong>
                        </div>
                        <p className="mb-0">{success}</p>
                        <hr />
                        <div className="d-flex align-items-center">
                            <i className="bi bi-info-circle me-2"></i>
                            <small className="text-muted">You will be able to login once an administrator approves your account.</small>
                        </div>
                    </div>
                )}
                
                {!success && (
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label">
                                <i className="bi bi-person me-2"></i>Full Name
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-person"></i>
                                </span>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    placeholder="Enter your full name"
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="invalid-feedback">{formik.errors.name}</div>
                                )}
                            </div>
                        </div>
                        
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
                        
                        <div className="row">
                            <div className="col-md-6 mb-4">
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
                                        placeholder="Create a password"
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <div className="invalid-feedback">{formik.errors.password}</div>
                                    )}
                                </div>
                                <small className="form-text text-muted">
                                    Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                                </small>
                            </div>
                            
                            <div className="col-md-6 mb-4">
                                <label htmlFor="confirmPassword" className="form-label">
                                    <i className="bi bi-shield-lock me-2"></i>Confirm Password
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
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.confirmPassword}
                                        placeholder="Confirm your password"
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="alert alert-info mb-4" role="alert">
                            <div className="d-flex">
                                <i className="bi bi-info-circle-fill me-2"></i>
                                <span>
                                    <strong>Note:</strong> After registration, your account will need to be approved 
                                    by an administrator before you can log in.
                                </span>
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
                                        Processing...
                                    </>
                                ) : (
                                    <>Create Account <i className="bi bi-arrow-right ms-2"></i></>
                                )}
                            </button>
                        </div>
                        
                        <div className="text-center mt-4">
                            <p className="mb-0">
                                Already have an account? <Link to="/login" className="fw-bold text-primary text-decoration-none">Login here</Link>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterForm; 