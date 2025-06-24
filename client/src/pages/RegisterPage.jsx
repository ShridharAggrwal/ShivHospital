import React from 'react';
import Layout from '../components/layouts/Layout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
    return (
        <Layout>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="text-center mb-4">
                            <h1 className="display-6 fw-bold">Staff Registration</h1>
                            <p className="lead text-muted">Create an account to access the patient management system</p>
                        </div>
                        
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RegisterPage; 