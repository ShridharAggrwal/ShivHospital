import React from 'react';
import Layout from '../components/layouts/Layout';
import StaffList from '../components/admin/StaffList';
import useAuth from '../context/useAuth';

const AdminDashboardPage = () => {
    const { auth } = useAuth();

    return (
        <Layout>
            <div className="container py-4">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1 className="mb-3">Admin Dashboard</h1>
                        <p className="lead">
                            Welcome to the admin dashboard. Here you can manage staff accounts and monitor system activity.
                        </p>
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