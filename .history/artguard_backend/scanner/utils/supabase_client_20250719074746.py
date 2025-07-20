from supabase import create_client, Client
import os
from django.conf import settings

# Get Supabase credentials from environment variables or Django settings
SUPABASE_URL = getattr(settings, 'SUPABASE_URL', os.getenv("SUPABASE_URL"))
SUPABASE_KEY = getattr(settings, 'SUPABASE_SERVICE_KEY', os.getenv("SUPABASE_SERVICE_KEY"))

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def log_scan_to_supabase(user_id: str, artwork_url: str, result: dict):
    """
    Log scan results to Supabase scan_history table
    
    Args:
        user_id: The user ID who performed the scan
        artwork_url: The URL of the scanned artwork
        result: Dictionary containing scan results and metadata
        
    Returns:
        dict: Supabase response on success
        None: On failure
    """
    try:
        response = supabase.table("scan_history").insert({
            "user_id": user_id,
            "artwork_url": artwork_url,
            "result": result
        }).execute()
        return response
    except Exception as e:
        print(f"Error logging scan to Supabase: {e}")
        return None

def get_user_scan_history(user_id: str, limit: int = 50):
    """
    Retrieve scan history for a specific user
    
    Args:
        user_id: The user ID to get history for
        limit: Maximum number of records to return (default: 50)
        
    Returns:
        dict: Supabase response with scan history
        None: On failure
    """
    try:
        response = supabase.table("scan_history")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        return response
    except Exception as e:
        print(f"Error retrieving scan history from Supabase: {e}")
        return None

def delete_scan_record(scan_id: str):
    """
    Delete a specific scan record from Supabase
    
    Args:
        scan_id: The ID of the scan record to delete
        
    Returns:
        dict: Supabase response on success
        None: On failure
    """
    try:
        response = supabase.table("scan_history")\
            .delete()\
            .eq("id", scan_id)\
            .execute()
        return response
    except Exception as e:
        print(f"Error deleting scan record from Supabase: {e}")
        return None 