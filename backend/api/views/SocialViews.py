from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from api.models import Post, Hashtag, Like, Bookmark
from api.serializers.SocialSerializers import PostSerializer, HashtagSerializer
from api.permissions import IsOwnerOrAdmin

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        
        if user.is_authenticated:
            queryset = Post.objects.filter(Q(author__is_private=False) | Q(author=user))
        else:
            queryset = Post.objects.filter(author__is_private=False)

        queryset = queryset.select_related('author').prefetch_related('hashtags', 'likes_received', 'saved_by')
        queryset = queryset.annotate(likes_count=Count('likes_received'))
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        hashtag_names = self.request.query_params.getlist('hashtags')
        if hashtag_names:
            queryset = queryset.filter(hashtags__name__in=hashtag_names).distinct()
            
        genre = self.request.query_params.get('genre')
        if genre:
            queryset = queryset.filter(genre=genre.strip())
        
        author_id = self.request.query_params.get('author')
        author_username = self.request.query_params.get('author_username')
        is_bookmarks = self.request.query_params.get('bookmarks') == 'true'

        if author_id:
            queryset = queryset.filter(author_id=author_id)

        if author_username:
            queryset = queryset.filter(author__username=author_username)
            
        if is_bookmarks and user.is_authenticated:
            queryset = queryset.filter(saved_by__user=user)

        sort_by = self.request.query_params.get('sort', 'newest')
        if sort_by == 'popular':
            queryset = queryset.order_by('-likes_count', '-created_at')
        else:
            queryset = queryset.order_by('-created_at')
            
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        fresh_serializer = self.get_serializer(serializer.instance)
        return Response(fresh_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        hashtag_names = self.request.data.get('hashtag_names', [])
        post = serializer.save(author=self.request.user)
        
        added_hashtags = []
        for name in hashtag_names[:7]:
            hashtag, _ = Hashtag.objects.get_or_create(name=name.strip().lower())
            post.hashtags.add(hashtag)
            added_hashtags.append(hashtag)
        
        for hashtag in added_hashtags:
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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        hashtags = list(instance.hashtags.all())
        self.perform_destroy(instance)
        
        for hashtag in hashtags:
            hashtag.usage_count = hashtag.posts.count()
            hashtag.save()
            
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        
        queryset = Post.objects.filter(author=user)
        if year:
            queryset = queryset.filter(created_at__year=year)
        if month:
            queryset = queryset.filter(created_at__month=month)
        
        category_counts = queryset.values('category').annotate(count=Count('id')).order_by('-count')
        
        hashtag_counts = Hashtag.objects.filter(posts__author=user, posts__in=queryset).annotate(
            user_usage_count=Count('posts', filter=Q(posts__in=queryset))
        ).distinct().order_by('-user_usage_count')[:10]
        
        return Response({
            'categories': list(category_counts),
            'hashtags': [{'name': h.name, 'count': h.user_usage_count} for h in hashtag_counts]
        })

class HashtagViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = HashtagSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Hashtag.objects.annotate(count=Count('posts')).order_by('-count')[:10]
