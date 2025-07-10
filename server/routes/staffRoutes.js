const express = require('express');
const router = express.Router();
const staffAuthWithApproval = require('../middleware/staffProtect');
const { registerStaff, loginStaff, forgotPasswordStaff, resetPasswordStaff } = require('../controllers/staffAuthControllers');
const { registerPatient, getPatients, getPatientById, updatePatient } = require('../controllers/patientController');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/loginStaff', loginStaff);
router.post('/signupStaff', registerStaff);
router.post('/forgotPasswordStaff', forgotPasswordStaff);
router.post('/resetPasswordStaff', resetPasswordStaff);

router.get('/staff-dashboard', staffAuthWithApproval, (req, res) => {
  res.json({ message: `Welcome Doctor ${req.staff._id}` });
});

router.post(
  '/staff-dashboard/patientRegistration',
  staffAuthWithApproval,
  upload.fields([
    { name: 'prescriptionFront', maxCount: 1 },
    { name: 'prescriptionBack', maxCount: 1 }
  ]),
  registerPatient
);

router.put(
  '/staff-dashboard/patients/:id',
  staffAuthWithApproval,
  upload.fields([
    { name: 'prescriptionFront', maxCount: 1 },
    { name: 'prescriptionBack', maxCount: 1 }
  ]),
  updatePatient
);

router.get('/staff-dashboard/patients', staffAuthWithApproval, getPatients);
router.get('/staff-dashboard/patients/:id', staffAuthWithApproval, getPatientById);

module.exports = router;