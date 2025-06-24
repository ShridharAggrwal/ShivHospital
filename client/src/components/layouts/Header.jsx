import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuth from '../../context/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    const { auth, logout } = useAuth();
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle navbar collapse on mobile
    const toggleNavbar = () => {
        setNavbarOpen(!navbarOpen);
    };

    // Add scroll effect to header
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close mobile menu when changing routes
    useEffect(() => {
        setNavbarOpen(false);
    }, [location.pathname]);

    return (
        <nav className={`navbar navbar-expand-lg navbar-dark bg-primary sticky-top ${scrolled ? 'shadow-sm' : ''}`}
             style={{ transition: 'all 0.3s ease' }}>
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <i className="bi bi-hospital me-2"></i>
                    <span>Shiv Hospital</span>
                </Link>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    onClick={toggleNavbar}
                    aria-expanded={navbarOpen ? "true" : "false"}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className={`collapse navbar-collapse ${navbarOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        {/* Home button - always visible */}
                        <li className="nav-item me-2">
                            <Link className="nav-link" to="/">
                                <i className="bi bi-house-door me-1"></i>
                                <span>Home</span>
                            </Link>
                        </li>
                        
                        {auth?.userRole ? (
                            // Logged in navigation
                            <>
                                <li className="nav-item mx-2">
                                    <Link 
                                        className="nav-link d-flex align-items-center" 
                                        to={`/${auth.userRole}-dashboard`}
                                    >
                                        <i className="bi bi-speedometer2 me-1"></i>
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <button 
                                        className="btn btn-outline-light rounded-pill"
                                        onClick={logout}
                                    >
                                        <i className="bi bi-box-arrow-right me-1"></i>
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </>
                        ) : (
                            // Logged out navigation
                            <>
                                <li className="nav-item mx-2">
                                    <Link className="nav-link d-flex align-items-center" to="/login">
                                        <i className="bi bi-box-arrow-in-right me-1"></i>
                                        <span>Login</span>
                                    </Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <Link className="btn btn-outline-light rounded-pill" to="/register">
                                        <i className="bi bi-person-plus me-1"></i>
                                        <span>Register</span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header; 