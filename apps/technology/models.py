from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class TechnologyCategory(models.Model):
    name = models.CharField(max_length=100)  
    description = models.TextField(blank=True)
    icon_code = models.CharField(max_length=10) 
    icon_color = models.CharField(max_length=50)  
    
    class Meta:
        verbose_name_plural = "Technology Categories"
    
    def __str__(self):
        return self.name

class Technology(models.Model):
    name = models.CharField(max_length=100)  
    category = models.ForeignKey(TechnologyCategory, on_delete=models.CASCADE, related_name='technologies')
    proficiency = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    is_main_tech = models.BooleanField(default=False) 
    class Meta:
        verbose_name_plural = "Technologies"
    
    def __str__(self):
        return self.name

class SubTechnology(models.Model):
    name = models.CharField(max_length=100)  
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE, related_name='subtechnologies')
    
    class Meta:
        verbose_name_plural = "Sub Technologies"
    
    def __str__(self):
        return f"{self.technology.name} - {self.name}"

class ExpertiseLevel(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
        ('Expert', 'Expert')
    ]
    
    technology = models.OneToOneField(Technology, on_delete=models.CASCADE, related_name='expertise')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    
    def __str__(self):
        return f"{self.technology.name} - {self.level}"