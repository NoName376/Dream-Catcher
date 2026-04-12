from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from api.models import CustomUser, Post, Hashtag, Like, Bookmark

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'is_staff', 'is_active')
    search_fields = ('email', 'username')
    ordering = ('email',)

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('author', 'content_snippet', 'created_at')
    list_filter = ('created_at', 'author')
    search_fields = ('content', 'author__username')

    def content_snippet(self, obj):
        return obj.content[:50]

@admin.register(Hashtag)
class HashtagAdmin(admin.ModelAdmin):
    list_display = ('name', 'usage_count')
    search_fields = ('name',)

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
