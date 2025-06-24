const express = require('express');
const adminProtect = require('../middleware/adminProtect');
const { loginAdmin, forgotPasswordAdmin, resetPasswordAdmin } = require('../controllers/adminAuthContoller');
const {getAllStaffs, updateStaffStatus, getPatients } = require('../controllers/personalizeContorllers/adminControllers')
const router = express.Router();

router.post('/loginAdmin', loginAdmin);
router.post('/forgotPasswordAdmin', forgotPasswordAdmin);
router.post('/resetPasswordAdmin', resetPasswordAdmin);

router.get('/admin-dashboard', adminProtect, (req, res) => {
  res.json({ message: `Welcome Admin ${req.admin.id}` });
});

// Get full list of staffs
router.get('/admin-dashboard/staffs', adminProtect, getAllStaffs);

// Update staff status
router.patch('/admin-dashboard/staff-status/:staffId', adminProtect, updateStaffStatus);

// Get patients list with filtering and pagination
router.get('/admin-dashboard/patients', adminProtect, getPatients);

module.exports = router;