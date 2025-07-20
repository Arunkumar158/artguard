# Cloudinary Integration Setup Guide

This guide explains how to set up the Cloudinary integration for the ArtGuard application, including environment variables and configuration.

## Prerequisites

1. A Cloudinary account (sign up at https://cloudinary.com/)
2. Your Cloudinary credentials from the dashboard
3. A Supabase project with the `scan_history` table

## Environment Variables Setup

### Frontend (.env file)

Create a `.env` file in the root directory of your project with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Supabase Configuration (if needed for frontend)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Backend (.env file)

Create a `.env` file in the `artguard_backend/` directory with the following variables:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

## Cloudinary Setup Steps

### 1. Get Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret

### 2. Create Upload Preset

1. In your Cloudinary dashboard, go to Settings > Upload
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Set the following:
   - **Preset name**: `artguard_uploads` (or your preferred name)
   - **Signing Mode**: `Unsigned`
   - **Folder**: `artguard/user_uploads`
   - **Access Mode**: `Public`
5. Save the preset

### 3. Update Environment Variables

Replace the placeholder values in your `.env` files with your actual credentials:

**Frontend (.env):**
```env
VITE_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=artguard_uploads
```

**Backend (.env):**
```env
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

## How It Works

### Scan Process Flow

1. **User uploads image** → Frontend validates file
2. **Backend receives image** → Uploads to Cloudinary
3. **ML model processes image** → Generates classification
4. **Results logged to Supabase** → Includes Cloudinary URL
5. **Frontend displays results** → Shows image from Cloudinary

### API Endpoints

#### Complete Scan Process
- **URL**: `POST /api/complete-scan/`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `image`: Image file (required)
  - `user_id`: User ID (optional, defaults to 'anonymous')
  - `description`: Scan description (optional)

**Response Example**:
```json
{
  "success": true,
  "message": "Scan completed successfully",
  "data": {
    "label": "Handmade",
    "confidence": 0.85,
    "cloudinary_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/artguard/user_uploads/abc123.jpg",
    "public_id": "artguard/user_uploads/abc123",
    "filename": "abc123.jpg",
    "user_id": "user123",
    "scan_id": "uuid-here",
    "supabase_logged": true
  }
}
```

#### Upload Image (Legacy)
- **URL**: `POST /api/upload/`
- **Description**: Uploads image to Cloudinary only

## File Organization

Images are uploaded to Cloudinary under the folder structure:
```
artguard/
└── user_uploads/
    └── {user_id}/
        └── {unique_filename}
```

## Error Handling

The integration includes comprehensive error handling:

- **File validation**: Type and size checks
- **Upload failures**: Graceful fallback with user feedback
- **Network errors**: Retry mechanisms and user notifications
- **Supabase logging failures**: Non-blocking with warnings

## Security Considerations

1. **Upload Preset**: Use unsigned uploads for frontend uploads
2. **API Keys**: Keep backend API keys secure and never expose in frontend
3. **File Validation**: Validate file types and sizes on both frontend and backend
4. **User Authentication**: Implement proper user authentication for production

## Testing the Integration

### 1. Test Frontend Upload
```bash
# Start the frontend
npm run dev

# Navigate to the upload page and test image upload
```

### 2. Test Backend API
```bash
# Start the backend
cd artguard_backend
python manage.py runserver

# Test the complete scan endpoint
curl -X POST http://localhost:8000/api/complete-scan/ \
  -F "image=@test-image.jpg" \
  -F "user_id=test-user" \
  -F "description=Test scan"
```

### 3. Verify Supabase Logging
Check your Supabase dashboard to ensure scan records are being created with Cloudinary URLs.

## Troubleshooting

### Common Issues

1. **"Cloudinary configuration missing"**
   - Ensure all environment variables are set correctly
   - Check that the `.env` file is in the correct location

2. **"Upload preset not found"**
   - Verify the upload preset name in your Cloudinary dashboard
   - Ensure the preset is set to "Unsigned"

3. **"Failed to upload to Cloudinary"**
   - Check your Cloudinary credentials
   - Verify your account has sufficient upload credits

4. **"Failed to log to Supabase"**
   - Check your Supabase credentials
   - Verify the `scan_history` table exists with correct schema

### Debug Mode

Enable debug logging by setting `DEBUG=True` in your backend `.env` file.

## Production Deployment

For production deployment:

1. **Environment Variables**: Use your hosting platform's environment variable system
2. **CORS**: Configure CORS to allow only your frontend domain
3. **Rate Limiting**: Implement rate limiting for upload endpoints
4. **Monitoring**: Set up monitoring for upload success rates and errors
5. **Backup**: Ensure Cloudinary and Supabase backups are configured

## Support

If you encounter issues:

1. Check the browser console for frontend errors
2. Check the Django logs for backend errors
3. Verify all environment variables are set correctly
4. Test with a simple image file first
5. Check Cloudinary and Supabase dashboards for any service issues 