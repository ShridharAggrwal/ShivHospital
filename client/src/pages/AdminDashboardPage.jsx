import React from 'react';
import Layout from '../components/layouts/Layout';
import StaffList from '../components/admin/StaffList';
import useAuth from '../context/useAuth';

const AdminDashboardPage = () => {
    const { auth } = useAuth();

    return (
        <Layout>
            <div className="container-fluid py-4 px-md-4">
                <div className="row mb-4 align-items-center">
                    <div className="col-md-8">
                        <h1 className="display-6 fw-bold mb-2">
                            <i className="bi bi-shield-lock text-primary me-2"></i>
                            Admin Dashboard
                        </h1>
                        <p className="lead">
                            Welcome{auth?.name ? `, ${auth.name}` : ''}! Manage staff accounts here.
                        </p>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        <div className="badge bg-light text-dark p-2 d-inline-flex align-items-center">
                            <i className="bi bi-clock-history me-2"></i>
                            <span>Last updated: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="mb-4 p-3 bg-light rounded-3 border">
                            <div className="row justify-content-center">
                                <div className="col-sm-8 col-md-6 col-lg-4">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body text-center p-3">
                                            <div className="display-6 text-primary mb-2">
                                                <i className="bi bi-people-fill"></i>
                                            </div>
                                            <h5 className="card-title mb-1">Staff Management</h5>
                                            <p className="card-text small text-muted">Approve and manage staff accounts</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <StaffList />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboardPage; 