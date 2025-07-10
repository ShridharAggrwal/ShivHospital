import axios from 'axios';

// Get the base URL without the /api/auth part
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/auth';
  
  // For production URL (Render)
  if (apiUrl.includes('shivhospital.onrender.com')) {
    return 'https://shivhospital.onrender.com';
  }
  
  // For local development or other environments
  return apiUrl.split('/api/auth')[0];
};

const BASE_URL = getBaseUrl();

/**
 * Pings the server every 14 minutes to keep it alive
 * Render free tier has a 15-minute inactivity timeout
 */
export const startKeepAlive = () => {
  // Initial ping when the app loads
  pingServer();
  
  // Set up interval (14 minutes = 840000 ms)
  const intervalId = setInterval(pingServer, 840000);
  
  // Return function to clear interval if needed
  return () => clearInterval(intervalId);
};

/**
 * Sends a ping request to the server
 */
const pingServer = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/ping`, { timeout: 5000 });
    console.log('Keep-alive ping sent:', response.status === 200 ? 'success' : 'failed');
  } catch (error) {
    console.log('Keep-alive ping failed:', error.message);
  }
};

export default startKeepAlive; 