from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import CustomUser

class AuthService:
    @staticmethod
    def RegisterUser(data):
        from api.serializers.AuthSerializers import RegisterSerializer
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return user
        return None

    @staticmethod
    def AuthenticateUser(email, password):
        user = authenticate(email=email, password=password)
        if user:
            return AuthService.GenerateTokens(user)
        return None

    @staticmethod
    def GenerateTokens(user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
