from rest_framework import serializers
from .models import Reservation
from django.contrib.auth import get_user_model

User = get_user_model()

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']

class ReservationSerializer(serializers.ModelSerializer):
    user_details = UserMiniSerializer(source='user', read_only=True)
    
    # Mapping des champs frontend (camelCase) vers backend (snake_case)
    specialRequests = serializers.CharField(source='special_requests', write_only=True, required=False, allow_blank=True)
    
    # Rendre ces champs optionnels car ils peuvent être remplis par l'utilisateur connecté
    name = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)

    class Meta:
        model = Reservation
        fields = [
            'id', 'user', 'user_details', 'name', 'email', 'phone', 
            'date', 'time', 'guests', 'status', 'special_requests', 'specialRequests',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
