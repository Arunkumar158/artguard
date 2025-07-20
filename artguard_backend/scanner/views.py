import logging
from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .utils.storage import upload_image_to_cloudinary
from .utils.supabase_client import (
    log_scan_to_supabase, 
    get_user_scan_history, 
    delete_scan_record,
    get_scan_analytics,
    batch_delete_scans,
    search_scans,
    update_scan_record,
    get_scan_by_id
)
import json

# Configure logging
logger = logging.getLogger(__name__)

# Create your views here.

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@csrf_exempt
def upload_image(request):
    """
    API endpoint to handle image uploads to Cloudinary with Supabase logging
    
    Expected request:
    - POST with multipart/form-data
    - 'image' field containing the image file
    - 'user_id' field containing the user ID (optional, defaults to 'anonymous')
    - 'description' field containing scan description (optional)
    
    Returns:
    - 200: Success with image URL and metadata
    - 400: Bad request (missing image or invalid data)
    - 500: Server error during upload
    """
    try:
        # Check if image file is present
        if 'image' not in request.FILES:
            return Response(
                {'error': 'No image file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        image_file = request.FILES['image']
        user_id = request.data.get('user_id', 'anonymous')
        description = request.data.get('description', '')
        
        # Validate file type (basic check)
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if image_file.content_type not in allowed_types:
            return Response(
                {'error': 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size (max 10MB)
        if image_file.size > 10 * 1024 * 1024:  # 10MB in bytes
            return Response(
                {'error': 'File size too large. Maximum size is 10MB'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Upload to Cloudinary
        upload_result = upload_image_to_cloudinary(image_file, user_id)
        
        if upload_result is None:
            return Response(
                {'error': 'Failed to upload image to Cloudinary'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Prepare scan data for Supabase
        scan_data = {
            'upload_url': upload_result['url'],
            'public_id': upload_result['public_id'],
            'filename': upload_result['filename'],
            'upload_timestamp': upload_result.get('created_at'),
            'file_size': image_file.size,
            'content_type': image_file.content_type,
            'description': description,
            'status': 'uploaded'
        }
        
        # Log the upload to Supabase
        supabase_log = log_scan_to_supabase(user_id, upload_result['url'], scan_data)
        
        response_data = {
            'success': True,
            'message': 'Image uploaded successfully',
            'data': {
                'url': upload_result['url'],
                'public_id': upload_result['public_id'],
                'filename': upload_result['filename'],
                'user_id': user_id,
                'scan_id': supabase_log.get('id') if supabase_log else None
            }
        }
        
        # Add Supabase logging status to response
        if supabase_log:
            response_data['data']['supabase_logged'] = True
            response_data['data']['scan_id'] = supabase_log.get('id')
        else:
            response_data['data']['supabase_logged'] = False
            response_data['warning'] = 'Failed to log to scan history'
        
        logger.info(f"Successfully uploaded image for user {user_id}")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in upload_image: {e}")
        return Response(
            {'error': f'Unexpected error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@csrf_exempt
def complete_scan(request):
    """
    Complete scan process: Upload to Cloudinary, scan artwork, and log to Supabase
    
    Expected request:
    - POST with multipart/form-data
    - 'image' field containing the image file
    - 'user_id' field containing the user ID (optional, defaults to 'anonymous')
    - 'description' field containing scan description (optional)
    
    Returns:
    - 200: Success with scan results and Cloudinary URL
    - 400: Bad request (missing image or invalid data)
    - 500: Server error during processing
    """
    try:
        # Check if image file is present
        if 'image' not in request.FILES:
            return Response(
                {'error': 'No image file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        image_file = request.FILES['image']
        user_id = request.data.get('user_id', 'anonymous')
        description = request.data.get('description', '')
        
        # Validate file type (basic check)
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if image_file.content_type not in allowed_types:
            return Response(
                {'error': 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size (max 10MB)
        if image_file.size > 10 * 1024 * 1024:  # 10MB in bytes
            return Response(
                {'error': 'File size too large. Maximum size is 10MB'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Step 1: Upload to Cloudinary
        upload_result = upload_image_to_cloudinary(image_file, user_id)
        
        if upload_result is None:
            return Response(
                {'error': 'Failed to upload image to Cloudinary'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Step 2: Perform ML scan (mock for now, replace with actual ML inference)
        # In production, this would call your ML model
        import random
        labels = ["Handmade", "AI-Generated", "Digital"]
        scan_result = {
            'label': random.choice(labels),
            'confidence': round(0.7 + random.random() * 0.29, 2)  # Between 0.7 and 0.99
        }
        
        # Step 3: Prepare scan data for Supabase
        scan_data = {
            'upload_url': upload_result['url'],
            'public_id': upload_result['public_id'],
            'filename': upload_result['filename'],
            'file_size': image_file.size,
            'content_type': image_file.content_type,
            'description': description,
            'status': 'completed',
            'label': scan_result['label'],
            'confidence': scan_result['confidence'],
            'cloudinary_url': upload_result['url']
        }
        
        # Step 4: Log the complete scan to Supabase
        supabase_log = log_scan_to_supabase(user_id, upload_result['url'], scan_data)
        
        response_data = {
            'success': True,
            'message': 'Scan completed successfully',
            'data': {
                'label': scan_result['label'],
                'confidence': scan_result['confidence'],
                'cloudinary_url': upload_result['url'],
                'public_id': upload_result['public_id'],
                'filename': upload_result['filename'],
                'user_id': user_id,
                'scan_id': supabase_log.get('id') if supabase_log else None,
                'supabase_logged': bool(supabase_log)
            }
        }
        
        if not supabase_log:
            response_data['warning'] = 'Failed to log to scan history'
        
        logger.info(f"Successfully completed scan for user {user_id}")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in complete_scan: {e}")
        return Response(
            {'error': f'Unexpected error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def health_check(request):
    """
    Simple health check endpoint
    """
    return Response({
        'status': 'healthy',
        'message': 'ArtGuard backend is running',
        'version': '1.0.0'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_scan_history(request):
    """
    Get scan history for a specific user with pagination
    
    Expected request:
    - GET with query parameter 'user_id'
    - Optional query parameter 'limit' (default: 50, max: 100)
    - Optional query parameter 'offset' (default: 0)
    
    Returns:
    - 200: Success with scan history data
    - 400: Bad request (missing user_id)
    - 500: Server error
    """
    try:
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            limit = int(request.GET.get('limit', 50))
            offset = int(request.GET.get('offset', 0))
        except ValueError:
            return Response(
                {'error': 'Invalid limit or offset parameter'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        history = get_user_scan_history(user_id, limit, offset)
        if history is None:
            return Response(
                {'error': 'Failed to retrieve scan history'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'success': True,
            'data': history.data,
            'pagination': {
                'limit': limit,
                'offset': offset,
                'total_count': len(history.data)
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in get_scan_history: {e}")
        return Response(
            {'error': f'Unexpected error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def delete_scan(request):
    """
    Delete a specific scan record with optional user validation
    
    Expected request:
    - DELETE with query parameter 'scan_id'
    - Optional query parameter 'user_id' for ownership validation
    
    Returns:
    - 200: Success with deletion confirmation
    - 400: Bad request (missing scan_id)
    - 404: Scan not found
    - 500: Server error
    """
    try:
        scan_id = request.GET.get('scan_id')
        user_id = request.GET.get('user_id')
        
        if not scan_id:
            return Response(
                {'error': 'scan_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = delete_scan_record(scan_id, user_id)
        if result is None:
            return Response(
                {'error': 'Scan record not found or access denied'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response({
            'success': True,
            'message': 'Scan record deleted successfully',
            'deleted_id': scan_id
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in delete_scan: {e}")
        return Response(
            {'error': f'Unexpected error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_scan_analytics(request):
    """
    Get analytics for a user's scan history
    
    Expected request:
    - GET with query parameter 'user_id'
    - Optional query parameter 'days' (default: 30)
    
    Returns:
    - 200: Success with analytics data
    - 400: Bad request (missing user_id)
    - 500: Server error
    """
    try:
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            days = int(request.GET.get('days', 30))
        except ValueError:
            return Response(
                {'error': 'Invalid days parameter'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        analytics = get_scan_analytics(user_id, days)
        if analytics is None:
            return Response(
                {'error': 'Failed to retrieve analytics'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'success': True,
            'data': analytics
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in get_scan_analytics: {e}")
        return Response(
            {'error': f'Unexpected error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def batch_delete_scans(request):
    """
    Delete multiple scan records in a batch
    
    Expected request:
    - DELETE with JSON body containing 'scan_ids' array
    - Optional 'user_id' for ownership validation
    
    Returns:
    - 200: Success with deletion confirmation
    - 400: Bad request (missing scan_ids)
    - 500: Server error
    """
    try:
        data = json.loads(request.body) if request.body else {}
        scan_ids = data.get('scan_ids', [])
        user_id = data.get('user_id')
        
        if not scan_ids:
            return Response(
                {'error': 'scan_ids array is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not isinstance(scan_ids, list):
            return Response(
                {'error': 'scan_ids must be an array'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = batch_delete_scans(scan_ids, user_id)
        if result is None:
            return Response(
                {'error': 'Failed to delete scan records'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'success': True,
            'message': f'Successfully deleted {result["deleted_count"]} scan records',
            'deleted_count': result['deleted_count']
        }, status=status.HTTP_200_OK)
        
    except json.JSONDecodeError:
        return Response(
            {'error': 'Invalid JSON in request body'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Error in batch_delete_scans: {e}")
        return Response(
            {'error': f'Unexpected error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def search_scan_history(request):
    """
    Search through a user's scan history
    
    Expected request:
    - GET with query parameters 'user_id' and 'query'
    - Optional query parameter 'limit' (default: 20)
    
    Returns:
    - 200: Success with search results
    - 400: Bad request (missing parameters)
    - 500: Server error
    """
    try:
        user_id = request.GET.get('user_id')
        query = request.GET.get('query')
        
        if not user_id or not query:
            return Response(
                {'error': 'user_id and query parameters are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            limit = int(request.GET.get('limit', 20))
        except ValueError:
            return Response(
                {'error': 'Invalid limit parameter'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        results = search_scans(user_id, query, limit)
        if results is None:
            return Response(
                {'error': 'Failed to search scan history'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'success': True,
            'data': results.data,
            'query': query,
            'result_count': len(results.data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in search_scan_history: {e}")
        return Response(
            {'error': f'Unexpected error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
def update_scan(request):
    """
    Update a scan record with new information
    
    Expected request:
    - PUT with JSON body containing 'scan_id' and 'updates'
    - Optional 'user_id' for ownership validation
    
    Returns:
    - 200: Success with updated record
    - 400: Bad request (missing parameters)
    - 404: Scan not found
    - 500: Server error
    """
    try:
        data = json.loads(request.body) if request.body else {}
        scan_id = data.get('scan_id')
        updates = data.get('updates', {})
        user_id = data.get('user_id')
        
        if not scan_id or not updates:
            return Response(
                {'error': 'scan_id and updates are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not isinstance(updates, dict):
            return Response(
                {'error': 'updates must be an object'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = update_scan_record(scan_id, updates, user_id)
        if result is None:
            return Response(
                {'error': 'Scan record not found or access denied'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response({
            'success': True,
            'message': 'Scan record updated successfully',
            'data': result
        }, status=status.HTTP_200_OK)
        
    except json.JSONDecodeError:
        return Response(
            {'error': 'Invalid JSON in request body'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Error in update_scan: {e}")
        return Response(
            {'error': f'Unexpected error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_scan_by_id(request):
    """
    Get a specific scan record by ID
    
    Expected request:
    - GET with query parameter 'scan_id'
    - Optional query parameter 'user_id' for ownership validation
    
    Returns:
    - 200: Success with scan record
    - 400: Bad request (missing scan_id)
    - 404: Scan not found
    - 500: Server error
    """
    try:
        scan_id = request.GET.get('scan_id')
        user_id = request.GET.get('user_id')
        
        if not scan_id:
            return Response(
                {'error': 'scan_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = get_scan_by_id(scan_id, user_id)
        if result is None:
            return Response(
                {'error': 'Scan record not found or access denied'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response({
            'success': True,
            'data': result
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in get_scan_by_id: {e}")
        return Response(
            {'error': f'Unexpected error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
