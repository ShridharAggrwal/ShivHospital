const Staff = require('../models/Staff')
const Patient = require('../models/Patient')

// Get all staff members
const getAllStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find({}).select('-password');
    res.json(staffs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update staff status
const updateStaffStatus = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'blocked'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      { status },
      { new: true }
    ).select('-password');

    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json(updatedStaff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patients for admin dashboard with filtering, sorting and pagination
const getPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'registrationDate';
    const sortOrder = req.query.sortOrder || 'desc';
    const search = req.query.search || '';
    const { name, address, mobileNo, alternativeNo, startDate, endDate } = req.query;

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

    // Get total count for pagination
    const totalCount = await Patient.countDocuments(query);
    
    // Get patients with sorting and pagination
    const patients = await Patient.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      data: patients,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

module.exports = {getAllStaffs, updateStaffStatus, getPatients} 