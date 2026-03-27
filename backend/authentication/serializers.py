from rest_framework import serializers
from django.contrib.auth import get_user_model
from .backends import hash_password, verify_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'name', 'role', 'phone', 'address', 'preferences', 'password', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def get_name(self, obj):
        if obj.first_name or obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        return obj.username
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['password'] = hash_password(password)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            validated_data['password'] = hash_password(password)
        return super().update(instance, validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            try:
                user = User.objects.get(email=email)
                if verify_password(password, user.password):
                    data['user'] = user
                    return data
                else:
                    raise serializers.ValidationError('Identifiants invalides')
            except User.DoesNotExist:
                raise serializers.ValidationError('Identifiants invalides')
        else:
            raise serializers.ValidationError('Email et mot de passe requis')

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'name']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'username': {'required': False}
        }
    
    def create(self, validated_data):
        name = validated_data.pop('name', '')
        password = validated_data.pop('password')
        
        # Si un nom complet est fourni, on le divise
        if name and not validated_data.get('first_name'):
            parts = name.split(' ', 1)
            validated_data['first_name'] = parts[0]
            if len(parts) > 1:
                validated_data['last_name'] = parts[1]
        
        # Utiliser l'email comme username si non fourni
        if not validated_data.get('username'):
            validated_data['username'] = validated_data.get('email')
            
        validated_data['password'] = hash_password(password)
        return super().create(validated_data)
