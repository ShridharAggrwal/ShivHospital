const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  
  name: {
    type : String,
    required : true,
  },
  
  email: {
    type : String,
    required : true,
  },
  
  password: { 
    type : String,
    required : true,
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'blocked'],
    default: 'pending'
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  resetPasswordToken: {
    type: String,
    default: null
  },
  
  resetPasswordExpires: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Staff', staffSchema);
