import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kolya_backend.settings')
django.setup()

from gallery.models import GalleryItem
from dishes.models import Dish

def update_gallery():
    print("Updating gallery items...")
    mapping = {
        "Intérieur Restaurant": "gallery/interior.png",
        "Plat Signature": "gallery/couscous.png",
        "Terrasse Extérieure": "gallery/exterior.png",
        "Équipe en Action": "gallery/team.png"
    }
    for title, path in mapping.items():
        items = GalleryItem.objects.filter(title=title)
        for item in items:
            item.image = path
            item.save()
            print(f"Updated {title} to {path}")

def update_dishes():
    print("\nUpdating dishes...")
    mapping = {
        "Couscous Royal": "dishes/couscous.png",
        "Tajine de Poulet": "dishes/tajine.png",
        "Salade Marocaine": "dishes/salad.png",
        "Gantshua Mbouba Joel": "dishes/couscous.png", # Backup
        "Test Correction": "dishes/tajine.png", # Backup
        "Test sans image": "dishes/interior.png", # Backup
        "fdfdf": "dishes/salad.png" # Backup
    }
    for name, path in mapping.items():
        dishes = Dish.objects.filter(name=name)
        for dish in dishes:
            dish.image = path
            dish.save()
            print(f"Updated {name} to {path}")

if __name__ == "__main__":
    update_gallery()
    update_dishes()
