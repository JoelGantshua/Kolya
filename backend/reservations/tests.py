from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Reservation

User = get_user_model()

class ReservationTests(TestCase):
    def setUp(self):
        self.api_client = APIClient()
        self.user1 = User.objects.create_user(email='res1@example.com', username='res1', password='Password123!', role='client')
        self.user2 = User.objects.create_user(email='res2@example.com', username='res2', password='Password123!', role='client')
        
    def test_create_reservation_authenticated(self):
        """Test creating a reservation while logged in"""
        self.api_client.force_authenticate(user=self.user1)
        data = {
            'date': '2026-12-25',
            'time': '19:00',
            'guests': 2,
            'phone': '0123456789',
            'specialRequests': 'Corner table'
        }
        response = self.api_client.post('/api/v1/reservations/create/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Reservation.objects.count(), 1)
        self.assertEqual(Reservation.objects.first().user, self.user1)

    def test_reservation_isolation(self):
        """Test that users can only see their own reservations"""
        # Create reservation for user 1
        Reservation.objects.create(user=self.user1, name='User 1', email='res1@example.com', phone='0123456789', date='2026-12-25', time='19:00', guests=2)
        
        # Try to view as user 2
        self.api_client.force_authenticate(user=self.user2)
        response = self.api_client.get('/api/v1/reservations/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 0)
        
        # View as user 1
        self.api_client.force_authenticate(user=self.user1)
        response = self.api_client.get('/api/v1/reservations/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
