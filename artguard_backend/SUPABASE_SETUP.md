# Supabase Integration Setup for ArtGuard

This document explains how to set up and use the enhanced Supabase integration in the ArtGuard backend.

## Prerequisites

1. A Supabase project with a `scan_history` table
2. Supabase URL and service role key
3. Python 3.8+ with required dependencies

## Environment Variables

Add the following environment variables to your `.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

## Enhanced Database Schema

Create a `scan_history` table in your Supabase database with the following structure:

```sql
-- Create the scan_history table with enhanced fields
CREATE TABLE scan_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    artwork_url TEXT NOT NULL,
    result JSONB NOT NULL,
    scan_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_size BIGINT DEFAULT 0,
    content_type TEXT DEFAULT '',
    upload_url TEXT DEFAULT '',
    public_id TEXT DEFAULT '',
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'uploaded',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_scan_history_user_id ON scan_history(user_id);
CREATE INDEX idx_scan_history_created_at ON scan_history(created_at DESC);
CREATE INDEX idx_scan_history_status ON scan_history(status);
CREATE INDEX idx_scan_history_scan_timestamp ON scan_history(scan_timestamp DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_scan_history_updated_at 
    BEFORE UPDATE ON scan_history 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Enable Row Level Security (RLS)
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- Optional: Create RLS policies (adjust based on your auth setup)
-- CREATE POLICY "Users can view their own scans" ON scan_history
--     FOR SELECT USING (auth.uid()::text = user_id);
-- 
-- CREATE POLICY "Users can insert their own scans" ON scan_history
--     FOR INSERT WITH CHECK (auth.uid()::text = user_id);
-- 
-- CREATE POLICY "Users can update their own scans" ON scan_history
--     FOR UPDATE USING (auth.uid()::text = user_id);
-- 
-- CREATE POLICY "Users can delete their own scans" ON scan_history
--     FOR DELETE USING (auth.uid()::text = user_id);
```

## API Endpoints

### 1. Upload Image with Enhanced Logging
- **URL**: `POST /api/upload/`
- **Description**: Uploads an image to Cloudinary and logs the scan to Supabase
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `image`: Image file (required)
  - `user_id`: User identifier (optional, defaults to 'anonymous')
  - `description`: Scan description (optional)

**Response Example**:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "artguard/...",
    "filename": "artwork.jpg",
    "user_id": "user123",
    "scan_id": "uuid-here",
    "supabase_logged": true
  }
}
```

### 2. Get Scan History with Pagination
- **URL**: `GET /api/scan-history/?user_id=<user_id>&limit=<limit>&offset=<offset>`
- **Description**: Retrieves scan history for a specific user with pagination
- **Parameters**:
  - `user_id`: User identifier (required)
  - `limit`: Maximum number of records (optional, default: 50, max: 100)
  - `offset`: Number of records to skip (optional, default: 0)

**Response Example**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total_count": 25
  }
}
```

### 3. Get Scan Analytics
- **URL**: `GET /api/analytics/?user_id=<user_id>&days=<days>`
- **Description**: Get analytics for a user's scan history
- **Parameters**:
  - `user_id`: User identifier (required)
  - `days`: Number of days to look back (optional, default: 30)

**Response Example**:
```json
{
  "success": true,
  "data": {
    "total_scans": 45,
    "total_file_size": 15728640,
    "average_file_size": 349525,
    "period_days": 30,
    "scans_per_day": 1.5
  }
}
```

### 4. Search Scan History
- **URL**: `GET /api/search/?user_id=<user_id>&query=<query>&limit=<limit>`
- **Description**: Search through a user's scan history
- **Parameters**:
  - `user_id`: User identifier (required)
  - `query`: Search query string (required)
  - `limit`: Maximum number of results (optional, default: 20)

**Response Example**:
```json
{
  "success": true,
  "data": [...],
  "query": "artwork",
  "result_count": 5
}
```

### 5. Get Scan by ID
- **URL**: `GET /api/scan/<scan_id>/?user_id=<user_id>`
- **Description**: Get a specific scan record by ID
- **Parameters**:
  - `scan_id`: UUID of the scan record (required, in URL path)
  - `user_id`: User identifier for ownership validation (optional)

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "user_id": "user123",
    "artwork_url": "https://...",
    "result": {...},
    "created_at": "2024-01-01T00:00:00Z",
    ...
  }
}
```

### 6. Update Scan Record
- **URL**: `PUT /api/scan/<scan_id>/update/`
- **Description**: Update a scan record with new information
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "scan_id": "uuid-here",
    "updates": {
      "description": "Updated description",
      "status": "processed"
    },
    "user_id": "user123"
  }
  ```

### 7. Delete Single Scan
- **URL**: `DELETE /api/delete-scan/?scan_id=<scan_id>&user_id=<user_id>`
- **Description**: Delete a specific scan record
- **Parameters**:
  - `scan_id`: UUID of the scan record to delete (required)
  - `user_id`: User identifier for ownership validation (optional)

### 8. Batch Delete Scans
- **URL**: `DELETE /api/batch-delete/`
- **Description**: Delete multiple scan records in a batch
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "scan_ids": ["uuid1", "uuid2", "uuid3"],
    "user_id": "user123"
  }
  ```

