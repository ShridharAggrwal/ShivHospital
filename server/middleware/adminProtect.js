const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path : path.resolve(__dirname,'../.env')})

const adminProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized, token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized, invalid token' });
  }
};

module.exports = adminProtect;
