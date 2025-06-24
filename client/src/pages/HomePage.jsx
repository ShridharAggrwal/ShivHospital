import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layouts/Layout';

const HomePage = () => {
    console.log("HomePage component rendering");
    return (
        <Layout>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="text-center mb-5">
                            <h1 className="display-4 fw-bold">Welcome to Shiv Hospital & Diagnostic Center</h1>
                            <p className="lead">Patient Registration and Management System</p>
                        </div>
                        
                        <div className="card shadow-lg border-0 mb-5">
                            <div className="card-body p-5">
                                <h2 className="mb-4">About Our System</h2>
                                <p>
                                    Shiv Hospital's Patient Registration System is designed to streamline the process of 
                                    registering patients and managing their prescription records efficiently. Our system 
                                    provides a secure and organized way to store patient information, including:
                                </p>
                                
                                <ul className="list-group list-group-flush mb-4">
                                    <li className="list-group-item">Patient personal details</li>
                                    <li className="list-group-item">Digital prescription records</li>
                                    <li className="list-group-item">Medical history tracking</li>
                                    <li className="list-group-item">Easy search and retrieval of patient records</li>
                                </ul>
                                
                                <p>
                                    Our staff members can quickly register patients, upload their prescription images, 
                                    and access their information whenever needed. This helps us provide better and more 
                                    efficient healthcare services to our patients.
                                </p>
                            </div>
                        </div>
                        
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow">
                                    <div className="card-body p-4 text-center">
                                        <h3 className="mb-3">Staff Members</h3>
                                        <p>Login to manage patient records and prescriptions.</p>
                                        <Link to="/login" className="btn btn-primary mt-2">
                                            <i className="bi bi-box-arrow-in-right me-2"></i>
                                            Staff Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow">
                                    <div className="card-body p-4 text-center">
                                        <h3 className="mb-3">New Staff</h3>
                                        <p>Register to get access to the patient management system.</p>
                                        <Link to="/register" className="btn btn-primary mt-2">
                                            <i className="bi bi-person-plus me-2"></i>
                                            Register
                                        </Link>
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

export default HomePage; 