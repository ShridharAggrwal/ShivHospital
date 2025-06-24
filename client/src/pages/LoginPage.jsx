import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layouts/Layout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
    return (
        <Layout>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7 px-3 px-md-4">
                        <div className="text-center mb-4">
                            <h1 className="display-6 fw-bold">Shiv Hospital Staff Portal</h1>
                            <p className="lead text-muted">Login to access the patient management system</p>
                        </div>
                        
                        <LoginForm role="staff" />
                        
                        <div className="card mt-4 bg-light border-0">
                            <div className="card-body text-center py-3">
                                <div className="row align-items-center">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <p className="mb-0">
                                            Don't have an account? <Link to="/register" className="fw-bold">Register</Link>
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="mb-0 text-muted small">
                                            <Link to="/admin-login" className="text-decoration-none text-muted">
                                                <i className="bi bi-shield-lock me-1"></i>Admin Login
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default LoginPage; 