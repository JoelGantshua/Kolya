#!/usr/bin/env python3
import os
import django

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kolya_backend.settings')
django.setup()

from dishes.models import Dish
from gallery.models import GalleryItem

def create_sample_dishes():
    """Create sample dishes"""
    dishes_data = [
        {
            'name': 'Couscous Royal',
            'description': 'Couscous traditionnel avec agneau, légumes et légumes confits',
            'price': 18.50,
            'category': 'main_course',
            'ingredients': ['semoule', 'agneau', 'carottes', 'courgettes', 'pois chiches'],
            'is_popular': True,
            'calories': 650
        },
        {
            'name': 'Tajine de Poulet',
            'description': 'Tajine tendre de poulet aux citrons confits et olives',
            'price': 15.90,
            'category': 'main_course',
            'ingredients': ['poulet', 'citrons confits', 'olives', 'oignons'],
            'is_spicy': False,
            'calories': 480
        },
        {
            'name': 'Salade Marocaine',
            'description': 'Salade fraîche avec tomates, concombres et herbes aromatiques',
            'price': 8.50,
            'category': 'salad',
            'ingredients': ['tomates', 'concombres', 'oignons', 'persil'],
            'is_vegetarian': True,
            'calories': 180
        },
        {
            'name': 'Harira',
            'description': 'Soupe traditionnelle aux lentilles et pois chiches',
            'price': 6.90,
            'category': 'soup',
            'ingredients': ['lentilles', 'pois chiches', 'tomates', 'céleri'],
            'is_vegetarian': True,
            'calories': 220
        },
        {
            'name': 'Thé à la Menthe',
            'description': 'Thé vert sucré avec feuilles de menthe fraîche',
            'price': 3.50,
            'category': 'beverage',
            'ingredients': ['thé vert', 'menthe', 'sucre'],
            'is_vegetarian': True,
            'calories': 80
        }
    ]
    
    for dish_data in dishes_data:
        dish, created = Dish.objects.get_or_create(
            name=dish_data['name'],
            defaults=dish_data
        )
        if created:
            print(f"✅ Plat créé: {dish.name}")
        else:
            print(f"ℹ️ Plat existe déjà: {dish.name}")

def create_sample_gallery():
    """Create sample gallery items"""
    gallery_data = [
        {
            'title': 'Intérieur Restaurant',
            'description': 'Vue chaleureuse de notre salle principale',
            'category': 'interior'
        },
        {
            'title': 'Plat Signature',
            'description': 'Notre célèbre couscous royal',
            'category': 'dishes'
        },
        {
            'title': 'Terrasse Extérieure',
            'description': 'Espace extérieur pour dîner en été',
            'category': 'exterior'
        },
        {
            'title': 'Équipe en Action',
            'description': 'Nos chefs préparent avec passion',
            'category': 'team'
        }
    ]
    
    for item_data in gallery_data:
        item, created = GalleryItem.objects.get_or_create(
            title=item_data['title'],
            defaults=item_data
        )
        if created:
            print(f"✅ Élément galerie créé: {item.title}")
        else:
            print(f"ℹ️ Élément galerie existe déjà: {item.title}")

if __name__ == "__main__":
    print("🍽 Création des données d'exemple...")
    create_sample_dishes()
    print("\n🖼️ Création des éléments de galerie...")
    create_sample_gallery()
    print("\n✨ Données d'exemple créées avec succès!")
