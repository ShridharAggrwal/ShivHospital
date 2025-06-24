import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layouts/Layout';
import LoginForm from '../components/auth/LoginForm';

const AdminLoginPage = () => {
    return (
        <Layout>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7 px-3 px-md-4">
                        <div className="text-center mb-4">
                            <h1 className="display-6 fw-bold">Administrator login Portal</h1>
                            <p className="lead text-muted">Access the administrative dashboard</p>
                        </div>
                        
                        <LoginForm role="admin" />
                        
                        <div className="card mt-4 bg-light border-0">
                            <div className="card-body text-center py-3">
                                <Link to="/login" className="btn btn-outline-secondary">
                                    <i className="bi bi-arrow-left me-1"></i>
                                    Back to Staff Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminLoginPage; 