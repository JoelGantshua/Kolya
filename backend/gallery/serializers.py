from rest_framework import serializers
from .models import GalleryItem

class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        image_url = representation.get('image')
        
        if image_url:
            # Handle absolute URLs (like Cloudinary) correctly
            if 'http%3A' in image_url or 'https%3A' in image_url:
                import urllib.parse
                if '/media/' in image_url:
                    actual_url = image_url.split('/media/')[-1]
                    representation['image'] = urllib.parse.unquote(actual_url)
                    return representation

            # Handle full storage URLs
            image_str = str(instance.image)
            if image_str.startswith('http://') or image_str.startswith('https://'):
                representation['image'] = image_str
            elif not image_url.startswith('http') and not image_url.startswith('/media/'):
                # Ensure the /media/ prefix if it's a relative DRF path missing it
                representation['image'] = f"/media/{image_str}"
        
        return representation
