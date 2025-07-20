from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .utils.storage import upload_image_to_cloudinary
from .utils.supabase_client import log_scan_to_supabase, get_user_scan_history, delete_scan_record
import json

# Create your views here.

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@csrf_exempt
def upload_image(request):
    """
    API endpoint to handle image uploads to Cloudinary
    
    Expected request:
    - POST with multipart/form-data
    - 'image' field containing the image file
    - 'user_id' field containing the user ID (optional, defaults to 'anonymous')
    
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
        
        return Response({
            'success': True,
            'message': 'Image uploaded successfully',
            'data': {
                'url': upload_result['url'],
                'public_id': upload_result['public_id'],
                'filename': upload_result['filename'],
                'user_id': user_id
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
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
        'message': 'ArtGuard backend is running'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_scan_history(request):
    """
    Get scan history for a specific user
    
    Expected request:
    - GET with query parameter 'user_id'
    - Optional query parameter 'limit' (default: 50)
    
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
        
        limit = int(request.GET.get('limit', 50))
        
        history = get_user_scan_history(user_id, limit)
        if history is None:
            return Response(
                {'error': 'Failed to retrieve scan history'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'success': True,
            'data': history.data
        }, status=status.HTTP_200_OK)
        
    except ValueError:
        return Response(
            {'error': 'Invalid limit parameter'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'Unexpected error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def delete_scan(request):
    """
    Delete a specific scan record
    
    Expected request:
    - DELETE with query parameter 'scan_id'
    
    Returns:
    - 200: Success with deletion confirmation
    - 400: Bad request (missing scan_id)
    - 500: Server error
    """
    try:
        scan_id = request.GET.get('scan_id')
        if not scan_id:
            return Response(
                {'error': 'scan_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = delete_scan_record(scan_id)
        if result is None:
            return Response(
                {'error': 'Failed to delete scan record'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'success': True,
            'message': 'Scan record deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Unexpected error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
