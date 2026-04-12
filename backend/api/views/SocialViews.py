from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from api.models import Post, Hashtag, Like, Bookmark
from api.serializers.SocialSerializers import PostSerializer, HashtagSerializer

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Post.objects.all().select_related('author').prefetch_related('hashtags', 'likes_received', 'saved_by')
        # Filter by hashtags if provided
        hashtag_names = self.request.query_params.getlist('hashtags')
        if hashtag_names:
            queryset = queryset.filter(hashtags__name__in=hashtag_names).distinct()
        
        # Filter by user (for Bookmarks or own posts)
        is_bookmarks = self.request.query_params.get('bookmarks') == 'true'
        if is_bookmarks and self.request.user.is_authenticated:
            queryset = queryset.filter(saved_by__user=self.request.user)
            
        return queryset

    def perform_create(self, serializer):
        # Extract hashtag names from request
        hashtag_names = self.request.data.get('hashtag_names', [])
        post = serializer.save(author=self.request.user)
        
        # Add hashtags (limit 7 is enforced on frontend, but good to handle here too)
        for name in hashtag_names[:7]:
            hashtag, created = Hashtag.objects.get_or_create(name=name.strip().lower())
            post.hashtags.add(hashtag)
            # Update count correctly
            hashtag.usage_count = hashtag.posts.count()
            hashtag.save()

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        if not created:
            like.delete()
            return Response({'status': 'unliked'})
        return Response({'status': 'liked'})

    @action(detail=True, methods=['post'])
    def bookmark(self, request, pk=None):
        post = self.get_object()
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, post=post)
        if not created:
            bookmark.delete()
            return Response({'status': 'unsaved'})
        return Response({'status': 'saved'})

class HashtagViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = HashtagSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Hashtag.objects.annotate(count=Count('posts')).order_by('-count')[:10]
