const Staff = require('../../models/Staff')

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

module.exports = {getAllStaffs, updateStaffStatus} 