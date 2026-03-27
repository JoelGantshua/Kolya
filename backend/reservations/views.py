from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Reservation
from .serializers import ReservationSerializer

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def reservations_list(request):
    """Liste de toutes les réservations (Admin seulement ou filtre par utilisateur)"""
    if request.user.is_staff or request.user.role == 'admin':
        reservations = Reservation.objects.all()
    else:
        reservations = Reservation.objects.filter(user=request.user)
    
    serializer = ReservationSerializer(reservations, many=True)
    return Response({'success': True, 'data': serializer.data})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def reservations_detail(request, pk):
    """Détails d'une réservation"""
    try:
        if request.user.is_staff:
            reservation = Reservation.objects.get(pk=pk)
        else:
            reservation = Reservation.objects.get(pk=pk, user=request.user)
    except Reservation.DoesNotExist:
        return Response({'success': False, 'message': 'Réservation non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        
    serializer = ReservationSerializer(reservation)
    return Response({'success': True, 'data': serializer.data})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_reservations(request):
    """Créer une nouvelle réservation"""
    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        # Lier l'utilisateur s'il est authentifié
        if request.user.is_authenticated:
            # Remplir automatiquement les infos du client si non fournies
            name = request.data.get('name') or getattr(request.user, 'name', request.user.username)
            email = request.data.get('email') or request.user.email
            serializer.save(
                user=request.user,
                name=name,
                email=email
            )
        else:
            serializer.save()
        return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
    return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_reservations(request, pk):
    """Mettre à jour une réservation (Statut, etc.)"""
    try:
        if request.user.is_staff:
            reservation = Reservation.objects.get(pk=pk)
        else:
            reservation = Reservation.objects.get(pk=pk, user=request.user)
    except Reservation.DoesNotExist:
        return Response({'success': False, 'message': 'Réservation non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        
    serializer = ReservationSerializer(reservation, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'success': True, 'data': serializer.data})
    return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_reservations(request, pk):
    """Supprimer une réservation"""
    try:
        if request.user.is_staff:
            reservation = Reservation.objects.get(pk=pk)
        else:
            reservation = Reservation.objects.get(pk=pk, user=request.user)
    except Reservation.DoesNotExist:
        return Response({'success': False, 'message': 'Réservation non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        
    reservation.delete()
    return Response({'success': True, 'message': 'Réservation supprimée avec succès'})
