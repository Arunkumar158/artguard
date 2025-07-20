# Cloudinary Integration Test Guide

This guide helps you test the Cloudinary integration to ensure everything is working correctly.

## Prerequisites

1. Environment variables are configured (see `CLOUDINARY_INTEGRATION_SETUP.md`)
2. Backend server is running
3. Frontend development server is running
4. Supabase project is set up with `scan_history` table

## Test Steps

### 1. Test Frontend Upload and Scan

1. **Start the frontend**:
   ```bash
   npm run dev
   ```

2. **Navigate to the upload page** (usually `http://localhost:5173`)

3. **Upload an image**:
   - Click "Drop your artwork here or click to browse"
   - Select a test image (JPG, PNG, GIF, or WebP)
   - Click "Scan Artwork"

4. **Verify the process**:
   - You should see a loading state
   - After 2-3 seconds, you should see scan results
   - The toast should say "Scan complete. Image uploaded to Cloudinary."

5. **Check browser console** for any errors

### 2. Test Backend API Directly

1. **Start the backend**:
   ```bash
   cd artguard_backend
   python manage.py runserver
   ```

2. **Test the complete scan endpoint**:
   ```bash
   curl -X POST http://localhost:8000/api/complete-scan/ \
     -F "image=@test-image.jpg" \
     -F "user_id=test-user" \
     -F "description=Test scan from curl"
   ```

3. **Expected response**:
   ```json
   {
     "success": true,
     "message": "Scan completed successfully",
     "data": {
       "label": "Handmade",
       "confidence": 0.85,
       "cloudinary_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/artguard/user_uploads/test-user/abc123.jpg",
       "public_id": "artguard/user_uploads/test-user/abc123",
       "filename": "abc123.jpg",
       "user_id": "test-user",
       "scan_id": "uuid-here",
       "supabase_logged": true
     }
   }
   ```

### 3. Verify Cloudinary Upload

1. **Check your Cloudinary dashboard**:
   - Go to Media Library
   - Look for the uploaded image in the `artguard/user_uploads/test-user/` folder
   - Verify the image is accessible via the returned URL

2. **Test the Cloudinary URL**:
   - Copy the `cloudinary_url` from the API response
   - Open it in a browser to verify the image loads

### 4. Verify Supabase Logging

1. **Check your Supabase dashboard**:
   - Go to Table Editor
   - Select the `scan_history` table
   - Look for the new record with your test data

2. **Verify the record contains**:
   - `user_id`: "test-user"
   - `artwork_url`: The Cloudinary URL
   - `result.cloudinary_url`: The Cloudinary URL
   - `result.label`: The scan classification
   - `result.confidence`: The confidence score

### 5. Test Scan History Display

1. **Navigate to scan history page** (usually `/scan-history`)

2. **Verify the uploaded image appears**:
   - The image should be visible in the scan history grid
   - The classification label should be displayed
   - The confidence score should be shown

3. **Test image viewing**:
   - Click the "View" button on a scan record
   - The image should open in a new tab from Cloudinary

## Troubleshooting

### Common Issues and Solutions

#### 1. "Cloudinary configuration missing"
**Error**: `Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET environment variables.`

**Solution**:
- Check that your `.env` file exists in the project root
- Verify the environment variables are set correctly
- Restart the development server after changing environment variables

#### 2. "Upload preset not found"
**Error**: `Upload preset not found`

**Solution**:
- Check your Cloudinary dashboard for the upload preset name
- Ensure the preset is set to "Unsigned"
- Verify the preset name in your `.env` file matches exactly

#### 3. "Failed to upload to Cloudinary"
**Error**: `Failed to upload image to Cloudinary`

**Solution**:
- Check your Cloudinary credentials
- Verify your account has sufficient upload credits
- Check the file size (should be under 10MB)
- Verify the file type is supported

#### 4. "Failed to log to Supabase"
**Warning**: `Failed to log to scan history`

**Solution**:
- Check your Supabase credentials
- Verify the `scan_history` table exists
- Check the table schema matches the expected structure

#### 5. Images not displaying in scan history
**Issue**: Images show as broken or placeholder

**Solution**:
- Check that the Cloudinary URL is being stored correctly
- Verify the URL is accessible in a browser
- Check for CORS issues if testing locally

## Performance Testing

### Test with Different File Types
- JPG files (various sizes)
- PNG files (with transparency)
- GIF files
- WebP files

### Test with Different File Sizes
- Small files (< 1MB)
- Medium files (1-5MB)
- Large files (5-10MB)
- Files over 10MB (should be rejected)

### Test Concurrent Uploads
- Upload multiple images simultaneously
- Verify all uploads complete successfully
- Check that scan history shows all uploads

## Security Testing

### Test File Validation
- Try uploading non-image files (should be rejected)
- Try uploading files over 10MB (should be rejected)
- Verify error messages are user-friendly

### Test User Isolation
- Upload images with different user IDs
- Verify users can only see their own scan history
- Test that scan records are properly associated with users

## Success Criteria

The integration is working correctly if:

1. ✅ Images upload to Cloudinary successfully
2. ✅ Scan results are generated and returned
3. ✅ Scan records are logged to Supabase with Cloudinary URLs
4. ✅ Images display correctly in scan history
5. ✅ Error handling works for invalid files
6. ✅ User feedback is clear and helpful
7. ✅ Performance is acceptable (uploads complete within 10 seconds)

## Next Steps

Once testing is complete:

1. **Production Deployment**: Follow the deployment guide in `CLOUDINARY_INTEGRATION_SETUP.md`
2. **Monitoring**: Set up monitoring for upload success rates
3. **Optimization**: Consider implementing image optimization and compression
4. **Security**: Implement proper user authentication and authorization
5. **Backup**: Ensure Cloudinary and Supabase backups are configured 