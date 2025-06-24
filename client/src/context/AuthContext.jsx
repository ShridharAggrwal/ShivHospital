import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    console.log("AuthProvider initializing");
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            console.log("AuthProvider useEffect running");
            // Check if user is logged in on page load
            const token = localStorage.getItem('token');
            const userRole = localStorage.getItem('userRole');
            const userId = localStorage.getItem('userId');
            const userName = localStorage.getItem('userName');
            
            if (token && userRole) {
                console.log(`User authenticated as ${userRole}`);
                setAuth({ token, userRole, userId, name: userName });
            } else {
                console.log("No user authentication found");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error in AuthProvider useEffect:", error);
            setLoading(false);
        }
    }, []);

    const login = async (credentials, role) => {
        try {
            let endpoint = '';
            
            // Determine login endpoint based on role
            if (role === 'staff') {
                endpoint = '/loginStaff';
            } else if (role === 'admin') {
                endpoint = '/loginAdmin';
            } else {
                throw new Error('Invalid role');
            }
            
            const response = await axios.post(endpoint, credentials);
            
            if (response.data?.token) {
                const { token, _id, name, status } = response.data;
                
                // For staff users, check their status
                if (role === 'staff') {
                    // Only allow approved staff to log in
                    if (status && status !== 'approved') {
                        let errorMessage = 'Account access denied.';
                        
                        if (status === 'pending') {
                            errorMessage = 'Your account is pending approval by an administrator. Please try again later.';
                        } else if (status === 'rejected') {
                            errorMessage = 'Your account registration has been rejected. Please contact the administrator.';
                        } else if (status === 'blocked') {
                            errorMessage = 'Your account has been blocked. Please contact the administrator.';
                        }
                        
                        return { success: false, message: errorMessage };
                    }
                }
                
                // Store auth data in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userRole', role);
                localStorage.setItem('userId', _id);
                localStorage.setItem('userName', name || '');
                
                // Update auth state
                setAuth({ token, userRole: role, userId: _id, name });
                
                // Navigate to appropriate dashboard
                if (role === 'staff') {
                    navigate('/staff-dashboard');
                } else if (role === 'admin') {
                    navigate('/admin-dashboard');
                }
                
                return { success: true };
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Check if the error response contains specific status information
            if (error.response?.data?.status) {
                const { status } = error.response.data;
                
                if (status === 'pending') {
                    return { 
                        success: false, 
                        message: 'Your account is pending approval by an administrator.'
                    };
                } else if (status === 'rejected') {
                    return { 
                        success: false, 
                        message: 'Your account registration has been rejected. Please contact the administrator.'
                    };
                } else if (status === 'blocked') {
                    return { 
                        success: false, 
                        message: 'Your account has been blocked. Please contact the administrator.'
                    };
                }
            }
            
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const register = async (userData, role) => {
        try {
            let endpoint = '';
            
            // Determine registration endpoint based on role
            if (role === 'staff') {
                endpoint = '/signupStaff';
            } else {
                throw new Error('Invalid role');
            }
            
            const response = await axios.post(endpoint, userData);
            
            if (response.status === 201 || response.status === 200) {
                return { 
                    success: true,
                    message: 'Registration successful! Your account is pending approval by an administrator.'
                };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    const logout = () => {
        // Clear auth data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        
        // Reset auth state
        setAuth({});
        
        // Navigate to home
        navigate('/');
    };

    console.log("AuthProvider rendering with auth state:", auth);
    
    return (
        <AuthContext.Provider value={{ 
            auth, 
            login, 
            register, 
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 