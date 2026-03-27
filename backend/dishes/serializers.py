from rest_framework import serializers
from .models import Dish

class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        image_url = representation.get('image')
        
        if image_url:
            # If the URL contains an absolute URL (like Cloudinary) but was prepended with media path
            if 'http%3A' in image_url or 'https%3A' in image_url:
                import urllib.parse
                # Extract the actual URL
                if '/media/' in image_url:
                    actual_url = image_url.split('/media/')[-1]
                    return {**representation, 'image': urllib.parse.unquote(actual_url)}

            # Handle full storage URLs
            image_str = str(instance.image)
            if image_str.startswith('http://') or image_str.startswith('https://'):
                representation['image'] = image_str
            elif not image_url.startswith('http') and not image_url.startswith('/media/'):
                # Ensure the /media/ prefix if it's a relative DRF path missing it
                representation['image'] = f"/media/{image_str}"
        
        return representation