**Response Example**:
```json
{
  "success": true,
  "message": "Successfully deleted 3 scan records",
  "deleted_count": 3
}
```

### 9. Health Check
- **URL**: `GET /api/health/`
- **Description**: Simple health check endpoint

**Response Example**:
```json
{
  "status": "healthy",
  "message": "ArtGuard backend is running",
  "version": "1.0.0"
}
```

## Usage Examples

### Python Usage

```python
from scanner.utils.supabase_client import (
    log_scan_to_supabase, 
    get_user_scan_history, 
    get_scan_analytics,
    search_scans
)

# Log a scan with enhanced data
result = log_scan_to_supabase(
    user_id="user123",
    artwork_url="https://example.com/artwork.jpg",
    scan_data={
        "upload_url": "https://res.cloudinary.com/...",
        "public_id": "artguard/user123/artwork",
        "file_size": 1024000,
        "content_type": "image/jpeg",
        "description": "Mona Lisa scan",
        "status": "uploaded"
    }
)

# Get user's scan history with pagination
history = get_user_scan_history("user123", limit=20, offset=0)

# Get analytics
analytics = get_scan_analytics("user123", days=30)

# Search scans
results = search_scans("user123", "mona lisa", limit=10)
```

### JavaScript/TypeScript Usage

```javascript
// Upload image with enhanced logging
const formData = new FormData();
formData.append('image', imageFile);
formData.append('user_id', 'user123');
formData.append('description', 'Mona Lisa artwork scan');

const response = await fetch('/api/upload/', {
    method: 'POST',
    body: formData
});

// Get scan history with pagination
const historyResponse = await fetch('/api/scan-history/?user_id=user123&limit=20&offset=0');
const history = await historyResponse.json();

// Get analytics
const analyticsResponse = await fetch('/api/analytics/?user_id=user123&days=30');
const analytics = await analyticsResponse.json();

// Search scans
const searchResponse = await fetch('/api/search/?user_id=user123&query=mona&limit=10');
const searchResults = await searchResponse.json();

// Update scan record
const updateResponse = await fetch('/api/scan/uuid-here/update/', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        scan_id: 'uuid-here',
        updates: { description: 'Updated description' },
        user_id: 'user123'
    })
});

// Batch delete scans
const batchDeleteResponse = await fetch('/api/batch-delete/', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        scan_ids: ['uuid1', 'uuid2', 'uuid3'],
        user_id: 'user123'
    })
});
```

## Error Handling

The enhanced Supabase client includes comprehensive error handling:

- **Input Validation**: All functions validate required parameters
- **Logging**: Detailed logging for debugging and monitoring
- **Graceful Failures**: Functions return `None` on failure with logged errors
- **HTTP Status Codes**: API endpoints return appropriate HTTP status codes
- **Error Messages**: Descriptive error messages for different failure scenarios

## Security Features

1. **User Validation**: Optional user ID validation for ownership checks
2. **Input Sanitization**: All inputs are validated and sanitized
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **Row Level Security**: Optional RLS policies for additional security
5. **Service Key Protection**: Service role key is only used on the backend

## Performance Optimizations

1. **Database Indexes**: Optimized indexes for common query patterns
2. **Pagination**: Efficient pagination for large datasets
3. **Batch Operations**: Batch delete operations for better performance
4. **Connection Pooling**: Supabase client handles connection pooling
5. **Caching**: Consider implementing caching for frequently accessed data

## Monitoring and Logging

The enhanced integration includes:

- **Structured Logging**: All operations are logged with relevant context
- **Error Tracking**: Comprehensive error logging for debugging
- **Performance Metrics**: Track operation timing and success rates
- **Health Checks**: Built-in health check endpoint

## Troubleshooting

1. **Connection Issues**: 
   - Verify Supabase URL and service key
   - Check network connectivity
   - Ensure Supabase project is active

2. **Table Not Found**: 
   - Run the database schema creation script
   - Verify table name and structure
   - Check database permissions

3. **Permission Errors**: 
   - Verify service key has necessary permissions
   - Check RLS policies if enabled
   - Ensure user authentication is working

4. **Environment Variables**: 
   - Verify all required environment variables are set
   - Check for typos in variable names
   - Ensure variables are accessible to the application

5. **Performance Issues**: 
   - Check database indexes
   - Monitor query performance
   - Consider implementing caching
   - Review batch operation sizes

## Production Considerations

1. **Environment Variables**: Use secure environment variable management
2. **Logging**: Configure appropriate log levels for production
3. **Monitoring**: Set up monitoring and alerting for the API endpoints
4. **Backup**: Ensure regular database backups
5. **Security**: Implement proper authentication and authorization
6. **Rate Limiting**: Add rate limiting to prevent abuse
7. **Caching**: Implement caching for frequently accessed data 