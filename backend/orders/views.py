from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order
from .serializers import OrderSerializer

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def orders_list(request):
    """Liste de toutes les commandes"""
    if request.user.is_authenticated:
        if request.user.role == 'admin':
            orders = Order.objects.all().order_by('-created_at')
        else:
            orders = Order.objects.filter(user=request.user).order_by('-created_at')
    else:
        # Fallback for anonymous orders (e.g. by email)
        email = request.query_params.get('email')
        if email:
            orders = Order.objects.filter(customer_email=email).order_by('-created_at')
        else:
            orders = Order.objects.none()
            
    serializer = OrderSerializer(orders, many=True)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def order_detail(request, order_id):
    """Détails d'une commande (Propriétaire ou Admin uniquement)"""
    order = get_object_or_404(Order, id=order_id)
    
    # Vérification des permissions
    if request.user.role != 'admin' and order.user != request.user:
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
        
    serializer = OrderSerializer(order)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_order(request):
    """Créer une nouvelle commande"""
    # Debug: logger les données reçues
    print(f"DEBUG: Données de commande reçues: {request.data}")
    
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        try:
            if request.user.is_authenticated:
                # Récupérer les infos du client avec fallback sur l'utilisateur connecté
                customer_name = request.data.get('customer_name') or request.data.get('customerName')
                if not customer_name:
                    customer_name = getattr(request.user, 'name', None) or request.user.username
                
                customer_email = request.data.get('customer_email') or request.user.email
                
                serializer.save(
                    user=request.user,
                    customer_name=customer_name,
                    customer_email=customer_email
                )
            else:
                # Pour les anonymes
                if not request.data.get('customer_name') and not request.data.get('customer_email'):
                    return Response({
                        'success': False,
                        'message': 'Les informations du client sont requises pour une commande anonyme',
                        'errors': {'customer_name': ['Ce champ est obligatoire.'], 'customer_email': ['Ce champ est obligatoire.']}
                    }, status=status.HTTP_400_BAD_REQUEST)
                serializer.save()
                
            return Response({
                'success': True,
                'message': 'Commande créée avec succès',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"DEBUG: Erreur lors de la sauvegarde de la commande: {str(e)}")
            return Response({
                'success': False,
                'message': f'Erreur lors de la sauvegarde de la commande: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Si le sérialiseur n'est pas valide, retourner les erreurs détaillées
    error_details = []
    for field, field_errors in serializer.errors.items():
        error_details.append(f"{field}: {', '.join([str(e) for e in field_errors])}")
    error_msg = f"Données de commande invalides: {'; '.join(error_details)}"
    
    print(f"DEBUG: Erreurs de validation: {serializer.errors}")
    return Response({
        'success': False,
        'message': error_msg,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_order(request, order_id):
    """Mettre à jour une commande (admin uniquement)"""
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    order = get_object_or_404(Order, id=order_id)
    serializer = OrderSerializer(order, data=request.data, partial=True)
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
def delete_order(request, order_id):
    """Supprimer une commande"""
    order = get_object_or_404(Order, id=order_id)
    
    # Vérification des permissions : admin ou propriétaire de la commande
    if request.user.role != 'admin' and order.user != request.user:
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    order.delete()
    return Response({
        'success': True,
        'message': 'Commande supprimée avec succès'
    })
