import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { axiosPrivate } from '../../api/axios';

const PatientRegistrationForm = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [prescriptionFrontPreview, setPrescriptionFrontPreview] = useState(null);
    const [prescriptionBackPreview, setPrescriptionBackPreview] = useState(null);

    const formik = useFormik({
        initialValues: {
            name: '',
            age: '',
            gender: '',
            address: '',
            mobileNo: '',
            alternativeNo: '',
            registrationDate: new Date().toISOString().split('T')[0],
            prescriptionFront: null,
            prescriptionBack: null
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            age: Yup.number()
                .positive('Age must be a positive number')
                .integer('Age must be an integer')
                .required('Age is required'),
            gender: Yup.string()
                .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender')
                .required('Gender is required'),
            address: Yup.string().required('Address is required'),
            mobileNo: Yup.string().required('Mobile number is required'),
            registrationDate: Yup.date().required('Registration date is required'),
            prescriptionFront: Yup.mixed().required('Front prescription image is required')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            
            try {
                // Create form data for file upload
                const formData = new FormData();
                
                // Append text fields
                formData.append('name', values.name);
                formData.append('age', values.age);
                formData.append('gender', values.gender);
                formData.append('address', values.address);
                formData.append('mobileNo', values.mobileNo);
                formData.append('alternativeNo', values.alternativeNo);
                formData.append('registrationDate', values.registrationDate);
                
                // Append files
                formData.append('prescriptionFront', values.prescriptionFront);
                if (values.prescriptionBack) {
                    formData.append('prescriptionBack', values.prescriptionBack);
                }
                
                // Send request
                const response = await axiosPrivate.post(
                    '/staff-dashboard/patientRegistration', 
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
                if (response.data?.success) {
                    // Reset form and preview images
                    formik.resetForm();
                    setPrescriptionFrontPreview(null);
                    setPrescriptionBackPreview(null);
                    
                    // Call success callback
                    if (onSuccess) {
                        onSuccess(response.data.data);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to register patient');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    });

    // Handle file input change
    const handleFileChange = (event, fieldName) => {
        const file = event.currentTarget.files[0];
        
        if (file) {
            // Set file in formik values
            formik.setFieldValue(fieldName, file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                if (fieldName === 'prescriptionFront') {
                    setPrescriptionFrontPreview(reader.result);
                } else if (fieldName === 'prescriptionBack') {
                    setPrescriptionBackPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="card shadow">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0 fw-bold">
                    <i className="bi bi-person-plus me-2"></i>Register New Patient
                </h5>
            </div>
            <div className="card-body">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {error}
                    </div>
                )}
                
                <form onSubmit={formik.handleSubmit}>
                    <div className="row g-3">
                        {/* Patient Information Section */}
                        <div className="col-12">
                            <h6 className="text-primary fw-bold mb-3">
                                <i className="bi bi-info-circle me-2"></i>
                                Patient Information
                            </h6>
                        </div>
                        
                        {/* Name Field */}
                        <div className="col-md-6 col-lg-4 mb-3">
                            <label htmlFor="name" className="form-label">Patient Name</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-person"></i>
                                </span>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    placeholder="Enter full name"
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="invalid-feedback">{formik.errors.name}</div>
                                )}
                            </div>
                        </div>
                        
                        {/* Age Field */}
                        <div className="col-md-6 col-lg-4 mb-3">
                            <label htmlFor="age" className="form-label">Age</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-calendar3"></i>
                                </span>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    min="0"
                                    className={`form-control ${formik.touched.age && formik.errors.age ? 'is-invalid' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.age}
                                    placeholder="Enter age"
                                />
                                {formik.touched.age && formik.errors.age && (
                                    <div className="invalid-feedback">{formik.errors.age}</div>
                                )}
                            </div>
                        </div>
                        
                        {/* Gender Field */}
                        <div className="col-md-6 col-lg-4 mb-3">
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-gender-ambiguous"></i>
                                </span>
                                <select
                                    id="gender"
                                    name="gender"
                                    className={`form-select ${formik.touched.gender && formik.errors.gender ? 'is-invalid' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.gender}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {formik.touched.gender && formik.errors.gender && (
                                    <div className="invalid-feedback">{formik.errors.gender}</div>
                                )}
                            </div>
                        </div>
                        
                        {/* Mobile Number Field */}
                        <div className="col-md-6 col-lg-4 mb-3">
                            <label htmlFor="mobileNo" className="form-label">Mobile Number</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-phone"></i>
                                </span>
                                <input
                                    id="mobileNo"
                                    name="mobileNo"
                                    type="text"
                                    className={`form-control ${formik.touched.mobileNo && formik.errors.mobileNo ? 'is-invalid' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.mobileNo}
                                    placeholder="Enter mobile number"
                                />
                                {formik.touched.mobileNo && formik.errors.mobileNo && (
                                    <div className="invalid-feedback">{formik.errors.mobileNo}</div>
                                )}
                            </div>
                        </div>
                        
                        {/* Alternative Number Field */}
                        <div className="col-md-6 col-lg-4 mb-3">
                            <label htmlFor="alternativeNo" className="form-label">Alternative Number <span className="text-muted">(Optional)</span></label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-phone"></i>
                                </span>
                                <input
                                    id="alternativeNo"
                                    name="alternativeNo"
                                    type="text"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.alternativeNo}
                                    placeholder="Enter alternative number"
                                />
                            </div>
                        </div>
                        
                        {/* Registration Date Field */}
                        <div className="col-md-6 col-lg-4 mb-3">
                            <label htmlFor="registrationDate" className="form-label">Registration Date</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-calendar-date"></i>
                                </span>
                                <input
                                    id="registrationDate"
                                    name="registrationDate"
                                    type="date"
                                    className={`form-control ${formik.touched.registrationDate && formik.errors.registrationDate ? 'is-invalid' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.registrationDate}
                                />
                                {formik.touched.registrationDate && formik.errors.registrationDate && (
                                    <div className="invalid-feedback">{formik.errors.registrationDate}</div>
                                )}
                            </div>
                        </div>
                        
                        {/* Address Field */}
                        <div className="col-md-12 mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-geo-alt"></i>
                                </span>
                                <textarea
                                    id="address"
                                    name="address"
                                    className={`form-control ${formik.touched.address && formik.errors.address ? 'is-invalid' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.address}
                                    rows="3"
                                    placeholder="Enter full address including area, city, and pin code for better searchability"
                                ></textarea>
                                {formik.touched.address && formik.errors.address && (
                                    <div className="invalid-feedback">{formik.errors.address}</div>
                                )}
                            </div>
                            <div className="form-text">
                                <i className="bi bi-info-circle me-1"></i>
                                Include detailed address with landmarks for improved searchability
                            </div>
                        </div>
                        
                        {/* Prescription Section */}
                        <div className="col-12 mt-2">
                            <h6 className="text-primary fw-bold mb-3">
                                <i className="bi bi-file-medical me-2"></i>
                                Prescription Information
                            </h6>
                        </div>
                        
                        {/* Prescription Front Image */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="prescriptionFront" className="form-label">
                                Prescription Front Image <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-image"></i>
                                </span>
                                <input
                                    id="prescriptionFront"
                                    name="prescriptionFront"
                                    type="file"
                                    accept="image/*"
                                    className={`form-control ${formik.touched.prescriptionFront && formik.errors.prescriptionFront ? 'is-invalid' : ''}`}
                                    onChange={(event) => handleFileChange(event, 'prescriptionFront')}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.prescriptionFront && formik.errors.prescriptionFront && (
                                    <div className="invalid-feedback">{formik.errors.prescriptionFront}</div>
                                )}
                            </div>
                            
                            {prescriptionFrontPreview && (
                                <div className="mt-3 text-center">
                                    <img 
                                        src={prescriptionFrontPreview} 
                                        alt="Prescription Front Preview" 
                                        className="img-thumbnail shadow-sm" 
                                        style={{ maxHeight: '200px' }}
                                    />
                                    <p className="text-muted mt-1 small">Front side preview</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Prescription Back Image */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="prescriptionBack" className="form-label">
                                Prescription Back Image <span className="text-muted">(Optional)</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-image"></i>
                                </span>
                                <input
                                    id="prescriptionBack"
                                    name="prescriptionBack"
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={(event) => handleFileChange(event, 'prescriptionBack')}
                                />
                            </div>
                            
                            {prescriptionBackPreview && (
                                <div className="mt-3 text-center">
                                    <img 
                                        src={prescriptionBackPreview} 
                                        alt="Prescription Back Preview" 
                                        className="img-thumbnail shadow-sm" 
                                        style={{ maxHeight: '200px' }}
                                    />
                                    <p className="text-muted mt-1 small">Back side preview</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Submit Button */}
                        <div className="col-12 mt-3 text-end">
                            <button 
                                type="submit" 
                                className="btn btn-primary px-4 py-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-save me-2"></i>
                                        Register Patient
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientRegistrationForm; 