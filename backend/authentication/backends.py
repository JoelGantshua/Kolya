import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions
from rest_framework.authentication import BaseAuthentication
import bcrypt

User = get_user_model()

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).split()
        
        if not auth_header or auth_header[0].lower() != b'bearer':
            return None
            
        if len(auth_header) == 1:
            raise exceptions.AuthenticationFailed('Token invalide')
        elif len(auth_header) > 2:
            raise exceptions.AuthenticationFailed('Token invalide')
            
        try:
            token = auth_header[1].decode('utf-8')
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            user_id = payload.get('sub')
            
            if not user_id:
                raise exceptions.AuthenticationFailed('Token invalide')
                
            user = User.objects.get(id=user_id)
            return (user, token)
            
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token expiré')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Token invalide')
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('Utilisateur non trouvé')
    
    def authenticate_header(self, request):
        return 'Bearer'

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except (ValueError, TypeError):
        # Fallback for Django's default hash format
        from django.contrib.auth.hashers import check_password
        return check_password(plain_password, hashed_password)

def generate_token(user_id: int) -> str:
    """Generate JWT token for user"""
    from datetime import datetime, timedelta
    
    exp = datetime.utcnow() + timedelta(days=settings.JWT_EXPIRATION_DELTA)
    payload = {
        'sub': str(user_id),
        'exp': exp,
        'iat': datetime.utcnow()
    }
    
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
