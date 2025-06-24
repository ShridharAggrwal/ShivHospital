const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');


const staffAuthWithApproval = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Check role
    if (decoded.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied. Not a staff.' });
    }

    // 3. Fetch staff from DB
    const staff = await Staff.findById(decoded.id);

    if (!staff) {
      return res.status(404).json({ message: 'staff not found' });
    }

    // 4. Check approval status
    if (staff.status !== 'approved') {
      return res.status(403).json({ message: `Access denied. Current status: ${staff.status}` });
    }

    // 5. Attach to request
    req.staff = staff;
    next();
  } catch (error) {
    console.error('staff auth error:', error);
    res.status(401).json({ message: 'Unauthorized, invalid token or user' });
  }
};

module.exports = staffAuthWithApproval;