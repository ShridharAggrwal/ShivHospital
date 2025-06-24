import { useState, useEffect } from 'react';
import { axiosPrivate } from '../../api/axios';
import React from 'react';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // Default sort by registration date in descending order (newest first)
    const [sortBy, setSortBy] = useState('registrationDate');
    const [sortOrder, setSortOrder] = useState('desc');
    const [advancedSearch, setAdvancedSearch] = useState(false);

    // Fetch patients with search, sort and pagination
    const fetchPatients = async () => {
        try {
            setLoading(true);
            // Build search params based on selected field
            let searchParams = {};
            if (searchTerm) {
                if (advancedSearch) {
                    // In advanced search mode, use field-specific search
                    if (searchField === 'mobileNo') {
                        searchParams.mobileNo = searchTerm;
                    } else if (searchField === 'name') {
                        searchParams.name = searchTerm;
                    } else if (searchField === 'address') {
                        searchParams.address = searchTerm;
                    } else if (searchField === 'alternativeNo') {
                        searchParams.alternativeNo = searchTerm;
                    } else {
                        // If "All" is selected, use general search parameter
                        searchParams.search = searchTerm;
                    }
                } else {
                    // In simple search mode, always search across all fields
                    searchParams.search = searchTerm;
                }
            }

            const response = await axiosPrivate.get('/staff-dashboard/patients', {
                params: {
                    ...searchParams,
                    page: currentPage,
                    limit: 10,
                    sortBy,
                    sortOrder
                }
            });
            
            setPatients(response.data.data);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch patients');
            setLoading(false);
            console.error(err);
        }
    };

    // Fetch patients when dependencies change
    useEffect(() => {
        fetchPatients();
    }, [currentPage, sortBy, sortOrder]);

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page
        fetchPatients();
    };

    // Toggle advanced search
    const toggleAdvancedSearch = () => {
        setAdvancedSearch(!advancedSearch);
        setSearchField('all');
        setSearchTerm('');
    };

    // Handle sort change
    const handleSort = (field) => {
        if (sortBy === field) {
            // Toggle sort order
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // New field, default to descending
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    // Reset search form
    const resetSearch = () => {
        setSearchTerm('');
        setSearchField('all');
        setCurrentPage(1);
        fetchPatients();
    };

    if (loading && patients.length === 0) {
        return (
            <div className="d-flex justify-content-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
            </div>
        );
    }

    return (
        <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                    <i className="bi bi-list-ul me-2"></i>
                    Patient Records
                </h5>
                <button 
                    className="btn btn-outline-light btn-sm" 
                    onClick={toggleAdvancedSearch}
                >
                    <i className={`bi ${advancedSearch ? 'bi-funnel-fill' : 'bi-funnel'} me-1`}></i>
                    {advancedSearch ? 'Simple Search' : 'Advanced Search'}
                </button>
            </div>
            
            <div className="card-body">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-4">
                    <div className="row">
                        <div className="col-12">
                            <label className="form-label fw-bold mb-2">
                                <i className="bi bi-search me-1"></i> 
                                {advancedSearch ? 'Advanced Search' : 'Quick Search'}
                            </label>
                        </div>
                        
                        {advancedSearch ? (
                            <>
                                <div className="col-md-3 mb-3">
                                    <select 
                                        className="form-select" 
                                        value={searchField}
                                        onChange={(e) => setSearchField(e.target.value)}
                                    >
                                        <option value="all">All Fields</option>
                                        <option value="name">Name</option>
                                        <option value="mobileNo">Mobile Number</option>
                                        <option value="alternativeNo">Alternative Number</option>
                                        <option value="address">Address</option>
                                    </select>
                                    <div className="form-text">Select search field</div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={`Search by ${searchField === 'all' ? 'any field' : searchField}`}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-primary">
                                            Search
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={resetSearch}>
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="col-md-8 col-lg-6">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search patients..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button type="submit" className="btn btn-primary">
                                        <i className="bi bi-search me-1 d-none d-md-inline-block"></i>
                                        Search
                                    </button>
                                </div>
                                <div className="form-text">Search by name, mobile number, alternative number or address</div>
                            </div>
                        )}
                    </div>
                </form>
                
                {/* Patient Table */}
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }} className="text-nowrap">
                                    <span className="d-flex align-items-center">
                                        <span>Name</span>
                                        {sortBy === 'name' && (
                                            <i className={`bi ms-1 ${sortOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
                                        )}
                                    </span>
                                </th>
                                <th className="d-none d-md-table-cell">Age</th>
                                <th className="d-none d-md-table-cell">Gender</th>
                                <th onClick={() => handleSort('mobileNo')} style={{ cursor: 'pointer' }} className="text-nowrap">
                                    <span className="d-flex align-items-center">
                                        <span>Mobile</span>
                                        {sortBy === 'mobileNo' && (
                                            <i className={`bi ms-1 ${sortOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
                                        )}
                                    </span>
                                </th>
                                <th className="d-none d-md-table-cell text-nowrap" onClick={() => handleSort('alternativeNo')} style={{ cursor: 'pointer' }}>
                                    <span className="d-flex align-items-center">
                                        <span>Alt. Number</span>
                                        {sortBy === 'alternativeNo' && (
                                            <i className={`bi ms-1 ${sortOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
                                        )}
                                    </span>
                                </th>
                                <th onClick={() => handleSort('registrationDate')} style={{ cursor: 'pointer' }} className="text-nowrap">
                                    <span className="d-flex align-items-center">
                                        <span>Date</span>
                                        {sortBy === 'registrationDate' && (
                                            <i className={`bi ms-1 ${sortOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
                                        )}
                                    </span>
                                </th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.length > 0 ? (
                                patients.map(patient => (
                                    <tr key={patient._id}>
                                        <td>
                                            <div className="d-md-none fw-bold">{patient.name}</div>
                                            <div className="d-none d-md-block">{patient.name}</div>
                                            <div className="d-md-none small text-muted">
                                                Age: {patient.age} | Gender: {patient.gender}
                                                {patient.alternativeNo && (
                                                    <span> | Alt: {patient.alternativeNo}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="d-none d-md-table-cell">{patient.age}</td>
                                        <td className="d-none d-md-table-cell">{patient.gender}</td>
                                        <td>{patient.mobileNo}</td>
                                        <td className="d-none d-md-table-cell">
                                            {patient.alternativeNo || '-'}
                                        </td>
                                        <td className="text-nowrap">
                                            <span className="badge bg-light text-dark">
                                                <i className="bi bi-calendar3 me-1"></i>
                                                {formatDate(patient.registrationDate)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2 justify-content-center flex-wrap">
                                                <a 
                                                    href={patient.prescriptionFrontUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="View front prescription"
                                                >
                                                    <i className="bi bi-file-earmark-medical me-1 d-none d-sm-inline-block"></i>
                                                    Front
                                                </a>
                                                
                                                {patient.prescriptionBackUrl && (
                                                    <a 
                                                        href={patient.prescriptionBackUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="View back prescription"
                                                    >
                                                        <i className="bi bi-file-earmark me-1 d-none d-sm-inline-block"></i>
                                                        Back
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        <div className="d-flex flex-column align-items-center">
                                            <i className="bi bi-inbox text-muted mb-2" style={{ fontSize: '2rem' }}></i>
                                            <p className="mb-0">No patients found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <nav aria-label="Patient list pagination">
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        aria-label="Previous page"
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                
                                {/* Show limited page numbers on mobile */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        // On mobile, show fewer page numbers
                                        if (window.innerWidth < 768) {
                                            return (
                                                page === 1 || 
                                                page === totalPages || 
                                                Math.abs(page - currentPage) <= 1
                                            );
                                        }
                                        return true;
                                    })
                                    .map(page => (
                                        <li 
                                            key={page} 
                                            className={`page-item ${currentPage === page ? 'active' : ''}`}
                                        >
                                            <button 
                                                className="page-link" 
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ))
                                }
                                
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        aria-label="Next page"
                                    >
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientList; 