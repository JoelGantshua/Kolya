#!/usr/bin/env python3
import os
import django
from django.conf import settings

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kolya_backend.settings')
django.setup()

from authentication.models import User
from authentication.backends import hash_password

def create_admin():
    """Create admin user"""
    try:
        admin_user = User.objects.create_user(
            username='admin',
            email='kolya@gmail.com',
            password='Kolya1@',
            first_name='Admin',
            last_name='Kolya',
            role='admin',
            is_staff=True,
            is_superuser=True
        )
        
        print("✅ Administrateur créé avec succès")
        print(f"Email: {admin_user.email}")
        print(f"Mot de passe: Kolya1@")
        print(f"Rôle: {admin_user.role}")
        print("\n⚠️  IMPORTANT: Gardez ces identifiants en sécurité!")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création de l'admin: {e}")

if __name__ == "__main__":
    create_admin()
