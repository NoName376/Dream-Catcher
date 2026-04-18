from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.services.AuthService import AuthService
from api.serializers.AuthSerializers import LoginSerializer
from api.serializers.SocialSerializers import UserUpdateSerializer, PasswordChangeSerializer, PasswordUpdateSerializer
from rest_framework import permissions

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            user = AuthService.RegisterUser(request.data)
            if user:
                tokens = AuthService.GenerateTokens(user)
                return Response(tokens, status=status.HTTP_201_CREATED)
            return Response({'error': 'Registration failed'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            error_data = getattr(e, 'detail', str(e))
            if isinstance(error_data, dict):
                if 'email' in error_data:
                    return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
                if 'username' in error_data:
                    return Response({'error': 'User with this username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            tokens = AuthService.AuthenticateUser(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if tokens:
                return Response(tokens, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UserUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserUpdateSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordChangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'status': 'Password updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        serializer = PasswordUpdateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = request.user
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response({'status': 'Password updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
