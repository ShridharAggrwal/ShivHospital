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
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
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
                <h5 className="mb-0">Staff Members</h5>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.length > 0 ? (
                                staffList.map(staff => (
                                    <tr key={staff._id}>
                                        <td>{staff.name}</td>
                                        <td>{staff.email}</td>
                                        <td>
                                            <span className={`badge ${getBadgeClass(staff.status)}`}>
                                                {staff.status}
                                            </span>
                                        </td>
                                        <td>
                                            {staff.status === 'pending' && (
                                                <>
                                                    <button 
                                                        className="btn btn-sm btn-success me-2"
                                                        onClick={() => handleStatusChange(staff._id, 'approved')}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleStatusChange(staff._id, 'rejected')}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            
                                            {staff.status === 'approved' && (
                                                <button 
                                                    className="btn btn-sm btn-warning"
                                                    onClick={() => handleStatusChange(staff._id, 'blocked')}
                                                >
                                                    Block
                                                </button>
                                            )}
                                            
                                            {staff.status === 'blocked' && (
                                                <button 
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => handleStatusChange(staff._id, 'approved')}
                                                >
                                                    Reactivate
                                                </button>
                                            )}
                                            
                                            {staff.status === 'rejected' && (
                                                <button 
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => handleStatusChange(staff._id, 'approved')}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-3">
                                        No staff members found
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