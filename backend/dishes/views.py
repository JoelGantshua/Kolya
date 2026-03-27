from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from .models import Dish
from .serializers import DishSerializer

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def dishes_list(request):
    """Liste de tous les plats"""
    dishes = Dish.objects.all().order_by('-created_at')
    serializer = DishSerializer(dishes, many=True)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def dish_detail(request, dish_id):
    """Détails d'un plat"""
    dish = get_object_or_404(Dish, id=dish_id)
    serializer = DishSerializer(dish)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def create_dish(request):
    """Créer un nouveau plat (admin uniquement)"""
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Merge FILES into data explicitly for safety
    data = request.data.copy()
    if 'image' in request.FILES:
        data['image'] = request.FILES['image']
        
    serializer = DishSerializer(data=data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    # Logger les erreurs de validation pour debug
    print(f"❌ Erreurs de validation: {serializer.errors}")
    return Response({
        'success': False,
        'error': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def update_dish(request, dish_id):
    """Mettre à jour un plat (admin uniquement)"""
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    dish = get_object_or_404(Dish, id=dish_id)
    
    # Merge FILES into data explicitly for safety
    data = request.data.copy()
    if 'image' in request.FILES:
        data['image'] = request.FILES['image']
        
    serializer = DishSerializer(dish, data=data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    return Response({
        'success': False,
        'error': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_dish(request, dish_id):
    """Supprimer un plat (admin uniquement)"""
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    dish = get_object_or_404(Dish, id=dish_id)
    dish.delete()
    return Response({
        'success': True,
        'message': 'Plat supprimé avec succès'
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def upload_dish_image(request, dish_id):
    """Uploader une image pour un plat (admin uniquement)"""
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    dish = get_object_or_404(Dish, id=dish_id)
    
    if 'image' not in request.FILES:
        return Response({
            'success': False,
            'error': 'Aucune image fournie'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    image = request.FILES['image']
    dish.image = image
    dish.save()
    
    return Response({
        'success': True,
        'message': 'Image uploadée avec succès',
        'image_url': dish.image.url if dish.image else None
    })
