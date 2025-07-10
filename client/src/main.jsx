import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import startKeepAlive from './utils/keepAlive.js'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css'

console.log("Main.jsx is executing");

// Start the keep-alive service to prevent server sleep
startKeepAlive();

// Error handling for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
console.log("Root element found:", document.getElementById('root'));

try {
  console.log("Attempting to render App component");
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("App component rendered successfully");
} catch (error) {
  console.error("Failed to render application:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2>Something went wrong</h2>
      <p>The application failed to load. Please try refreshing the page.</p>
      <pre style="background: #f1f1f1; padding: 10px; text-align: left; margin-top: 20px;">${error.message}</pre>
    </div>
  `;
}
