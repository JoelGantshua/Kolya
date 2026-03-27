from django.db import models

class Dish(models.Model):
    CATEGORY_CHOICES = [
        ('appetizer', 'Entrée'),
        ('main_course', 'Plat principal'),
        ('dessert', 'Dessert'),
        ('beverage', 'Boisson'),
        ('soup', 'Soupe'),
        ('salad', 'Salade'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    ingredients = models.JSONField(default=list, blank=True)
    image = models.ImageField(upload_to='dishes/', null=True, blank=True)
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)
    is_spicy = models.BooleanField(default=False)
    is_popular = models.BooleanField(default=False)
    calories = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
