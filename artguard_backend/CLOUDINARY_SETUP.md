# Cloudinary Setup Guide

## Prerequisites
1. A Cloudinary account (sign up at https://cloudinary.com/)
2. Your Cloudinary credentials from the dashboard

## Configuration Steps

### 1. Create .env file
Create a `.env` file in the `artguard_backend/` directory with the following content:

```
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Get Cloudinary Credentials
1. Log in to your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret

### 3. Update .env file
Replace the placeholder values in your `.env` file with your actual Cloudinary credentials.

## API Endpoints

### Upload Image
- **URL**: `POST /api/upload/`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `image`: The image file to upload
  - `user_id`: (optional) User ID for organizing uploads (defaults to 'anonymous')

**Example Response**:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/user_uploads/user123/abc123.jpg",
    "public_id": "user_uploads/user123/abc123",
    "filename": "abc123.jpg",
    "user_id": "user123"
  }
}
```

### Health Check
- **URL**: `GET /api/health/`
- **Response**: Simple health status

## File Organization
Images are uploaded to Cloudinary under the folder structure:
`user_uploads/<user_id>/<unique_filename>`

## Supported File Types
- JPEG/JPG
- PNG
- GIF
- WebP

## File Size Limit
Maximum file size: 10MB

## Error Handling
The API returns appropriate HTTP status codes:
- 200: Success
- 400: Bad request (missing file, invalid type, file too large)
- 500: Server error (upload failure) 