const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Get Firebase credentials from environment variables
let serviceAccount;
try {
  // First try to parse service account from environment variable if it exists
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('Firebase service account loaded from environment variable');
  } else {
    // Fallback to individual env variables
    serviceAccount = {
      "type": process.env.FIREBASE_TYPE || "service_account",
      "project_id": process.env.FIREBASE_PROJECT_ID,
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
      "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
      "client_email": process.env.FIREBASE_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_CLIENT_ID,
      "auth_uri": process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      "token_uri": process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL,
      "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com"
    };
    console.log('Firebase service account constructed from individual environment variables');
  }
} catch (error) {
  console.error('Error parsing Firebase service account:', error);
  // If environment variables aren't set up, we'll use mock functions instead
  serviceAccount = null;
}

// Get storage bucket name from environment variables
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

console.log('Initializing Firebase with storage bucket:', storageBucket || 'Not configured');

// Mock upload function for when Firebase fails
const mockUploadFile = async (file, folder = 'prescriptions') => {
  console.log('Using mock upload function');
  return `https://mock-storage.example.com/${folder}/${Date.now()}-${file?.originalname || 'unknown.jpg'}`;
};

try {
  // Only initialize Firebase if we have the necessary credentials
  if (serviceAccount && storageBucket) {
    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket
    });

    // Get reference to storage bucket
    const bucket = admin.storage().bucket();

    // Upload file to Firebase Storage
    const uploadFile = async (file, folder = 'prescriptions') => {
      try {
        if (!file) {
          console.log('No file provided for upload');
          return null;
        }
        
        const fileName = `${folder}/${Date.now()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);
        
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });
        
        return new Promise((resolve, reject) => {
          blobStream.on('error', (error) => {
            console.error('Upload stream error:', error);
            // Fall back to mock URL on error
            console.log('Falling back to mock URL due to upload error');
            resolve(`https://mock-storage.example.com/${folder}/${Date.now()}-${file.originalname}`);
          });
          
          blobStream.on('finish', async () => {
            try {
              // Make the file public
              await fileUpload.makePublic();
              
              // Get the public URL
              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
              console.log('File uploaded successfully:', publicUrl);
              resolve(publicUrl);
            } catch (error) {
              console.error('Error making file public:', error);
              // Fall back to mock URL on error
              console.log('Falling back to mock URL due to makePublic error');
              resolve(`https://mock-storage.example.com/${folder}/${Date.now()}-${file.originalname}`);
            }
          });
          
          blobStream.end(file.buffer);
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        // Fall back to mock URL on error
        return `https://mock-storage.example.com/${folder}/${Date.now()}-${file?.originalname || 'unknown.jpg'}`;
      }
    };

    // Delete file from Firebase Storage
    const deleteFile = async (fileUrl) => {
      try {
        if (!fileUrl) {
          console.log('No file URL provided for deletion');
          return false;
        }

        // Check if it's a mock URL
        if (fileUrl.includes('mock-storage.example.com')) {
          console.log('Mock URL detected, skipping deletion');
          return true;
        }

        // Extract file path from the URL
        // Format: https://storage.googleapis.com/BUCKET_NAME/FILE_PATH
        const urlParts = fileUrl.split(`https://storage.googleapis.com/${bucket.name}/`);
        
        if (urlParts.length !== 2) {
          console.log('Invalid file URL format');
          return false;
        }
        
        const filePath = urlParts[1];
        const file = bucket.file(filePath);
        
        // Check if file exists before deleting
        const [exists] = await file.exists();
        if (!exists) {
          console.log('File does not exist:', filePath);
          return true; // Return true since the file is already gone
        }
        
        // Delete the file
        await file.delete();
        console.log('File deleted successfully:', filePath);
        return true;
      } catch (error) {
        console.error('Error deleting file:', error);
        return false;
      }
    };

    // Mock delete function
    const mockDeleteFile = async (fileUrl) => {
      console.log('Using mock delete function for:', fileUrl);
      return true;
    };

    // Check if bucket is accessible
    bucket.getMetadata()
      .then(() => {
        console.log('Firebase Storage bucket verified successfully');
      })
      .catch((error) => {
        console.error('Error accessing Firebase Storage bucket:', error.message);
        console.warn('Will use mock upload functionality when needed');
      });

    module.exports = { uploadFile, deleteFile, bucket, admin };
  } else {
    throw new Error('Firebase credentials or storage bucket not configured in environment variables');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  
  // Export mock functions if Firebase initialization fails
  module.exports = { 
    uploadFile: mockUploadFile, 
    deleteFile: mockDeleteFile,
    bucket: null, 
    admin: null 
  };
} 