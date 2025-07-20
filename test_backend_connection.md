# Backend Connection Test Guide

This guide helps you diagnose and fix the "Failed to fetch" error in the ArtGuard application.

## Quick Diagnosis

### 1. Check if Backend is Running

First, ensure your Django backend is running:

```bash
cd artguard_backend
python manage.py runserver
```

You should see output like:
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
Month Day, Year - HH:MM:SS
Django version X.X.X, using settings 'artguard_backend.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### 2. Test Backend Health Endpoint

Open your browser and navigate to:
```
http://localhost:8000/api/health/
```

You should see a JSON response like:
```json
{
  "status": "healthy",
  "message": "ArtGuard backend is running",
  "version": "1.0.0"
}
```

### 3. Check Frontend Environment Variables

Ensure your frontend `.env` file contains:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Common Issues and Solutions

### Issue 1: Backend Not Running
**Symptoms**: "Failed to fetch" error, backend health check fails

**Solution**:
1. Start the Django server:
   ```bash
   cd artguard_backend
   python manage.py runserver
   ```
2. Verify it's running on http://localhost:8000
3. Test the health endpoint in your browser

### Issue 2: Wrong API URL
**Symptoms**: Network errors, 404 responses

**Solution**:
1. Check your `.env` file has the correct API URL
2. Ensure the URL ends with `/api`
3. Restart your frontend development server after changing environment variables

### Issue 3: CORS Issues
**Symptoms**: CORS errors in browser console

**Solution**:
1. Check that CORS is properly configured in Django settings
2. Ensure the frontend origin is allowed
3. Verify the backend is accepting requests from the frontend domain

### Issue 4: Port Conflicts
**Symptoms**: "Address already in use" error

**Solution**:
1. Check if port 8000 is already in use:
   ```bash
   # On Windows
   netstat -ano | findstr :8000
   
   # On Mac/Linux
   lsof -i :8000
   ```
2. Kill the process using the port or use a different port:
   ```bash
   python manage.py runserver 8001
   ```
3. Update your frontend `.env` file accordingly

## Debug Steps

### Step 1: Enable Browser Developer Tools
1. Open your browser's developer tools (F12)
2. Go to the Console tab
3. Look for error messages and debug information

### Step 2: Check Network Tab
1. In developer tools, go to the Network tab
2. Try to upload an image
3. Look for failed requests and their details

### Step 3: Use Debug Console
The application automatically logs debug information in development mode. Look for:
- 🔍 Debug Information
- 🔧 API Connectivity Troubleshooting
- 📡 API URL
- 🏥 Backend Health status

### Step 4: Manual API Testing
Test the API endpoints manually:

```bash
# Test health endpoint
curl http://localhost:8000/api/health/

# Test complete scan endpoint (replace with actual image path)
curl -X POST http://localhost:8000/api/complete-scan/ \
  -F "image=@test-image.jpg" \
  -F "user_id=test-user" \
  -F "description=Test scan"
```

## Environment Setup Checklist

### Backend Setup
- [ ] Django server is running on http://localhost:8000
- [ ] Health endpoint responds correctly
- [ ] CORS is configured properly
- [ ] All required environment variables are set

### Frontend Setup
- [ ] `.env` file exists in project root
- [ ] `VITE_API_BASE_URL` is set correctly
- [ ] Development server is running
- [ ] No console errors on page load

### Dependencies
- [ ] All Python dependencies are installed
- [ ] All Node.js dependencies are installed
- [ ] No version conflicts

## Testing the Fix

After making changes:

1. **Restart both servers**:
   ```bash
   # Backend
   cd artguard_backend
   python manage.py runserver
   
   # Frontend (in another terminal)
   npm run dev
   ```

2. **Clear browser cache** and refresh the page

3. **Test the upload functionality**:
   - Upload an image
   - Check for successful scan completion
   - Verify scan history shows the uploaded image

4. **Check console logs** for any remaining errors

## Getting Help

If you're still experiencing issues:

1. **Check the console logs** for detailed error messages
2. **Verify all environment variables** are set correctly
3. **Test the backend API directly** using curl or Postman
4. **Check the Django logs** for server-side errors
5. **Ensure all dependencies** are up to date

## Common Error Messages

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Failed to fetch" | Backend not running | Start Django server |
| "Network error" | Wrong API URL | Check VITE_API_BASE_URL |
| "CORS error" | CORS not configured | Configure CORS in Django |
| "404 Not Found" | Wrong endpoint | Check API URL and routes |
| "500 Internal Server Error" | Backend error | Check Django logs |

## Success Indicators

The integration is working correctly when:

- ✅ Backend health check passes
- ✅ Image upload completes successfully
- ✅ Scan results are returned
- ✅ Scan history shows uploaded images
- ✅ No console errors
- ✅ No network errors in browser dev tools 