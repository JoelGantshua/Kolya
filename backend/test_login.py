#!/usr/bin/env python3
import os
import sys
import django

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kolya_backend.settings')
django.setup()

from authentication.models import User
from authentication.backends import hash_password, verify_password

def test_login():
    """Test login functionality"""
    try:
        # Get admin user
        admin = User.objects.get(email='kolya@gmail.com')
        print(f"✅ Admin user found: {admin.email}")
        print(f"Role: {admin.role}")
        print(f"Password hash: {admin.password[:50]}...")
        
        # Test password verification
        test_password = "Kolya1@"
        is_valid = verify_password(test_password, admin.password)
        print(f"✅ Password verification: {is_valid}")
        
        # Test token generation
        from authentication.backends import generate_token
        token = generate_token(admin.id)
        print(f"✅ Token generated: {token[:50]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_login()
