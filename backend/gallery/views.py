from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import GalleryItem
from .serializers import GalleryItemSerializer

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def gallery_list(request):
    """Liste de tous les éléments de la galerie"""
    items = GalleryItem.objects.all().order_by('-created_at')
    serializer = GalleryItemSerializer(items, many=True)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def gallery_item_detail(request, item_id):
    """Détails d'un élément de la galerie"""
    item = get_object_or_404(GalleryItem, id=item_id)
    serializer = GalleryItemSerializer(item)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_gallery_item(request):
    """Créer un nouvel élément de galerie (admin uniquement)"""
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = GalleryItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'error': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_gallery_image(request):
    """Uploader une image dans la galerie (admin uniquement)"""
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    if 'image' not in request.FILES:
        return Response({
            'success': False,
            'error': 'Aucune image fournie'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = request.data.copy()
    data['image'] = request.FILES['image']
    
    serializer = GalleryItemSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'error': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_gallery_item(request, item_id):
    """Mettre à jour un élément de galerie (admin uniquement)"""
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    item = get_object_or_404(GalleryItem, id=item_id)
    serializer = GalleryItemSerializer(item, data=request.data, partial=True)
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
def delete_gallery_item(request, item_id):
    """Supprimer un élément de galerie (admin uniquement)"""
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    item = get_object_or_404(GalleryItem, id=item_id)
    item.delete()
    return Response({
        'success': True,
        'message': 'Élément supprimé avec succès'
    })
