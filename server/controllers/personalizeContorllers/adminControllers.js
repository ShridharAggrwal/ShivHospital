const Staff = require('../../models/Staff')

// Get all doctors with full details
const getAllStaffs = async (req, res) => {
    try {
      const staff = await Staff.find().populate('approvedBy', 'name email');
      res.status(200).json(staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Approve/Reject/Block a doctor
  const updateStaffStatus = async (req, res) => {
    const { staffId } = req.params;
    const { status } = req.body;
  
    if (!['approved', 'rejected', 'blocked'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
  
    try {
      const staff = await Staff.findByIdAndUpdate(
        staffId,
        { status, approvedBy: req.admin.id },
        { new: true }
      ).populate('approvedBy', 'name email');
  
      if (!staff) return res.status(404).json({ message: 'Staff not found' });
  
      res.status(200).json({ message: `Doctor status updated to ${status}`, staff });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
module.exports = {getAllStaffs,updateStaffStatus} 