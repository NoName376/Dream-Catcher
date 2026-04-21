from django.db import models
from django.contrib.auth.models import AbstractUser
from api.managers.UserManager import CustomUserManager

class CustomUser(AbstractUser):
    first_name = None
    last_name = None
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    is_private = models.BooleanField(default=False)
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Hashtag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    usage_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"#{self.name}"

class Post(models.Model):
    GENRE_CHOICES = [
        ('Nightmares', 'Nightmares'),
        ('Lucid Dreaming', 'Lucid Dreaming'),
        ('Adventure', 'Adventure'),
        ('Romance', 'Romance'),
        ('Fantasy', 'Fantasy'),
        ('Surrealism', 'Surrealism'),
        ('Action', 'Action'),
        ('Liminal', 'Liminal'),
    ]

    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=500, default='')
    content = models.TextField()
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES, blank=True, null=True)
    hashtags = models.ManyToManyField(Hashtag, related_name='posts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.author.username}: {self.content[:30]}..."

class Like(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes_received')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

class Bookmark(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookmarks')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
