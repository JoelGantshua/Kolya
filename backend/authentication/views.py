from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, LoginSerializer, RegisterSerializer
from .backends import generate_token

User = get_user_model()

from rest_framework.throttling import ScopedRateThrottle

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([ScopedRateThrottle])
def register(request):
    """Inscription d'un nouvel utilisateur"""
    request.throttle_scope = 'auth'
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'success': True,
            'message': 'Utilisateur créé avec succès',
            'user': UserSerializer(user).data if user else None
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'error': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([ScopedRateThrottle])
def login(request):
    """Connexion d'un utilisateur"""
    request.throttle_scope = 'auth'
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token = generate_token(user.id)
        
        return Response({
            'success': True,
            'token': token,
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'error': 'Identifiants invalides'
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    """Obtenir les informations de l'utilisateur connecté"""
    serializer = UserSerializer(request.user)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def refresh_token(request):
    """Rafraîchir le token"""
    token = generate_token(request.user.id)
    return Response({
        'success': True,
        'token': token
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def users_list(request):
    """Liste des utilisateurs (admin uniquement)"""
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    users = User.objects.all().order_by('-created_at')
    serializer = UserSerializer(users, many=True)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_user(request, user_id):
    """Mettre à jour un utilisateur"""
    # Les utilisateurs peuvent modifier leur propre profil, les admin peuvent modifier tout le monde
    if request.user.role != 'admin' and request.user.id != int(user_id):
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Utilisateur non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Seuls les admin peuvent modifier les rôles
    if 'role' in request.data and request.user.role != 'admin':
        request.data.pop('role')
    
    serializer = UserSerializer(user, data=request.data, partial=True)
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
def delete_user(request, user_id):
    """Supprimer un utilisateur (admin uniquement)"""
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'error': 'Accès refusé'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Empêcher l'auto-suppression
    if request.user.id == int(user_id):
        return Response({
            'success': False,
            'error': 'Vous ne pouvez pas supprimer votre propre compte'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({
            'success': True,
            'message': 'Utilisateur supprimé avec succès'
        })
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Utilisateur non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_request(request):
    """Demander une réinitialisation de mot de passe"""
    email = request.data.get('email')
    if not email:
        return Response({
            'success': False,
            'error': 'L\'adresse email est requise'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        user = User.objects.get(email=email)
        
        # Vérification du rôle (uniquement pour les clients)
        if user.role != 'client':
            return Response({
                'success': False,
                'error': 'La réinitialisation autonome est réservée aux comptes clients.'
            }, status=status.HTTP_403_FORBIDDEN)
            
        # En production, on enverrait un email ici. 
        # Pour cette phase de stabilisation, on simule l'envoi.
        print(f"DEBUG: Demande de réinitialisation pour {email}")
        
        return Response({
            'success': True,
            'message': 'Si un compte existe avec cet email, un lien de réinitialisation vous a été envoyé.'
        })
    except User.DoesNotExist:
        # On renvoie le même message pour des raisons de sécurité (ne pas confirmer l'existence d'un email)
        return Response({
            'success': True,
            'message': 'Si un compte existe avec cet email, un lien de réinitialisation vous a été envoyé.'
        })

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_confirm(request):
    """Confirmer la réinitialisation du mot de passe"""
    email = request.data.get('email')
    new_password = request.data.get('password')
    
    if not email or not new_password:
        return Response({
            'success': False,
            'error': 'L\'email et le nouveau mot de passe sont requis'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        user = User.objects.get(email=email)
        
        # Vérification du rôle
        if user.role != 'client':
            return Response({
                'success': False,
                'error': 'Action non autorisée pour ce type de compte.'
            }, status=status.HTTP_403_FORBIDDEN)
            
        user.password = hash_password(new_password)
        user.save()
        
        return Response({
            'success': True,
            'message': 'Votre mot de passe a été réinitialisé avec succès'
        })
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Utilisateur non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """Vérifier l'état de l'API et de la base de données"""
    diagnostics = {
        'status': 'healthy',
        'database': 'unknown',
        'user_count': 0,
        'error': None
    }
    
    try:
        from django.db import connection
        connection.ensure_connection()
        diagnostics['database'] = 'connected'
        
        # Tester l'accès aux modèles
        diagnostics['user_count'] = User.objects.count()
        
    except Exception as e:
        diagnostics['status'] = 'unhealthy'
        diagnostics['database'] = 'error'
        diagnostics['error'] = str(e)
        
    return Response({
        'success': diagnostics['status'] == 'healthy',
        'data': diagnostics
    }, status=status.HTTP_200_OK if diagnostics['status'] == 'healthy' else status.HTTP_500_INTERNAL_SERVER_ERROR)
