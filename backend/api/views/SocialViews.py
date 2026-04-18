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
        queryset = queryset.annotate(likes_count=Count('likes_received'))
        
        # Filtering
        hashtag_names = self.request.query_params.getlist('hashtags')
        if hashtag_names:
            queryset = queryset.filter(hashtags__name__in=hashtag_names).distinct()
        
        author_id = self.request.query_params.get('author')
        author_username = self.request.query_params.get('author_username')
        is_bookmarks = self.request.query_params.get('bookmarks') == 'true'

        if author_id:
            queryset = queryset.filter(author_id=author_id)

        if author_username:
            queryset = queryset.filter(author__username=author_username)
            
        if is_bookmarks and self.request.user.is_authenticated:
            queryset = queryset.filter(saved_by__user=self.request.user)

        # Privacy Filter
        # Exclude private users' posts from general feed
        # But allow if viewing own profile or specific author (if logic allows)
        # Actually, if author_id or author_username is provided, we assume the user wants to see specifically those.
        # However, for general feed (no specific author), we must exclude is_private=True.
        if not (author_id or author_username or is_bookmarks):
            queryset = queryset.exclude(author__is_private=True)
        elif (author_id and author_id != str(self.request.user.id)) or (author_username and author_username != self.request.user.username):
            # If viewing someone else's profile, also check privacy
            queryset = queryset.exclude(author__is_private=True)

        # Sorting
        sort_by = self.request.query_params.get('sort', 'newest')
        if sort_by == 'popular':
            queryset = queryset.order_by('-likes_count', '-created_at')
        else:
            queryset = queryset.order_by('-created_at')
            
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
