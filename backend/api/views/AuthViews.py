from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.services.AuthService import AuthService
from api.serializers.AuthSerializers import LoginSerializer

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        user = AuthService.RegisterUser(request.data)
        if user:
            tokens = AuthService.GenerateTokens(user)
            return Response(tokens, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

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
