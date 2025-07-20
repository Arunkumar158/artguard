from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_image, name='upload_image'),
    path('health/', views.health_check, name='health_check'),
    path('scan-history/', views.get_scan_history, name='get_scan_history'),
    path('delete-scan/', views.delete_scan, name='delete_scan'),
] 