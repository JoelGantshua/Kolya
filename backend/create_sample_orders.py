#!/usr/bin/env python3
import os
import django

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kolya_backend.settings')
django.setup()

from orders.models import Order

def create_sample_orders():
    """Create sample orders"""
    orders_data = [
        {
            'customer_name': 'Mohammed Benali',
            'customer_email': 'mohammed@email.com',
            'customer_phone': '0612345678',
            'items': [
                {'name': 'Couscous Royal', 'quantity': 2, 'price': 18.50},
                {'name': 'Thé à la Menthe', 'quantity': 2, 'price': 3.50}
            ],
            'total_amount': 44.00,
            'status': 'delivered',
            'delivery_address': '15 Rue Hassan II, Casablanca',
            'delivery_notes': 'Livraison après 19h'
        },
        {
            'customer_name': 'Fatima Alami',
            'customer_email': 'fatima@email.com',
            'customer_phone': '0623456789',
            'items': [
                {'name': 'Tajine de Poulet', 'quantity': 1, 'price': 15.90},
                {'name': 'Salade Marocaine', 'quantity': 1, 'price': 8.50}
            ],
            'total_amount': 24.40,
            'status': 'confirmed',
            'delivery_address': '32 Avenue Mohammed V, Rabat',
            'delivery_notes': 'Appeler à l\'interphone'
        },
        {
            'customer_name': 'Youssef Karim',
            'customer_email': 'youssef@email.com',
            'items': [
                {'name': 'Harira', 'quantity': 3, 'price': 6.90}
            ],
            'total_amount': 20.70,
            'status': 'preparing',
            'delivery_address': '7 Boulevard Zerktouni, Marrakech',
            'delivery_notes': 'Sans oignons svp'
        }
    ]
    
    for order_data in orders_data:
        order, created = Order.objects.get_or_create(
            customer_email=order_data['customer_email'],
            defaults=order_data
        )
        if created:
            print(f"✅ Commande créée: {order.customer_name}")
        else:
            print(f"ℹ️ Commande existe déjà: {order.customer_name}")

if __name__ == "__main__":
    print("📦 Création des commandes d'exemple...")
    create_sample_orders()
    print("\n✨ Commandes d'exemple créées avec succès!")
