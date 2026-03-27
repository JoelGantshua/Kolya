from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .backends import verify_password, generate_token

User = get_user_model()

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/v1/auth/register/'
        self.login_url = '/api/v1/auth/login/'
        self.user_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'Password123!',
            'name': 'Test User'
        }

    def test_register_user(self):
        """Test user registration"""
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='test@example.com').exists())

    def test_login_user(self):
        """Test user login and token generation"""
        # First register
        self.client.post(self.register_url, self.user_data)
        
        # Then login
        login_data = {
            'email': 'test@example.com',
            'password': 'Password123!'
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['email'], 'test@example.com')

    def test_invalid_login(self):
        """Test login with incorrect password"""
        self.client.post(self.register_url, self.user_data)
        login_data = {
            'email': 'test@example.com',
            'password': 'WrongPassword'
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
