import os
import uuid
from django.conf import settings
import cloudinary
import cloudinary.uploader
from cloudinary.exceptions import Error as CloudinaryError


def upload_image_to_cloudinary(image_file, user_id):
    """
    Upload an image file to Cloudinary under user_uploads/<user_id>/<filename>
    
    Args:
        image_file: The image file to upload (Django InMemoryUploadedFile or TemporaryUploadedFile)
        user_id: The user ID to organize uploads
        
    Returns:
        dict: Contains 'url' (str) and 'public_id' (str) on success
        None: On failure
    """
    try:
        # Configure Cloudinary with settings
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET
        )
        
        # Generate a unique filename to avoid conflicts
        file_extension = os.path.splitext(image_file.name)[1]
        unique_filename = f"{uuid.uuid4().hex}{file_extension}"
        
        # Create the folder path: user_uploads/<user_id>/
        folder_path = f"user_uploads/{user_id}"
        
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(
            image_file,
            folder=folder_path,
            public_id=unique_filename,
            resource_type="image",
            overwrite=False,
            invalidate=True
        )
        
        return {
            'url': upload_result.get('secure_url'),
            'public_id': upload_result.get('public_id'),
            'filename': unique_filename
        }
        
    except CloudinaryError as e:
        print(f"Cloudinary upload error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error during upload: {e}")
        return None


def delete_image_from_cloudinary(public_id):
    """
    Delete an image from Cloudinary using its public_id
    
    Args:
        public_id: The public_id of the image to delete
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET
        )
        
        result = cloudinary.uploader.destroy(public_id)
        return result.get('result') == 'ok'
        
    except CloudinaryError as e:
        print(f"Cloudinary delete error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error during deletion: {e}")
        return False 