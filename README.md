# Hospital Patient Registration System - Backend

This is the backend for a hospital patient registration system with authentication, patient registration, and prescription image upload functionality.

## Features

- Staff and Admin authentication
- Patient registration with details
- Prescription image upload with compression
- Firebase Storage integration for image storage
- Search and sort functionality for patients
- Pagination for patient listing

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com/
   - Go to Project Settings > Service accounts
   - Generate a new private key (this will download a JSON file)
   - Enable Firebase Storage in your project

4. Create a `.env` file based on `env.example`:
   - Set your MongoDB connection string
   - Set your JWT secret
   - Set your Firebase credentials. There are two options:
     1. Set the entire Firebase service account JSON as a string in FIREBASE_SERVICE_ACCOUNT, or 
     2. Set individual Firebase credentials (FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, etc.)
   - Set your Firebase storage bucket name
   - Set default admin user credentials for initial setup

### Security Considerations

The application has been configured to use environment variables for all sensitive information:

1. **Firebase Credentials**: No credentials are hardcoded in the code. The Firebase configuration loads all credentials from environment variables.
2. **Database Connection**: MongoDB connection strings are loaded from environment variables.
3. **JWT Secrets**: Authentication tokens are signed with a secret stored in environment variables.
4. **Admin Creation**: Admin credentials are loaded from environment variables instead of being hardcoded.

Make sure to:
- Keep your `.env` file secure and never commit it to version control
- Use strong, unique passwords for your admin accounts
- Rotate your Firebase service account keys periodically
- Set appropriate Firebase Storage security rules

### Running the Server

```
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/loginStaff` - Staff login
- `POST /api/auth/signupStaff` - Staff registration

### Patient Management

- `POST /api/auth/staff-dashboard/patientRegistration` - Register a new patient with prescription images
- `GET /api/auth/staff-dashboard/patients` - Get all patients (with search, sort, and pagination)
- `GET /api/auth/staff-dashboard/patients/:id` - Get a specific patient by ID

## Patient Registration API

### Request

```
POST /api/auth/staff-dashboard/patientRegistration
```

Headers:
```
Authorization: Bearer <staff_token>
Content-Type: multipart/form-data
```

Form Data:
```
name: Patient Name
age: 30
gender: Male
address: 123 Hospital St
mobileNo: 1234567890
registrationDate: 2023-10-20 (optional)
prescriptionFront: [Image File]
prescriptionBack: [Image File] (optional)
```

### Response

```json
{
  "success": true,
  "data": {
    "name": "Patient Name",
    "age": 30,
    "gender": "Male",
    "address": "123 Hospital St",
    "mobileNo": "1234567890",
    "registrationDate": "2023-10-20T00:00:00.000Z",
    "prescriptionFrontUrl": "https://storage.googleapis.com/your-bucket/prescriptions/front/image.jpg",
    "prescriptionBackUrl": "https://storage.googleapis.com/your-bucket/prescriptions/back/image.jpg",
    "registeredBy": "staff_id",
    "_id": "patient_id",
    "createdAt": "2023-10-20T12:00:00.000Z",
    "updatedAt": "2023-10-20T12:00:00.000Z"
  }
}
```