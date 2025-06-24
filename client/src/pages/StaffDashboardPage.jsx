import { useState } from 'react';
import Layout from '../components/layouts/Layout';
import PatientRegistrationForm from '../components/staff/PatientRegistrationForm';
import PatientList from '../components/staff/PatientList';
import useAuth from '../context/useAuth';

const StaffDashboardPage = () => {
    const { auth } = useAuth();
    const [activeTab, setActiveTab] = useState('patientList');
    const [patientListKey, setPatientListKey] = useState(0);

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Handle successful patient registration
    const handlePatientAdded = () => {
        // Switch to patient list tab
        setActiveTab('patientList');
        // Force refresh of patient list by changing key
        setPatientListKey(prevKey => prevKey + 1);
    };

    return (
        <Layout>
            <div className="container-fluid py-4 px-md-4">
                <div className="row mb-4 align-items-center">
                    <div className="col-md-8">
                        <h1 className="display-6 fw-bold mb-2">
                            <i className="bi bi-clipboard2-pulse text-primary me-2"></i>
                            Staff Dashboard
                        </h1>
                        <p className="lead">
                            Welcome{auth?.name ? `, ${auth.name}` : ''}! Manage patient records and registrations here.
                        </p>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        <div className="badge bg-light text-dark p-2 d-inline-flex align-items-center">
                            <i className="bi bi-clock-history me-2"></i>
                            <span>Last updated: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <ul className="nav nav-tabs nav-fill mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'patientList' ? 'active' : ''} d-flex align-items-center justify-content-center`}
                            onClick={() => handleTabChange('patientList')}
                        >
                            <i className="bi bi-list-ul me-2"></i>
                            <span>Patient Records</span>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'registerPatient' ? 'active' : ''} d-flex align-items-center justify-content-center`}
                            onClick={() => handleTabChange('registerPatient')}
                        >
                            <i className="bi bi-person-plus me-2"></i>
                            <span>Register New Patient</span>
                        </button>
                    </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'patientList' && (
                        <div className="tab-pane fade show active">
                            <PatientList key={patientListKey} />
                        </div>
                    )}
                    
                    {activeTab === 'registerPatient' && (
                        <div className="tab-pane fade show active">
                            <PatientRegistrationForm onSuccess={handlePatientAdded} />
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default StaffDashboardPage; 