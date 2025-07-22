from functools import wraps
from django.http import JsonResponse
from .models import ApiKey, ApiUsageLog
from django.utils import timezone

def require_api_key(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        api_key = request.headers.get("x-api-key")
        if not api_key:
            return JsonResponse({"error": "Missing API key"}, status=401)
        try:
            key_record = ApiKey.objects.get(api_key=api_key, active=True)
        except ApiKey.DoesNotExist:
            return JsonResponse({"error": "Invalid or inactive API key"}, status=401)
        # Log usage
        ApiUsageLog.objects.create(
            key=key_record,
            endpoint=request.path,
            timestamp=timezone.now()
        )
        request.api_key_record = key_record
        return view_func(request, *args, **kwargs)
    return _wrapped_view 