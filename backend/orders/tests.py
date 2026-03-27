from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Order

User = get_user_model()

class OrderSecurityTests(TestCase):
    def setUp(self):
        self.api_client = APIClient()
        # Create Users
        self.user1 = User.objects.create_user(email='user1@example.com', username='user1', password='Password123!', role='client')
        self.user2 = User.objects.create_user(email='user2@example.com', username='user2', password='Password123!', role='client')
        self.admin = User.objects.create_user(email='admin@example.com', username='admin', password='Password123!', role='admin')
        
        # Create Order for User 1
        self.order1 = Order.objects.create(
            user=self.user1,
            customer_name='User 1',
            customer_email='user1@example.com',
            total_amount=100.0,
            status='pending'
        )

    def test_own_order_access(self):
        """Test that user can access their own order"""
        self.api_client.force_authenticate(user=self.user1)
        url = f'/api/v1/orders/{self.order1.id}/'
        response = self.api_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_idor_protection(self):
        """Test that user CANNOT access order of another user (IDOR Protection)"""
        self.api_client.force_authenticate(user=self.user2)
        url = f'/api/v1/orders/{self.order1.id}/'
        response = self.api_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_access_all_orders(self):
        """Test that admin can access any order"""
        self.api_client.force_authenticate(user=self.admin)
        url = f'/api/v1/orders/{self.order1.id}/'
        response = self.api_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
