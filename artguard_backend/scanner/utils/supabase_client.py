import logging
from typing import Optional, Dict, List, Any
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
import os
from django.conf import settings
from datetime import datetime, timezone
import json

# Configure logging
logger = logging.getLogger(__name__)

# Get Supabase credentials from environment variables or Django settings
SUPABASE_URL = getattr(settings, 'SUPABASE_URL', os.getenv("SUPABASE_URL"))
SUPABASE_KEY = getattr(settings, 'SUPABASE_SERVICE_KEY', os.getenv("SUPABASE_SERVICE_KEY"))

# Validate required configuration
if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY")
    raise ValueError("Supabase configuration is required")

# Initialize Supabase client with options
client_options = ClientOptions(
    schema='public',
    headers={
        'X-Client-Info': 'artguard-backend/1.0.0'
    }
)

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY, options=client_options)
    logger.info("Supabase client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {e}")
    raise

class SupabaseError(Exception):
    """Custom exception for Supabase operations"""
    pass

def log_scan_to_supabase(user_id: str, artwork_url: str, scan_data: Dict[str, Any]) -> Optional[Dict]:
    """
    Log scan results to Supabase scan_history table with enhanced error handling
    
    Args:
        user_id: The user ID who performed the scan
        artwork_url: The URL of the scanned artwork
        scan_data: Dictionary containing scan results and metadata
        
    Returns:
        dict: Supabase response on success
        None: On failure
    """
    try:
        # Validate inputs
        if not user_id or not artwork_url:
            logger.error("user_id and artwork_url are required")
            return None
        
        # Prepare the data with additional metadata
        scan_record = {
            "user_id": user_id,
            "artwork_url": artwork_url,
            "result": scan_data,
            "scan_timestamp": datetime.now(timezone.utc).isoformat(),
            "file_size": scan_data.get('file_size', 0),
            "content_type": scan_data.get('content_type', ''),
            "upload_url": scan_data.get('upload_url', ''),
            "public_id": scan_data.get('public_id', '')
        }
        
        # Insert the record
        response = supabase.table("scan_history").insert(scan_record).execute()
        
        if response.data:
            logger.info(f"Successfully logged scan for user {user_id}")
            return response.data[0] if response.data else response
        else:
            logger.error("No data returned from Supabase insert")
            return None
            
    except Exception as e:
        logger.error(f"Error logging scan to Supabase: {e}")
        return None

def get_user_scan_history(user_id: str, limit: int = 50, offset: int = 0) -> Optional[Dict]:
    """
    Retrieve scan history for a specific user with pagination
    
    Args:
        user_id: The user ID to get history for
        limit: Maximum number of records to return (default: 50, max: 100)
        offset: Number of records to skip for pagination (default: 0)
        
    Returns:
        dict: Supabase response with scan history
        None: On failure
    """
    try:
        # Validate inputs
        if not user_id:
            logger.error("user_id is required")
            return None
        
        # Limit the maximum number of records
        limit = min(limit, 100)
        
        response = supabase.table("scan_history")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .range(offset, offset + limit - 1)\
            .execute()
        
        if response.data is not None:
            logger.info(f"Retrieved {len(response.data)} scan records for user {user_id}")
            return response
        else:
            logger.error("No data returned from Supabase query")
            return None
            
    except Exception as e:
        logger.error(f"Error retrieving scan history from Supabase: {e}")
        return None

def delete_scan_record(scan_id: str, user_id: str = None) -> Optional[Dict]:
    """
    Delete a specific scan record from Supabase with optional user validation
    
    Args:
        scan_id: The ID of the scan record to delete
        user_id: Optional user ID to validate ownership before deletion
        
    Returns:
        dict: Supabase response on success
        None: On failure
    """
    try:
        if not scan_id:
            logger.error("scan_id is required")
            return None
        
        # Build the query
        query = supabase.table("scan_history").delete()
        
        # If user_id is provided, ensure the user owns the record
        if user_id:
            query = query.eq("id", scan_id).eq("user_id", user_id)
        else:
            query = query.eq("id", scan_id)
        
        response = query.execute()
        
        if response.data:
            logger.info(f"Successfully deleted scan record {scan_id}")
            return response
        else:
            logger.warning(f"No scan record found with id {scan_id}")
            return None
            
    except Exception as e:
        logger.error(f"Error deleting scan record from Supabase: {e}")
        return None

