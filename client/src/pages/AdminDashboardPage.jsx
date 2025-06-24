import React, { useState } from 'react';
import Layout from '../components/layouts/Layout';
import StaffList from '../components/admin/StaffList';
import AdminPatientList from '../components/admin/AdminPatientList';
import useAuth from '../context/useAuth';

const AdminDashboardPage = () => {
    const { auth } = useAuth();
    const [activeTab, setActiveTab] = useState('staffManagement');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <Layout>
            <div className="container-fluid py-3">
                <div className="row g-3 mb-3 align-items-center">
                    <div className="col-12 col-md-8">
                        <h1 className="display-6 fw-bold mb-0">
                            <i className="bi bi-shield-lock text-primary me-2"></i>
                            Admin Dashboard
                        </h1>
                        <p className="lead mb-0">
                            Welcome{auth?.name ? `, ${auth.name}` : ''}! Manage staff accounts and view patient records here.
                        </p>
                    </div>
                    <div className="col-12 col-md-4 text-md-end">
                        <div className="badge bg-light text-dark p-2 d-inline-flex align-items-center">
                            <i className="bi bi-clock-history me-2"></i>
                            <span>Last updated: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="nav-tabs-wrapper mb-3">
                    <ul className="nav nav-tabs nav-fill">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'staffManagement' ? 'active' : ''} d-flex align-items-center justify-content-center`}
                                onClick={() => handleTabChange('staffManagement')}
                            >
                                <i className="bi bi-people-fill me-2"></i>
                                <span>Staff Management</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'patientRecords' ? 'active' : ''} d-flex align-items-center justify-content-center`}
                                onClick={() => handleTabChange('patientRecords')}
                            >
                                <i className="bi bi-clipboard2-pulse me-2"></i>
                                <span>Patient Records</span>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'staffManagement' && (
                        <div className="tab-pane fade show active">
                            <StaffList />
                        </div>
                    )}
                    
                    {activeTab === 'patientRecords' && (
                        <div className="tab-pane fade show active">
                            <AdminPatientList />
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboardPage; 