from rest_framework import serializers
from api.models import Post, Hashtag, Like, Bookmark, CustomUser

class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ['id', 'name', 'usage_count']

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    hashtag_names = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Hashtag.objects.all(),
        source='hashtags',
        required=False
    )
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes_received.count', read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'author_username', 'content', 
            'hashtag_names', 'created_at', 'is_liked', 
            'is_bookmarked', 'likes_count'
        ]
        read_only_fields = ['author', 'created_at']

    def get_is_liked(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return Like.objects.filter(user=user, post=obj).exists()
        return False

    def get_is_bookmarked(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return Bookmark.objects.filter(user=user, post=obj).exists()
        return False

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name']

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)
