# Create your models here.
from django.db import models


# =======================
# PROJECT MODEL
# =======================
class Project(models.Model):
    # Link to future User model (string reference)
    owner = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="projects"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    tech_stack = models.CharField(
        max_length=255, blank=True, help_text="Comma-separated technologies"
    )
    demo_link = models.URLField(blank=True, null=True)
    source_code = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


# =======================
# BLOG POST MODEL
# =======================
class Post(models.Model):
    # Link to future User model (string reference)
    author = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="posts"
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    cover_image = models.ImageField(upload_to="posts/", blank=True, null=True)
    tags = models.CharField(
        max_length=255, blank=True, help_text="Comma-separated tags"
    )
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
