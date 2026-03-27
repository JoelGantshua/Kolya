from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ContactMessage
from .serializers import ContactMessageSerializer

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def contact_messages_list(request):
    """Liste de tous les messages de contact"""
    messages = ContactMessage.objects.all()
    serializer = ContactMessageSerializer(messages, many=True)
    return Response({'success': True, 'data': serializer.data})

from rest_framework.throttling import ScopedRateThrottle
from rest_framework.decorators import api_view, permission_classes, throttle_classes

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([ScopedRateThrottle])
def create_contact_message(request):
    """Créer un nouveau message de contact"""
    request.throttle_scope = 'anon'
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
    return Response({'success': False, 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def mark_read(request, pk):
    """Marquer un message comme lu"""
    message = get_object_or_404(ContactMessage, pk=pk)
    message.is_read = True
    message.save()
    serializer = ContactMessageSerializer(message)
    return Response({'success': True, 'data': serializer.data})

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def mark_replied(request, pk):
    """Marquer un message comme répondu"""
    message = get_object_or_404(ContactMessage, pk=pk)
    message.is_replied = True
    message.save()
    serializer = ContactMessageSerializer(message)
    return Response({'success': True, 'data': serializer.data})

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def mark_archived(request, pk):
    """Archiver un message"""
    message = get_object_or_404(ContactMessage, pk=pk)
    message.is_archived = True
    message.save()
    serializer = ContactMessageSerializer(message)
    return Response({'success': True, 'data': serializer.data})

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_message(request, pk):
    """Supprimer un message"""
    message = get_object_or_404(ContactMessage, pk=pk)
    message.delete()
    return Response({'success': True, 'message': 'Message supprimé avec succès'})

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def bulk_mark_read(request):
    """Marquer plusieurs messages comme lus"""
    ids = request.data.get('ids', [])
    ContactMessage.objects.filter(id__in=ids).update(is_read=True)
    return Response({'success': True})
