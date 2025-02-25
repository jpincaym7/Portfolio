# models.py
from django.db import models
from django.utils import timezone

class ContactMessage(models.Model):
    """
    Model to store contact form submissions
    """
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
    
    def __str__(self):
        return f"{self.name}: {self.subject}"
    
    def mark_as_read(self):
        """Mark the message as read"""
        self.is_read = True
        self.save()