from django.urls import path
from . import views

urlpatterns = [
    # Core upload and health endpoints
    path('upload/', views.upload_image, name='upload_image'),
    path('health/', views.health_check, name='health_check'),
    
    # Scan history management
    path('scan-history/', views.get_scan_history, name='get_scan_history'),
    path('scan/<str:scan_id>/', views.get_scan_by_id, name='get_scan_by_id'),
    path('scan/<str:scan_id>/update/', views.update_scan, name='update_scan'),
    path('delete-scan/', views.delete_scan, name='delete_scan'),
    path('batch-delete/', views.batch_delete_scans, name='batch_delete_scans'),
    
    # Analytics and search
    path('analytics/', views.get_scan_analytics, name='get_scan_analytics'),
    path('search/', views.search_scan_history, name='search_scan_history'),
] 