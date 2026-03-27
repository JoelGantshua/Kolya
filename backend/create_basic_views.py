#!/usr/bin/env python3
import os
import django
from django.conf import settings

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kolya_backend.settings')
django.setup()

# Import apps that need views
apps = ['orders', 'reservations', 'contact']

basic_view_template = '''
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def {app}_list(request):
    """Liste de tous les {app}s"""
    return Response({{'success': True, 'data': []}})

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def {app}_detail(request, {app}_id):
    """Détails d'un {app}"""
    return Response({{'success': True, 'data': {{}}}})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_{app}(request):
    """Créer un nouveau {app}"""
    return Response({{'success': True, 'data': {{}}}}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_{app}(request, {app}_id):
    """Mettre à jour un {app}"""
    return Response({{'success': True, 'data': {{}}}})

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_{app}(request, {app}_id):
    """Supprimer un {app}"""
    return Response({{'success': True, 'message': '{app} supprimé avec succès'}})
'''

for app in apps:
    views_content = basic_view_template.format(app=app)
    views_path = f'/Users/jamilaaitbouchnani/Kolya-1/backend/{app}/views.py'
    
    with open(views_path, 'w') as f:
        f.write(views_content)
    
    print(f"Created basic views for {app}")

print("All basic views created successfully!")
