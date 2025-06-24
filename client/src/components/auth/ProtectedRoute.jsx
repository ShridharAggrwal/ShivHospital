import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { auth, loading } = useAuth();
    
    console.log("ProtectedRoute rendering, auth:", auth, "allowedRole:", allowedRole);
    
    // Show loading state if auth is still being determined
    if (loading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    
    // Check if user is authenticated
    if (!auth?.token) {
        console.log("ProtectedRoute: No token found, redirecting to login");
        return <Navigate to="/login" replace />;
    }
    
    // Check if user has the required role
    if (allowedRole && auth.userRole !== allowedRole) {
        console.log(`ProtectedRoute: User role (${auth.userRole}) doesn't match required role (${allowedRole}), redirecting to home`);
        return <Navigate to="/" replace />;
    }
    
    // If authenticated and has the correct role, render the children
    console.log("ProtectedRoute: Authentication successful, rendering children");
    return children;
};

export default ProtectedRoute; 