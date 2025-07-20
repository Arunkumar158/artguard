// Cloudinary upload utility for frontend
export interface CloudinaryUploadResponse {
  success: boolean;
  url?: string;
  public_id?: string;
  error?: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

/**
 * Upload image to Cloudinary using unsigned upload
 * @param file - The image file to upload
 * @param config - Cloudinary configuration
 * @returns Promise with upload result
 */
export async function uploadToCloudinary(
  file: File,
  config: CloudinaryConfig
): Promise<CloudinaryUploadResponse> {
  try {
    // Validate file
    if (!file || !file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Invalid file type. Please select an image file.'
      };
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size too large. Maximum size is 10MB.'
      };
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error?.message || `Upload failed: ${response.statusText}`
      };
    }

    const data = await response.json();

    return {
      success: true,
      url: data.secure_url,
      public_id: data.public_id
    };

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Get Cloudinary configuration from environment variables
 */
export function getCloudinaryConfig(): CloudinaryConfig {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET environment variables.'
    );
  }

  return {
    cloudName,
    uploadPreset
  };
}

/**
 * Delete image from Cloudinary (requires signed upload or admin API)
 * Note: This requires server-side implementation for security
 */
export async function deleteFromCloudinary(
  publicId: string,
  config: CloudinaryConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    // This would typically be done server-side for security
    // For now, we'll return an error indicating server-side implementation is needed
    return {
      success: false,
      error: 'Image deletion requires server-side implementation for security.'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    };
  }
} 