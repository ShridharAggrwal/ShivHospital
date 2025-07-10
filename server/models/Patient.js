const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
  age: {
    type: Number,
    required: true
  },
  
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  
  address: {
    type: String,
    required: true
  },
  
  mobileNo: {
    type: String,
    required: true
  },
  
  alternativeNo: {
    type: String,
    required: false
  },
  
  registrationDate: {
    type: Date,
    default: Date.now
  },
  
  prescriptionFrontUrl: {
    type: String,
    required: false
  },
  
  prescriptionBackUrl: {
    type: String,
    required: false
  },
  
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema); 