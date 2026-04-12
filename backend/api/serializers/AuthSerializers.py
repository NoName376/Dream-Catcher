from rest_framework import serializers
from api.models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validatedData):
        user = CustomUser.objects.create_user(
            email=validatedData['email'],
            username=validatedData['username'],
            password=validatedData['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
