import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages - Ensure correct capitalization
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  console.log("App component rendering");
  return (
    <ErrorBoundary showDetails={true}>
      <Router>
        <div className="App">
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              
              {/* Forgot & Reset Password Routes */}
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/forgot-password/admin" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/staff/:token" element={<ResetPasswordPage />} />
              <Route path="/reset-password/admin/:token" element={<ResetPasswordPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/staff-dashboard" 
                element={
                  <ProtectedRoute allowedRole="staff">
                    <StaffDashboardPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </AuthProvider>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
