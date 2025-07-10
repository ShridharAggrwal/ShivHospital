const Patient = require('../models/Patient');
const { uploadFile, deleteFile } = require('../config/firebase');
const { compressImage } = require('../utils/imageProcessor');

// Register a new patient
const registerPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      address,
      mobileNo,
      alternativeNo,
      registrationDate
    } = req.body;

    // Check if all required fields are provided
    if (!name || !age || !gender || !address || !mobileNo) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Get the staff ID from the authenticated user
    const staffId = req.staff._id;

    // Initialize variables for image URLs
    let prescriptionFrontUrl = null;
    let prescriptionBackUrl = null;

    // Compress and upload front prescription image if provided
    if (req.files && req.files.prescriptionFront && req.files.prescriptionFront[0]) {
      const frontImage = req.files.prescriptionFront[0];
      const compressedFrontImage = await compressImage(frontImage.buffer);
      frontImage.buffer = compressedFrontImage;
      prescriptionFrontUrl = await uploadFile(frontImage, 'prescriptions/front');
    }

    // Compress and upload back prescription image if provided
    if (req.files && req.files.prescriptionBack && req.files.prescriptionBack[0]) {
      const backImage = req.files.prescriptionBack[0];
      const compressedBackImage = await compressImage(backImage.buffer);
      backImage.buffer = compressedBackImage;
      prescriptionBackUrl = await uploadFile(backImage, 'prescriptions/back');
    }

    // Create new patient
    const patient = await Patient.create({
      name,
      age,
      gender,
      address,
      mobileNo,
      alternativeNo,
      registrationDate: registrationDate || Date.now(),
      prescriptionFrontUrl,
      prescriptionBackUrl,
      registeredBy: staffId
    });

    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register patient',
      error: error.message
    });
  }
};

// Get all patients
const getPatients = async (req, res) => {
  try {
    const { 
      search, name, address, mobileNo, alternativeNo, 
      startDate, endDate,
      sortBy, sortOrder, page = 1, limit = 10 
    } = req.query;
    
    // Build query
    const query = {};
    
    // Add search functionality
    if (search) {
      // General search across multiple fields
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobileNo: { $regex: search, $options: 'i' } },
        { alternativeNo: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    } else {
      // Specific field search
      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }
      
      if (address) {
        query.address = { $regex: address, $options: 'i' };
      }
      
      if (mobileNo) {
        query.mobileNo = { $regex: mobileNo, $options: 'i' };
      }
      
      if (alternativeNo) {
        query.alternativeNo = { $regex: alternativeNo, $options: 'i' };
      }
    }
    
    // Add date range search
    if (startDate || endDate) {
      query.registrationDate = {};
      
      if (startDate) {
        // Set start of day for startDate
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.registrationDate.$gte = start;
      }
      
      if (endDate) {
        // Set end of day for endDate
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.registrationDate.$lte = end;
      }
    }
    
    // Build sort options
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by createdAt desc
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const patients = await Patient.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('registeredBy', 'name email');
    
    // Get total count for pagination
    const total = await Patient.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: patients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
      error: error.message
    });
  }
};

// Get patient by ID
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('registeredBy', 'name email');
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient',
      error: error.message
    });
  }
};

// Update patient
const updatePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    
    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ 
        success: false,
        message: 'Patient not found' 
      });
    }
    
    // Extract data from request body
    const {
      name,
      age,
      gender,
      address,
      mobileNo,
      alternativeNo,
      registrationDate
    } = req.body;
    
    // Create update object with basic fields
    const updateData = {};
    
    // Only update fields that are provided
    if (name) updateData.name = name;
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;
    if (address) updateData.address = address;
    if (mobileNo) updateData.mobileNo = mobileNo;
    if (alternativeNo !== undefined) updateData.alternativeNo = alternativeNo;
    if (registrationDate) updateData.registrationDate = registrationDate;
    
    // Handle front prescription image update
    if (req.files && req.files.prescriptionFront && req.files.prescriptionFront[0]) {
      // Delete old image if it exists
      if (patient.prescriptionFrontUrl) {
        await deleteFile(patient.prescriptionFrontUrl);
      }
      
      // Upload new image
      const frontImage = req.files.prescriptionFront[0];
      const compressedFrontImage = await compressImage(frontImage.buffer);
      frontImage.buffer = compressedFrontImage;
      updateData.prescriptionFrontUrl = await uploadFile(frontImage, 'prescriptions/front');
    }
    
    // Handle back prescription image update
    if (req.files && req.files.prescriptionBack && req.files.prescriptionBack[0]) {
      // Delete old image if it exists
      if (patient.prescriptionBackUrl) {
        await deleteFile(patient.prescriptionBackUrl);
      }
      
      // Upload new image
      const backImage = req.files.prescriptionBack[0];
      const compressedBackImage = await compressImage(backImage.buffer);
      backImage.buffer = compressedBackImage;
      updateData.prescriptionBackUrl = await uploadFile(backImage, 'prescriptions/back');
    }
    
    // Handle image deletion requests (without uploading new ones)
    if (req.body.deleteFrontImage === 'true' && !req.files?.prescriptionFront) {
      if (patient.prescriptionFrontUrl) {
        await deleteFile(patient.prescriptionFrontUrl);
      }
      updateData.prescriptionFrontUrl = null;
    }
    
    if (req.body.deleteBackImage === 'true' && !req.files?.prescriptionBack) {
      if (patient.prescriptionBackUrl) {
        await deleteFile(patient.prescriptionBackUrl);
      }
      updateData.prescriptionBackUrl = null;
    }
    
    // Update patient in database
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true, runValidators: true }
    ).populate('registeredBy', 'name email');
    
    res.status(200).json({
      success: true,
      data: updatedPatient
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update patient',
      error: error.message
    });
  }
};

module.exports = {
  registerPatient,
  getPatients,
  getPatientById,
  updatePatient
}; 