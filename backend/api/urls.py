from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views.AuthViews import RegisterView, LoginView, UserUpdateView, PasswordChangeView
from api.views.SocialViews import PostViewSet, HashtagViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'hashtags', HashtagViewSet, basename='hashtag')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/profile/', UserUpdateView.as_view(), name='profile-update'),
    path('auth/password/', PasswordChangeView.as_view(), name='password-change'),
]
