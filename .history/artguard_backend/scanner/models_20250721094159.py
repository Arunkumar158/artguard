from django.db import models
from django.utils import timezone

# Create your models here.

class ApiKey(models.Model):
    user_id = models.CharField(max_length=255)
    api_key = models.CharField(max_length=255, unique=True)
    usage_count = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_id} - {self.api_key}"

class ApiUsageLog(models.Model):
    key = models.ForeignKey(ApiKey, on_delete=models.CASCADE)
    endpoint = models.CharField(max_length=255)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.key} - {self.endpoint} - {self.timestamp}"
