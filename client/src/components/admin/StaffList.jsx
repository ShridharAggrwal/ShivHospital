import { useState, useEffect } from 'react';
import { axiosPrivate } from '../../api/axios';

const StaffList = () => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch staff list
        const fetchStaffList = async () => {
            try {
                const response = await axiosPrivate.get('/admin-dashboard/staffs');
                setStaffList(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch staff list');
                setLoading(false);
                console.error(err);
            }
        };

        fetchStaffList();
    }, []);

    const handleStatusChange = async (staffId, newStatus) => {
        try {
            await axiosPrivate.patch(`/admin-dashboard/staff-status/${staffId}`, {
                status: newStatus
            });
            
            // Update the staff list locally
            setStaffList(prev => prev.map(staff => 
                staff._id === staffId ? { ...staff, status: newStatus } : staff
            ));
        } catch (err) {
            setError('Failed to update staff status');
            console.error(err);
        }
    };

    if (loading) {
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

    const getBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-warning';
            case 'approved':
                return 'bg-success';
            case 'rejected':
                return 'bg-danger';
            case 'blocked':
                return 'bg-secondary';
            default:
                return 'bg-primary';
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0 fw-bold">
                    <i className="bi bi-people me-2"></i>
                    Staff Members
                </h5>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th className="d-none d-md-table-cell">Email</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.length > 0 ? (
                                staffList.map(staff => (
                                    <tr key={staff._id}>
                                        <td>
                                            <div className="fw-medium">{staff.name}</div>
                                            <div className="small text-muted d-md-none">{staff.email}</div>
                                        </td>
                                        <td className="d-none d-md-table-cell">{staff.email}</td>
                                        <td>
                                            <span className={`badge ${getBadgeClass(staff.status)}`}>
                                                {staff.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                                {staff.status === 'pending' && (
                                                    <>
                                                        <button 
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => handleStatusChange(staff._id, 'approved')}
                                                        >
                                                            <i className="bi bi-check-lg d-none d-sm-inline me-1"></i>
                                                            Approve
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleStatusChange(staff._id, 'rejected')}
                                                        >
                                                            <i className="bi bi-x-lg d-none d-sm-inline me-1"></i>
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {staff.status === 'approved' && (
                                                    <button 
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => handleStatusChange(staff._id, 'blocked')}
                                                    >
                                                        <i className="bi bi-slash-circle d-none d-sm-inline me-1"></i>
                                                        Block
                                                    </button>
                                                )}
                                                
                                                {staff.status === 'blocked' && (
                                                    <button 
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleStatusChange(staff._id, 'approved')}
                                                    >
                                                        <i className="bi bi-check-circle d-none d-sm-inline me-1"></i>
                                                        Reactivate
                                                    </button>
                                                )}
                                                
                                                {staff.status === 'rejected' && (
                                                    <button 
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleStatusChange(staff._id, 'approved')}
                                                    >
                                                        <i className="bi bi-check-circle d-none d-sm-inline me-1"></i>
                                                        Approve
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">
                                        <div className="d-flex flex-column align-items-center">
                                            <i className="bi bi-people-fill text-muted mb-2" style={{ fontSize: '2rem' }}></i>
                                            <p className="mb-0">No staff members found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffList; 