def get_scan_analytics(user_id: str, days: int = 30) -> Optional[Dict]:
    """
    Get analytics for a user's scan history
    
    Args:
        user_id: The user ID to get analytics for
        days: Number of days to look back (default: 30)
        
    Returns:
        dict: Analytics data including total scans, file sizes, etc.
        None: On failure
    """
    try:
        if not user_id:
            logger.error("user_id is required")
            return None
        
        # Get scans from the last N days
        from datetime import timedelta
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        response = supabase.table("scan_history")\
            .select("*")\
            .eq("user_id", user_id)\
            .gte("created_at", cutoff_date.isoformat())\
            .execute()
        
        if response.data:
            scans = response.data
            total_scans = len(scans)
            total_size = sum(scan.get('file_size', 0) for scan in scans)
            avg_size = total_size / total_scans if total_scans > 0 else 0
            
            analytics = {
                "total_scans": total_scans,
                "total_file_size": total_size,
                "average_file_size": avg_size,
                "period_days": days,
                "scans_per_day": total_scans / days if days > 0 else 0
            }
            
            logger.info(f"Generated analytics for user {user_id}: {total_scans} scans")
            return analytics
        else:
            return {"total_scans": 0, "total_file_size": 0, "average_file_size": 0, "period_days": days, "scans_per_day": 0}
            
    except Exception as e:
        logger.error(f"Error getting scan analytics from Supabase: {e}")
        return None

def batch_delete_scans(scan_ids: List[str], user_id: str = None) -> Optional[Dict]:
    """
    Delete multiple scan records in a batch
    
    Args:
        scan_ids: List of scan IDs to delete
        user_id: Optional user ID to validate ownership before deletion
        
    Returns:
        dict: Supabase response on success
        None: On failure
    """
    try:
        if not scan_ids:
            logger.error("scan_ids list is required")
            return None
        
        # Limit batch size to prevent performance issues
        if len(scan_ids) > 100:
            logger.warning("Batch size limited to 100 records")
            scan_ids = scan_ids[:100]
        
        # Build the query
        query = supabase.table("scan_history").delete()
        
        # If user_id is provided, ensure the user owns the records
        if user_id:
            query = query.in_("id", scan_ids).eq("user_id", user_id)
        else:
            query = query.in_("id", scan_ids)
        
        response = query.execute()
        
        if response.data:
            deleted_count = len(response.data)
            logger.info(f"Successfully deleted {deleted_count} scan records")
            return {"deleted_count": deleted_count, "data": response.data}
        else:
            logger.warning("No scan records found for deletion")
            return {"deleted_count": 0, "data": []}
            
    except Exception as e:
        logger.error(f"Error batch deleting scan records from Supabase: {e}")
        return None

def search_scans(user_id: str, query: str, limit: int = 20) -> Optional[Dict]:
    """
    Search through a user's scan history
    
    Args:
        user_id: The user ID to search for
        query: Search query string
        limit: Maximum number of results (default: 20)
        
    Returns:
        dict: Supabase response with matching scan records
        None: On failure
    """
    try:
        if not user_id or not query:
            logger.error("user_id and query are required")
            return None
        
        # Use full-text search if available, otherwise filter by URL
        response = supabase.table("scan_history")\
            .select("*")\
            .eq("user_id", user_id)\
            .ilike("artwork_url", f"%{query}%")\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        
        if response.data is not None:
            logger.info(f"Found {len(response.data)} scan records matching '{query}' for user {user_id}")
            return response
        else:
            logger.error("No data returned from Supabase search")
            return None
            
    except Exception as e:
        logger.error(f"Error searching scan history in Supabase: {e}")
        return None

def update_scan_record(scan_id: str, updates: Dict[str, Any], user_id: str = None) -> Optional[Dict]:
    """
    Update a scan record with new information
    
    Args:
        scan_id: The ID of the scan record to update
        updates: Dictionary of fields to update
        user_id: Optional user ID to validate ownership before update
        
    Returns:
        dict: Supabase response on success
        None: On failure
    """
    try:
        if not scan_id or not updates:
            logger.error("scan_id and updates are required")
            return None
        
        # Build the query
        query = supabase.table("scan_history").update(updates)
        
        # If user_id is provided, ensure the user owns the record
        if user_id:
            query = query.eq("id", scan_id).eq("user_id", user_id)
        else:
            query = query.eq("id", scan_id)
        
        response = query.execute()
        
        if response.data:
            logger.info(f"Successfully updated scan record {scan_id}")
            return response.data[0] if response.data else response
        else:
            logger.warning(f"No scan record found with id {scan_id}")
            return None
            
    except Exception as e:
        logger.error(f"Error updating scan record in Supabase: {e}")
        return None

def get_scan_by_id(scan_id: str, user_id: str = None) -> Optional[Dict]:
    """
    Get a specific scan record by ID
    
    Args:
        scan_id: The ID of the scan record to retrieve
        user_id: Optional user ID to validate ownership
        
    Returns:
        dict: Scan record data
        None: On failure or not found
    """
    try:
        if not scan_id:
            logger.error("scan_id is required")
            return None
        
        # Build the query
        query = supabase.table("scan_history").select("*").eq("id", scan_id)
        
        # If user_id is provided, ensure the user owns the record
        if user_id:
            query = query.eq("user_id", user_id)
        
        response = query.execute()
        
        if response.data and len(response.data) > 0:
            logger.info(f"Retrieved scan record {scan_id}")
            return response.data[0]
        else:
            logger.warning(f"No scan record found with id {scan_id}")
            return None
            
    except Exception as e:
        logger.error(f"Error retrieving scan record from Supabase: {e}")
        return None 